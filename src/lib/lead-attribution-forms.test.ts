import { describe, expect, it } from 'vitest';

/**
 * Har bir lid formasi reklama manbasini yuboradi (K-2). Yangi forma `/api/submit-form`ga yozsa-yu,
 * `getLeadAttribution()`ni qo'shmasa — amoCRM'da manba yana yo'qoladi. Bu test shuni ushlaydi.
 */
const sources = import.meta.glob<string>(['/src/**/*.tsx', '!/src/**/*.test.tsx'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

const forms = Object.entries(sources).filter(([, code]) => /fetch\(\s*['"]\/api\/submit-form['"]/.test(code));

describe('lead forms send campaign attribution', () => {
  it('finds the site lead forms', () => {
    expect(forms.length).toBeGreaterThanOrEqual(8);
  });

  it.each(forms.map(([file, code]) => [file, code] as const))('%s spreads getLeadAttribution() into its request', (_file, code) => {
    expect(code).toMatch(/\.\.\.getLeadAttribution\(\)/);
  });
});
