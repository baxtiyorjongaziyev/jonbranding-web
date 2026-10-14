/**
 * Bitta portfolio keysidan Reels render qiladi.
 *   npm run render -- <slug>
 * Natija: out/<slug>.mp4
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@sanity/client';
import type { CaseReelProps } from '../src/CaseReel';

type Result = { metric?: string; value?: string; sourceUrl?: string; period?: string; approved?: boolean };

const slug = process.argv[2];
if (!slug) {
  console.error('Foydalanish: npm run render -- <portfolio-slug>');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'h6ymmj0v',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const QUERY = `*[_type == "portfolio" && slug.current == $slug][0] {
  client, title, category,
  "beforeImage": beforeImage.asset->url + "?w=1080&h=1920&fit=crop&auto=format",
  "afterImage": afterImage.asset->url + "?w=1080&h=1920&fit=crop&auto=format",
  "gallery": galleryImages[].asset->url + "?w=1080&h=1920&fit=crop&auto=format",
  results
}`;

// Saytdagi qoida bilan bir xil (src/lib/portfolio-evidence.ts): faqat tasdiqlangan, manbali natija.
const approvedResult = (results?: Result[]) =>
  (results ?? []).find((r) => {
    if (!r?.approved || !r.metric?.trim() || !r.value?.trim() || !r.period?.trim()) return false;
    try {
      return ['https:', 'http:'].includes(new URL(r.sourceUrl ?? '').protocol);
    } catch {
      return false;
    }
  });

const doc = await client.fetch(QUERY, { slug });
if (!doc) {
  console.error(`Keys topilmadi: ${slug}`);
  process.exit(1);
}

const result = approvedResult(doc.results);
const props: CaseReelProps = {
  client: doc.client ?? doc.title,
  title: doc.title,
  category: doc.category ?? 'Branding',
  beforeImage: doc.beforeImage ?? null,
  afterImage: doc.afterImage ?? null,
  gallery: (doc.gallery ?? []).filter(Boolean),
  result: result ? { metric: result.metric!, value: result.value! } : null,
};

writeFileSync('props.json', JSON.stringify(props, null, 2));
mkdirSync('out', { recursive: true });
execFileSync('npx', ['remotion', 'render', 'src/index.ts', 'CaseReel', `out/${slug}.mp4`, '--props=props.json'], {
  stdio: 'inherit',
});
console.log(`Tayyor: out/${slug}.mp4`);
