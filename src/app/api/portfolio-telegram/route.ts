import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { listSubfolders, listFiles, downloadFileBuffer } from '@/lib/google-drive';
import { parsePortfolioMetadata } from '@/lib/gemini';
import { safeCompare } from '@/lib/security';
import { getDb } from '@/lib/firebase-admin';

export const maxDuration = 60;

const QUEUE = 'telegram_portfolio_queue';
const TG_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

/** Albomning qolgan rasmlari yetib kelishi uchun kutiladigan vaqt. */
const ALBUM_SETTLE_MS = 7000;
/** Ishlov berish yarimda uzilib qolsa, shu vaqtdan keyin qayta urinish mumkin. */
const CLAIM_TTL_MS = 5 * 60 * 1000;

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h6ymmj0v',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-04-14',
  useCdn: false,
});

type ChannelPost = {
  message_id: number;
  media_group_id?: string;
  caption?: string;
  text?: string;
  chat: { id: number; username?: string };
  photo?: { file_id: string; width: number }[];
};

type QueuedGroup = {
  caption: string;
  photos: string[];
  updatedAt: number;
  processed?: boolean;
  claimedAt?: number | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96);
}

/** Drive papka nomlari post nomiga aniq mos kelmaydi, shuning uchun yumshoq solishtirish. */
function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9а-яёўқғҳ]+/gi, '');
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function telegramApi<T>(method: string, params: Record<string, string>): Promise<T | null> {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/${method}?${query}`);
    const data = await res.json();
    return data.ok ? (data.result as T) : null;
  } catch {
    return null;
  }
}

async function downloadTelegramPhoto(fileId: string): Promise<Buffer | null> {
  const file = await telegramApi<{ file_path: string }>('getFile', { file_id: fileId });
  if (!file?.file_path) return null;
  const res = await fetch(`https://api.telegram.org/file/bot${TG_BOT_TOKEN}/${file.file_path}`);
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

async function imagesFromDrive(title: string, client: string) {
  const parentId = process.env.DRIVE_PARENT_FOLDER_ID;
  if (!parentId) return [];

  try {
    const folders = await listSubfolders(parentId);
    const targets = [title, client].filter(Boolean).map(normalizeForMatch);
    const folder = folders.find((item) => {
      const name = normalizeForMatch(item.name);
      return targets.some((target) => target.length > 2 && (name.includes(target) || target.includes(name)));
    });
    if (!folder) return [];

    const files = await listFiles(folder.id);
    const images = files.filter((file) => file.mimeType.startsWith('image/')).slice(0, 8);

    return Promise.all(
      images.map(async (image) => ({
        buffer: await downloadFileBuffer(image.id),
        filename: image.name,
        contentType: image.mimeType,
      }))
    );
  } catch (error) {
    console.error('[portfolio-telegram] Drive qidiruvi muvaffaqiyatsiz:', error);
    return [];
  }
}

async function imagesFromTelegram(fileIds: string[]) {
  const results = [];
  const ids = fileIds.slice(0, 8);
  for (let index = 0; index < ids.length; index += 1) {
    const buffer = await downloadTelegramPhoto(ids[index]);
    if (buffer) {
      results.push({ buffer, filename: `telegram-${index + 1}.jpg`, contentType: 'image/jpeg' });
    }
  }
  return results;
}

/**
 * Bir nechta webhook chaqiruvi bitta albomni baravar ko'rishi mumkin — faqat
 * bittasi ishlov berishi uchun tranzaksiya bilan "band qilamiz".
 */
async function claimGroup(key: string): Promise<QueuedGroup | null> {
  const ref = getDb().collection(QUEUE).doc(key);

  return getDb().runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    if (!snapshot.exists) return null;

    const data = snapshot.data() as QueuedGroup;
    if (data.processed) return null;
    if (data.claimedAt && Date.now() - data.claimedAt < CLAIM_TTL_MS) return null;
    if (Date.now() - data.updatedAt < ALBUM_SETTLE_MS - 1000) return null;

    tx.update(ref, { claimedAt: Date.now() });
    return data;
  });
}

async function publishGroup(key: string, group: QueuedGroup) {
  const ref = getDb().collection(QUEUE).doc(key);

  try {
    const meta = await parsePortfolioMetadata(group.caption);
    if (!meta.isPortfolioCase) {
      await ref.update({ processed: true, skippedReason: 'portfolio keys emas (kontent/reklama/maslahat posti)' });
      return { title: meta.title, status: 'skipped', reason: 'Not a portfolio case' };
    }

    const slug = slugify(meta.title);

    const existing = await sanity.fetch<{
      _id: string;
      tags?: string[];
      results?: Array<{ _key: string; metric: string; value: string }>;
      description?: string;
      coverImage?: { asset?: { _ref?: string } };
      galleryImages?: Array<{ _key?: string; asset?: { _ref?: string } }>;
    } | null>(
      '*[_type == "portfolio" && slug.current == $slug][0] { _id, tags, results, description, coverImage, galleryImages }',
      { slug }
    );

    let images = await imagesFromDrive(meta.title, meta.client);
    const source = images.length > 0 ? 'drive' : 'telegram';
    if (images.length === 0) images = await imagesFromTelegram(group.photos);

    if (images.length === 0 && !existing) {
      await ref.update({ processed: true, skippedReason: 'rasm topilmadi' });
      return { title: meta.title, status: 'failed', reason: 'Na Drive papkasi, na postda rasm topilmadi' };
    }

    const assets: string[] = [];
    for (const image of images) {
      try {
        const asset = await sanity.assets.upload('image', image.buffer, {
          filename: image.filename,
          contentType: image.contentType,
        });
        assets.push(asset._id);
      } catch (uploadErr) {
        console.warn('[portfolio-telegram] Rasm yuklashda xatolik:', uploadErr);
      }
    }

    if (existing) {
      // Mavjud portfolio boyitiladi (enrich)
      const patchData: Record<string, any> = {};

      if (assets.length > 0) {
        const existingRefs = new Set<string>();
        if (existing.coverImage?.asset?._ref) existingRefs.add(existing.coverImage.asset._ref);
        if (existing.galleryImages) {
          existing.galleryImages.forEach((img) => {
            if (img.asset?._ref) existingRefs.add(img.asset._ref);
          });
        }

        const newAssets = assets.filter((id) => !existingRefs.has(id));
        if (newAssets.length > 0) {
          const currentGallery = existing.galleryImages || [];
          patchData.galleryImages = [
            ...currentGallery,
            ...newAssets.map((id, i) => ({
              _type: 'image',
              _key: `gallery_enriched_${Date.now()}_${i}`,
              asset: { _type: 'reference', _ref: id },
            })),
          ];

          if (!existing.coverImage?.asset?._ref) {
            patchData.coverImage = { _type: 'image', asset: { _type: 'reference', _ref: newAssets[0] } };
          }
        }
      }

      // Teglar
      const mergedTags = Array.from(new Set([...(existing.tags || []), ...(meta.tags || [])])).filter(Boolean);
      if (mergedTags.length > 0 && mergedTags.length !== (existing.tags || []).length) {
        patchData.tags = mergedTags;
      }

      // Natijalar
      const currentResults = existing.results || [];
      const existingMetrics = new Set(currentResults.map((r) => r.metric.toLowerCase().trim()));
      const newResults = (meta.results || []).filter((r) => !existingMetrics.has(r.metric.toLowerCase().trim()));
      if (newResults.length > 0) {
        patchData.results = [
          ...currentResults,
          ...newResults.map((r, i) => ({
            _key: `result_enriched_${Date.now()}_${i}`,
            metric: r.metric,
            value: r.value,
          })),
        ];
      }

      // Tavsif
      if (!existing.description || (meta.description && meta.description.length > existing.description.length)) {
        patchData.description = meta.description;
      }

      if (Object.keys(patchData).length > 0) {
        await sanity.patch(existing._id).set(patchData).commit();
      }

      await ref.update({ processed: true, sanityId: existing._id, action: 'enriched' });
      return { title: meta.title, status: `enriched (${source})`, imageCount: images.length };
    }

    const created = await sanity.create({
      _type: 'portfolio',
      title: meta.title,
      slug: { _type: 'slug', current: slug },
      client: meta.client,
      category: meta.category,
      tags: meta.tags,
      description: meta.description,
      coverImage: { _type: 'image', asset: { _type: 'reference', _ref: assets[0] } },
      galleryImages: assets.slice(1).map((id, i) => ({
        _type: 'image',
        _key: `gallery_${i}`,
        asset: { _type: 'reference', _ref: id },
      })),
      results: meta.results.map((item, i) => ({ _key: `result_${i}`, metric: item.metric, value: item.value })),
      featured: false,
      publishedAt: new Date().toISOString(),
    });

    await ref.update({ processed: true, sanityId: created._id });
    return { title: meta.title, status: `created (${source})`, imageCount: images.length };
  } catch (error) {
    // Band qilishni bo'shatamiz — keyingi urinish (yoki cron) qayta ko'radi.
    await ref.update({ claimedAt: null, lastError: error instanceof Error ? error.message : String(error) });
    return { title: group.caption.slice(0, 60), status: 'failed', reason: error instanceof Error ? error.message : String(error) };
  }
}

/** Telegram webhook: post kelganda darhol chaqiriladi. */
async function handleWebhook(request: NextRequest) {
  const update = await request.json().catch(() => null);
  const post: ChannelPost | undefined = update?.channel_post;
  if (!post) return NextResponse.json({ ok: true });

  const channel = (process.env.TG_PORTFOLIO_CHANNEL || 'JonBranding').replace(/^@/, '').toLowerCase();
  if ((post.chat.username ?? '').toLowerCase() !== channel) return NextResponse.json({ ok: true });

  const key = post.media_group_id ?? `msg_${post.chat.id}_${post.message_id}`;
  const ref = getDb().collection(QUEUE).doc(key);
  const caption = post.caption ?? post.text ?? '';
  const largest = post.photo?.length ? post.photo.reduce((a, b) => (a.width > b.width ? a : b)) : null;

  await getDb().runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    const existing = snapshot.exists ? (snapshot.data() as QueuedGroup) : null;

    const photos = existing?.photos ?? [];
    if (largest && !photos.includes(largest.file_id)) photos.push(largest.file_id);

    tx.set(
      ref,
      {
        caption: caption.length > (existing?.caption.length ?? 0) ? caption : existing?.caption ?? '',
        photos,
        updatedAt: Date.now(),
        processed: existing?.processed ?? false,
        claimedAt: existing?.claimedAt ?? null,
      },
      { merge: true }
    );
  });

  // Albomning qolgan rasmlarini kutamiz, keyin bandlab ishlov beramiz.
  await sleep(ALBUM_SETTLE_MS);

  const group = await claimGroup(key);
  if (!group) return NextResponse.json({ ok: true });
  if (group.caption.trim().length < 20) {
    await ref.update({ processed: true, skippedReason: 'matn juda qisqa' });
    return NextResponse.json({ ok: true });
  }

  const result = await publishGroup(key, group);
  return NextResponse.json({ ok: true, result });
}

/** Zaxira: webhook o'tkazib yuborgan yozuvlarni kunlik cron yoki qo'lda tozalaydi. */
async function handleSweep() {
  const cutoff = Date.now() - 2 * 60 * 1000;
  const snapshot = await getDb()
    .collection(QUEUE)
    .where('processed', '==', false)
    .limit(5)
    .get();

  const results = [];
  for (const doc of snapshot.docs) {
    const data = doc.data() as QueuedGroup;
    if (data.updatedAt > cutoff) continue;
    if (data.caption.trim().length < 20) {
      await doc.ref.update({ processed: true, skippedReason: 'matn juda qisqa' });
      continue;
    }
    const group = await claimGroup(doc.id);
    if (group) results.push(await publishGroup(doc.id, group));
  }

  return NextResponse.json({ success: true, swept: results.length, results });
}

function isAuthorizedSweep(request: NextRequest) {
  const querySecret = request.nextUrl.searchParams.get('secret');
  const authHeader = request.headers.get('authorization');
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;
  const configured = [process.env.CRON_SECRET, process.env.AMOCRM_CRON_SECRET].filter(Boolean) as string[];
  const provided = [querySecret, bearerSecret].filter(Boolean) as string[];

  if (configured.length === 0) return false;
  return provided.some((value) => configured.some((secret) => safeCompare(value, secret)));
}

function missingConfig() {
  return ['TELEGRAM_BOT_TOKEN', 'SANITY_TOKEN', 'GEMINI_API_KEY'].filter((key) => !process.env[key]);
}

export async function POST(request: NextRequest) {
  const missing = missingConfig();
  if (missing.length > 0) {
    return NextResponse.json({ success: false, error: `Sozlanmagan: ${missing.join(', ')}` }, { status: 500 });
  }

  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const headerSecret = request.headers.get('x-telegram-bot-api-secret-token');

  if (webhookSecret && headerSecret && safeCompare(headerSecret, webhookSecret)) {
    return handleWebhook(request);
  }

  if (!isAuthorizedSweep(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return handleSweep();
}

export async function GET(request: NextRequest) {
  const missing = missingConfig();
  if (missing.length > 0) {
    return NextResponse.json({ success: false, error: `Sozlanmagan: ${missing.join(', ')}` }, { status: 500 });
  }
  if (!isAuthorizedSweep(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return handleSweep();
}
