/**
 * F-07 — egasi tasdiqlagan (reel.status=approved) keyslardan bittasini Instagram Reels'ga chiqaradi.
 *   npm run ig-publish            # faqat ochiq slotda (09:00 / 13:00 / 19:00 Toshkent), har slotda bitta
 *   npm run ig-publish -- --now   # slotni kutmasdan (qo'lda sinov) — baribir slot band qilinadi
 * Cron (server UTC): `0 4,8,14 * * * cd services/case-reels && npm run ig-publish`
 *
 * .env: META_IG_USER_ID, META_ACCESS_TOKEN, SANITY_WRITE_TOKEN, PUBLISH_LANG (default uz)
 * MOCK_META=true — to'liq sinov: Sanity'ga ham, Instagram'ga ham hech narsa yozilmaydi/yuklanmaydi, faqat lokal manifest.
 *
 * Xavfsizlik (AGENTS.md, Human-in-the-loop):
 *  1. Slot qulfi — `reelsPublishLock` hujjati ifRevisionId bilan band qilinadi: ikki parallel ishga tushirish bitta slotda ikki post chiqarmaydi.
 *  2. Keys band qilinadi — approved → scheduled (ifRevisionId). Faqat shu jarayon chiqara oladi.
 *  3. media_publish'dan oldin keys hali scheduled ekani qayta tekshiriladi (egasi rad etgan bo'lsa — chiqmaydi).
 *  4. media_publish muvaffaqiyatli bo'lishi bilan darhol published yoziladi (permalink keyin, ixtiyoriy).
 */
import './lib/env';
import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import type { ManifestEntry } from './lib/batch';
import { graphApi, igCaption, mockGraph, publishReel, slotKey } from './lib/meta';
import { sanity } from './lib/sanity';
import type { CaptionFile } from './lib/telegram';

const force = process.argv.includes('--now');
const lang = process.env.PUBLISH_LANG?.trim() || 'uz';
const mock = process.env.MOCK_META === 'true';

const manifest: ManifestEntry[] = existsSync('out/manifest.json') ? JSON.parse(readFileSync('out/manifest.json', 'utf8')) : [];
const assetsFor = (slug: string) => {
  const e = manifest.find((m) => m.slug === slug && m.lang === lang && m.gate.ok && !m.error && m.file && m.captionFile);
  return e && existsSync(e.file!) && existsSync(e.captionFile!) ? { file: e.file!, captionFile: e.captionFile! } : null;
};

if (mock) {
  // To'liq sinov: tarmoqqa umuman chiqmaydi.
  const slug = manifest.find((m) => assetsFor(m.slug))?.slug;
  if (!slug) {
    console.log(`[mock] manifestda ${lang} uchun tayyor video yo'q.`);
    process.exit(0);
  }
  const a = assetsFor(slug)!;
  const cap = JSON.parse(readFileSync(a.captionFile, 'utf8')) as CaptionFile;
  const r = await publishReel(`https://cdn.sanity.io/mock/${basename(a.file)}`, igCaption(cap.text, cap.hashtags), {
    graph: mockGraph(console.log),
    igUserId: 'mock',
    sleep: async () => {},
    stillClaimed: async () => true,
    onPublished: async (id) => console.log(`[mock] ${slug}: published (media ${id})`),
  });
  console.log(`[mock] ✅ ${slug}: ${r.permalink}`);
  process.exit(0);
}

const igUserId = process.env.META_IG_USER_ID;
const metaToken = process.env.META_ACCESS_TOKEN;
const writeToken = process.env.SANITY_WRITE_TOKEN;
if (!igUserId || !metaToken || !writeToken) {
  console.error('META_IG_USER_ID, META_ACCESS_TOKEN va SANITY_WRITE_TOKEN kerak (yoki to\'liq sinov uchun MOCK_META=true).');
  process.exit(1);
}
const db = sanity.withConfig({ token: writeToken, useCdn: false });

// 1. Slot qulfi.
const now = new Date();
const slot = slotKey(now) ?? (force ? `manual-${now.toISOString()}` : null);
if (!slot) {
  console.log("⏸  Hozir ochiq slot yo'q (09:00 / 13:00 / 19:00 Toshkent).");
  process.exit(0);
}
const LOCK_ID = 'reelsPublishLock';
await db.createIfNotExists({ _id: LOCK_ID, _type: 'reelsPublishLock', slot: '' });
const lock = await db.getDocument<{ _rev: string; slot?: string }>(LOCK_ID);
if (lock?.slot === slot) {
  console.log(`⏸  ${slot} sloti band — bu slotda allaqachon chiqarilgan.`);
  process.exit(0);
}
let lockRev: string;
try {
  lockRev = (await db.patch(LOCK_ID).ifRevisionId(lock!._rev).set({ slot, at: now.toISOString() }).commit())._rev;
} catch {
  console.log('⏸  Slotni boshqa jarayon band qildi.');
  process.exit(0);
}
// Hech narsa chiqmagani aniq bo'lsa slot qaytariladi (faqat o'zimiz band qilgan holatda).
const releaseSlot = () =>
  db.patch(LOCK_ID).ifRevisionId(lockRev).set({ slot: lock?.slot ?? '' }).commit().then(() => {}, () => {});

// 2. Shu tilda tayyor video'si bor eng eski approved keysni band qilish.
let picked: { _id: string; slug: string; file: string; captionFile: string } | null = null;
try {
  const approved = await db.fetch<{ _id: string; _rev: string; slug: string }[]>(
    `*[_type == "portfolio" && !(_id in path("drafts.**")) && reel.status == "approved"] | order(_updatedAt asc){ _id, _rev, "slug": slug.current }`,
  );
  for (const doc of approved) {
    const a = assetsFor(doc.slug);
    if (!a) {
      console.warn(`↷ ${doc.slug}: ${lang} uchun video/caption yo'q — o'tkazib yuborildi`);
      continue;
    }
    try {
      await db.patch(doc._id).ifRevisionId(doc._rev).set({ 'reel.status': 'scheduled', 'reel.scheduledAt': now.toISOString() }).commit();
      picked = { _id: doc._id, slug: doc.slug, ...a };
      break;
    } catch {
      console.warn(`↷ ${doc.slug}: boshqa jarayon band qildi yoki holat o'zgardi`);
    }
  }
} catch (e) {
  // Navbatni o'qib bo'lmadi — hech narsa chiqmagan, slot bo'shatiladi.
  await releaseSlot();
  console.error(`❌ Approved navbatni o'qishda xato: ${(e as Error).message}`);
  process.exit(1);
}
if (!picked) {
  await releaseSlot();
  console.log(`Chiqarishga tayyor approved reel yo'q (${lang}).`);
  process.exit(0);
}

type Stage = 'pre' | 'attempted' | 'published';
let stage = 'pre' as Stage; // callback'lar ichida o'zgaradi
let mediaId: string | null = null;
const publishedPatch = (id: string, url: string) => ({
  'reel.status': 'published',
  'reel.publishedAt': new Date().toISOString(),
  [`reel.videos.${lang}`]: url,
  'reel.note': `Instagram media ${id}`,
});
let videoUrl = '';

try {
  const cap = JSON.parse(readFileSync(picked.captionFile, 'utf8')) as CaptionFile;
  const caption = igCaption(cap.text, cap.hashtags);
  // Instagram videoni ommaviy URL'dan oladi — Sanity CDN'ga yuklanadi.
  const asset = await db.assets.upload('file', createReadStream(picked.file), { filename: basename(picked.file), contentType: 'video/mp4' });
  videoUrl = asset.url;

  const { permalink } = await publishReel(asset.url, caption, {
    graph: graphApi(metaToken),
    igUserId,
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
    stillClaimed: async () => (await db.fetch<string | null>(`*[_id == $id][0].reel.status`, { id: picked!._id })) === 'scheduled',
    onPublishAttempt: () => {
      stage = 'attempted';
    },
    onPublished: async (id) => {
      // Avval xotirada: Sanity yozuvi muvaffaqiyatsiz bo'lsa ham post chiqqani unutilmaydi.
      stage = 'published';
      mediaId = id;
      await db.patch(picked!._id).set(publishedPatch(id, asset.url)).commit();
    },
  });
  if (permalink) await db.patch(picked._id).set({ 'reel.postUrl': permalink }).commit().catch(() => {});
  console.log(`✅ ${picked.slug} chiqarildi: ${permalink ?? `media ${mediaId} (havola keyinroq)`}`);
} catch (e) {
  const msg = (e as Error).message;
  if ((stage as Stage) === 'published') {
    // Post Instagram'da BOR — hech qachon navbatga qaytarilmaydi. Yozuv qayta urinib ko'riladi, slot band qoladi.
    for (let i = 0; i < 3; i++) {
      try {
        await db.patch(picked._id).set(publishedPatch(mediaId!, videoUrl)).commit();
        console.error(`⚠️  ${picked.slug}: chiqarildi (media ${mediaId}), Sanity yozuvi qayta urinishda saqlandi.`);
        process.exit(0);
      } catch {
        await new Promise((r) => setTimeout(r, 2000 * 2 ** i));
      }
    }
    console.error(`🚨 ${picked.slug}: Instagram'da CHIQDI (media ${mediaId}), lekin Sanity'ga yozilmadi. Holat "scheduled" qoldi — qo'lda published qiling.`);
    process.exit(1);
  }
  if ((stage as Stage) === 'attempted') {
    // Natija noaniq (media_publish javobi kelmadi): takroriy post xavfi — keys ham, slot ham band qoladi.
    await db.patch(picked._id).set({ 'reel.note': `Natija noaniq: ${msg} — Instagram'ni tekshiring` }).commit().catch(() => {});
    console.error(`🚨 ${picked.slug}: media_publish natijasi noaniq (${msg}). Instagram'ni tekshiring; keys "scheduled" qoldi.`);
    process.exit(1);
  }
  // Chiqarilmagani aniq: keys navbatga qaytadi (faqat hali biz band qilgan revision bo'lsa), slot bo'shatiladi.
  try {
    const cur = await db.fetch<{ _rev: string; status?: string } | null>(`*[_id == $id][0]{ _rev, "status": reel.status }`, { id: picked._id });
    if (cur?.status === 'scheduled') {
      await db.patch(picked._id).ifRevisionId(cur._rev).set({ 'reel.status': 'approved', 'reel.note': `Chiqarishda xato: ${msg}` }).commit();
    }
  } catch (e2) {
    console.error(`⚠️  ${picked.slug}: holatni approved ga qaytarib bo'lmadi (${(e2 as Error).message}) — Studio'da "scheduled" ni qo'lda "approved" qiling. Instagram'ga hech narsa chiqmagan.`);
  }
  await releaseSlot();
  console.error(`❌ ${picked.slug}: ${msg}`);
  process.exit(1);
}
