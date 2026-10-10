import { createClient, type Client, type InStatement, type ResultSet } from '@libsql/client';
import { logger } from '@/lib/logger';

let tursoClientInstance: Client | null = null;
let tablesChecked = false;

function normalizeTursoUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith('libsql://')) {
    return 'https://' + trimmed.slice('libsql://'.length);
  }
  return trimmed;
}

export function isTursoConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL?.trim() && process.env.TURSO_AUTH_TOKEN?.trim());
}

export function getTursoClient(): Client | null {
  if (tursoClientInstance) {
    return tursoClientInstance;
  }

  const rawUrl = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (!rawUrl || !authToken) {
    return null;
  }

  try {
    const url = normalizeTursoUrl(rawUrl);
    tursoClientInstance = createClient({
      url,
      authToken,
    });
    return tursoClientInstance;
  } catch (error) {
    logger.error('[Turso] Failed to initialize client:', error);
    return null;
  }
}

export async function ensureTursoSchema(): Promise<void> {
  if (tablesChecked) return;
  const client = getTursoClient();
  if (!client) return;

  try {
    await client.batch(
      [
        `CREATE TABLE IF NOT EXISTS oauth_tokens (
          service_name TEXT PRIMARY KEY,
          access_token TEXT NOT NULL,
          refresh_token TEXT,
          expires_at TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          extra_data TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS failed_leads (
          event_id TEXT PRIMARY KEY,
          lead_data TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          integration TEXT NOT NULL DEFAULT 'amocrm',
          error_message TEXT,
          error_status INTEGER,
          error_detail TEXT,
          error_type TEXT,
          retry_count INTEGER DEFAULT 0,
          amocrm_lead_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          retried_at TIMESTAMP
        );`,
        `CREATE INDEX IF NOT EXISTS idx_failed_leads_status ON failed_leads(status, created_at);`,
        `CREATE TABLE IF NOT EXISTS rate_limits (
          key TEXT PRIMARY KEY,
          count INTEGER NOT NULL DEFAULT 1,
          reset_at INTEGER NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS affiliates (
          id TEXT PRIMARY KEY,
          full_name TEXT NOT NULL,
          phone TEXT NOT NULL UNIQUE,
          telegram_username TEXT,
          promo_code TEXT NOT NULL UNIQUE,
          access_token TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS referrals (
          id TEXT PRIMARY KEY,
          affiliate_id TEXT NOT NULL REFERENCES affiliates(id),
          amocrm_lead_id INTEGER,
          lead_name TEXT NOT NULL,
          lead_phone TEXT NOT NULL,
          service_hint TEXT,
          status TEXT NOT NULL DEFAULT 'new',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          won_at TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS payouts (
          id TEXT PRIMARY KEY,
          referral_id TEXT NOT NULL UNIQUE REFERENCES referrals(id),
          affiliate_id TEXT NOT NULL REFERENCES affiliates(id),
          service TEXT NOT NULL,
          amount INTEGER NOT NULL,
          paid INTEGER NOT NULL DEFAULT 0,
          paid_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
      ],
      'write'
    );
    tablesChecked = true;
  } catch (err) {
    logger.error('[Turso] Error ensuring schema:', err);
  }
}

export async function executeTurso(
  stmt: InStatement
): Promise<ResultSet | null> {
  const client = getTursoClient();
  if (!client) return null;

  try {
    return await client.execute(stmt);
  } catch (error) {
    logger.error('[Turso] Query execution error:', error);
    return null;
  }
}
