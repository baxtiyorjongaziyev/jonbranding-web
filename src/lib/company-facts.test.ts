import { describe, expect, it } from 'vitest';
import { fillFacts, yearsOfExperience } from './company-facts';

describe('company facts', () => {
  it('counts full years from 2018-11-27', () => {
    expect(yearsOfExperience(new Date('2026-11-26T12:00:00+05:00'))).toBe(7);
    expect(yearsOfExperience(new Date('2026-11-27T12:00:00+05:00'))).toBe(8);
  });

  it('fills dictionary tokens', () => {
    const out = fillFacts({ a: '{{years}} yil, {{clients}} mijoz, {{projects}} loyiha, {{founded}}' }, new Date('2027-01-01'));
    expect(out.a).toBe('8+ yil, 600+ mijoz, 1200+ loyiha, 2018');
  });
});
