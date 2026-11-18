import { webcrypto } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardWebsiteRequest, type WebsiteGuardEnv } from './website-edge-guard';
import { attachIntakeSession, validIntakeSession } from './intake-session';
import { intakePhone, isScannerInput, safeIntakeObject, validChatMessage, validIntakeName } from './intake-validation';

const host = 'https://jonbranding.uz';
const client = { 'cf-connecting-ip': '192.0.2.10', 'user-agent': 'security-unit-test', origin: host };
const lead = { fullName: 'Synthetic Unit Test', phone: '+998901234567', source: 'footer_team_modal', lang: 'uz' };
function limiter() { return { limit: vi.fn(async () => ({ success: true })) }; }
function environment(): WebsiteGuardEnv { return { OISHA_SECRET_KEY: 'synthetic-unit-test-key', JB_API_LIMIT: limiter(), JB_FORM_LIMIT: limiter(), JB_CONTACT_LIMIT: limiter(), JB_LOGIN_LIMIT: limiter(), JB_PAGE_LIMIT: limiter() }; }
function post(path: string, body: unknown, headers: Record<string, string> = {}) {
  return new Request(host + path, { method: 'POST', headers: { ...client, 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
}
async function cookie(env: WebsiteGuardEnv) {
  const response = await attachIntakeSession(new Request(host, { headers: client }), new Response('<html></html>', { headers: { 'content-type': 'text/html' } }), env, Date.now() - 3000);
  return response.headers.get('set-cookie')!.split(';')[0];
}
beforeEach(() => vi.stubGlobal('crypto', webcrypto));
afterEach(() => vi.unstubAllGlobals());

describe('intake validation', () => {
  it.each(['Baxtiyorjon G‘aziyev', 'Oʻtkir', 'Анна Иванова', '王小明', "D'Angelo", 'Anne-Marie'])('accepts real name format: %s', name => expect(validIntakeName(name)).toBe(true));
  it.each(['e', 'wpGrepvf()','../../etc/passwd','<script>alert(1)</script>', '(select 198766*667891)', 'https://example.com'])('rejects scanner names: %s', name => expect(validIntakeName(name)).toBe(false));
  it.each(['pg_sleep(15)', 'waitfor delay \'0:0:15\'', "e'||DBMS_PIPE.RECEIVE_MESSAGE(CHR(98),15)||'", '${@print(md5(31337))}', '%253Cscript%253Ealert(1)%253C/script%253E', '&#60;img src=x onerror=alert(1)&#62;', 'http://bxss.me/test', '(select 198766*667891 from DUAL)', 'curl example.com', '../../../../etc/shells', '1}dfb{{98991*97996}}xca', '1%25>dfb<%25=98991*97996%25>xca', 'companyWebsite[%24eq]=Testing'])('recognizes scanner technique: %s', input => expect(isScannerInput(input)).toBe(true));
  it('allows ordinary branding questions and short real chat replies', () => {
    expect(isScannerInput("O‘zbekcha logotip kerak. Narx qancha?")).toBe(false);
    expect(validChatMessage('Ha')).toBe(true);
    expect(validChatMessage('Salom, logo narxi qancha?')).toBe(true);
    expect(validChatMessage('e')).toBe(false);
    expect(validChatMessage('Testing')).toBe(false);
    expect(validChatMessage('...')).toBe(false);
  });
  it('does not turn arbitrary text into a phone', () => {
    expect(intakePhone('call999901234567')).toBeNull();
    expect(intakePhone('+28459941')).toBeNull();
    expect(intakePhone('90 123 45 67')).toBe('+998901234567');
  });
  it('rejects prototype keys and excessive nesting', () => {
    expect(safeIntakeObject(JSON.parse('{"__proto__":{"admin":true}}'))).toBe(false);
    expect(safeIntakeObject({ a: { b: { c: { d: { e: { f: { g: {} } } } } } } })).toBe(false);
  });
});

describe('signed intake sessions', () => {
  it('issues an HttpOnly, Secure, host-only cookie and disables shared HTML caching', async () => {
    const result = await attachIntakeSession(new Request(host, { headers: client }), new Response('page', { headers: { 'content-type': 'text/html', 'cache-control': 'public' } }), environment());
    expect(result.headers.get('set-cookie')).toMatch(/__Host-jb-intake=.*Secure; HttpOnly; SameSite=Strict/);
    expect(result.headers.get('set-cookie')).not.toContain('Domain=');
    expect(result.headers.get('cache-control')).toBe('private, no-store');
  });
  it('rejects forged, expired, fresh, or replayed-on-another-IP cookies', async () => {
    const env = environment(); const signed = await cookie(env);
    const valid = new Request(host + '/api/submit-form', { headers: { ...client, cookie: signed } });
    expect(await validIntakeSession(valid, env)).toBe(true);
    expect(await validIntakeSession(valid, env, Date.now() + 7 * 3600000)).toBe(false);
    expect(await validIntakeSession(valid, env, Date.now() - 3000)).toBe(false);
    expect(await validIntakeSession(new Request(valid, { headers: { ...client, cookie: signed, 'cf-connecting-ip': '192.0.2.11' } }), env)).toBe(false);
    expect(await validIntakeSession(new Request(valid, { headers: { ...client, cookie: signed.replace(/.$/, 'x') } }), env)).toBe(false);
  });
  it('does not put cookies on static assets', async () => {
    const original = new Response('asset', { headers: { 'content-type': 'text/javascript' } });
    expect(await attachIntakeSession(new Request(host), original, environment())).toBe(original);
  });
});

describe('website edge boundary', () => {
  it('preserves the existing bodyless admin logout behind session and origin checks', async () => {
    const env = environment();
    const request = new Request(host + '/api/admin/logout', { method: 'POST', headers: { ...client, cookie: await cookie(env) } });
    expect(await guardWebsiteRequest(request, env)).toBeInstanceOf(Request);
    expect((await guardWebsiteRequest(new Request(host + '/api/admin/logout', { method: 'POST', headers: client }), env) as Response).status).toBe(403);
  });
  it('passes valid human intake to the existing handler without external calls', async () => {
    const env = environment(); const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    const result = await guardWebsiteRequest(post('/api/submit-form', lead, { cookie: await cookie(env) }), env);
    expect(result).toBeInstanceOf(Request); expect(await (result as Request).json()).toEqual(lead);
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each(['/api/submit-form', '/api/diagnostics', '/api/navigator-lead', '/api/affiliate/register'])('blocks scanner data across %s', async path => {
    const result = await guardWebsiteRequest(post(path, { ...lead, fullName: '(select 198766*667891 from DUAL)' }), environment());
    expect((result as Response).status).toBe(400);
  });
  it('checks every metadata field, not just the name', async () => {
    expect((await guardWebsiteRequest(post('/api/submit-form', { ...lead, utmSource: '%253Cscript%253Ealert(1)' }), environment()) as Response).status).toBe(400);
  });
  it.each([null, [], 42, '{bad json'])('rejects malformed object %s', async body => {
    expect((await guardWebsiteRequest(post('/api/submit-form', body), environment()) as Response).status).toBe(400);
  });
  it('rejects cross-origin requests even when Referer is forged to look safe', async () => {
    expect((await guardWebsiteRequest(post('/api/submit-form', lead, { origin: 'https://evil.test', referer: host }), environment()) as Response).status).toBe(403);
  });
  it('does not trust arbitrary Vercel tenants', async () => {
    expect((await guardWebsiteRequest(post('/api/submit-form', lead, { origin: 'https://evil.vercel.app' }), environment()) as Response).status).toBe(403);
  });
  it('requires a signed session for plausible API submissions', async () => {
    const result = await guardWebsiteRequest(post('/api/submit-form', lead), environment()) as Response;
    expect(result.status).toBe(403); expect((await result.json()).error).toBe('reload_required');
  });
  it('retains a service-authenticated ingestion path', async () => {
    const env = environment();
    expect(await guardWebsiteRequest(post('/api/submit-form', lead, { authorization: `Bearer ${env.OISHA_SECRET_KEY}` }), env)).toBeInstanceOf(Request);
  });
  it('blocks oversized streamed bodies without trusting Content-Length', async () => {
    expect((await guardWebsiteRequest(post('/api/submit-form', { ...lead, pain: 'a'.repeat(17000) }), environment()) as Response).status).toBe(413);
  });
  it('rejects wrong content type before parsing', async () => {
    expect((await guardWebsiteRequest(post('/api/submit-form', lead, { 'content-type': 'text/plain' }), environment()) as Response).status).toBe(415);
  });
  it('shares contact quota across rotating IP addresses and hashes its key', async () => {
    const env = environment(); const contactLimit = vi.mocked(env.JB_CONTACT_LIMIT.limit);
    contactLimit.mockResolvedValueOnce({ success: true }).mockResolvedValueOnce({ success: false });
    const result1 = await guardWebsiteRequest(post('/api/submit-form', lead, { cookie: await cookie(env) }), env);
    const result2 = await guardWebsiteRequest(post('/api/submit-form', lead, { authorization: `Bearer ${env.OISHA_SECRET_KEY}`, 'cf-connecting-ip': '192.0.2.11' }), env) as Response;
    expect(result1).toBeInstanceOf(Request); expect(result2.status).toBe(429);
    expect(contactLimit.mock.calls[0][0].key).toMatch(/^contact:[a-f0-9]{64}$/);
    expect(contactLimit.mock.calls[0][0].key).toBe(contactLimit.mock.calls[1][0].key);
  });
  it('fails closed on unavailable edge protection', async () => {
    const env = environment(); vi.mocked(env.JB_API_LIMIT.limit).mockRejectedValue(new Error('down'));
    expect((await guardWebsiteRequest(post('/api/submit-form', lead), env) as Response).status).toBe(503);
  });
  it.each(['/api/amocrm-webhook', '/api/vimeo-webhook', '/api/portfolio-telegram', '/api/amocrm-refresh', '/api/content-agent'])('rejects unauthenticated machine endpoint %s', async path => {
    expect((await guardWebsiteRequest(post(path, {}), environment()) as Response).status).toBe(401);
  });
  it('preserves authenticated webhook bytes exactly', async () => {
    const env = { ...environment(), AMOCRM_WEBHOOK_SECRET: 'synthetic-hook-secret' };
    const request = new Request(host + '/api/amocrm-webhook', { method: 'POST', headers: { ...client, 'content-type': 'application/x-www-form-urlencoded', 'x-jonbranding-webhook-secret': 'synthetic-hook-secret' }, body: 'leads%5Bstatus%5D%5B0%5D%5Bid%5D=42' });
    const result = await guardWebsiteRequest(request, env) as Request;
    expect(result).toBeInstanceOf(Request); expect(await result.text()).toBe('leads%5Bstatus%5D%5B0%5D%5Bid%5D=42');
  });
  it('cannot select another chat visitor identity', async () => {
    const env = environment(); const signed = await cookie(env);
    const request = new Request(host + '/api/oisha?user_id=web_someone_else', { headers: { ...client, cookie: signed } });
    const result = await guardWebsiteRequest(request, env) as Request;
    expect(new URL(result.url).searchParams.get('user_id')).toMatch(/^web_[a-f0-9-]{36}$/);
    expect(new URL(result.url).searchParams.get('user_id')).not.toBe('web_someone_else');
  });
  it.each(['http://127.0.0.1/admin', 'https://evil.test/x.png', '//evil.test/a', '/api/amocrm-health', '/images/../../api/oisha'])('blocks image proxy abuse %s', target => {
    return guardWebsiteRequest(new Request(host + '/_next/image?url=' + encodeURIComponent(target)), environment()).then(result => expect((result as Response).status).toBe(400));
  });
  it('keeps approved CDN image optimization working', async () => {
    expect(await guardWebsiteRequest(new Request(host + '/_next/image?url=' + encodeURIComponent('https://cdn.sanity.io/images/h6ymmj0v/production/test.png')), environment())).toBeInstanceOf(Request);
  });
  it.each(['/.env', '/.git/config', '/wp-login.php', '/_next_cache/private.html', '/.open-next/server.js'])('blocks scanner path %s', async path => {
    expect((await guardWebsiteRequest(new Request(host + path), environment()) as Response).status).toBe(404);
  });
  it('blocks unused Server Actions and strips middleware override headers', async () => {
    expect((await guardWebsiteRequest(new Request(host, { method: 'POST', headers: { 'next-action': 'attacker' } }), environment()) as Response).status).toBe(405);
    const result = await guardWebsiteRequest(new Request(host, { headers: { 'x-middleware-subrequest': 'attacker' } }), environment()) as Request;
    expect(result.headers.get('x-middleware-subrequest')).toBeNull();
  });
  it('absorbs ResizeObserver noise and blocks error reports from falling back to the sales chat', async () => {
    const baseEnv = environment();
    const signedCookie = await cookie(baseEnv);
    const noiseRes = await guardWebsiteRequest(
      post('/api/report-error', {
        message: 'ResizeObserver loop completed with undelivered notifications.',
        stack: 'https://www.jonbranding.uz/:0:0',
        pathname: '/',
      }, { cookie: signedCookie }),
      { ...baseEnv, TELEGRAM_CHAT_ID: 'sales-chat', TELEGRAM_ADMIN_CHAT_ID: 'admin-chat' },
    ) as Response;
    expect(noiseRes.status).toBe(200);
    expect(await noiseRes.json()).toEqual({ ok: true, reported: false });

    const noAdminRes = await guardWebsiteRequest(
      post('/api/report-error', {
        message: 'TypeError: real error',
        stack: 'TypeError: real error\n    at app.js:1:1',
        pathname: '/',
      }, { cookie: signedCookie }),
      { ...baseEnv, TELEGRAM_CHAT_ID: 'sales-chat' },
    ) as Response;
    expect(noAdminRes.status).toBe(200);
    expect(await noAdminRes.json()).toEqual({ ok: true, reported: false });

    const realErrorResult = await guardWebsiteRequest(
      post('/api/report-error', {
        message: 'TypeError: real error',
        stack: 'TypeError: real error\n    at app.js:1:1',
        pathname: '/',
      }, { cookie: signedCookie }),
      { ...baseEnv, TELEGRAM_CHAT_ID: 'sales-chat', TELEGRAM_ADMIN_CHAT_ID: 'admin-chat' },
    );
    expect(realErrorResult).toBeInstanceOf(Request);
  });
  it('blocks scanner IP, honeypot/SSTI queries, 1-char spam, and blocked Oisha user_id', async () => {
    const env = environment();
    const signed = await cookie(env);
    expect((await guardWebsiteRequest(new Request(host + '/uz', { headers: { 'cf-connecting-ip': '213.230.125.2' } }), env) as Response).status).toBe(403);
    expect((await guardWebsiteRequest(new Request(host + '/ru/portfolio/geonest?companyWebsite=Testing', { headers: client }), env) as Response).status).toBe(400);
    expect((await guardWebsiteRequest(new Request(host + '/ru/portfolio/geonest?companyWebsite[%24eq]=Testing', { headers: client }), env) as Response).status).toBe(400);
    expect((await guardWebsiteRequest(new Request(host + '/ru/portfolio/geonest?q=1}dfb{{98991*97996}}xca', { headers: client }), env) as Response).status).toBe(400);
    expect(await guardWebsiteRequest(new Request(host + '/uz?online=1&_rsc=abc', { headers: client }), env)).toBeInstanceOf(Request);
    expect((await guardWebsiteRequest(post('/api/oisha', { user_id: 'web_1a7ae654-dac2-41a0-aedf-b31564803674', text: 'Salom', lang: 'uz' }, { cookie: signed }), env) as Response).status).toBe(403);
    expect((await guardWebsiteRequest(post('/api/oisha', { user_id: 'web_fc166ee6-a3c9-44c6-b3e7-39a64e61a867', text: 'Salom', lang: 'ru' }, { cookie: signed }), env) as Response).status).toBe(403);
    const blockedCookie = `__Host-jb-intake=1700000000000.fc166ee6-a3c9-44c6-b3e7-39a64e61a867.${'0'.repeat(64)}`;
    expect((await guardWebsiteRequest(post('/api/oisha', { user_id: 'web_another_id', text: 'Salom', lang: 'ru' }, { cookie: blockedCookie }), env) as Response).status).toBe(403);
    expect((await guardWebsiteRequest(new Request(host + '/ru', { headers: { ...client, cookie: blockedCookie } }), env) as Response).status).toBe(403);
    expect((await guardWebsiteRequest(post('/api/oisha', { user_id: 'web_test_user', text: 'e', lang: 'uz' }, { cookie: signed }), env) as Response).status).toBe(400);
    expect((await guardWebsiteRequest(post('/api/oisha', { user_id: 'web_test_user', text: 'Testing', lang: 'uz' }, { cookie: signed }), env) as Response).status).toBe(400);
  });

  it('protects /api/revalidate and permits only matching internal ISR revalidation requests', async () => {
    const env: WebsiteGuardEnv = {
      ...environment(),
      REVALIDATE_SECRET: 'rev-secret-123',
      prerenderRevalidateId: 'internal-preview-token-abc',
    };

    expect((await guardWebsiteRequest(new Request(host + '/cdn-cgi/_next_cache/test.cache'), env) as Response).status).toBe(404);
    expect((await guardWebsiteRequest(post('/api/revalidate', { _type: 'post' }), env) as Response).status).toBe(401);
    expect(await guardWebsiteRequest(post('/api/revalidate', { _type: 'post' }, { authorization: 'Bearer rev-secret-123' }), env)).toBeInstanceOf(Request);
    expect(await guardWebsiteRequest(post('/api/revalidate', { _type: 'post' }, { 'x-sanity-webhook-secret': 'rev-secret-123' }), env)).toBeInstanceOf(Request);

    // External requests must NEVER retain x-prerender-revalidate even if guessing the header value
    const externalSpoof = await guardWebsiteRequest(
      new Request(host + '/uz', {
        method: 'HEAD',
        headers: {
          'cf-connecting-ip': '192.0.2.99',
          'x-isr': '1',
          'x-prerender-revalidate': 'internal-preview-token-abc',
        },
      }),
      env,
    );
    expect(externalSpoof).toBeInstanceOf(Request);
    expect((externalSpoof as Request).headers.get('x-prerender-revalidate')).toBeNull();

    // Internal WORKER_SELF_REFERENCE revalidation (no cf-connecting-ip) keeps the verified token
    const internalReq = await guardWebsiteRequest(
      new Request(host + '/uz', {
        method: 'HEAD',
        headers: {
          'x-isr': '1',
          'x-prerender-revalidate': 'internal-preview-token-abc',
        },
      }),
      env,
    );
    expect(internalReq).toBeInstanceOf(Request);
    expect((internalReq as Request).headers.get('x-prerender-revalidate')).toBe('internal-preview-token-abc');
  });
});
