import { describe, expect, it } from 'vitest';
import { getDictionary, type Locale } from './dictionaries';
import { patentFaqs } from './patent-faq';

describe('patent kalkulyatori savol-javoblari', () => {
  it.each(['uz', 'ru', 'en', 'zh'] as Locale[])('%s: barcha belgilar to‘ldiriladi', async (lang) => {
    const items = (await getDictionary(lang)).patentCalculatorPage.faq.items;
    const faqs = patentFaqs(lang, items);
    expect(faqs).toHaveLength(5);
    for (const f of faqs) {
      expect(f.a).not.toMatch(/\{\w+\}/);
    }
    expect(faqs[0].a).toContain('880 000');
  });
});
