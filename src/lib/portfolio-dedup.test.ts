import { describe, expect, it } from 'vitest';
import { normalizeCaption, portfolioDocId } from './portfolio-dedup';

describe('portfolio-dedup', () => {
  it('normalizes punctuation, case and whitespace away', () => {
    expect(normalizeCaption('  Bekmarket "Zayyan" — Naming & Branding!  ')).toBe(
      'bekmarket zayyan naming branding'
    );
  });

  it('keeps Cyrillic and Uzbek letters', () => {
    expect(normalizeCaption('Декор, Qo‘shimcha — ЎҚҒҲ')).toBe('декор qo shimcha ўқғҳ');
  });

  it('gives the same id to captions that differ only in formatting', () => {
    const a = 'Bekmarket Zayyan — Naming va Branding loyihasi, 2026-yil';
    const b = '  bekmarket   zayyan   naming va branding loyihasi 2026 yil!!!  ';
    expect(portfolioDocId(a)).toBe(portfolioDocId(b));
  });

  it('gives different ids to posts that share a long identical opening', () => {
    const prefix = 'Jon Branding '.repeat(60);
    expect(portfolioDocId(prefix + 'Bekmarket Zayyan')).not.toBe(
      portfolioDocId(prefix + 'Feel it SAT')
    );
  });

  it('gives different ids to different posts', () => {
    const a = 'Bekmarket Zayyan — Naming va Branding loyihasi, 2026-yil';
    const b = 'Feel it: SAT uchun logo va aydentika loyihasi, 2026-yil';
    expect(portfolioDocId(a)).not.toBe(portfolioDocId(b));
  });

  it('returns null for captions too short to identify a case', () => {
    expect(portfolioDocId('Yangi ish')).toBeNull();
    expect(portfolioDocId('')).toBeNull();
  });

  /**
   * Golden qiymat: `services/portfolio-bot/src/sanity.ts` dagi nusxa ham
   * shu natijani berishi shart, aks holda ikkala tizim bir postdan ikkita
   * hujjat yaratadi. Algoritmni o'zgartirsangiz ikkala joyni ham yangilang.
   */
  it('matches the golden id the portfolio-bot copy must also produce', () => {
    expect(portfolioDocId('Bekmarket Zayyan Naming va Branding loyihasi')).toBe(
      'tg-bef7595f22b63cb44d469111d37ed19e'
    );
  });
});
