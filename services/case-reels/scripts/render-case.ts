/**
 * Bitta portfolio keysidan Reels render qiladi.
 *   npm run render -- <slug> [uz|ru|en|zh]
 * Natija: out/<slug>-<til>.mp4
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { approvedResult, sanity } from './lib/sanity';
import type { CaseReelProps, ReelLang } from '../src/CaseReel';


const slug = process.argv[2];
const LANGS: ReelLang[] = ['uz', 'ru', 'en', 'zh'];
const lang = (process.argv[3] ?? 'uz') as ReelLang;
if (!LANGS.includes(lang)) {
  console.error(`Til noto'g'ri: ${lang} (uz | ru | en | zh)`);
  process.exit(1);
}
const IMG = '?w=1080&h=1920&fit=crop&auto=format';
if (!slug) {
  console.error('Foydalanish: npm run render -- <portfolio-slug> [uz|ru|en|zh]');
  process.exit(1);
}



const QUERY = `*[_type == "portfolio" && slug.current == $slug][0] {
  client, title, category,
  "beforeImage": beforeImage.asset->url + "?w=1080&h=1920&fit=crop&auto=format",
  "afterImage": afterImage.asset->url + "?w=1080&h=1920&fit=crop&auto=format",
  "gallery": galleryImages[defined(asset)].asset->url,
  results
}`;



const doc = await sanity.fetch(QUERY, { slug });
if (!doc) {
  console.error(`Keys topilmadi: ${slug}`);
  process.exit(1);
}

const result = approvedResult(doc.results);
const props: CaseReelProps = {
  lang,
  client: doc.client ?? doc.title,
  title: doc.title,
  category: doc.category ?? 'Branding',
  beforeImage: doc.beforeImage ?? null,
  afterImage: doc.afterImage ?? null,
  gallery: ((doc.gallery ?? []) as (string | null)[]).filter(Boolean).map((url) => `${url}${IMG}`),
  result: result ? { metric: result.metric!, value: result.value! } : null,
};

writeFileSync('props.json', JSON.stringify(props, null, 2));
mkdirSync('out', { recursive: true });
execFileSync('npx', ['remotion', 'render', 'src/index.ts', 'CaseReel', `out/${slug}-${lang}.mp4`, '--props=props.json'], {
  stdio: 'inherit',
});
console.log(`Tayyor: out/${slug}-${lang}.mp4`);
