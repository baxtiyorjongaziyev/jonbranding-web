import { describe, expect, it } from 'vitest';
import { getCredentialsCopy } from './credentials-content';
import { getSalesContent } from './sales-content';

const LANGS = ['uz', 'ru', 'en', 'zh'] as const;

function namingNames(lang: string): string[] {
  const naming = getSalesContent(lang)
    .serviceGroups.flatMap((group) => group.items)
    .find((item) => item.id === 'naming');
  return naming?.proof?.items ?? [];
}

describe('credentials copy', () => {
  it('has the same naming field keys in every language', () => {
    const keys = LANGS.map((lang) => Object.keys(getCredentialsCopy(lang).naming.fields).sort().join(','));
    expect(new Set(keys).size).toBe(1);
  });

  it('every field points at a name the pricing page already claims', () => {
    for (const lang of LANGS) {
      const names = new Set(namingNames(lang).map((name) => name.toUpperCase()));
      for (const key of Object.keys(getCredentialsCopy(lang).naming.fields)) {
        expect(names.has(key), `${lang}: ${key}`).toBe(true);
      }
    }
  });

  it('every approved name has a field, so no card renders blank', () => {
    for (const lang of LANGS) {
      const fields = getCredentialsCopy(lang).naming.fields;
      const names = namingNames(lang);
      // Ro'yxat bo'sh bo'lsa test jimgina o'tib ketmasin — slaydda 19 ta nom bor.
      expect(names.length, `${lang}: naming proof items`).toBe(19);
      for (const name of names) {
        expect(fields[name.toUpperCase()], `${lang}: ${name}`).toBeTruthy();
      }
    }
  });

  it('falls back to Uzbek for unknown locales', () => {
    expect(getCredentialsCopy('de')).toBe(getCredentialsCopy('uz'));
    expect(getCredentialsCopy()).toBe(getCredentialsCopy('uz'));
  });
});
