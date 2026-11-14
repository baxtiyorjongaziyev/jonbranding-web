/** No successful lead submissions: smoke checks never create CRM deals or Telegram messages. */
const fs = require('node:fs');
const root = process.env.JB_SECURITY_EVIDENCE_DIR || 'output/website-security-deploy';
const upgrade = process.env.JB_SECURITY_UPGRADE === '1';
const live = process.argv[2] === 'live';
const target = live ? 'https://jonbranding.uz' : fs.readFileSync(root + '/preview-url.txt', 'utf8').trim();
const results = [];
const agent = 'JonBranding security verification';
let cookie = '';
async function check(label, route, expected, init = {}, signed = false) {
  const response = await fetch(target + route, { ...init, redirect: 'follow', signal: AbortSignal.timeout(45000), headers: { 'User-Agent': agent, ...(signed ? { Cookie: cookie } : {}), ...init.headers } });
  const body = await response.text();
  results.push({ label, status: response.status, expected });
  console.log(label + ': ' + response.status);
  if (!expected.includes(response.status)) throw new Error(label + ': unexpected status ' + response.status + ' ' + body.slice(0, 180));
  return { response, body };
}
const post = body => ({ method: 'POST', headers: { Origin: target, 'Content-Type': 'application/json' }, body: typeof body === 'string' ? body : JSON.stringify(body) });
async function main() {
  const page = await check('landing', '/uz', [200]);
  cookie = (page.response.headers.getSetCookie?.() || [page.response.headers.get('set-cookie') || '']).find(value => value.startsWith('__Host-jb-intake='))?.split(';')[0] || '';
  if (!cookie) throw new Error('Signed intake cookie missing');
  if (upgrade) {
    if (!page.response.headers.get('content-security-policy')?.includes("script-src-attr 'none'")) throw new Error('CSP event handler restriction missing');
    if (!page.response.headers.get('permissions-policy')?.includes('geolocation=()')) throw new Error('Permissions policy missing');
    if (page.response.headers.has('x-middleware-set-cookie')) throw new Error('Internal cookie header exposed');
    await check('private team page', '/jamoa', [401]);
    await check('private team HTML asset', '/jamoa.html', [401]);
    await check('internal cache asset', '/_next_cache/uz.html', [404]);
    await check('admin role required', '/api/admin/payouts/a-test-id/mark-paid', [401], post({}));
    for (const route of ['/ru', '/en', '/zh', '/uz/narxlar', '/uz/portfolio', '/uz/credentials']) await check('public page ' + route, route, [200]);
  }
  const asset = page.body.match(/(?:src|href)="(\/_next\/static\/[^"?]+\.js)/)?.[1];
  if (!asset) throw new Error('Next asset missing');
  await check('javascript asset', asset, [200]);
  const scanner = await check('observed scanner rejected', '/api/submit-form', [400], post({ fullName: '(select 198766*667891)', phone: '+28459941' }));
  if (!scanner.body.includes('invalid_lead')) throw new Error('New guard not verified; refusing subsequent checks');
  const lead = { fullName: 'Synthetic Security Verification', phone: '+12025550123' };
  await check('direct bot without cookie', '/api/submit-form', [403], post(lead));
  for (const fullName of ["';print(md5(31337));$a='", '${@print(md5(31337))}', '<script>alert(1)</script>', '%27%3Bprint(md5(31337))', '{{7*7}}']) {
    await check('scanner payload', '/api/submit-form', [400], post({ ...lead, fullName }), true);
  }
  await check('metadata injection', '/api/submit-form', [400], post({ ...lead, source: '1 UNION SELECT password FROM users' }), true);
  await check('honeypot', '/api/submit-form', [400], post({ ...lead, companyWebsite: 'https://example.com' }), true);
  await check('malformed phone', '/api/submit-form', [400], post({ ...lead, phone: '+28459941' }), true);
  await check('invalid body', '/api/submit-form', [400], post('null'), true);
  await check('oversized body', '/api/submit-form', [413], post({ ...lead, padding: 'a'.repeat(17000) }), true);
  await check('foreign origin', '/api/submit-form', [403], { ...post(lead), headers: { Origin: 'https://example.com', 'Content-Type': 'application/json' } }, true);
  await check('wrong content type', '/api/submit-form', [415], { method: 'POST', headers: { Origin: target, 'Content-Type': 'text/plain' }, body: '{}' }, true);
  const errorNoise = await check('ResizeObserver error suppressed', '/api/report-error', [200], post({
    message: 'ResizeObserver loop completed with undelivered notifications.',
    stack: 'https://www.jonbranding.uz/:0:0',
    pathname: '/',
  }), true);
  if (JSON.parse(errorNoise.body).reported !== false) throw new Error('Error report unexpectedly delivered');
  await check('unauthenticated cron', '/api/cron/lead-retry', [401]);
  await check('unauthenticated webhook', '/api/amocrm-webhook', [401], post({}));
  await check('server actions blocked', '/uz', [405], { method: 'POST', headers: { 'Next-Action': 'invalid' }, body: '{}' });
  await check('secret file scan', '/.env', [404]);
  await check('private image source', '/_next/image?url=http%3A%2F%2F127.0.0.1%2F&w=640&q=75', [400, 403]);
  await check('scanner honeypot query rejected', '/ru/portfolio/geonest?companyWebsite=Testing', [400]);
  await check('blocked scanner chat user_id', '/api/oisha', [403], post({ user_id: 'web_1a7ae654-dac2-41a0-aedf-b31564803674', text: 'Salom', lang: 'uz' }), true);
  await check('blocked scanner RU chat user_id', '/api/oisha', [403], post({ user_id: 'web_fc166ee6-a3c9-44c6-b3e7-39a64e61a867', text: 'Salom', lang: 'ru' }), true);
  await check('single-char chat spam rejected', '/api/oisha', [400], post({ user_id: 'web_valid_smoke_test', text: 'e', lang: 'uz' }), true);
  // A deliberately incorrect admin password cannot create a business record.
  await new Promise(resolve => setTimeout(resolve, 2100));
  const login = await check('signed browser passes session validation', '/api/admin/login', [400, 401, 503, 429], post({ password: 'SYNTHETIC-INVALID-SECURITY-TEST' }), true);
  console.log('Login quota evidence: ' + JSON.stringify({ status: login.response.status, retryAfter: login.response.headers.get('retry-after'), body: login.body.slice(0, 180) }));
  let limited = login.response.status === 429;
  for (let index = 0; index < 36 && !limited; index++) {
    if (index === 6 || index === 18) await new Promise(resolve => setTimeout(resolve, 12000));
    const res = await fetch(target + '/api/admin/login', { ...post({ password: 'SYNTHETIC-INVALID-SECURITY-TEST' }), headers: { ...post({}).headers, Cookie: cookie, 'User-Agent': agent } });
    await res.text();
    if (res.status === 429) { limited = true; break; }
    if (![400, 401, 503].includes(res.status)) throw new Error('Signed browser unexpectedly rejected: ' + res.status);
  }
  results.push({ label: 'login burst blocked (edge or original handler)', passed: limited });
  if (!limited) throw new Error('Login quota not observed');
  fs.writeFileSync(root + '/' + (live ? 'live' : 'preview') + '-smoke.json', JSON.stringify({ target, passed: true, checkedAt: new Date().toISOString(), results }, null, 2));
  console.log('PASS: ' + results.length + ' checks; no successful lead submission');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
