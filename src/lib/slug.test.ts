import { describe, expect, it } from 'vitest';
import { slugify, toSlug } from './slug';

describe('slugify', () => {
  it('keeps Uzbek Latin readable and drops apostrophes', () => {
    expect(slugify("Brend nomining ahamiyati: to'g'ri tanlov")).toBe('brend-nomining-ahamiyati-togri-tanlov');
  });

  it('transliterates Russian and Uzbek Cyrillic instead of returning an empty slug', () => {
    expect(slugify('Важность нейминга в брендинге')).toBe('vajnost-neyminga-v-brendinge');
    expect(slugify('Қадоқ дизайни')).toBe('qadoq-dizayni');
  });

  it('never leaves leading or trailing dashes', () => {
    expect(slugify('  — Logo! — ')).toBe('logo');
  });
});

describe('toSlug', () => {
  it('falls back when the title cannot be transliterated', () => {
    expect(toSlug('品牌命名的重要性', 'The importance of naming')).toBe('the-importance-of-naming');
  });
});
