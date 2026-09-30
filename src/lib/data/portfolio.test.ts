import { describe, expect, it } from 'vitest';
import { supersedesFallback } from './portfolio';

describe('supersedesFallback', () => {
  const denAroma = { slug: 'den-aroma', title: 'Den Aroma' };

  it('treats a longer Sanity slug for the same case as the same project', () => {
    expect(supersedesFallback({ slug: 'den-aroma-brend-transformatsiyasi', title: 'Den Aroma brendi' }, denAroma)).toBe(true);
    expect(supersedesFallback({ slug: 'fidda-by-sevara-kumush-brendi', title: 'Fidda' }, { slug: 'fidda', title: 'Fidda' })).toBe(true);
  });

  it('does not merge unrelated cases that merely share a prefix', () => {
    expect(supersedesFallback({ slug: 'den-aromatic', title: 'Den Aromatic' }, denAroma)).toBe(false);
    expect(supersedesFallback({ slug: 'savod', title: 'Savod' }, denAroma)).toBe(false);
  });
});
