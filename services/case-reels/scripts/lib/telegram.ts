/**
 * F-06 — Telegram preview va egasining tasdig'i. Sof mantiq; Telegram API va Sanity yozuvi injeksiya qilinadi.
 * Qoida (PRD §10 Q1): preview Marketing guruhiga boradi, tugmani faqat egasi bosa oladi.
 */
import { createHash } from 'node:crypto';
import type { ManifestEntry } from './batch';

export type ReviewAction = 'ok' | 'redo' | 'skip';

/** Preview versiyasi: yuborilgan videolarning hash'i. Fayl almashsa, eski tugmalar eskirgan bo'ladi. */
export function itemVersion(videos: Buffer[]): string {
  const h = createHash('sha256');
  for (const v of videos) h.update(v);
  return h.digest('hex').slice(0, 8);
}
export type TargetStatus = 'approved' | 'draft' | 'rejected';

export const ACTION_STATUS: Record<ReviewAction, TargetStatus> = { ok: 'approved', redo: 'draft', skip: 'rejected' };
const ACTION_LABEL: Record<ReviewAction, string> = { ok: '✅ Chiqar', redo: '✏️ Qayta', skip: "⏭ O'tkazib yubor" };
const ACTION_DONE: Record<ReviewAction, string> = { ok: '✅ Tasdiqlandi', redo: '✏️ Qayta ishlashga qaytarildi', skip: "⏭ O'tkazib yuborildi" };

/** Callback'da to'liq slug emas, qisqa ID (slug 96 belgigacha bo'lishi mumkin, callback_data esa ≤ 64 bayt). */
export const shortId = (slug: string) => createHash('sha1').update(slug).digest('hex').slice(0, 12);

export type CaptionFile = { lang: string; text: string; hashtags: string[]; needsReview?: string[]; source?: string };

export type ReviewItem = { slug: string; langs: string[]; variants: { lang: string; video: string; caption: CaptionFile }[]; captions: CaptionFile[] };

/** Manifestdan faqat barcha tillari darvozadan o'tgan va caption'i bor keyslarni oladi. */
export function readyItems(manifest: ManifestEntry[], readCaption: (file: string) => CaptionFile): ReviewItem[] {
  const bySlug = new Map<string, ManifestEntry[]>();
  for (const e of manifest) bySlug.set(e.slug, [...(bySlug.get(e.slug) ?? []), e]);
  const items: ReviewItem[] = [];
  for (const [slug, entries] of bySlug) {
    const ok = entries.length > 0 && entries.every((e) => e.lang && e.file && e.captionFile && e.gate.ok && !e.error);
    if (!ok) continue;
    const variants = entries.map((e) => ({ lang: e.lang!, video: e.file!, caption: readCaption(e.captionFile!) }));
    items.push({ slug, langs: variants.map((v) => v.lang), variants, captions: variants.map((v) => v.caption) });
  }
  return items;
}

export const callbackData = (action: ReviewAction, slug: string, ver: string) => `rv:${action}:${shortId(slug)}:${ver}`;

/** `ver` yo'q bo'lsa (versiyasiz eski tugma) — tugma eskirgan hisoblanadi. */
export function parseCallback(data: string | undefined): { action: ReviewAction; id: string; ver?: string } | null {
  const m = /^rv:(ok|redo|skip):([0-9a-f]{12})(?::([0-9a-f]{8}))?$/.exec(data ?? '');
  return m ? { action: m[1] as ReviewAction, id: m[2], ver: m[3] } : null;
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Telegram caption limiti (1024) ko'rinadigan matnga tegishli: avval oddiy matn qisqartiriladi, keyin escape — entity bo'linmaydi.
const clipPlain = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

/** Bitta til varianti uchun video caption'i (HTML). */
export function variantText(slug: string, c: CaptionFile): string {
  const flags = c.needsReview?.length ? `⚠️ ${c.needsReview.join('; ')}\n` : '';
  const plain = clipPlain(`${c.text}\n${c.hashtags.join(' ')}`, 1000 - flags.length - slug.length - 10);
  return `<b>[${escapeHtml(c.lang)}]</b> <code>${escapeHtml(slug)}</code>\n${escapeHtml(flags)}${escapeHtml(plain)}`;
}

/** To'liq caption matni (oddiy matn, ≤ 4096 belgili bo'laklarda) — video izohi qisqartirilsa ham egasi hammasini o'qiydi. */
export function fullCaptionChunks(slug: string, c: CaptionFile, max = 4000): string[] {
  const full = `[${c.lang}] ${slug} — to'liq caption:\n\n${c.text}\n\n${c.hashtags.join(' ')}`;
  const chunks: string[] = [];
  for (let i = 0; i < full.length; i += max) chunks.push(full.slice(i, i + max));
  return chunks;
}

/** Tugmalar bilan yakuniy xabar: barcha variantlar yuqorida yuborilgandan keyin. */
export function decisionText(item: ReviewItem): string {
  const flags = [...new Set(item.captions.flatMap((c) => (c.needsReview ?? []).map((f) => `${c.lang}: ${f}`)))];
  return [
    `<b>Reel draft</b> · <code>${escapeHtml(item.slug)}</code>`,
    `Tillar: ${escapeHtml(item.langs.join(', '))} — har biri yuqorida alohida yuborildi.`,
    flags.length ? `⚠️ Tekshiring: ${escapeHtml(clipPlain(flags.join('; '), 600))}` : '',
    "Barcha tillarni ko'rib chiqing: ✅ butun keysni tasdiqlaydi.",
  ].filter(Boolean).join('\n');
}

export function keyboard(slug: string, ver: string) {
  return {
    inline_keyboard: [(['ok', 'redo', 'skip'] as ReviewAction[]).map((a) => ({ text: ACTION_LABEL[a], callback_data: callbackData(a, slug, ver) }))],
  };
}

export type CallbackQuery = {
  id: string;
  from: { id: number; first_name?: string };
  data?: string;
  message?: { chat: { id: number }; message_id: number };
};

export type SetResult = 'changed' | 'unchanged' | 'simulated';

export type ReviewDeps = {
  ownerId: number;
  /** Qisqa ID → slug (send yozgan indeks). */
  resolve: (id: string) => string | undefined;
  /** Sanity: faqat draft'dan o'zgartiradi. 'simulated' — MOCK_SANITY_WRITE, hech narsa yozilmadi. */
  setStatus: (slug: string, status: TargetStatus, note: string) => Promise<SetResult>;
  /** ✏️ Qayta: tuzatilgan draft qayta yuborilishi uchun "yuborilgan" ro'yxatidan chiqariladi. */
  onRework: (slug: string) => void;
  /** Hozir diskdagi videolar versiyasi (yo'q bo'lsa undefined). Tugma shu bilan solishtiriladi. */
  currentVersion: (slug: string) => string | undefined;
  answer: (callbackId: string, text: string) => Promise<void>;
  markMessage: (q: CallbackQuery, text: string) => Promise<void>;
};

export type CallbackOutcome = 'ignored' | 'forbidden' | 'unknown' | 'stale' | 'applied' | 'unchanged' | 'simulated';

export async function handleCallback(q: CallbackQuery, deps: ReviewDeps): Promise<CallbackOutcome> {
  const parsed = parseCallback(q.data);
  if (!parsed) return 'ignored';
  if (q.from.id !== deps.ownerId) {
    await deps.answer(q.id, 'Faqat egasi tasdiqlaydi.');
    return 'forbidden';
  }
  const slug = deps.resolve(parsed.id);
  if (!slug) {
    await deps.answer(q.id, "Bu preview topilmadi (indeks yo'q).");
    return 'unknown';
  }
  // Video almashgan (qayta render) yoki versiyasiz eski tugma: egasi ko'rmagan faylni tasdiqlab bo'lmaydi.
  if (parsed.ver === undefined || deps.currentVersion(slug) !== parsed.ver) {
    await deps.answer(q.id, "Bu preview eskirgan — video o'zgargan. Yangi preview'ni kuting.");
    return 'stale';
  }
  const status = ACTION_STATUS[parsed.action];
  const note = `Telegram: ${parsed.action} (${new Date().toISOString()})`;
  const result = await deps.setStatus(slug, status, note);
  if (result === 'unchanged') {
    await deps.answer(q.id, 'Holat allaqachon o\'zgargan — hech narsa qilinmadi.');
    return 'unchanged';
  }
  if (result === 'simulated') {
    // Sinov rejimi: tugmalar o'chirilmaydi, aks holda haqiqiy qaror berib bo'lmay qoladi.
    await deps.answer(q.id, "Sinov rejimi: Sanity'ga yozilmadi.");
    return 'simulated';
  }
  if (parsed.action === 'redo') deps.onRework(slug);
  await deps.answer(q.id, ACTION_DONE[parsed.action]);
  await deps.markMessage(q, `${ACTION_DONE[parsed.action]} · ${slug}`);
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
