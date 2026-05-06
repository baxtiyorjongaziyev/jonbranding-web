import { describe, it, expect } from 'vitest';
import { getDictionary } from './dictionaries';

describe('Localization Dictionaries', () => {
  it('should load the Uzbek dictionary by default', async () => {
    const dict = await getDictionary('uz');
    expect(dict).toBeDefined();
    expect(dict.header).toBeDefined();
    expect(dict.header.portfolio).toBeDefined();
  });

  it('should load the Russian dictionary', async () => {
    const dict = await getDictionary('ru');
    expect(dict).toBeDefined();
    expect(dict.header.portfolio).toBe('Портфолио');
  });

  it('should fallback to Uzbek for unknown locales', async () => {
    // @ts-ignore
    const dict = await getDictionary('fr');
    expect(dict).toBeDefined();
    expect(dict.header.portfolio).toBe('Portfolio');
  });
});
