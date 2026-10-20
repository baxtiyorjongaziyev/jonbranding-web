import { describe, expect, it } from 'vitest';
import { buildPrompt, hashtagsFor, makeCaption, numbersIn, templateCaption, validateCaption, type CaptionFacts } from './caption';

const facts: CaptionFacts = {
  client: 'Den Aroma',
  title: 'Brend transformatsiyasi',
  category: 'Logo · Brandbook',
  city: 'Toshkent',
  industry: 'Qahva',
  result: { metric: 'Sotuv', value: '+40%', period: '2025 Q1' },
  url: 'https://jonbranding.uz/uz/portfolio/den-aroma',
};
const cta = "Brendingiz ham shunday bo'lishini xohlaysizmi? Bepul audit — havola profilda";

describe('numbersIn', () => {
  it('bo\'shliq va vergulli raqamlarni normallashtiradi', () => {
    expect(numbersIn('1 200 mijoz, 40% o\'sish, 3.5 oy')).toEqual(['1200', '40', '3.5']);
  });
});

describe('validateCaption', () => {
  it('faktdagi raqam va CTA bo\'lsa o\'tadi', () => {
    expect(validateCaption(`Den Aroma sotuvi +40% oshdi (2025 Q1).\n\n${cta}`, facts, 'uz')).toEqual({ ok: true });
  });
  it('to\'qilgan raqamni rad etadi', () => {
    const r = validateCaption(`500 dan ortiq mijoz bilan ishladik.\n\n${cta}`, facts, 'uz');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reasons[0]).toContain('500');
  });
  it('CTA yo\'q bo\'lsa rad etadi', () => {
    expect(validateCaption('Den Aroma uchun ish.', facts, 'uz').ok).toBe(false);
  });
  it('matn ichidagi hashtagni rad etadi', () => {
    expect(validateCaption(`Ish #logo\n\n${cta}`, facts, 'uz').ok).toBe(false);
  });
});

describe('makeCaption', () => {
  it('LLM to\'qisa — shablonga qaytadi, 2 marta urinadi', async () => {
    let calls = 0;
    const c = await makeCaption(facts, 'uz', async () => { calls++; return `1000% o'sish!\n\n${cta}`; });
    expect(calls).toBe(2);
    expect(c.source).toBe('template');
    expect(validateCaption(c.text, facts, 'uz')).toEqual({ ok: true });
  });
  it('to\'g\'ri LLM javobini qabul qiladi', async () => {
    const c = await makeCaption(facts, 'uz', async () => `Den Aroma yangi ko'rinishda.\n\n${cta}`);
    expect(c.source).toBe('llm');
  });
  it('generatorsiz shablon 4 tilda ham tekshiruvdan o\'tadi', () => {
    for (const lang of ['uz', 'ru', 'en', 'zh'] as const) {
      expect(validateCaption(templateCaption(facts, lang), facts, lang)).toEqual({ ok: true });
    }
  });
});

describe('hashtagsFor / buildPrompt', () => {
  it('8 tadan oshmaydi va soha/shaharni qo\'shadi', () => {
    const tags = hashtagsFor(facts);
    expect(tags.length).toBeLessThanOrEqual(8);
    expect(tags).toEqual(expect.arrayContaining(['#jonbranding', '#qahva', '#toshkent']));
  });
  it('prompt faktlarni va taqiqni o\'z ichiga oladi', () => {
    const p = buildPrompt(facts, 'ru');
    expect(p).toContain('Den Aroma');
    expect(p).toContain("QO'SHMA");
  });
});
