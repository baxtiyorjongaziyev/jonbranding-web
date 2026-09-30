import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

type Redirect = { source: string; destination: string; permanent: boolean };

/** next.config.js `redirects()` yozuvlarini Next.js path-to-regexp ma'nosida qo'llaydi. */
async function resolve(pathname: string): Promise<{ destination: string; permanent: boolean } | null> {
  const nextConfig = require('../../next.config.js');
  const redirects: Redirect[] = await nextConfig.redirects();
  for (const rule of redirects) {
    const names: string[] = [];
    const pattern = rule.source.replace(/\/:(\w+)(\(([^)]+)\))?(\?)?/g, (_m, name, _g, group, optional) => {
      names.push(name);
      const body = `(${group ?? '[^/]+'})`;
      return optional ? `(?:/${body})?` : `/${body}`;
    });
    const match = new RegExp(`^${pattern}$`).exec(pathname);
    if (!match) continue;
    const params = Object.fromEntries(names.map((name, i) => [name, match[i + 1]]));
    const destination = rule.destination.replace(/:(\w+)/g, (_m, name) => params[name] ?? '');
    return { destination, permanent: rule.permanent };
  }
  return null;
}

describe('legacy Brand Strategy URLs', () => {
  it.each([
    ['/xizmatlar/brand-strategiyasi', '/brand-strategy'],
    ['/uz/xizmatlar/brand-strategiyasi', '/brand-strategy'],
    ['/xizmatlar/brand-strategy', '/brand-strategy'],
    ['/ru/xizmatlar/brand-strategiyasi', '/ru/brand-strategy'],
    ['/en/xizmatlar/brand-strategy', '/en/brand-strategy'],
  ])('%s → %s (permanent, language kept)', async (from, to) => {
    expect(await resolve(from)).toEqual({ destination: to, permanent: true });
  });
});
