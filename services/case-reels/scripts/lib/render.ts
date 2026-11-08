/** Remotion orqali bitta keysni bitta tilda render qiladi. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import type { ReelLang } from '../../src/CaseReel';
import { toProps, type CaseDoc } from './case-data';

export function renderCase(doc: CaseDoc, lang: ReelLang, file = `out/${doc.slug}-${lang}.mp4`): string {
  mkdirSync('out', { recursive: true });
  const propsFile = `out/${doc.slug}-${lang}.props.json`;
  writeFileSync(propsFile, JSON.stringify(toProps(doc, lang), null, 2));
  execFileSync('npx', ['remotion', 'render', 'src/index.ts', 'CaseReel', file, `--props=${propsFile}`], { stdio: 'inherit' });
  return file;
}
