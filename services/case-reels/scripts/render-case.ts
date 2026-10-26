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

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const slug = args[0];
const LANGS: ReelLang[] = ['uz', 'ru', 'en', 'zh'];
const lang = (args[1] ?? 'uz') as ReelLang;
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

// Egasi tasdiqlagan/chiqarilgan video ustidan yozilmaydi (chiqariladigan fayl = ko'rib chiqilgan fayl).
// draft: faqat --force bilan (keyin Telegram'da ✏️ Qayta → yangi preview). approved/scheduled/published: taqiqlangan.
const status = await sanity.withConfig({ useCdn: false }).fetch<string | null>(`*[_id == $id][0].reel.status`, { id: doc._id });
if (status === 'approved' || status === 'scheduled' || status === 'published') {
  console.error(`⛔ ${slug}: reel.status=${status} — tasdiqlangan video qayta render qilinmaydi. Avval Studio'da holatni rejected/none qiling.`);
  process.exit(1);
}
if (status === 'draft' && !process.argv.includes('--force')) {
  console.error(`⛔ ${slug}: reel.status=draft — preview yuborilgan bo'lishi mumkin. Qayta render uchun --force.`);
  process.exit(1);
}

console.log(`Tayyor: ${renderCase(doc, lang)}`);
