/**
 * F-06 — Telegram preview va egasining tasdig'i. Sof mantiq; Telegram API va Sanity yozuvi injeksiya qilinadi.
 * Qoida (PRD §10 Q1): preview Marketing guruhiga boradi, tugmani faqat egasi bosa oladi.
 */
import type { ManifestEntry } from './batch';

export type ReviewAction = 'ok' | 'redo' | 'skip';
export type TargetStatus = 'approved' | 'draft' | 'rejected';

export const ACTION_STATUS: Record<ReviewAction, TargetStatus> = { ok: 'approved', redo: 'draft', skip: 'rejected' };
const ACTION_LABEL: Record<ReviewAction, string> = { ok: '✅ Chiqar', redo: '✏️ Qayta', skip: "⏭ O'tkazib yubor" };
const ACTION_DONE: Record<ReviewAction, string> = { ok: '✅ Tasdiqlandi', redo: '✏️ Qayta ishlashga qaytarildi', skip: "⏭ O'tkazib yuborildi" };

/** Telegram callback_data 64 baytdan oshmasligi kerak. */
const MAX_CALLBACK_BYTES = 64;

export type CaptionFile = { lang: string; text: string; hashtags: string[]; needsReview?: string[]; source?: string };

export type ReviewItem = { slug: string; video: string; langs: string[]; captions: CaptionFile[] };

/** Manifestdan faqat barcha tillari darvozadan o'tgan va caption'i bor keyslarni oladi. */
export function readyItems(manifest: ManifestEntry[], readCaption: (file: string) => CaptionFile): ReviewItem[] {
  const bySlug = new Map<string, ManifestEntry[]>();
  for (const e of manifest) bySlug.set(e.slug, [...(bySlug.get(e.slug) ?? []), e]);
  const items: ReviewItem[] = [];
  for (const [slug, entries] of bySlug) {
    const ok = entries.length > 0 && entries.every((e) => e.lang && e.file && e.captionFile && e.gate.ok && !e.error);
    if (!ok) continue;
    const main = entries.find((e) => e.lang === 'uz') ?? entries[0];
    items.push({
      slug,
      video: main.file!,
      langs: entries.map((e) => e.lang!),
      captions: entries.map((e) => readCaption(e.captionFile!)),
    });
  }
  return items;
}

export function callbackData(action: ReviewAction, slug: string): string {
  const data = `rv:${action}:${slug}`;
  if (Buffer.byteLength(data) > MAX_CALLBACK_BYTES) throw new Error(`slug juda uzun (callback_data > 64 bayt): ${slug}`);
  return data;
}

export function parseCallback(data: string | undefined): { action: ReviewAction; slug: string } | null {
  const m = /^rv:(ok|redo|skip):(.+)$/.exec(data ?? '');
  return m ? { action: m[1] as ReviewAction, slug: m[2] } : null;
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Preview matni (HTML): asosiy caption + belgilar. Telegram caption limiti 1024 belgi. */
export function previewText(item: ReviewItem): string {
  const main = item.captions.find((c) => c.lang === 'uz') ?? item.captions[0];
  const flags = [...new Set(item.captions.flatMap((c) => (c.needsReview ?? []).map((f) => `${c.lang}: ${f}`)))];
  const head = `<b>Reel draft</b> · <code>${escapeHtml(item.slug)}</code>\nTillar: ${item.langs.join(', ')}`;
  const warn = flags.length ? `\n⚠️ Tekshiring: ${escapeHtml(flags.join('; '))}` : '';
  const body = main ? `\n\n${escapeHtml(main.text)}\n${escapeHtml(main.hashtags.join(' '))}` : '';
  const text = head + warn + body;
  return text.length > 1024 ? `${text.slice(0, 1020)}…` : text;
}

export function keyboard(slug: string) {
  return {
    inline_keyboard: [(['ok', 'redo', 'skip'] as ReviewAction[]).map((a) => ({ text: ACTION_LABEL[a], callback_data: callbackData(a, slug) }))],
  };
}

export type CallbackQuery = {
  id: string;
  from: { id: number; first_name?: string };
  data?: string;
  message?: { chat: { id: number }; message_id: number };
};

export type ReviewDeps = {
  ownerId: number;
  /** Sanity: draft → status. Joriy holat draft bo'lmasa (yoki allaqachon target bo'lsa) false qaytaradi. */
  setStatus: (slug: string, status: TargetStatus, note: string) => Promise<boolean>;
  answer: (callbackId: string, text: string) => Promise<void>;
  markMessage: (q: CallbackQuery, text: string) => Promise<void>;
};

export type CallbackOutcome = 'ignored' | 'forbidden' | 'applied' | 'unchanged';

export async function handleCallback(q: CallbackQuery, deps: ReviewDeps): Promise<CallbackOutcome> {
  const parsed = parseCallback(q.data);
  if (!parsed) return 'ignored';
  if (q.from.id !== deps.ownerId) {
    await deps.answer(q.id, 'Faqat egasi tasdiqlaydi.');
    return 'forbidden';
  }
  const status = ACTION_STATUS[parsed.action];
  const note = `Telegram: ${parsed.action} (${new Date().toISOString()})`;
  const changed = await deps.setStatus(parsed.slug, status, note);
  if (!changed) {
    await deps.answer(q.id, 'Holat allaqachon o\'zgargan — hech narsa qilinmadi.');
    return 'unchanged';
  }
  await deps.answer(q.id, ACTION_DONE[parsed.action]);
  await deps.markMessage(q, `${ACTION_DONE[parsed.action]} · ${parsed.slug}`);
  return 'applied';
}

/** Telegram Bot API chaqiruvchisi. MOCK_TELEGRAM=true bo'lsa tarmoqqa chiqmaydi. */
export type TgCall = (method: string, params: Record<string, unknown>) => Promise<any>;

export function telegramApi(token: string): TgCall {
  return async (method, params) => {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(60_000),
    });
    const json = (await res.json()) as { ok: boolean; result?: unknown; description?: string };
    if (!json.ok) throw new Error(`Telegram ${method}: ${json.description ?? res.status}`);
    return json.result;
  };
}

export function mockTelegram(log: (m: string) => void): TgCall {
  return async (method, params) => {
    log(`[mock telegram] ${method} ${JSON.stringify(params).slice(0, 300)}`);
    return method === 'getUpdates' ? [] : { message_id: 0 };
  };
}
