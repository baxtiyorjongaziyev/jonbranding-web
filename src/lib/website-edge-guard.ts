import { readChatBody } from './oisha-input';
import { canonicalText, intakePhone, intakeTelegram, isMaliciousHeaderValue, isScannerInput, safeIntakeObject, validChatMessage, validIntakeName } from './intake-validation';
import { validIntakeSession } from './intake-session';
import { verifiedWebsiteRole } from './website-admin-session';
import { humanConfiguration, humanVerificationRequired, validHumanSession, verifyHumanChallenge } from './human-verification';

declare const JB_PRERENDER_REVALIDATE_ID: string | undefined;

type EdgeLimiter = { limit(input: { key: string }): Promise<{ success: boolean }> };
export type WebsiteGuardEnv = {
  OISHA_SECRET_KEY?: string; CRON_SECRET?: string; AMOCRM_CRON_SECRET?: string;
  REVALIDATE_SECRET?: string; prerenderRevalidateId?: string;
  ADMIN_SECRET?: string; SALES_TEAM_SECRET?: string;
  TURNSTILE_SECRET_KEY?: string; TURNSTILE_SITE_KEY?: string; TURNSTILE_ENFORCE?: string;
  JB_CHALLENGE_LIMIT?: EdgeLimiter;
  AMOCRM_WEBHOOK_SECRET?: string; TELEGRAM_WEBHOOK_SECRET?: string; VIMEO_WEBHOOK_SECRET?: string;
  TELEGRAM_CHAT_ID?: string; TELEGRAM_ADMIN_CHAT_ID?: string; TELEGRAM_ERROR_CHAT_ID?: string;
  JB_API_LIMIT: EdgeLimiter; JB_FORM_LIMIT: EdgeLimiter; JB_CONTACT_LIMIT: EdgeLimiter;
  JB_LOGIN_LIMIT: EdgeLimiter; JB_PAGE_LIMIT: EdgeLimiter;
};

const browserPosts = new Set(['/api/submit-form', '/api/diagnostics', '/api/navigator-lead', '/api/affiliate/register', '/api/affiliate/validate-code', '/api/report-error', '/api/oisha', '/api/admin/login', '/api/admin/logout', '/api/security/verify']);
const leadPosts = new Set(['/api/submit-form', '/api/diagnostics', '/api/navigator-lead', '/api/affiliate/register']);
const cronRoutes = new Set(['/api/content-agent', '/api/blog-agent', '/api/portfolio-sync', '/api/reviews-sync', '/api/cron/lead-retry']);
const serviceRoutes = new Set(['/api/amocrm-health', '/api/amocrm-refresh', '/api/amocrm-process-calls']);
const knownRoutes = new Set([...browserPosts, ...cronRoutes, ...serviceRoutes, '/api/revalidate', '/api/comparisons', '/api/testimonials', '/api/amocrm-webhook', '/api/vimeo-webhook', '/api/portfolio-telegram', '/api/admin/retry-amocrm-leads', '/api/auth/instagram', '/api/auth/instagram/callback']);
const publicHosts = new Set(['jonbranding.uz', 'www.jonbranding.uz', 'patent.jonbranding.uz']);
const imageHosts = new Set(['cdn.sanity.io', 'cdn.prod.website-files.com', 'images.unsplash.com']);
const blockedScannerIps = new Set(['213.230.125.2']);
const blockedScannerUserIds = new Set(['web_1a7ae654-dac2-41a0-aedf-b31564803674', 'web_fc166ee6-a3c9-44c6-b3e7-39a64e61a867']);
const scannerUserAgentRe = /\b(?:sqlmap|nikto|acunetix|nessus|openvas|masscan|zgrab|nuclei|gobuster|dirbuster|ffuf|feroxbuster|wfuzz|wpscan|havij|commix|xsstrike|hydra|burpcollaborator|netsparker|appscan|metasploit)\b/i;

function isScannerQuery(url: URL): boolean {
  for (const [key, value] of url.searchParams.entries()) {
    if (/^companyWebsite(?:\[|$)/i.test(key) || isScannerInput(key) || isScannerInput(value)) return true;
  }
  const decoded = canonicalText(url.search);
  return /\bon(?:abort|blur|change|click|dblclick|error|focus|input|keydown|keypress|keyup|load|mousedown|mouseenter|mouseleave|mousemove|mouseout|mouseover|mouseup|pointer\w*|reset|resize|scroll|select|submit|toggle|touch\w*|wheel)\s*=/i.test(decoded)
    || /<\?(?:php|=)|<\s*\/?(?:script|iframe|object|embed|svg|img|esi:include)\b|\$\{\s*@|\bunion\s+(?:all\s+)?select\b/i.test(decoded);
}

function denied(status: number, error: string, retry?: string) {
  return Response.json({ ok: false, error }, { status, headers: { 'Cache-Control': 'no-store', ...(retry ? { 'Retry-After': retry } : {}) } });
}

function matchesSecret(actual: string | null, expected: string | undefined) {
  if (!actual || !expected?.trim() || actual.length !== expected.trim().length) return false;
  let diff = 0;
  for (let index = 0; index < actual.length; index++) diff |= actual.charCodeAt(index) ^ expected.trim().charCodeAt(index);
  return diff === 0;
}

function bearer(request: Request, secrets: Array<string | undefined>) {
  const value = request.headers.get('authorization');
  return Boolean(value?.startsWith('Bearer ') && secrets.some(secret => matchesSecret(value.slice(7), secret)));
}

function browserOrigin(request: Request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = request.headers.get('origin');
  if (!origin || origin === 'null') return false;
  try {
    const source = new URL(origin);
    const target = new URL(request.url);
    return source.protocol === 'https:' && !source.username && !source.password
      && (source.origin === target.origin || (publicHosts.has(source.hostname) && publicHosts.has(target.hostname)));
  } catch { return false; }
}

async function quota(limiter: EdgeLimiter | undefined, key: string) {
  try { return limiter ? (await limiter.limit({ key })).success : null; }
  catch { return null; }
}

function imageRequest(url: URL) {
  const raw = url.searchParams.get('url');
  if (!raw || raw.length > 2000 || /[\u0000-\u001f\\]/.test(raw)) return false;
  if (raw.startsWith('/')) {
    if (raw.startsWith('//') || /(?:%2f|%5c|\.\.)/i.test(raw)) return false;
    return /^\/(?:images|logos|assets|_next\/static\/media)\//.test(raw);
  }
  try {
    const remote = new URL(raw);
    return remote.protocol === 'https:' && imageHosts.has(remote.hostname)
      && !remote.username && !remote.password && !remote.port;
  } catch { return false; }
}

function validLead(body: Record<string, unknown>, path: string) {
  if (!validIntakeName(body.fullName) || !safeIntakeObject(body)) return false;
  if (body.companyWebsite !== undefined && (typeof body.companyWebsite !== 'string' || body.companyWebsite.trim())) return false;
  if (path === '/api/diagnostics') return body.consent === true && Boolean(intakePhone(body.contact) || intakeTelegram(body.contact));
  const phone = body.phone === undefined || body.phone === '' ? null : intakePhone(body.phone);
  const telegram = intakeTelegram(body.telegram || body.telegramUsername);
  if (body.phone && !phone) return false;
  if (!phone && !telegram) return false;
  if (path === '/api/navigator-lead' && body.consent !== true) return false;
  return true;
}

function contactKey(body: Record<string, unknown>) {
  return intakePhone(body.phone || body.contact) || intakeTelegram(body.telegram || body.telegramUsername || body.contact);
}

/** Standalone Web API guard runs before Next: rejected requests never touch CRM or Telegram. */
export async function guardWebsiteRequest(request: Request, env: WebsiteGuardEnv): Promise<Request | Response> {
  const clientIp = request.headers.get('cf-connecting-ip')?.trim() || '';
  if (blockedScannerIps.has(clientIp)) return denied(403, 'scanner_blocked');
  const userAgent = request.headers.get('user-agent') || '';
  if (userAgent.length > 1024) return denied(400, 'invalid_header');
  if (scannerUserAgentRe.test(userAgent)) return denied(403, 'scanner_blocked');
  const cookieHeader = request.headers.get('cookie') || '';
  if (cookieHeader.length > 8192) return denied(431, 'header_too_large');
  for (const headerName of ['user-agent', 'referer', 'accept-language'] as const) {
    const headerValue = request.headers.get(headerName);
    if (headerValue && isMaliciousHeaderValue(headerValue)) return denied(403, 'scanner_blocked');
  }
  const intakeNonce = cookieHeader.match(/(?:^|;\s*)__Host-jb-intake=\d+\.([0-9a-f-]{36})\./)?.[1];
  if (intakeNonce && blockedScannerUserIds.has(`web_${intakeNonce}`)) return denied(403, 'scanner_blocked');
  const url = new URL(request.url);
  if (request.url.length > 8192) return denied(414, 'uri_too_long');
  let path: string;
  try { path = decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/'; }
  catch { return denied(400, 'invalid_path'); }
  if (/[\\\u0000]/.test(path) || /(?:^|\/)\.\.(?:;|\/|$)/.test(path) || /%25?2e%25?2e|%2f|%5c|%00/i.test(url.pathname)) return denied(400, 'invalid_path');
  if (/(?:^|\/)\.(?:env|git|svn|hg|htaccess|htpasswd|aws|ssh|ds_store|dockerenv|npmrc|yarnrc)(?:[./]|$)/i.test(path)
    || /\.(?:php|phtml|phar|asp|aspx|jsp|cgi|bak|old|orig|sql|sqlite|ini|swp)(?:\/|$)/i.test(path)
    || /^\/(?:etc\/(?:passwd|shadow|hosts|shells)|wp-admin|wp-content|wp-includes|wp-login|wp-config|xmlrpc\.php|phpmyadmin|pma|adminer|cgi-bin|actuator|telescope|vendor\/phpunit|debug\/vars)(?:\/|$)/i.test(path)
    || /^\/(?:dockerfile|docker-compose(?:\.[^/]+)?|package(?:-lock)?\.json|tsconfig(?:\.[^/]+)?\.json|wrangler\.(?:toml|jsonc?)|next\.config\.[cm]?js|composer\.(?:json|lock)|web\.config|server-status|server-info)$/i.test(path)) {
    return denied(404, 'not_found');
  }
  if (request.headers.has('next-action')) return denied(405, 'unsupported_action');
  if (/^\/(?:_next_cache|cdn-cgi\/_next_cache|\.open-next|\.next)(?:\/|$)/.test(path)) return denied(404, 'not_found');
  if (path.startsWith('/_next/static/') && path.endsWith('.map')) return denied(404, 'not_found');
  if (path === '/_next/image' && !imageRequest(url)) return denied(400, 'invalid_image_source');
  if (path !== '/_next/image' && url.search) {
    if (url.searchParams.has('companyWebsite') || isScannerQuery(url)) return denied(400, 'invalid_query');
    if (blockedScannerUserIds.has(url.searchParams.get('user_id') || '')) return denied(403, 'scanner_blocked');
  }
  const expectedPreviewId = env.prerenderRevalidateId
    || (typeof JB_PRERENDER_REVALIDATE_ID === 'string' ? JB_PRERENDER_REVALIDATE_ID : undefined);
  const internalRevalidate =
    !clientIp &&
    (request.method === 'HEAD' || request.method === 'GET') &&
    request.headers.get('x-isr') === '1' &&
    Boolean(expectedPreviewId && matchesSecret(request.headers.get('x-prerender-revalidate'), expectedPreviewId));
  // Client-supplied Next internal headers must never override middleware/auth behavior.
  const cleanHeaders = new Headers(request.headers);
  for (const key of Array.from(cleanHeaders.keys())) {
    if (key === 'x-prerender-revalidate' && internalRevalidate) continue;
    if (key.startsWith('x-middleware-') || key.startsWith('x-nextjs-') || key.startsWith('x-invoke-')
      || ['x-matched-path', 'x-now-route-matches', 'x-prerender-revalidate', 'x-prerender-revalidate-if-generated',
        'x-forwarded-host', 'x-original-url', 'x-rewrite-url', 'x-http-method-override', 'x-method-override', 'x-http-method'].includes(key)) {
      cleanHeaders.delete(key);
    }
  }
  request = new Request(request, { headers: cleanHeaders });
  if (internalRevalidate) return request;
  if ((path === '/jamoa' || path === '/jamoa.html') && !(await verifiedWebsiteRole(request, env, 'team'))) return denied(401, 'team_authentication_required');
  if (!path.startsWith('/api/')) {
    if (!['GET', 'HEAD'].includes(request.method)) return denied(405, 'method_not_allowed');
    if (!/^\/(?:_next\/static|images|assets|logos|videos)\//.test(path) && !/\.(?:ico|svg|png|jpe?g|webp|avif|woff2?|css|js|mp4)$/i.test(path)) {
      const pageAllowed = await quota(env.JB_PAGE_LIMIT, `page:${request.headers.get('cf-connecting-ip') || 'unknown'}`);
      if (pageAllowed === null) return denied(503, 'protection_unavailable', '10');
      if (!pageAllowed) return denied(429, 'rate_limited', '60');
    }
    return request;
  }
  if (!knownRoutes.has(path) && path !== '/api/security/challenge' && !/^\/api\/admin\/payouts\/[a-zA-Z0-9_-]{1,80}\/mark-paid$/.test(path)) return denied(404, 'not_found');
  if (!['GET', 'HEAD', 'POST', 'OPTIONS'].includes(request.method)) return denied(405, 'method_not_allowed');

  const tokenAuth = bearer(request, [env.OISHA_SECRET_KEY]);
  if (path.startsWith('/api/admin/') && !['/api/admin/login', '/api/admin/logout'].includes(path)) {
    if (!(await verifiedWebsiteRole(request, env))) return denied(401, 'admin_authentication_required');
    if (request.method === 'POST' && !browserOrigin(request)) return denied(403, 'origin_rejected');
  }
  if (path === '/api/revalidate'
    && !bearer(request, [env.REVALIDATE_SECRET, env.CRON_SECRET, env.AMOCRM_CRON_SECRET])
    && !matchesSecret(request.headers.get('x-sanity-webhook-secret') || request.headers.get('x-webhook-secret'), env.REVALIDATE_SECRET)) return denied(401, 'unauthorized');
  if ((cronRoutes.has(path) || (path === '/api/testimonials' && request.method === 'POST'))
    && !bearer(request, [env.CRON_SECRET, env.AMOCRM_CRON_SECRET])) return denied(401, 'unauthorized');
  if (serviceRoutes.has(path) && !bearer(request, [env.AMOCRM_CRON_SECRET])) return denied(401, 'unauthorized');
  if (path === '/api/amocrm-webhook'
    && !matchesSecret(request.headers.get('x-jonbranding-webhook-secret') || url.searchParams.get('secret'), env.AMOCRM_WEBHOOK_SECRET)) return denied(401, 'unauthorized');
  if (path === '/api/portfolio-telegram'
    && !matchesSecret(request.headers.get('x-telegram-bot-api-secret-token'), env.TELEGRAM_WEBHOOK_SECRET)
    && !bearer(request, [env.CRON_SECRET, env.AMOCRM_CRON_SECRET])) return denied(401, 'unauthorized');
  if (path === '/api/vimeo-webhook' && (!env.VIMEO_WEBHOOK_SECRET || !/^[a-f0-9]{64}$/i.test(request.headers.get('x-webhook-signature') || ''))) return denied(401, 'unauthorized');

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const allowed = await quota(env.JB_API_LIMIT, `api:${ip}`);
  if (allowed === null) return denied(503, 'protection_unavailable', '10');
  if (!allowed) return denied(429, 'rate_limited', '60');

  if (path === '/api/security/challenge') return request.method === 'GET' ? humanConfiguration(request, env) : denied(405, 'method_not_allowed');
  if (path === '/api/security/verify' && request.method !== 'POST') return denied(405, 'method_not_allowed');

  if (path === '/api/oisha' && ['GET', 'HEAD'].includes(request.method)) {
    if (!tokenAuth && !(await validIntakeSession(request, env, Date.now(), 0))) return denied(403, 'reload_required');
    if (!tokenAuth) {
      const cookie = request.headers.get('cookie')!.match(/(?:^|;\s*)__Host-jb-intake=\d+\.([0-9a-f-]{36})\./)!;
      url.searchParams.set('user_id', `web_${cookie[1]}`);
      return new Request(url, request);
    }
    return request;
  }
  if (request.method !== 'POST') return request;
  if (!browserPosts.has(path)) {
    // Authenticated webhooks retain their original raw bytes for HMAC verification.
    return boundedCopy(request, 256_000);
  }
  if (!tokenAuth && !browserOrigin(request)) return denied(403, 'origin_rejected');
  if (path === '/api/admin/logout' && !request.headers.get('content-type')) {
    if (!tokenAuth && !(await validIntakeSession(request, env))) return denied(403, 'reload_required');
    return request;
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return denied(415, 'json_required');
  if (request.headers.has('content-encoding') && request.headers.get('content-encoding') !== 'identity') return denied(415, 'encoding_not_supported');
  let body: unknown;
  try { body = await readChatBody(request, 16_384); }
  catch (error) { return denied(error instanceof RangeError ? 413 : 400, 'invalid_body'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return denied(400, 'invalid_body');
  const data = body as Record<string, unknown>;
  if (leadPosts.has(path) && !validLead(data, path)) return denied(400, 'invalid_lead');
  if (path === '/api/oisha') {
    if (typeof data.user_id === 'string' && blockedScannerUserIds.has(data.user_id)) return denied(403, 'scanner_blocked');
    if (!validChatMessage(data.text) || !safeIntakeObject(data)) return denied(400, 'invalid_chat_message');
  }
  if (path === '/api/affiliate/validate-code' && (typeof data.code !== 'string' || !/^[\p{L}\p{N}_-]{1,40}$/u.test(data.code))) return denied(400, 'invalid_code');
  if (path === '/api/report-error' && (typeof data.message !== 'string' || !data.message.trim() || data.message.length > 2000)) return denied(400, 'invalid_error_report');
  if (!tokenAuth && !(await validIntakeSession(request, env))) return denied(403, 'reload_required');

  if (path === '/api/security/verify') {
    const challengeAllowed = await quota(env.JB_CHALLENGE_LIMIT, `challenge:${ip}`);
    if (challengeAllowed === null) return denied(503, 'verification_unavailable', '10');
    if (!challengeAllowed) return denied(429, 'rate_limited', '60');
    return verifyHumanChallenge(request, data, env);
  }
  if (!tokenAuth && (leadPosts.has(path) || path === '/api/oisha') && humanVerificationRequired(env) && !(await validHumanSession(request, env))) return denied(403, 'human_verification_required');

  if (leadPosts.has(path) || path === '/api/report-error' || path === '/api/admin/login') {
    const limit = path === '/api/admin/login' ? env.JB_LOGIN_LIMIT : env.JB_FORM_LIMIT;
    const allowedForm = await quota(limit, `write:${ip}`);
    if (allowedForm === null) return denied(503, 'protection_unavailable', '10');
    if (!allowedForm) return denied(429, 'rate_limited', '60');
  }
  if (path === '/api/report-error') {
    const message = String(data.message).trim();
    const stack = typeof data.stack === 'string' ? data.stack.trim() : '';
    const errorChatId = (env.TELEGRAM_ERROR_CHAT_ID || env.TELEGRAM_ADMIN_CHAT_ID || '').trim();
    const salesChatId = (env.TELEGRAM_CHAT_ID || '').trim();
    if (/ResizeObserver loop|^Script error\.?$|Telegram API Error|Non-Error promise rejection/i.test(message)
      || /^https?:\/\/[^/\s]+\/?:0:0$/i.test(stack)
      || !errorChatId || errorChatId === salesChatId) {
      return Response.json({ ok: true, reported: false }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
    }
  }
  if (leadPosts.has(path)) {
    const contact = contactKey(data)!;
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(contact));
    const key = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
    const allowedContact = await quota(env.JB_CONTACT_LIMIT, `contact:${key}`);
    if (allowedContact === null) return denied(503, 'protection_unavailable', '10');
    if (!allowedContact) return denied(429, 'duplicate_contact', '60');
    if (intakePhone(data.phone)) data.phone = intakePhone(data.phone);
  }
  if (path === '/api/oisha' && !tokenAuth) {
    const cookie = request.headers.get('cookie')!.match(/(?:^|;\s*)__Host-jb-intake=\d+\.([0-9a-f-]{36})\./)!;
    data.user_id = `web_${cookie[1]}`;
  }
  const headers = new Headers(request.headers);
  headers.delete('content-length');
  return new Request(request, { headers, body: JSON.stringify(data) });
}

async function boundedCopy(request: Request, maximum: number): Promise<Request | Response> {
  if (Number(request.headers.get('content-length')) > maximum) return denied(413, 'body_too_large');
  const reader = request.body?.getReader();
  if (!reader) return request;
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maximum) { await reader.cancel(); return denied(413, 'body_too_large'); }
      chunks.push(value);
    }
  } catch { return denied(400, 'invalid_body'); }
  finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new Request(request, { body: bytes });
}
