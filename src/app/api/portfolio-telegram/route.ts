import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { listSubfolders, listFiles, downloadFileBuffer } from '@/lib/google-drive';
import { parsePortfolioMetadata } from '@/lib/gemini';
import { safeCompare } from '@/lib/security';
import { getDb } from '@/lib/firebase-admin';

export const maxDuration = 300;

const OFFSET_DOC = 'telegram_sync/portfolio';
const TG_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

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
  photo?: { file_id: string; file_size?: number; width: number }[];
};

type PostGroup = { caption: string; photos: string[] };

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

async function readOffset(): Promise<number> {
  try {
    const snapshot = await getDb().doc(OFFSET_DOC).get();
    return snapshot.exists ? Number(snapshot.data()?.offset) || 0 : 0;
  } catch {
    return 0;
  }
}

async function writeOffset(offset: number): Promise<void> {
  try {
    await getDb().doc(OFFSET_DOC).set({ offset, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[portfolio-telegram] Offset saqlanmadi:', error);
  }
}

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

/**
 * Albom (media group) bir nechta update bo'lib keladi: matn faqat bittasida,
 * rasmlar boshqalarida. Shuning uchun media_group_id bo'yicha birlashtiramiz.
 */
function groupPosts(posts: ChannelPost[]): PostGroup[] {
  const groups = new Map<string, PostGroup>();

  for (const post of posts) {
    const key = post.media_group_id ?? `single_${post.message_id}`;
    const group = groups.get(key) ?? { caption: '', photos: [] };

    const caption = post.caption ?? post.text ?? '';
    if (caption.length > group.caption.length) group.caption = caption;

    if (post.photo?.length) {
      const largest = post.photo.reduce((a, b) => (a.width > b.width ? a : b));
      group.photos.push(largest.file_id);
    }

    groups.set(key, group);
  }

  return Array.from(groups.values()).filter((group) => group.caption.trim().length > 20);
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

export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  const querySecret = request.nextUrl.searchParams.get('secret');
  const authHeader = request.headers.get('authorization');
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;
  const configured = [process.env.CRON_SECRET, process.env.AMOCRM_CRON_SECRET].filter(Boolean) as string[];
  const provided = [querySecret, bearerSecret].filter(Boolean) as string[];

  if (configured.length === 0) {
    return NextResponse.json({ success: false, error: 'No auth configured' }, { status: 500 });
  }
  if (!provided.some((value) => configured.some((secret) => safeCompare(value, secret)))) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const missing = ['TELEGRAM_BOT_TOKEN', 'SANITY_TOKEN', 'GEMINI_API_KEY'].filter((key) => !process.env[key]);
  if (missing.length > 0) {
    return NextResponse.json({ success: false, error: `Sozlanmagan: ${missing.join(', ')}` }, { status: 500 });
  }

  const channel = (process.env.TG_PORTFOLIO_CHANNEL || 'JonBranding').replace(/^@/, '').toLowerCase();

  try {
    const offset = await readOffset();
    const updates = await telegramApi<{ update_id: number; channel_post?: ChannelPost }[]>('getUpdates', {
      offset: String(offset),
      limit: '100',
      timeout: '0',
      allowed_updates: JSON.stringify(['channel_post']),
    });

    if (!updates) {
      return NextResponse.json({ success: false, error: 'Telegram getUpdates javob bermadi' }, { status: 502 });
    }

    const maxUpdateId = updates.reduce((max, update) => Math.max(max, update.update_id), offset);
    const posts = updates
      .map((update) => update.channel_post)
      .filter((post): post is ChannelPost => Boolean(post))
      .filter((post) => (post.chat.username ?? '').toLowerCase() === channel);

    const results: { title: string; status: string; reason?: string; imageCount?: number }[] = [];

    for (const group of groupPosts(posts)) {
      let title = group.caption.slice(0, 60);
      try {
        const meta = await parsePortfolioMetadata(group.caption);
        title = meta.title;
        const slug = slugify(meta.title);

        const existing = await sanity.fetch<string | null>(
          '*[_type == "portfolio" && slug.current == $slug][0]._id',
          { slug }
        );
        if (existing) {
          results.push({ title, status: 'skipped', reason: 'Bunday slug bilan case allaqachon bor' });
          continue;
        }

        let images = await imagesFromDrive(meta.title, meta.client);
        const source = images.length > 0 ? 'drive' : 'telegram';
        if (images.length === 0) images = await imagesFromTelegram(group.photos);

        if (images.length === 0) {
          results.push({ title, status: 'failed', reason: 'Na Drive papkasi, na postda rasm topilmadi' });
          continue;
        }

        const assets = [];
        for (const image of images) {
          const asset = await sanity.assets.upload('image', image.buffer, {
            filename: image.filename,
            contentType: image.contentType,
          });
          assets.push(asset._id);
        }

        await sanity.create({
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

        results.push({ title: meta.title, status: `created (${source})`, imageCount: images.length });
      } catch (error) {
        results.push({
          title,
          status: 'failed',
          reason: error instanceof Error ? error.message : String(error),
        });
      }
    }

    if (maxUpdateId > offset) await writeOffset(maxUpdateId + 1);

    return NextResponse.json({ success: true, channel, checked: posts.length, results });
  } catch (error) {
    console.error('[portfolio-telegram] Sync xatosi:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
