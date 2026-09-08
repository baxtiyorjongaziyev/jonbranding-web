import { describe, expect, it } from 'vitest';
import { generatePromoCode, normalizePromoBase } from './promo-code';

describe('normalizePromoBase', () => {
  it('uppercases the first name word', () => {
    expect(normalizePromoBase('Sherbek Aliyev')).toBe('SHERBEK');
    expect(normalizePromoBase('  muborak  ')).toBe('MUBORAK');
  });

  it('transliterates common cyrillic', () => {
    expect(normalizePromoBase('Шербек')).toBe('SHERBEK');
  });

  it('strips non-alphanumerics', () => {
    expect(normalizePromoBase("O'ktam-99")).toBe('OKTAM99');
  });

  it('falls back to HAMKOR for empty or too-short input', () => {
    expect(normalizePromoBase('')).toBe('HAMKOR');
    expect(normalizePromoBase('Ali')).toBe('HAMKOR'); // < 4 belgi
    expect(normalizePromoBase('!!')).toBe('HAMKOR');
  });

  it('caps length at 20', () => {
    expect(normalizePromoBase('Abdurahmonqulovabdulla')).toHaveLength(20);
  });
});

describe('generatePromoCode', () => {
  it('returns the base when free', async () => {
    const code = await generatePromoCode('Sherbek', async () => false);
    expect(code).toBe('SHERBEK');
  });

  it('appends a numeric suffix when the base is taken', async () => {
    const taken = new Set(['SHERBEK', 'SHERBEK2']);
    const code = await generatePromoCode('Sherbek', async (c) => taken.has(c));
    expect(code).toBe('SHERBEK3');
  });

  it('falls back to a random suffix after 99 collisions', async () => {
    const code = await generatePromoCode('Sherbek', async (c) => c === 'SHERBEK' || /^SHERBEK\d{1,2}$/.test(c));
    expect(code).toMatch(/^SHERBEK[A-Z0-9]{3,4}$/);
  });
});
