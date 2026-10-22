/**
 * F-02 sifat darvozasi.
 *   npm run quality-gate -- <video.mp4> [case.json]
 * case.json berilsa galereya ham tekshiriladi. Rad etilsa exit code 1.
 */
import { readFileSync } from 'node:fs';
import { checkCase, checkRendered, type GateResult } from './lib/quality-gate';

const [video, caseFile] = process.argv.slice(2);
if (!video) {
  console.error('Foydalanish: npm run quality-gate -- <video.mp4> [case.json]');
  process.exit(1);
}

const results: GateResult[] = [];
if (caseFile) results.push(checkCase(JSON.parse(readFileSync(caseFile, 'utf8'))));
results.push(await checkRendered(video));

const reasons = results.flatMap((r) => r.reasons);
console.log(JSON.stringify({ ok: reasons.length === 0, reasons }, null, 2));
process.exit(reasons.length ? 1 : 0);
