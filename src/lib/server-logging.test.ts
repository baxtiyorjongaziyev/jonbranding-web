import { describe, expect, it } from 'vitest';

/**
 * Loyiha qoidasi 5 (CLAUDE.md): server kodida `console.*` emas, `logger` (`src/lib/logger.ts`) —
 * xato matni va stack JSON'da yo'qolmaydi, daraja bo'yicha filtrlanadi. Brauzer kodi (`'use client'`) bundan mustasno.
 */
const serverSources = import.meta.glob<string>(
  ['/src/app/api/**/*.ts', '/src/lib/**/*.ts', '!/src/**/*.test.ts', '!/src/lib/logger.ts'],
  { query: '?raw', import: 'default', eager: true },
);

describe('server logging', () => {
  it('reads server sources', () => {
    expect(Object.keys(serverSources).length).toBeGreaterThan(50);
  });

  it('uses logger instead of console in server code', () => {
    const offenders = Object.entries(serverSources)
      .filter(([, code]) => !/^\s*['"]use client['"]/.test(code))
      .flatMap(([file, code]) =>
        code.split('\n').flatMap((line, i) => (/\bconsole\.(log|info|warn|error|debug)\(/.test(line) ? [`${file}:${i + 1}`] : [])),
      );
    expect(offenders).toEqual([]);
  });
});
