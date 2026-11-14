// Fail closed: an unavailable/malformed audit must never look like a clean scan.
import fs from 'node:fs';

const ALLOWLIST = new Map();

let raw = fs.readFileSync(process.argv[2] ?? 'npm-audit.json');
if (raw[0] === 0xff && raw[1] === 0xfe) {
  raw = raw.subarray(2).toString('utf16le');
} else {
  raw = raw.toString('utf8').replace(/^\uFEFF/, '');
}
const audit = JSON.parse(raw);
if (audit.error || audit.auditReportVersion !== 2 || !audit.vulnerabilities || typeof audit.vulnerabilities !== 'object'
  || !audit.metadata?.vulnerabilities || ['high', 'critical', 'total'].some(key => !Number.isInteger(audit.metadata.vulnerabilities[key]) || audit.metadata.vulnerabilities[key] < 0)) {
  throw new Error('npm audit did not return a complete report; security gate cannot pass.');
}
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

const totalsHighOrCritical = (audit.metadata?.vulnerabilities?.high ?? 0) + (audit.metadata?.vulnerabilities?.critical ?? 0);
if (blocking.length || totalsHighOrCritical > 0) {
  console.error('High/critical advisories found. Review npm-audit.json and Dependabot alerts.');
  process.exit(1);
}
