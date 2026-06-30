import type { Testimonial } from '@/lib/types';

const TG_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CACHE_FILE = 'public/data/testimonials-telegram.json';

interface TelegramFileInfo {
  file_id: string;
  file_unique_id: string;
  file_size?: number;
  file_path?: string;
}

interface TelegramChannelPost {
  message_id: number;
  text?: string;
  caption?: string;
  video?: TelegramFileInfo & { mime_type?: string };
  audio?: TelegramFileInfo & { mime_type?: string };
  voice?: TelegramFileInfo & { mime_type?: string };
  document?: TelegramFileInfo & { mime_type?: string };
  date: number;
  from?: { id: number; first_name?: string; username?: string };
}

const MAX_BOT_FILE_SIZE = 20 * 1024 * 1024;

function parseTestimonialFromPost(post: TelegramChannelPost): any | null {
  const text = post.caption || post.text || '';
  if (!text.trim()) return null;

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const vimeoMatch = text.match(/https?:\/\/(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/i);
  const nameLine = lines[0] || '';
  const [name, company] = nameLine.includes('|')
    ? nameLine.split('|').map((s) => s.trim())
    : [nameLine, ''];

  const quoteLines = lines.slice(1).filter((l) => !l.includes('vimeo.com') && !l.includes('http'));
  const quote = quoteLines.join(' ').replace(/^["""]|["""]$/g, '').trim();

  if (!name) return null;

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const mediaInfo = post.video || post.audio || post.voice || post.document;

  return {
    name,
    company,
    avatar: initials,
    image: '',
    imageHint: `telegram testimonial from ${name}`,
    quote,
    videoUrl: vimeoMatch ? `https://player.vimeo.com/video/${vimeoMatch[1]}` : undefined,
    telegramFileId: mediaInfo?.file_id,
    telegramMimeType: mediaInfo?.mime_type || (post.video ? 'video/mp4' : undefined),
    telegramFileSize: mediaInfo?.file_size,
  };
}

function getCachePath() {
  const fs = require('fs');
  const path = require('path');
  return path.join(process.cwd(), CACHE_FILE);
}

export function readCachedTestimonials(): Testimonial[] {
  try {
    const fs = require('fs');
    const filePath = getCachePath();
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function writeCachedTestimonials(testimonials: Testimonial[]): void {
  try {
    const fs = require('fs');
    const filePath = getCachePath();
    const dir = require('path').dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(testimonials, null, 2), 'utf-8');
  } catch (err) {
    console.error('[telegram-testimonials] Cache write error:', err);
  }
}

function readOffsetFile(): number {
  try {
    const fs = require('fs');
    const path = require('path');
    const offsetPath = path.join(process.cwd(), 'public/data/telegram-offset.txt');
    if (!fs.existsSync(offsetPath)) return 0;
    return parseInt(fs.readFileSync(offsetPath, 'utf-8').trim(), 10) || 0;
  } catch {
    return 0;
  }
}

function writeOffsetFile(offset: number): void {
  try {
    const fs = require('fs');
    const path = require('path');
    const offsetPath = path.join(process.cwd(), 'public/data/telegram-offset.txt');
    const dir = path.dirname(offsetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(offsetPath, String(offset), 'utf-8');
  } catch (err) {
    console.error('[telegram-testimonials] Offset write error:', err);
  }
}

async function getTelegramFilePath(fileId: string): Promise<{ file_path: string; file_size: number } | null> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/getFile?file_id=${fileId}`);
    const data = await res.json();
    if (!data.ok || !data.result?.file_path) return null;
    return { file_path: data.result.file_path, file_size: data.result.file_size || 0 };
  } catch {
    return null;
  }
}

async function downloadTelegramFile(filePath: string): Promise<Buffer | null> {
  try {
    const res = await fetch(`https://api.telegram.org/file/bot${TG_BOT_TOKEN}/${filePath}`);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

async function uploadToSanity(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<{ _id: string; url: string } | null> {
  const { createClient } = require('@sanity/client');
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h6ymmj0v',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-04-14',
    useCdn: false,
  });

  try {
    const assetType = mimeType.startsWith('video/') ? 'file' : 'file';
    const asset = await client.assets.upload(assetType, buffer, { filename, contentType: mimeType });
    const url = asset.url || `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h6ymmj0v'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${asset._id.replace('file-', '').replace(/-[^-]*$/, '')}.${filename.split('.').pop()}`;
    return { _id: asset._id, url };
  } catch (err) {
    console.error('[telegram-testimonials] Sanity upload error:', err);
    return null;
  }
}

async function parseWithGemini(
  caption: string,
  nameFromCaption: string
): Promise<{ name: string; company: { uz: string; ru: string; en: string; zh: string }; quote: { uz: string; ru: string; en: string; zh: string } } | null> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a multilingual translation AI for Jon Branding agency.
Extract the client name, company name, and testimonial text from the caption below.
Then translate the company and quote into 4 languages (Uzbek, Russian, English, Chinese).
The client name is already provided: "${nameFromCaption}".

Respond ONLY with this JSON format, no other text:
{
  "name": "${nameFromCaption}",
  "company": {
    "uz": "company name in Uzbek",
    "ru": "company name in Russian",
    "en": "company name in English",
    "zh": "company name in Chinese"
  },
  "quote": {
    "uz": "testimonial in Uzbek (from original text, cleaned up)",
    "ru": "translation to Russian",
    "en": "translation to English",
    "zh": "translation to Chinese"
  }
}

CAPTION:
"""
${caption}
"""`,
            }],
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ],
        }),
      }
    );

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function processPostMedia(
  post: any,
  lang: string = 'uz'
): Promise<Testimonial | null> {
  const partial = parseTestimonialFromPost(post);
  if (!partial) return null;

  const id = `tg_${post.message_id || Date.now()}`;
  const testimonial: Testimonial = {
    _id: id,
    name: partial.name || '',
    company: partial.company || '',
    avatar: partial.avatar || '',
    image: partial.image || '',
    imageHint: partial.imageHint || '',
    quote: partial.quote || '',
    videoUrl: partial.videoUrl,
  };

  const mediaInfo = post.video || post.audio || post.voice || post.document;
  const fileId = mediaInfo?.file_id || partial.telegramFileId;

  if (fileId && mediaInfo) {
    const fileSize = mediaInfo.file_size || 0;
    const mimeType = mediaInfo.mime_type || (post.video ? 'video/mp4' : undefined);

    if (fileSize <= MAX_BOT_FILE_SIZE && mimeType) {
      const fileInfo = await getTelegramFilePath(fileId);
      if (fileInfo) {
        const buffer = await downloadTelegramFile(fileInfo.file_path);
        if (buffer && buffer.length > 0) {
          const ext = fileInfo.file_path.split('.').pop() || 'mp4';
          const slug = (testimonial.name || 'testimonial').toLowerCase().replace(/\s+/g, '-');
          const filename = `${slug}-${post.message_id}.${ext}`;

          const sanityAsset = await uploadToSanity(buffer, filename, mimeType);
          if (sanityAsset) {
            if (mimeType.startsWith('video/')) {
              testimonial.videoFileUrl = sanityAsset.url;
            } else {
              testimonial.audioFileUrl = sanityAsset.url;
            }
          }
        }
      }
    }
  }

  try {
    const geminiResult = await parseWithGemini(
      post.caption || post.text || testimonial.quote,
      testimonial.name
    );
    if (geminiResult) {
      testimonial.quote = geminiResult.quote[lang as keyof typeof geminiResult.quote] || testimonial.quote;
    }
  } catch {}

  return testimonial;
}

export async function syncTelegramTestimonials(): Promise<{ new: number; total: number }> {
  if (!TG_BOT_TOKEN) return { new: 0, total: 0 };

  try {
    const existing = readCachedTestimonials();
    const processedIds = new Set(existing.map((t) => t._id).filter(Boolean));
    const offset = readOffsetFile();

    const params = new URLSearchParams({
      limit: '50',
      offset: String(offset),
      allowed_updates: JSON.stringify(['channel_post']),
    });

    const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/getUpdates?${params}`);
    const data = await res.json();
    if (!data.ok || !Array.isArray(data.result)) return { new: 0, total: existing.length };

    let newCount = 0;
    let maxUpdateId = offset;

    for (const update of data.result) {
      const updateId = update.update_id;
      if (updateId > maxUpdateId) maxUpdateId = updateId;

      const post: TelegramChannelPost | undefined = update.channel_post;
      if (!post) continue;

      const id = `tg_${post.message_id}`;
      if (processedIds.has(id)) continue;

      const partial = parseTestimonialFromPost(post);
      if (!partial) continue;

      const testimonial: Testimonial = {
        _id: id,
        name: partial.name || '',
        company: partial.company || '',
        avatar: partial.avatar || '',
        image: partial.image || '',
        imageHint: partial.imageHint || '',
        quote: partial.quote || '',
        videoUrl: partial.videoUrl,
      };

      existing.push(testimonial);
      processedIds.add(id);
      newCount++;
    }

    if (maxUpdateId > offset) writeOffsetFile(maxUpdateId + 1);
    if (newCount > 0) writeCachedTestimonials(existing);

    return { new: newCount, total: existing.length };
  } catch (err) {
    console.error('[telegram-testimonials] Sync error:', err);
    return { new: 0, total: readCachedTestimonials().length };
  }
}

export async function syncAndProcessMedia(): Promise<{ processed: number; total: number; errors: number }> {
  if (!TG_BOT_TOKEN) return { processed: 0, total: 0, errors: 0 };

  try {
    const existing = readCachedTestimonials();
    let processed = 0;
    let errors = 0;

    const unprocessed = existing.filter((t) => !t.videoFileUrl && !t.audioFileUrl);

    for (const testimonial of unprocessed) {
      const msgId = testimonial._id?.replace('tg_', '');
      if (!msgId) continue;

      try {
        const params = new URLSearchParams({
          limit: '1',
          offset: '0',
          allowed_updates: JSON.stringify(['channel_post']),
        });
        const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/getUpdates?${params}`);
        const data = await res.json();
        if (!data.ok || !Array.isArray(data.result)) continue;

        for (const update of data.result) {
          const post = update.channel_post;
          if (!post || String(post.message_id) !== msgId) continue;

          const mediaInfo = post.video || post.audio || post.voice || post.document;
          if (!mediaInfo?.file_id) continue;

          const fileSize = mediaInfo.file_size || 0;
          if (fileSize > MAX_BOT_FILE_SIZE) continue;

          const fileInfo = await getTelegramFilePath(mediaInfo.file_id);
          if (!fileInfo) continue;

          const buffer = await downloadTelegramFile(fileInfo.file_path);
          if (!buffer || buffer.length === 0) continue;

          const mimeType = mediaInfo.mime_type || (post.video ? 'video/mp4' : 'audio/mpeg');
          const ext = fileInfo.file_path.split('.').pop() || 'mp4';
          const slug = (testimonial.name || 'testimonial').toLowerCase().replace(/\s+/g, '-');
          const filename = `${slug}-${msgId}.${ext}`;

          const sanityAsset = await uploadToSanity(buffer, filename, mimeType);
          if (sanityAsset) {
            if (mimeType.startsWith('video/')) {
              testimonial.videoFileUrl = sanityAsset.url;
            } else {
              testimonial.audioFileUrl = sanityAsset.url;
            }

            const geminiResult = await parseWithGemini(
              post.caption || post.text || testimonial.quote,
              testimonial.name
            );
            if (geminiResult) {
              testimonial.quote = geminiResult.quote.uz || testimonial.quote;
            }

            processed++;
          }
          break;
        }
      } catch {
        errors++;
      }
    }

    if (processed > 0) writeCachedTestimonials(existing);

    return { processed, total: existing.length, errors };
  } catch (err) {
    console.error('[telegram-testimonials] Process media error:', err);
    return { processed: 0, total: readCachedTestimonials().length, errors: 0 };
  }
}
