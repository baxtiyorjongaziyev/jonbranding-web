import { getDb } from './firebase';
import { getTursoClient, isTursoConfigured } from '@/lib/turso';
import { logger } from '@/lib/logger';

const TOKENS_DOC = 'amocrm/website_tokens';
const REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes before expiry

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix ms
}

// Module-level cache: survives multiple requests within one serverless instance
let memoryToken: TokenData | null = null;
// Mutex: prevents concurrent token refreshes within one instance
let refreshInFlight: Promise<TokenData> | null = null;

async function readTokensFromTurso(): Promise<TokenData | null> {
  const client = getTursoClient();
  if (!client) return null;

  try {
    const res = await client.execute({
      sql: `SELECT access_token, refresh_token, expires_at 
            FROM oauth_tokens 
            WHERE service_name IN ('website_tokens', 'amocrm') 
            ORDER BY CASE WHEN service_name = 'website_tokens' THEN 0 ELSE 1 END, expires_at DESC 
            LIMIT 1`,
      args: [],
    });

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const accessToken = String(row.access_token || '').trim();
    if (!accessToken) return null;

    const rawExp = row.expires_at;
    let expiresAt = typeof rawExp === 'number' ? rawExp : new Date(String(rawExp || '')).getTime();
    if (Number.isNaN(expiresAt) || expiresAt <= 0) {
      expiresAt = Date.now() + 365 * 86400 * 1000;
    }

    return {
      access_token: accessToken,
      refresh_token: String(row.refresh_token || '').trim(),
      expires_at: expiresAt,
    };
  } catch (error) {
    logger.error('[Turso] Error reading AmoCRM token:', error);
    return null;
  }
}

async function writeTokensToTurso(data: TokenData): Promise<void> {
  const client = getTursoClient();
  if (!client) return;

  try {
    await client.execute({
      sql: `INSERT INTO oauth_tokens (service_name, access_token, refresh_token, expires_at, updated_at, extra_data)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(service_name) DO UPDATE SET
              access_token = excluded.access_token,
              refresh_token = excluded.refresh_token,
              expires_at = excluded.expires_at,
              updated_at = excluded.updated_at`,
      args: [
        'website_tokens',
        data.access_token,
        data.refresh_token || '',
        new Date(data.expires_at).toISOString(),
        new Date().toISOString(),
        JSON.stringify({ source: 'website' }),
      ],
    });
  } catch (error) {
    logger.error('[Turso] Error writing AmoCRM token:', error);
  }
}

async function readTokensFromFirestore(): Promise<TokenData | null> {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return null;
    const snap = await getDb().doc(TOKENS_DOC).get();
    if (!snap.exists) return null;
    return snap.data() as TokenData;
  } catch (e) {
    return null;
  }
}

async function writeTokensToFirestore(data: TokenData): Promise<void> {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return;
    await getDb().doc(TOKENS_DOC).set(data);
  } catch (e) {
    // Fail soft if Firestore is unreachable
  }
}

async function readStoredTokens(): Promise<TokenData | null> {
  if (isTursoConfigured()) {
    const fromTurso = await readTokensFromTurso();
    if (fromTurso) return fromTurso;
  }
  return await readTokensFromFirestore();
}

async function writeStoredTokens(data: TokenData): Promise<void> {
  memoryToken = data;
  if (isTursoConfigured()) {
    await writeTokensToTurso(data);
  }
  await writeTokensToFirestore(data);
}

async function exchangeRefreshToken(refreshToken: string): Promise<TokenData> {
  const subdomain = (process.env.AMOCRM_SUBDOMAIN || process.env.AMOCRM_DOMAIN || '')
    .replace(/^https?:\/\//, '')
    .replace(/\..+$/, '');
  const clientId = process.env.AMOCRM_CLIENT_ID;
  const clientSecret = process.env.AMOCRM_CLIENT_SECRET;
  const redirectUri = process.env.AMOCRM_REDIRECT_URI || process.env.AMOCRM_REDIRECT_URL;

  if (!subdomain || !clientId || !clientSecret || !redirectUri) {
    throw new Error('AmoCRM OAuth credentials not configured');
  }

  const response = await fetch(`https://${subdomain}.amocrm.ru/oauth2/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`AmoCRM token refresh failed (${response.status}): ${text}`);
  }

  const result: any = await response.json();
  const expiresIn = Number(result.expires_in) || 86400;

  return {
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_at: Date.now() + expiresIn * 1000,
  };
}

async function doRefresh(): Promise<TokenData> {
  const current = await readStoredTokens();

  let seedRefreshToken: string | undefined;
  if (!current) {
    seedRefreshToken = process.env.AMOCRM_REFRESH_TOKEN?.trim();
    if (!seedRefreshToken) {
      const envToken = getEnvAccessToken();
      if (envToken) {
        const fallback: TokenData = {
          access_token: envToken,
          refresh_token: '',
          expires_at: Date.now() + 5 * 365 * 86400 * 1000,
        };
        await writeStoredTokens(fallback).catch(() => {});
        return fallback;
      }
      throw new Error('No tokens stored and AMOCRM_REFRESH_TOKEN env is not set');
    }
  }

  const refreshToken = current?.refresh_token ?? seedRefreshToken!;
  try {
    const fresh = await exchangeRefreshToken(refreshToken);
    await writeStoredTokens(fresh);
    return fresh;
  } catch (refreshErr) {
    const envToken = getEnvAccessToken();
    if (envToken) {
      console.warn('OAuth refresh failed, falling back to static AMOCRM_ACCESS_TOKEN from env:', refreshErr);
      const fallback: TokenData = {
        access_token: envToken,
        refresh_token: refreshToken || '',
        expires_at: Date.now() + 5 * 365 * 86400 * 1000,
      };
      await writeStoredTokens(fallback).catch(() => {});
      return fallback;
    }
    throw refreshErr;
  }
}

function getEnvAccessToken(): string | null {
  const raw = process.env.AMOCRM_ACCESS_TOKEN?.trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return String(parsed.access_token || '').trim() || null;
  } catch {
    return raw;
  }
}

export async function getValidAccessToken(): Promise<string> {
  const envToken = getEnvAccessToken();
  if (envToken) {
    return envToken;
  }

  // Hot path: valid token in memory — zero DB reads
  if (memoryToken && memoryToken.expires_at - REFRESH_BUFFER_MS > Date.now()) {
    return memoryToken.access_token;
  }

  // Cold path: memory empty or token expiring — read stored tokens once
  const tokens = await readStoredTokens();

  if (!tokens) {
    const fresh = await forceRefresh();
    return fresh.access_token;
  }

  const needsRefresh = tokens.expires_at - REFRESH_BUFFER_MS < Date.now();
  if (!needsRefresh) {
    memoryToken = tokens;
    return tokens.access_token;
  }

  const fresh = await forceRefresh();
  return fresh.access_token;
}

export async function forceRefresh(): Promise<{ access_token: string; expires_at: number }> {
  const envToken = getEnvAccessToken();
  if (envToken) {
    return { access_token: envToken, expires_at: Date.now() + 365 * 86400 * 1000 };
  }

  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  const data = await refreshInFlight;
  return { access_token: data.access_token, expires_at: data.expires_at };
}
