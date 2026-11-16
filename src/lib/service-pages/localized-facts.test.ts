import { describe, expect, it } from 'vitest';
import { fillServiceTokens, getServiceFact } from './localized-facts';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

const DICTS = { uz, ru, en, zh } as const;

describe('xizmat sahifalari: narx manbadan, qo‘lda yozilmaydi', () => {
  for (const [lang, dict] of Object.entries(DICTS)) {
    for (const [page, id] of [['logoDesignPage', 'logo'], ['brandbookPage', 'brandbook'], ['corporateStylePage', 'visual-identity'], ['packagingPage', 'packaging']] as const) {
      it(`${lang}/${page}: shablonlar to‘liq to‘ldiriladi`, () => {
        const p = (dict as any)[page];
        const currency = (dict as any).serviceFacts.currency;
        const texts: string[] = [
          p.metadata.title,
          p.metadata.description,
          p.metadata.keywords,
          p.facts.intro,
          ...p.facts.faqs.map((f: { a: string }) => f.a),
        ];
        const service = getServiceFact(lang, id);
        for (const t of texts) {
          const out = fillServiceTokens(t, lang, id, currency).replaceAll('{includes}', service.deliverables.join('; '));
          expect(out).not.toMatch(/\{[a-z]+\}/);
        }
        // narx matnga faqat token orqali kiradi
        for (const t of texts) expect(t).not.toMatch(/\d\s?000\s?000/);
        expect(fillServiceTokens(p.metadata.title, lang, id, currency)).toContain(service.price);
      });
    }
  }
});
