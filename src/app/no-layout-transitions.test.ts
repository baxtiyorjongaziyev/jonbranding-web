import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';

/**
 * Loyiha qoidasi 3 (CLAUDE.md): `transition: all` / `transition-all` taqiqlangan — width, padding,
 * max-width kabi layout xossalari ham animatsiya bo'lib, mobilda qotish beradi. Faqat transform/opacity/rang.
 * Progress bar'lar kenglik emas, `transform` bilan harakatlanadi.
 */
const components = import.meta.glob<string>(['/src/**/*.{ts,tsx}', '!/src/**/*.test.{ts,tsx}'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

describe('no layout transitions', () => {
  it('components do not use transition-all', () => {
    const offenders = Object.entries(components).filter(([, code]) => /\btransition-all\b/.test(code)).map(([file]) => file);
    expect(offenders).toEqual([]);
  });

  it('stylesheets do not use transition: all', () => {
    for (const css of [readFileSync('src/app/globals.css', 'utf8'), readFileSync('src/app/atelier.css', 'utf8')]) {
      expect(css).not.toMatch(/transition:\s*all\b/);
    }
  });
});
