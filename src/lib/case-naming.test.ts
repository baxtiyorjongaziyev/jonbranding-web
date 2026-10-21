import { describe, expect, it } from 'vitest';
import { FALLBACK_PORTFOLIO } from './portfolio-fallbacks';
import { buildCaseTitle, caseBrandName, validateCaseTitle } from './case-naming';

describe('keys nomlari standarti', () => {
  it('builds titles in every language', () => {
    expect(buildCaseTitle('Rash Milk', 'packaging', 'uz')).toBe('Rash Milk — qadoq dizayni');
    expect(buildCaseTitle('Rash Milk', 'packaging', 'ru')).toBe('Rash Milk — дизайн упаковки');
    expect(buildCaseTitle('Rash Milk', 'packaging', 'en')).toBe('Rash Milk — packaging design');
    expect(buildCaseTitle('Rash Milk', 'packaging', 'zh')).toBe('Rash Milk — 包装设计');
  });

  it('extracts the brand for cards', () => {
    expect(caseBrandName('Den Aroma — brend-strategiya')).toBe('Den Aroma');
    expect(caseBrandName('Eski: sarlavha')).toBe('Eski');
  });

  it('rejects non-standard titles', () => {
    expect(validateCaseTitle('Den Aroma Premium Parfyumeriya', 'Den Aroma')).not.toEqual([]);
    expect(validateCaseTitle('Den Aroma — firma uslubi', 'Den Aroma MChJ')).not.toEqual([]);
    expect(validateCaseTitle('ООО Den Aroma — firma uslubi', 'ООО Den Aroma')).not.toEqual([]);
  });

  it('fallback cases follow the standard', () => {
    const errors = Object.entries(FALLBACK_PORTFOLIO).flatMap(([lang, projects]) =>
      projects.flatMap((p) => {
        const issues = validateCaseTitle(p.title, p.client);
        if (p.title !== buildCaseTitle(p.client, p.category, lang as 'uz')) issues.push(`${lang}/${p.slug}: ish turi kategoriyaga mos emas`);
        return issues.map((e) => `${lang}/${p.slug}: ${e}`);
      }),
    );
    expect(errors).toEqual([]);
  });

  it('brand name is identical across languages', () => {
    const bySlug = new Map<string, Set<string>>();
    for (const projects of Object.values(FALLBACK_PORTFOLIO)) {
      for (const p of projects) bySlug.set(p.slug, (bySlug.get(p.slug) ?? new Set()).add(p.client));
    }
    for (const [slug, brands] of bySlug) expect([slug, brands.size]).toEqual([slug, 1]);
  });
});
