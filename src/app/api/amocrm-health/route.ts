import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/amocrm-token';
import { getDb } from '@/lib/firebase-admin';
import { safeCompare } from '@/lib/security';

export const dynamic = 'force-dynamic';

const AMOCRM_FAILED_LEADS_COLLECTION = 'amocrm_failed_leads';
const AMOCRM_TIMEOUT_MS = 8000;

const BOM = String.fromCharCode(0xfeff);

function cleanSecret(value: string | undefined) {
  const raw = String(value || '');
  return (raw.startsWith(BOM) ? raw.slice(1) : raw).trim();
}

/** Reads the api_domain claim from the access token without verifying it. */
function getTokenApiDomain(accessToken: string) {
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '='
    );
    const claims = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
    return typeof claims.api_domain === 'string' ? claims.api_domain : null;
  } catch {
    return null;
  }
}

function getConfiguredHost() {
  const raw = cleanSecret(process.env.AMOCRM_DOMAIN || process.env.AMOCRM_SUBDOMAIN);
  if (!raw) return null;

  const clean = raw
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .trim();

  if (!clean) return null;
  return clean.includes('.') ? clean : `${clean}.amocrm.ru`;
}

/**
 * The refresh flow in lib/integrations/amocrm.ts hardcodes `.amocrm.ru`, while lead
 * creation derives the host from the token. If the account lives on another TLD the
 * two disagree: leads keep working until the access token expires, then refresh fails.
 */
function getRefreshHost() {
  const subdomain = cleanSecret(process.env.AMOCRM_SUBDOMAIN || process.env.AMOCRM_DOMAIN)
    .replace(/^https?:\/\//, '')
    .replace(/\..+$/, '');
  return subdomain ? `${subdomain}.amocrm.ru` : null;
}

type QueueCheck =
  | { ok: true; pending: number; newest: string | null }
  | { ok: false; reason: string };

async function countPendingFailedLeads(): Promise<QueueCheck> {
  try {
    const pendingQuery = getDb()
      .collection(AMOCRM_FAILED_LEADS_COLLECTION)
      .where('status', '==', 'pending');

    // count() keeps the real backlog size: a capped .get() would report any
    // backlog of N or more as exactly N, hiding the worst case.
    const [countSnapshot, newestSnapshot] = await Promise.all([
      pendingQuery.count().get(),
      pendingQuery.orderBy('createdAt', 'desc').limit(1).get(),
    ]);

    const newest = newestSnapshot.docs[0]?.data()?.createdAt;

    return {
      ok: true,
      pending: Number(countSnapshot.data().count) || 0,
      newest: newest ? String(newest) : null,
    };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function GET(request: Request) {
  const cronSecret = cleanSecret(process.env.AMOCRM_CRON_SECRET);
  if (!cronSecret) {
    return NextResponse.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });
  }

  const authHeader = request.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ') || !safeCompare(authHeader.substring(7), cronSecret)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const checks: Record<string, unknown> = {};
  const problems: string[] = [];

  // 1. Token — presence only, never the value.
  let accessToken = '';
  try {
    accessToken = await getValidAccessToken();
    checks.token = { ok: true, source: 'firestore' };
  } catch (error) {
    checks.token = {
      ok: false,
      reason: error instanceof Error ? error.message : String(error),
    };
    problems.push('token');
  }

  // 2. Host resolution — configured vs token vs refresh flow.
  const configuredHost = getConfiguredHost();
  const tokenHost = accessToken ? getTokenApiDomain(accessToken) : null;
  const refreshHost = getRefreshHost();
  const leadHost = configuredHost || tokenHost;

  checks.hosts = {
    configured: configuredHost,
    fromToken: tokenHost,
    usedForLeads: leadHost,
    usedForRefresh: refreshHost,
  };

  if (!leadHost) {
    problems.push('no-host');
  }
  if (tokenHost && refreshHost && tokenHost !== refreshHost) {
    problems.push('refresh-host-mismatch');
  }

  // 3. Live AmoCRM call — read-only, creates nothing.
  if (accessToken && leadHost) {
    try {
      // Without a timeout an unresponsive AmoCRM would hang this request until
      // the platform kills it, so the check would never report the very outage
      // it exists to detect.
      const response = await fetch(`https://${leadHost}/api/v4/account`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(AMOCRM_TIMEOUT_MS),
      });

      if (response.ok) {
        const account: any = await response.json().catch(() => null);
        checks.amocrm = {
          ok: true,
          status: response.status,
          accountId: account?.id ?? null,
          accountName: account?.name ?? null,
        };
      } else {
        checks.amocrm = { ok: false, status: response.status };
        problems.push(`amocrm-http-${response.status}`);
      }
    } catch (error) {
      const timedOut = error instanceof Error && error.name === 'TimeoutError';
      checks.amocrm = {
        ok: false,
        timedOut,
        reason: error instanceof Error ? error.message : String(error),
      };
      problems.push(timedOut ? 'amocrm-timeout' : 'amocrm-unreachable');
    }
  } else {
    checks.amocrm = { ok: false, skipped: true };
  }

  // 4. Backup queue — pending entries mean leads were dropped.
  const queue = await countPendingFailedLeads();
  checks.failedLeadQueue = queue;
  if (queue.ok && queue.pending > 0) {
    problems.push('pending-failed-leads');
  }

  // 5. Telegram config — presence only.
  const botToken = cleanSecret(process.env.TELEGRAM_BOT_TOKEN);
  const chatId = cleanSecret(process.env.TELEGRAM_CHAT_ID);
  checks.telegram = {
    ok: Boolean(botToken && chatId),
    hasBotToken: Boolean(botToken),
    hasChatId: Boolean(chatId),
    hasThreadId: Boolean(cleanSecret(process.env.TELEGRAM_MESSAGE_THREAD_ID)),
    hasAdminFallback: Boolean(cleanSecret(process.env.TELEGRAM_ADMIN_CHAT_ID)),
  };
  if (!botToken || !chatId) {
    problems.push('telegram-config');
  }

  const healthy = problems.length === 0;

  return NextResponse.json(
    {
      ok: healthy,
      checkedAt: new Date().toISOString(),
      problems,
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}
