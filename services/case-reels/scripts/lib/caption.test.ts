import { describe, expect, it } from 'vitest';
import {
  CTA, MAX_CAPTION_CHARS, assemble, buildPrompt, hashtagsFor, makeCaption, numbersIn, parseDraft,
  templateCaption, validateDraft, type CaptionFacts, type Draft,
} from './caption';

const facts: CaptionFacts = {
  client: 'Den Aroma',
  title: 'Brend transformatsiyasi',
  category: 'Logo · Brandbook',
  city: 'Toshkent',
  industry: 'Qahva',
  result: { metric: 'Sotuv', value: '+40%', period: '2025 Q1' },
  url: 'https://jonbranding.uz/uz/portfolio/den-aroma',
};
const good: Draft = {
  hook: "Qahva do'koni qanday qilib esda qoladigan bo'ladi?",
  sentences: [
    { text: 'Den Aroma bilan brendni yangiladik.', fact: 'client' },
    { text: "Sotuv 2025 Q1 da +40% o'sdi.", fact: 'result' },
  ],
};
const json = (d: unknown) => JSON.stringify(d);

describe('numbersIn', () => {
  it('guruhlash va o\'nlikni ajratadi', () => {
    expect(numbersIn('1 200 va 1,200')).toEqual(['1200', '1200']);
    expect(numbersIn('3,5% va 3.5%')).toEqual(['3.5', '3.5']);
    expect(numbersIn('3,5%')).not.toContain('35');
  });
  it('to\'liq kenglik va xitoycha raqamlarni ko\'radi', () => {
    expect(numbersIn('５００家')).toEqual(['500']);
    expect(numbersIn('五百家门店')).toEqual(['五百']);
  });
});

describe('validateDraft', () => {
  it('rejects inherited prototype keys as fact sources', () => {
    for (const fact of ['toString', 'constructor', '__proto__']) {
      const d = { hook: 'Yangi brend', sentences: [{ text: 'Bu bozordagi eng yirik tarmoq.', fact }] } as unknown as Draft;
      expect(validateDraft(d, facts).ok).toBe(false);
    }
  });

  it('faktga bog\'langan to\'g\'ri draft o\'tadi', () => {
    expect(validateDraft(good, facts)).toEqual({ ok: true });
  });
  it('boshqa faktdagi raqamni qayta ishlatishni rad etadi (40% → "40 filial")', () => {
    const d: Draft = { hook: 'Salom', sentences: [{ text: '40 ta filial ochildi.', fact: 'client' }] };
    expect(validateDraft(d, facts).ok).toBe(false);
  });
  it('xitoycha to\'qilgan raqamni rad etadi', () => {
    const d: Draft = { hook: '你好', sentences: [{ text: '五百家门店。', fact: 'client' }] };
    expect(validateDraft(d, facts).ok).toBe(false);
  });
  it('mavjud bo\'lmagan faktga bog\'langan jumlani rad etadi', () => {
    const noCity = { ...facts, city: undefined };
    const d: Draft = { hook: 'Salom', sentences: [{ text: 'Toshkentda.', fact: 'city' }] };
    expect(validateDraft(d, noCity).ok).toBe(false);
  });
  it('ilmoqdagi raqam, kirill/xitoy hashtag va ko\'p jumlani rad etadi', () => {
    expect(validateDraft({ ...good, hook: '500 mijoz!' }, facts).ok).toBe(false);
    expect(validateDraft({ ...good, hook: 'Бренд #брендинг' }, facts).ok).toBe(false);
    expect(validateDraft({ ...good, hook: '品牌 #品牌' }, facts).ok).toBe(false);
    expect(validateDraft({ ...good, sentences: [...good.sentences, good.sentences[0]] }, facts).ok).toBe(false);
  });
});

describe('makeCaption', () => {
  it('to\'g\'ri JSON → llm, CTA bilan', async () => {
    const c = await makeCaption(facts, 'uz', async () => json(good));
    expect(c.source).toBe('llm');
    expect(c.text.endsWith(CTA.uz)).toBe(true);
    expect(c.text).toBe(assemble(good, 'uz'));
  });
  it('to\'qilgan javob → 2 urinish → shablon', async () => {
    let calls = 0;
    const c = await makeCaption(facts, 'uz', async () => { calls++; return json({ hook: '1000% o\'sish', sentences: [] }); });
    expect(calls).toBe(2);
    expect(c.source).toBe('template');
  });
  it('provayder xatosi CLI\'ni yiqitmaydi — shablonga qaytadi', async () => {
    const c = await makeCaption(facts, 'uz', async () => { throw new Error('Gemini 429'); });
    expect(c.source).toBe('template');
    expect(c.errors.join()).toContain('429');
  });
  it('JSON bo\'lmagan javob → shablon', async () => {
    expect((await makeCaption(facts, 'uz', async () => 'oddiy matn')).source).toBe('template');
  });
});

describe('templateCaption', () => {
  it('category bo\'lmasa uni to\'qimaydi', () => {
    expect(templateCaption({ ...facts, category: undefined }, 'uz').text).not.toContain('Branding');
  });
  it('uz\'dan boshqa tillarda tarjima qilinmagan faktlar belgilanadi', () => {
    expect(templateCaption(facts, 'uz').needsReview).toEqual([]);
    expect(templateCaption(facts, 'ru').needsReview).toContain('template-untranslated-facts');
    expect(templateCaption(facts, 'ru').text).toContain('Проект:');
  });
  it('juda uzun faktlarda ham limitdan oshmaydi va CTA saqlanadi', () => {
    const long = { ...facts, title: 'x'.repeat(5000), client: 'y'.repeat(5000) };
    const t = templateCaption(long, 'uz').text;
    expect(t.length).toBeLessThanOrEqual(MAX_CAPTION_CHARS);
    expect(t.endsWith(CTA.uz)).toBe(true);
  });
});

describe('hashtagsFor / parseDraft / buildPrompt', () => {
  it('ixtiyoriy maydonlar bo\'lmasa ham 5–8 hashtag', () => {
    const t = hashtagsFor({ ...facts, city: undefined, industry: undefined });
    expect(t.length).toBeGreaterThanOrEqual(5);
    expect(hashtagsFor(facts).length).toBeLessThanOrEqual(8);
  });
  it('```json``` o\'ramini ochadi', () => {
    expect(parseDraft('```json\n' + json(good) + '\n```')).toEqual(good);
  });
  it('promptda faqat mavjud fakt kalitlari', () => {
    const p = buildPrompt({ ...facts, city: undefined }, 'ru');
    expect(p).toContain('"client"');
    expect(p).not.toContain('"city" |');
  });
});

describe('templateCaption CTA', () => {
  it('keeps the CTA intact when facts are very long', async () => {
    const { templateCaption, CTA } = await import('./caption');
    const long = 'x'.repeat(5000);
    const { text } = templateCaption({ client: long, title: long, category: long, result: null, url: 'u' } as never, 'uz');
    expect(text.endsWith(CTA.uz)).toBe(true);
  });
});
