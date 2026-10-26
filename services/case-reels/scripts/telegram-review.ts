/**
 * F-06 — Telegram preview + egasining tasdig'i.
 *   npm run review -- send     # manifestdagi tayyor draftlarni Marketing guruhiga yuboradi (bir marta)
 *   npm run review -- listen   # tugmalarni tinglaydi: ✅ approved, ✏️ draft + note, ⏭ rejected
 *
 * .env: TELEGRAM_BOT_TOKEN, TELEGRAM_REELS_CHAT_ID, TELEGRAM_OWNER_USER_ID, SANITY_WRITE_TOKEN
 * MOCK_TELEGRAM=true — tashqariga hech narsa ketmaydi; MOCK_SANITY_WRITE=true — Sanity'ga yozilmaydi.
 * Holat faqat "draft" dan o'zgaradi; tugmani faqat TELEGRAM_OWNER_USER_ID bosa oladi.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import type { ManifestEntry } from './lib/batch';
import { sanity } from './lib/sanity';
import {
  handleCallback, keyboard, mockTelegram, previewText, readyItems, telegramApi,
  type CallbackQuery, type CaptionFile, type TargetStatus,
} from './lib/telegram';

const mode = process.argv[2];
if (mode !== 'send' && mode !== 'listen') {
  console.error('Foydalanish: npm run review -- send | listen');
  process.exit(1);
}

const mock = process.env.MOCK_TELEGRAM === 'true';
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_REELS_CHAT_ID;
const ownerId = Number(process.env.TELEGRAM_OWNER_USER_ID);
if (!mock && (!token || !chatId || !Number.isInteger(ownerId))) {
  console.error("TELEGRAM_BOT_TOKEN, TELEGRAM_REELS_CHAT_ID va TELEGRAM_OWNER_USER_ID kerak (yoki MOCK_TELEGRAM=true).");
  process.exit(1);
}
const tg = mock ? mockTelegram(console.log) : telegramApi(token!);

const readJson = <T>(file: string, fallback: T): T => (existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as T) : fallback);
const SENT = 'out/review-sent.json';
const OFFSET = 'out/review-offset.json';

if (mode === 'send') {
  const manifest = readJson<ManifestEntry[]>('out/manifest.json', []);
  const sent = new Set(readJson<string[]>(SENT, []));
  const items = readyItems(manifest, (f) => readJson<CaptionFile>(f, { lang: '?', text: '', hashtags: [] })).filter(
    (i) => !sent.has(i.slug),
  );
  for (const item of items) {
    if (mock) {
      await tg('sendVideo', { chat_id: chatId, video: item.video, caption: previewText(item), reply_markup: keyboard(item.slug) });
    } else {
      // Lokal faylni yuklash uchun multipart (JSON API fayl qabul qilmaydi).
      const form = new FormData();
      form.set('chat_id', chatId!);
      form.set('caption', previewText(item));
      form.set('parse_mode', 'HTML');
      form.set('reply_markup', JSON.stringify(keyboard(item.slug)));
      form.set('video', new Blob([readFileSync(item.video)], { type: 'video/mp4' }), basename(item.video));
      const res = await fetch(`https://api.telegram.org/bot${token}/sendVideo`, { method: 'POST', body: form });
      const json = (await res.json()) as { ok: boolean; description?: string };
      if (!json.ok) {
        console.error(`❌ ${item.slug}: ${json.description}`);
        continue;
      }
    }
    sent.add(item.slug);
    writeFileSync(SENT, JSON.stringify([...sent], null, 2));
    console.log(`📤 ${item.slug} yuborildi`);
  }
  console.log(items.length ? `Yuborildi: ${items.length}` : "Yangi tayyor draft yo'q.");
} else {
  const writeToken = process.env.SANITY_WRITE_TOKEN;
  const mockWrite = process.env.MOCK_SANITY_WRITE === 'true' || !writeToken;
  const writer = writeToken ? sanity.withConfig({ token: writeToken, useCdn: false }) : null;

  const setStatus = async (slug: string, status: TargetStatus, note: string): Promise<boolean> => {
    const doc = await sanity
      .withConfig({ useCdn: false })
      .fetch<{ _id: string; _rev: string; status?: string } | null>(
        `*[_type == "portfolio" && slug.current == $slug && !(_id in path("drafts.**"))][0]{ _id, _rev, "status": reel.status }`,
        { slug },
      );
    // Faqat draft holatidan o'zgartiriladi: ikkinchi bosish yoki boshqa holat — hech narsa qilinmaydi.
    if (!doc || doc.status !== 'draft') return false;
    if (mockWrite || !writer) {
      console.log(`[mock] ${slug}: reel.status=${status}, reel.note="${note}"`);
      return true;
    }
    await writer.patch(doc._id).ifRevisionId(doc._rev).set({ 'reel.status': status, 'reel.note': note }).commit();
    return true;
  };

  let offset = readJson<number>(OFFSET, 0);
  console.log(`👂 Tinglanmoqda${mock ? ' (mock)' : ''}... To'xtatish: Ctrl+C`);
  for (;;) {
    const updates = (await tg('getUpdates', { offset, timeout: 50, allowed_updates: ['callback_query'] })) as {
      update_id: number;
      callback_query?: CallbackQuery;
    }[];
    for (const u of updates) {
      offset = u.update_id + 1;
      if (!u.callback_query) continue;
      try {
        const outcome = await handleCallback(u.callback_query, {
          ownerId,
          setStatus,
          answer: (id, text) => tg('answerCallbackQuery', { callback_query_id: id, text }),
          markMessage: (q, text) =>
            q.message
              ? tg('editMessageReplyMarkup', {
                  chat_id: q.message.chat.id,
                  message_id: q.message.message_id,
                  reply_markup: { inline_keyboard: [[{ text, callback_data: 'rv:done' }]] },
                })
              : Promise.resolve(),
        });
        console.log(`${outcome}: ${u.callback_query.data} (from ${u.callback_query.from.id})`);
      } catch (e) {
        console.error(`⚠️  ${u.callback_query.data}: ${(e as Error).message}`);
      }
      writeFileSync(OFFSET, JSON.stringify(offset));
    }
    if (mock) break; // mock rejimda bitta aylanish yetarli
  }
}
