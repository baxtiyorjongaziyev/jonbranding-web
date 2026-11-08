import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';

/**
 * Analitika faqat cookie roziligidan keyin yuklanadi (`src/lib/analytics/loader-script.ts`).
 * `<noscript>` piksel esa JavaScript'siz ham, rozilikdan qat'i nazar ishlaydi — JS'siz mehmon
 * rozilik bera olmaydi. Yandex pikseli shu sabab olib tashlangan (texnik audit, P2).
 */
describe('tracking pixels respect consent', () => {
  it('the locale layout has no no-JS tracking pixel', () => {
    const layout = readFileSync('src/app/[lang]/layout.tsx', 'utf8');
    expect(layout).not.toMatch(/mc\.yandex\.ru\/watch|facebook\.com\/tr\?|googletagmanager\.com\/ns\.html/);
  });
});
