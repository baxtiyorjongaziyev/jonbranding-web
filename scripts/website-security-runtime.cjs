const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const bindings = [
  { name: 'OISHA_CHAT_BURST', type: 'ratelimit', namespace_id: '2026111401', simple: { limit: 5, period: 10 } },
  { name: 'OISHA_CHAT_MINUTE', type: 'ratelimit', namespace_id: '2026111402', simple: { limit: 30, period: 60 } },
  { name: 'JB_API_LIMIT', type: 'ratelimit', namespace_id: '2026111403', simple: { limit: 120, period: 60 } },
  { name: 'JB_FORM_LIMIT', type: 'ratelimit', namespace_id: '2026111404', simple: { limit: 5, period: 60 } },
  { name: 'JB_CONTACT_LIMIT', type: 'ratelimit', namespace_id: '2026111405', simple: { limit: 2, period: 60 } },
  { name: 'JB_LOGIN_LIMIT', type: 'ratelimit', namespace_id: '2026111406', simple: { limit: 5, period: 60 } },
  { name: 'JB_PAGE_LIMIT', type: 'ratelimit', namespace_id: '2026111407', simple: { limit: 120, period: 60 } },
];

function runtimeSource() {
  const modules = ['oisha-input', 'intake-validation', 'intake-session', 'website-admin-session', 'website-response-security', 'website-edge-guard', 'oisha-edge-guard'];
  const code = modules.map(name => ts.transpileModule(fs.readFileSync(path.join(__dirname, `../src/lib/${name}.ts`), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  }).outputText.replace(/^import .*;\r?\n/gm, '').replace(/^export /gm, '')).join('\n');
  return `(() => {\n${code}\nreturn {guardWebsiteRequest, guardOishaRequest, attachIntakeSession, secureWebsiteResponse};\n})()`;
}

function wrapperSource(originalName, legacyOrigin = '') {
  return `
const __jbRuntime = ${runtimeSource()};
const __jbOriginalFetch = ${originalName}.fetch;
${originalName}.fetch = async function(request, env, ctx) {
  const checked = await __jbRuntime.guardWebsiteRequest(request, env);
  if (checked instanceof Response) return __jbRuntime.secureWebsiteResponse(request, checked);
  const chat = await __jbRuntime.guardOishaRequest(checked, env);
  if (chat instanceof Response) return __jbRuntime.secureWebsiteResponse(request, chat);
  request = chat;
  const assetPath = new URL(request.url).pathname;
  ${!legacyOrigin ? `
  if (['GET','HEAD'].includes(request.method) && (assetPath === '/jamoa' || /\\.(?:html|ico|svg|png|jpe?g|webp|avif|woff2?|css|js|mp4|pdf|txt|xml)$/.test(assetPath) || assetPath.startsWith('/_next/static/'))) {
    const assetRequest = assetPath === '/jamoa' ? new Request(new URL('/jamoa.html', request.url), request) : request;
    const asset = await env.ASSETS.fetch(assetRequest);
    if (asset.status !== 404) return __jbRuntime.secureWebsiteResponse(request, await __jbRuntime.attachIntakeSession(request, asset, env));
  }
  ` : ''}
  ${legacyOrigin ? `
  const legacyAsset = async input => {
    const original = new Request(input);
    const target = new URL(original.url); target.host = ${JSON.stringify(new URL(legacyOrigin).host)}; target.protocol = 'https:';
    return fetch(target, {method: original.method === 'HEAD' ? 'HEAD' : 'GET', headers: {Accept: original.headers.get('accept') || '*/*'}, redirect: 'follow'});
  };
  if (new URL(request.url).pathname.startsWith('/_next/static/')) return __jbRuntime.secureWebsiteResponse(request, await legacyAsset(request));
  const assets = env.ASSETS;
  env = {...env, ASSETS: {async fetch(input, init) {const response = await assets.fetch(input, init); return response.status === 404 ? legacyAsset(new Request(input, init)) : response;}}};
  ` : ''}
  let response = await __jbOriginalFetch(request, env, ctx);
  response = await __jbRuntime.attachIntakeSession(request, response, env);
  if (new URL(request.url).pathname.startsWith('/api/')) {
    const headers = new Headers(response.headers); headers.set('Cache-Control', 'private, no-store'); headers.set('X-Content-Type-Options', 'nosniff');
    response = new Response(response.body, {status: response.status, statusText: response.statusText, headers});
  }
  return __jbRuntime.secureWebsiteResponse(request, response);
};
`;
}

function patchSnapshot(source, legacyOrigin) {
  if (!source.includes('var worker_default = {') || source.includes('const __jbRuntime =')) throw new Error('Unrecognized or already protected snapshot');
  return source + wrapperSource('worker_default', legacyOrigin);
}

module.exports = { bindings, runtimeSource, wrapperSource, patchSnapshot };
if (require.main === module) {
  const target = path.join(__dirname, '../.open-next/security-worker.mjs');
  fs.writeFileSync(target, `import original from './worker.js';\nexport * from './worker.js';\n${wrapperSource('original')}\nexport default original;\n`);
  console.log('Built security-worker.mjs from tested source guards');
}
