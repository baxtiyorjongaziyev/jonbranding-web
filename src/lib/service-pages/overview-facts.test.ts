import { describe, expect, it } from 'vitest';
import { fillOverviewTokens, buildOverviewFaqs } from './overview-facts';
import { getSalesContent } from '@/lib/sales-content';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

const DICTS = { uz, ru, en, zh } as const;

describe('/xizmatlar sharhi: narx manbadan, qo‘lda yozilmaydi', () => {
  for (const [lang, dict] of Object.entries(DICTS)) {
    it(`${lang}: shablonlar to‘liq to‘ldiriladi va qattiq narx yo‘q`, () => {
      const sp = (dict as any).servicesPage;
      const currency = (dict as any).serviceFacts.currency;
      const raw = [sp.seo.title, sp.seo.description, sp.seo.keywords, sp.overview.intro, ...sp.overview.faqs.map((f: { a: string }) => f.a)];
      for (const t of raw) {
        expect(t).not.toMatch(/\d\s?000\s?000/);
        expect(fillOverviewTokens(t, lang, currency)).not.toMatch(/\{[A-Za-z]+\}/);
      }
      const standard = getSalesContent(lang).packages[2];
      expect(fillOverviewTokens(sp.seo.description, lang, currency)).toContain(standard.price);
      expect(buildOverviewFaqs(lang, sp.overview, currency)).toHaveLength(sp.overview.faqs.length);
    });
  }
});
