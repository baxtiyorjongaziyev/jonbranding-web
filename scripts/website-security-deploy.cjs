/** Scoped deployment: clone an exact known-good version; never publish a dirty workspace build. */
const fs = require('node:fs');
const path = require('node:path');
const { bindings, patchSnapshot } = require('./website-security-runtime.cjs');
const root = path.resolve('output/website-security-deploy');
fs.mkdirSync(root, { recursive: true });
const localConfig = fs.readFileSync(path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'), 'utf8');
const token = localConfig.match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];
if (!token) throw new Error('Wrangler authentication unavailable');
const account = 'https://api.cloudflare.com/client/v4/accounts/e29fda2e66e08927a6423c2d8d7320ce';
const script = account + '/workers/scripts/jonbranding-web';
const baseVersion = '74bf6d3b-acba-4a72-a6e2-d4f56804e117';
async function api(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, ...init.headers } });
  const result = await res.json();
  if (!res.ok || result.success === false) throw new Error(`Cloudflare ${res.status}: ${JSON.stringify(result.errors || [])}`);
  return result.result;
}
function save(name, data) { fs.writeFileSync(path.join(root, name), JSON.stringify(data, null, 2)); }
async function main() {
  const mode = process.argv[2];
  if (mode === 'prepare') {
    const deployments = await api(script + '/deployments');
    const current = deployments.deployments[0].versions;
    if (current.length !== 1 || current[0].percentage !== 100) throw new Error('Gradual rollout in progress; refusing overwrite');
    const settings = await api(script + '/settings');
    const workers = await api(account + '/workers/workers');
    const worker = workers.find(item => item.name === 'jonbranding-web');
    if (!worker) throw new Error('Worker missing');
    const source = await api(account + `/workers/workers/${worker.id}/versions/${baseVersion}?include=modules`);
    if (source.id !== baseVersion || source.main_module !== 'worker.js') throw new Error('Unexpected source');
    const subdomain = await api(account + '/workers/subdomain');
    save('rollback.json', { versions: current, sourceVersion: baseVersion });
    save('settings.json', settings); save('source.json', source); save('subdomain.json', subdomain);
    console.log(JSON.stringify({ rollbackVersion: current[0].version_id, sourceVersion: baseVersion, modules: source.modules.map(m => m.name) }));
    return;
  }
  if (mode === 'upload') {
    const source = JSON.parse(fs.readFileSync(path.join(root, 'source.json')));
    const settings = JSON.parse(fs.readFileSync(path.join(root, 'settings.json')));
    const names = new Set(bindings.map(binding => binding.name));
    const form = new FormData();
    for (const mod of source.modules) {
      let content = Buffer.from(mod.content_base64, 'base64');
      if (mod.name === 'worker.js') content = Buffer.from(patchSnapshot(content.toString(), 'https://74bf6d3b-jonbranding-web.baxtiyorjongaziyev.workers.dev'));
      form.append(mod.name, new Blob([content], { type: mod.content_type }), mod.name);
    }
    const metadata = {
      main_module: 'worker.js', compatibility_date: source.compatibility_date, compatibility_flags: source.compatibility_flags,
      keep_assets: true, keep_bindings: ['secret_text', 'secret_key'],
      bindings: [...settings.bindings.filter(binding => !['secret_text', 'secret_key'].includes(binding.type) && !names.has(binding.name)), ...bindings],
      annotations: { 'workers/message': 'Website intake security: forms/chat/webhooks/session/schema/quotas/image boundary' },
    };
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    const result = await api(script + '/versions', { method: 'POST', body: form });
    save('upload.json', { id: result.id, metadata: result.metadata });
    const subdomain = JSON.parse(fs.readFileSync(path.join(root, 'subdomain.json'))).subdomain;
    const url = `https://${result.id.slice(0, 8)}-jonbranding-web.${subdomain}.workers.dev`;
    fs.writeFileSync(path.join(root, 'preview-url.txt'), url);
    console.log(JSON.stringify({ version: result.id, preview: url })); return;
  }
  if (mode === 'deploy' || mode === 'rollback') {
    const saved = JSON.parse(fs.readFileSync(path.join(root, 'rollback.json')));
    const target = JSON.parse(fs.readFileSync(path.join(root, 'upload.json'))).id;
    if (mode === 'deploy') {
      const current = (await api(script + '/deployments')).deployments[0].versions;
      if (JSON.stringify(current) !== JSON.stringify(saved.versions)) throw new Error('Production changed since preparation; stop for reconciliation');
      const proof = JSON.parse(fs.readFileSync(path.join(root, 'preview-smoke.json')));
      if (!proof.passed || !proof.target.includes(target.slice(0, 8))) throw new Error('Missing matching preview verification');
    }
    const versions = mode === 'rollback' ? saved.versions : [{ version_id: target, percentage: 100 }];
    const result = await api(script + '/deployments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ strategy: 'percentage', versions, annotations: { 'workers/message': `${mode}: website security (owner authorized 2026-11-14)` } }) });
    save(mode + '.json', result);
    console.log(JSON.stringify({ deployment: result.id, versions })); return;
  }
  throw new Error('Use prepare, upload, deploy or rollback');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
