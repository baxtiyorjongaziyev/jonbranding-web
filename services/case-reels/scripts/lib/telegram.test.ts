import { describe, expect, it, vi } from 'vitest';
import type { ManifestEntry } from './batch';
import {
  callbackData, handleCallback, keyboard, mockTelegram, parseCallback, previewText, readyItems,
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
    expect(items[0]).toMatchObject({ video: 'out/a-uz.mp4', langs: ['uz', 'ru'] });
  });
});

describe('callback data', () => {
  it('round-trips', () => expect(parseCallback(callbackData('ok', 'den-aroma'))).toEqual({ action: 'ok', slug: 'den-aroma' }));
  it('rejects foreign data and overlong slugs', () => {
    expect(parseCallback('hack:ok:x')).toBeNull();
    expect(parseCallback(undefined)).toBeNull();
    expect(() => callbackData('ok', 'x'.repeat(70))).toThrow();
  });
  it('keyboard has three buttons', () => expect(keyboard('a').inline_keyboard[0]).toHaveLength(3));
});

describe('previewText', () => {
  it('escapes HTML, shows review flags and fits 1024 chars', () => {
    const t = previewText({
      slug: 'a', video: 'v', langs: ['uz', 'ru'],
      captions: [{ lang: 'uz', text: 'x'.repeat(2000) + '<', hashtags: [], needsReview: [] }, { lang: 'ru', text: 'y', hashtags: [], needsReview: ['template-untranslated-facts'] }],
    });
    expect(t.length).toBeLessThanOrEqual(1024);
    expect(t).toContain('ru: template-untranslated-facts');
    expect(t).not.toContain('<b>Reel draft</b>x<');
  });
});

describe('handleCallback', () => {
  const q = (fromId: number, data = 'rv:ok:den'): CallbackQuery => ({ id: 'q1', from: { id: fromId }, data, message: { chat: { id: -1 }, message_id: 5 } });
  const deps = (over: Partial<ReviewDeps> = {}) => ({
    ownerId: 42,
    setStatus: vi.fn(async () => true),
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
    ['rv:ok:den', 'approved'],
    ['rv:redo:den', 'draft'],
    ['rv:skip:den', 'rejected'],
  ])('%s → %s', async (data, status) => {
    const d = deps();
    expect(await handleCallback(q(42, data), d)).toBe('applied');
    expect(d.setStatus).toHaveBeenCalledWith('den', status, expect.stringContaining('Telegram'));
    expect(d.markMessage).toHaveBeenCalled();
  });

  it('second press is a no-op (idempotent)', async () => {
    const d = deps({ setStatus: vi.fn(async () => false) });
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
