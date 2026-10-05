// npm audit gate: fail on high/critical advisories, except allowlisted ones
// that have no patched release upstream. Remove entries once a fix ships.
import fs from 'node:fs';

const ALLOWLIST = new Map([
  // braces <=3.0.3 stack-exhaustion DoS; no patched version (via sanity/chokidar/micromatch)
  ['GHSA-vfj7-8cjw-p6xm', 'braces: no upstream fix yet'],
]);

const audit = JSON.parse(fs.readFileSync(process.argv[2] ?? 'npm-audit.json', 'utf8'));
const advisories = new Map();
for (const vuln of Object.values(audit.vulnerabilities ?? {})) {
  for (const via of vuln.via) {
    if (typeof via !== 'object') continue;
    const id = via.url?.split('/').pop();
    advisories.set(id, { name: via.name, severity: via.severity, title: via.title, id });
  }
}

const blocking = [...advisories.values()].filter(
  (a) => (a.severity === 'high' || a.severity === 'critical') && !ALLOWLIST.has(a.id),
);
const ignored = [...advisories.values()].filter((a) => ALLOWLIST.has(a.id));

const lines = ['## npm audit report', ''];
for (const [k, v] of Object.entries(audit.metadata?.vulnerabilities ?? {})) lines.push(`- ${k}: ${v}`);
lines.push('', '### Blocking', ...(blocking.length ? blocking.map((a) => `- ${a.severity} ${a.name} ${a.id}: ${a.title}`) : ['- none']));
lines.push('', '### Allowlisted', ...(ignored.length ? ignored.map((a) => `- ${a.name} ${a.id}: ${ALLOWLIST.get(a.id)}`) : ['- none']), '');
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
console.log(lines.join('\n'));

if (blocking.length) {
  console.error('High/critical advisories found. Review npm-audit.json and Dependabot alerts.');
  process.exit(1);
}
