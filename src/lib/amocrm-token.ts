import { db } from './firebase-admin';

const TOKENS_DOC = 'amocrm/tokens';
const REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes before expiry

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix ms
}

// In-memory promise lock to prevent concurrent refreshes within one instance
let refreshInFlight: Promise<TokenData> | null = null;

async function readTokensFromFirestore(): Promise<TokenData | null> {
  const snap = await db.doc(TOKENS_DOC).get();
  if (!snap.exists) return null;
  return snap.data() as TokenData;
}

async function writeTokensToFirestore(data: TokenData): Promise<void> {
  await db.doc(TOKENS_DOC).set(data);
}

async function exchangeRefreshToken(refreshToken: string): Promise<TokenData> {
  const subdomain = (process.env.AMOCRM_SUBDOMAIN || process.env.AMOCRM_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\..+$/, '');
  const clientId = process.env.AMOCRM_CLIENT_ID;
  const clientSecret = process.env.AMOCRM_CLIENT_SECRET;
  const redirectUri = process.env.AMOCRM_REDIRECT_URI;

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
      throw new Error('No tokens in Firestore and AMOCRM_REFRESH_TOKEN env is not set');
    }
  }

  const refreshToken = current?.refresh_token ?? seedRefreshToken!;
  const fresh = await exchangeRefreshToken(refreshToken);
  await writeTokensToFirestore(fresh);
  return fresh;
}

export async function getValidAccessToken(): Promise<string> {
  const tokens = await readTokensFromFirestore();

  if (!tokens) {
    // No tokens yet — bootstrap
    const fresh = await forceRefresh();
    return fresh.access_token;
  }

  const needsRefresh = tokens.expires_at - REFRESH_BUFFER_MS < Date.now();
  if (!needsRefresh) {
    return tokens.access_token;
  }

  const fresh = await forceRefresh();
  return fresh.access_token;
}

export async function forceRefresh(): Promise<{ access_token: string; expires_at: number }> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  const data = await refreshInFlight;
  return { access_token: data.access_token, expires_at: data.expires_at };
}
