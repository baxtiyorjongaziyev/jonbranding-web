import { describe, expect, it, vi } from 'vitest';
import type { ManifestEntry } from './batch';
import {
  callbackData, decisionText, fullCaptionChunks, handleCallback, keyboard, mockTelegram, parseCallback, readyItems, shortId, variantText,
  type CallbackQuery, type ReviewDeps,
} from './telegram';

const ok = { ok: true, reasons: [] };
const entry = (slug: string, lang: 'uz' | 'ru', over: Partial<ManifestEntry> = {}): ManifestEntry => ({
  slug, lang, file: `out/${slug}-${lang}.mp4`, captionFile: `out/${slug}-${lang}.caption.json`, gate: ok, ...over,
});
const caption = (file: string) => ({ lang: file.includes('-ru.') ? 'ru' : 'uz', text: 'Matn <b>', hashtags: ['#a'], needsReview: [] });

describe('readyItems', () => {
  it('keeps only cases whose every language passed', () => {
    const items = readyItems(
      [entry('a', 'uz'), entry('a', 'ru'), entry('b', 'uz'), entry('b', 'ru', { error: 'x' }), { ...entry('c', 'uz'), lang: null }],
      caption,
    );
    expect(items.map((i) => i.slug)).toEqual(['a']);
    expect(items[0].langs).toEqual(['uz', 'ru']);
    expect(items[0].variants.map((v) => v.video)).toEqual(['out/a-uz.mp4', 'out/a-ru.mp4']);
  });
});

describe('callback data', () => {
  it('round-trips via a compact id', () => expect(parseCallback(callbackData('ok', 'den-aroma'))).toEqual({ action: 'ok', id: shortId('den-aroma') }));
  it('stays within 64 bytes for 96-char slugs', () => {
    for (const a of ['ok', 'redo', 'skip'] as const) expect(Buffer.byteLength(callbackData(a, 'x'.repeat(96)))).toBeLessThanOrEqual(64);
  });
  it('rejects foreign data', () => {
    expect(parseCallback('hack:ok:x')).toBeNull();
    expect(parseCallback(undefined)).toBeNull();
  });
  it('keyboard has three buttons', () => expect(keyboard('a').inline_keyboard[0]).toHaveLength(3));
});

describe('preview texts', () => {
  it('truncates plain text before escaping, so no entity is split', () => {
    const t = variantText('a', { lang: 'uz', text: '&'.repeat(1500), hashtags: [] });
    expect(t).not.toMatch(/&(?!amp;)[a-z]*…/);
    expect(t.replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').length).toBeLessThanOrEqual(1024);
  });
  it('full caption is delivered in chunks without losing text', () => {
    const text = 'z'.repeat(9000);
    const chunks = fullCaptionChunks('a', { lang: 'uz', text, hashtags: ['#x'] }, 4000);
    expect(chunks.every((c) => c.length <= 4000)).toBe(true);
    expect(chunks.join('')).toContain(text);
    expect(chunks.join('')).toContain('#x');
  });
  it('decision message lists every language and review flag', () => {
    const t = decisionText({
      slug: 'a', langs: ['uz', 'ru'], variants: [],
      captions: [{ lang: 'uz', text: '', hashtags: [] }, { lang: 'ru', text: '', hashtags: [], needsReview: ['template-untranslated-facts'] }],
    });
    expect(t).toContain('uz, ru');
    expect(t).toContain('ru: template-untranslated-facts');
  });
});

describe('handleCallback', () => {
  const q = (fromId: number, data = callbackData('ok', 'den')): CallbackQuery => ({ id: 'q1', from: { id: fromId }, data, message: { chat: { id: -1 }, message_id: 5 } });
  const deps = (over: Partial<ReviewDeps> = {}) => ({
    ownerId: 42,
    resolve: vi.fn((id: string) => (id === shortId('den') ? 'den' : undefined)),
    setStatus: vi.fn(async () => 'changed' as const),
    onRework: vi.fn(),
    answer: vi.fn(async () => {}),
    markMessage: vi.fn(async () => {}),
    ...over,
  });

  it('only the owner can change status', async () => {
    const d = deps();
    expect(await handleCallback(q(7), d)).toBe('forbidden');
    expect(d.setStatus).not.toHaveBeenCalled();
    expect(d.answer).toHaveBeenCalledWith('q1', 'Faqat egasi tasdiqlaydi.');
  });

  it.each([
    ['ok', 'approved'],
    ['redo', 'draft'],
    ['skip', 'rejected'],
  ] as const)('%s → %s', async (action, status) => {
    const d = deps();
    expect(await handleCallback(q(42, callbackData(action, 'den')), d)).toBe('applied');
    expect(d.setStatus).toHaveBeenCalledWith('den', status, expect.stringContaining('Telegram'));
    expect(d.markMessage).toHaveBeenCalled();
  });

  it('redo re-opens the case for a new preview', async () => {
    const d = deps();
    await handleCallback(q(42, callbackData('redo', 'den')), d);
    expect(d.onRework).toHaveBeenCalledWith('den');
  });

  it('simulated write keeps the buttons', async () => {
    const d = deps({ setStatus: vi.fn(async () => 'simulated' as const) });
    expect(await handleCallback(q(42), d)).toBe('simulated');
    expect(d.markMessage).not.toHaveBeenCalled();
  });

  it('unknown id changes nothing', async () => {
    const d = deps();
    expect(await handleCallback(q(42, callbackData('ok', 'other')), d)).toBe('unknown');
    expect(d.setStatus).not.toHaveBeenCalled();
  });

  it('second press is a no-op (idempotent)', async () => {
    const d = deps({ setStatus: vi.fn(async () => 'unchanged' as const) });
    expect(await handleCallback(q(42), d)).toBe('unchanged');
    expect(d.markMessage).not.toHaveBeenCalled();
  });

  it('ignores unrelated callbacks', async () => expect(await handleCallback(q(42, 'other'), deps())).toBe('ignored'));
});

describe('mockTelegram', () => {
  it('never touches the network', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const log = vi.fn();
    await mockTelegram(log)('sendVideo', { chat_id: 1 });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
