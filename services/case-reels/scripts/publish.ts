/**
 * F-07 — egasi tasdiqlagan (reel.status=approved) keyslardan bittasini Instagram Reels'ga chiqaradi.
 *   npm run ig-publish            # faqat ochiq slot bo'lsa (09:00 / 13:00 / 19:00 Toshkent), bitta keys
 *   npm run ig-publish -- --now   # slotni kutmasdan (qo'lda sinov)
 * Cron (server UTC): `0 4,8,14 * * * cd services/case-reels && npm run ig-publish`
 *
 * .env: META_IG_USER_ID, META_ACCESS_TOKEN, SANITY_WRITE_TOKEN, PUBLISH_LANG (default uz)
 * MOCK_META=true — Instagram'ga chiqmaydi; MOCK_SANITY_WRITE=true — Sanity'ga yozilmaydi.
 * Faqat approved holat chiqariladi — tasdiqsiz chiqarish yo'q (AGENTS.md, Human-in-the-loop).
 */
import './lib/env';
import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import type { ManifestEntry } from './lib/batch';
import { graphApi, igCaption, mockGraph, publishReel, slotOpen } from './lib/meta';
import { sanity } from './lib/sanity';
import type { CaptionFile } from './lib/telegram';

const force = process.argv.includes('--now');
const lang = process.env.PUBLISH_LANG?.trim() || 'uz';
const mockMeta = process.env.MOCK_META === 'true';
const mockWrite = process.env.MOCK_SANITY_WRITE === 'true';
const igUserId = process.env.META_IG_USER_ID;
const metaToken = process.env.META_ACCESS_TOKEN;
const writeToken = process.env.SANITY_WRITE_TOKEN;

if (!mockMeta && (!igUserId || !metaToken)) {
  console.error('META_IG_USER_ID va META_ACCESS_TOKEN kerak (yoki MOCK_META=true).');
  process.exit(1);
}
// Haqiqiy chiqarishda Sanity'ga yozish shart: aks holda bir keys qayta-qayta chiqib ketadi.
if (!mockMeta && !writeToken) {
  console.error('SANITY_WRITE_TOKEN kerak — chiqarilgan keys "published" deb belgilanishi shart.');
  process.exit(1);
}

const reader = sanity.withConfig({ useCdn: false });
const writer = writeToken ? sanity.withConfig({ token: writeToken, useCdn: false }) : null;

const lastPublishedAt = await reader.fetch<string | null>(
  `*[_type == "portfolio" && defined(reel.publishedAt)] | order(reel.publishedAt desc)[0].reel.publishedAt`,
);
if (!force && !slotOpen(new Date(), lastPublishedAt)) {
  console.log('⏸  Hozir ochiq slot yo\'q (09:00 / 13:00 / 19:00 Toshkent, har slotda bitta).');
  process.exit(0);
}

const next = await reader.fetch<{ _id: string; _rev: string; slug: string } | null>(
  `*[_type == "portfolio" && !(_id in path("drafts.**")) && reel.status == "approved"] | order(_updatedAt asc)[0]{ _id, _rev, "slug": slug.current }`,
);
if (!next) {
  console.log("Tasdiqlangan reel yo'q.");
  process.exit(0);
}

const manifest: ManifestEntry[] = existsSync('out/manifest.json') ? JSON.parse(readFileSync('out/manifest.json', 'utf8')) : [];
const entry = manifest.find((e) => e.slug === next.slug && e.lang === lang && e.gate.ok && e.file && e.captionFile);
if (!entry || !existsSync(entry.file!) || !existsSync(entry.captionFile!)) {
  console.error(`❌ ${next.slug} [${lang}]: video yoki caption topilmadi (out/manifest.json). Avval: npm run batch`);
  process.exit(1);
}
const captionFile = JSON.parse(readFileSync(entry.captionFile!, 'utf8')) as CaptionFile;
const caption = igCaption(captionFile.text, captionFile.hashtags);

// Instagram videoni ommaviy URL'dan oladi — Sanity CDN'ga yuklanadi va reel.videos.<til> ga yoziladi.
let videoUrl: string;
if (writer && !mockWrite) {
  const asset = await writer.assets.upload('file', createReadStream(entry.file!), { filename: basename(entry.file!), contentType: 'video/mp4' });
  videoUrl = asset.url;
} else {
  videoUrl = `https://cdn.sanity.io/mock/${basename(entry.file!)}`;
  console.log(`[mock] video yuklanmadi: ${videoUrl}`);
}

const graph = mockMeta ? mockGraph(console.log) : graphApi(metaToken!);
const { permalink } = await publishReel(videoUrl, caption, {
  graph,
  igUserId: igUserId ?? 'mock-ig-user',
  sleep: (ms) => new Promise((r) => setTimeout(r, mockMeta ? 0 : ms)),
});

const patch = { 'reel.status': 'published', 'reel.publishedAt': new Date().toISOString(), 'reel.postUrl': permalink, [`reel.videos.${lang}`]: videoUrl };
if (writer && !mockWrite) {
  // ifRevisionId: tanlangandan keyin holat o'zgargan bo'lsa (masalan rad etilgan) — yozuv rad etiladi va xato ko'rinadi.
  await writer.patch(next._id).ifRevisionId(next._rev).setIfMissing({ reel: {} }).set(patch).commit();
} else {
  console.log(`[mock] ${next.slug}: ${JSON.stringify(patch)}`);
}
console.log(`✅ ${next.slug} chiqarildi: ${permalink}`);
