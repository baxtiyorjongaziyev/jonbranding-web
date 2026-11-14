import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const clean = { auditReportVersion: 2, vulnerabilities: {}, metadata: { vulnerabilities: { high: 0, critical: 0, total: 0 } } };
function run(report) {
  const directory = mkdtempSync(join(tmpdir(), 'jb-audit-test-'));
  try {
    const file = join(directory, 'audit.json');
    writeFileSync(file, JSON.stringify(report));
    return spawnSync(process.execPath, ['scripts/check-audit.mjs', file], { encoding: 'utf8', env: { ...process.env, GITHUB_STEP_SUMMARY: '' } }).status;
  } finally {
    if (!directory.startsWith(join(tmpdir(), 'jb-audit-test-'))) throw new Error('Unexpected temporary test directory');
    rmSync(directory, { recursive: true });
  }
}
test('valid clean report passes', () => assert.equal(run(clean), 0));
test('audit provider error fails', () => assert.notEqual(run({ error: { code: 'EAUDITNOLOCK' } }), 0));
test('empty report fails', () => assert.notEqual(run({}), 0));
test('high/critical totals fail even if advisory details are missing', () => assert.notEqual(run({ ...clean, metadata: { vulnerabilities: { high: 1, critical: 0, total: 1 } } }), 0));
test('old allowlisted critical advisory also fails', () => assert.notEqual(run({ ...clean, vulnerabilities: { braces: { via: [{ url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm', name: 'braces', severity: 'critical', title: 'synthetic gate regression' }] } } }), 0));
