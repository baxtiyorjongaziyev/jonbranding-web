/**
 * Bitta portfolio keysidan Reels render qiladi.
 *   npm run render -- <slug> [uz|ru|en|zh]
 * Natija: out/<slug>-<til>.mp4
 */
import './lib/env';
import type { ReelLang } from '../src/CaseReel';
import { CASE_FIELDS, type CaseDoc } from './lib/case-data';
import { renderCase } from './lib/render';
import { sanity } from './lib/sanity';

const slug = process.argv[2];
const LANGS: ReelLang[] = ['uz', 'ru', 'en', 'zh'];
const lang = (process.argv[3] ?? 'uz') as ReelLang;
if (!LANGS.includes(lang)) {
  console.error(`Til noto'g'ri: ${lang} (uz | ru | en | zh)`);
  process.exit(1);
}
if (!slug) {
  console.error('Foydalanish: npm run render -- <portfolio-slug> [uz|ru|en|zh]');
  process.exit(1);
}

const doc = await sanity.fetch<CaseDoc | null>(`*[_type == "portfolio" && slug.current == $slug][0]{ ${CASE_FIELDS} }`, { slug });
if (!doc) {
  console.error(`Keys topilmadi: ${slug}`);
  process.exit(1);
}

console.log(`Tayyor: ${renderCase(doc, lang)}`);
