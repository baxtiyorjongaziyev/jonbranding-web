import { describe, expect, it } from 'vitest';
import { publicPortfolioResults } from './portfolio-evidence';

describe('portfolio evidence', () => {
  it('withholds old metrics and incomplete or unsafe provenance', () => {
    expect(publicPortfolioResults([
      { metric: 'Sales', value: '+85%' },
      { metric: 'Sales', value: '+85%', approved: true, period: '2026', sourceUrl: 'javascript:alert(1)' },
      { metric: 'Sales', value: '+85%', approved: true, sourceUrl: 'https://example.com/report' },
    ])).toEqual([]);
  });
  it('retains only attributable reviewed metrics', () => {
    const result = { metric: 'Sales', value: '+10%', approved: true, period: 'Jan–Feb 2026', sourceUrl: 'https://example.com/report' };
    expect(publicPortfolioResults([result])).toEqual([result]);
  });
});
