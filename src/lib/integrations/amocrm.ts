import { getDb } from './firebase';

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

async function readTokensFromFirestore(): Promise<TokenData | null> {
  const snap = await getDb().doc(TOKENS_DOC).get();
  if (!snap.exists) return null;
  return snap.data() as TokenData;
}

async function writeTokensToFirestore(data: TokenData): Promise<void> {
  await getDb().doc(TOKENS_DOC).set(data);
  memoryToken = data;
}

async function exchangeRefreshToken(refreshToken: string): Promise<TokenData> {
  const subdomain = (process.env.AMOCRM_SUBDOMAIN || process.env.AMOCRM_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\..+$/, '');
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
  const current = await readTokensFromFirestore();

  let seedRefreshToken: string | undefined;
  if (!current) {
    // Bootstrap: seed from env on first deploy
    seedRefreshToken = process.env.AMOCRM_REFRESH_TOKEN?.trim();
    if (!seedRefreshToken) {
      const envToken = getEnvAccessToken();
      if (envToken) {
        const fallback: TokenData = {
          access_token: envToken,
          refresh_token: '',
          expires_at: Date.now() + 5 * 365 * 86400 * 1000,
        };
        await writeTokensToFirestore(fallback).catch(() => {});
        return fallback;
      }
      throw new Error('No tokens in Firestore and AMOCRM_REFRESH_TOKEN env is not set');
    }
  }

  const refreshToken = current?.refresh_token ?? seedRefreshToken!;
  try {
    const fresh = await exchangeRefreshToken(refreshToken);
    await writeTokensToFirestore(fresh);
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
      await writeTokensToFirestore(fallback).catch(() => {});
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

  // Hot path: valid token in memory — zero Firestore reads
  if (memoryToken && memoryToken.expires_at - REFRESH_BUFFER_MS > Date.now()) {
    return memoryToken.access_token;
  }

  // Cold path: memory empty or token expiring — read Firestore once
  const tokens = await readTokensFromFirestore();

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
