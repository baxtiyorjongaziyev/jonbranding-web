/**
 * Bitta keys uchun 4 tilda Reels caption yozadi (F-05).
 *   npm run caption -- <slug>
 * Natija: out/<slug>-captions.json
 * GEMINI_API_KEY bo'lmasa yoki MOCK_LLM=true bo'lsa — LLM'siz shablon caption.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import type { ReelLang } from '../src/CaseReel';
import { geminiGenerator, makeCaption, type CaptionFacts } from './lib/caption';
import { approvedResult, sanity } from './lib/sanity';

const slug = process.argv[2];
if (!slug) {
  console.error('Foydalanish: npm run caption -- <portfolio-slug>');
  process.exit(1);
}

const doc = await sanity.fetch(
  `*[_type == "portfolio" && slug.current == $slug][0]{ client, title, category, city, industry, description, results }`,
  { slug },
);
if (!doc) {
  console.error(`Keys topilmadi: ${slug}`);
  process.exit(1);
}

const r = approvedResult(doc.results);
const facts: CaptionFacts = {
  client: doc.client ?? doc.title,
  title: doc.title,
  category: doc.category ?? undefined,
  city: doc.city ?? undefined,
  industry: doc.industry ?? undefined,
  description: typeof doc.description === 'string' ? doc.description.slice(0, 600) : undefined,
  result: r ? { metric: r.metric!, value: r.value!, period: r.period! } : null,
  url: `https://jonbranding.uz/uz/portfolio/${slug}`,
};

const key = process.env.GEMINI_API_KEY;
const generate = key && process.env.MOCK_LLM !== 'true' ? geminiGenerator(key) : undefined;
if (!generate) console.warn('⚠️  LLM o\'chiq (GEMINI_API_KEY yo\'q yoki MOCK_LLM=true) — shablon caption yoziladi.');

const langs: ReelLang[] = ['uz', 'ru', 'en', 'zh'];
const captions = [];
for (const lang of langs) captions.push(await makeCaption(facts, lang, generate));

mkdirSync('out', { recursive: true });
writeFileSync(`out/${slug}-captions.json`, JSON.stringify({ slug, facts, captions }, null, 2));
for (const c of captions) {
  const flags = [...c.needsReview, ...c.errors].join('; ');
  console.log(`[${c.lang}] ${c.source}${flags ? ` — ${flags}` : ''}`);
}
console.log('ℹ️  Bu draft. Egasi tasdiqlamaguncha hech narsa chiqmaydi (F-06).');
console.log(`Tayyor: out/${slug}-captions.json`);
