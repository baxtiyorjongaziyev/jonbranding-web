import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const APP_DIR = path.resolve(process.cwd(), 'src/app');
const LANG_DIR = path.join(APP_DIR, '[lang]');

function sitemapStaticRoutes(): string[] {
  const source = readFileSync(path.join(APP_DIR, 'sitemap.ts'), 'utf8');
  const block = source.match(/const staticRoutes = \[([\s\S]*?)\] as const;/);
  if (!block) throw new Error('staticRoutes not found in sitemap.ts');
  return Array.from(block[1].matchAll(/'([^']*)'/g), (match) => match[1]);
}

/** Route papkasining o'zidagi page.tsx va layout.tsx matni (ota layout'lar emas). */
function ownMetadataSource(route: string): string {
  const dir = path.join(LANG_DIR, route);
  return ['page.tsx', 'layout.tsx']
    .map((file) => path.join(dir, file))
    .filter((file) => existsSync(file))
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');
}

describe('canonical ownership', () => {
  it('root [lang] layout does not set a canonical that every page would inherit', () => {
    const source = readFileSync(path.join(LANG_DIR, 'layout.tsx'), 'utf8');
    expect(source).not.toMatch(/canonical\s*:/);
    expect(source).not.toMatch(/languages\s*:/);
  });

  it('home page declares its own canonical', () => {
    expect(ownMetadataSource('')).toMatch(/canonical\s*[:,]/);
  });

  it.each(sitemapStaticRoutes().filter(Boolean))(
    'sitemap route %s declares a canonical pointing to itself',
    (route) => {
      const source = ownMetadataSource(route);
      expect(source).toMatch(/canonical\s*[:,]|getPageAlternates\(/);
      expect(source).toContain(route.slice(1));
    },
  );

  it('portfolio case pages declare their own canonical', () => {
    expect(ownMetadataSource('portfolio/[slug]')).toMatch(
      /getPageAlternates\(\s*\w+\s*,\s*`\/portfolio\/\$\{slug\}`\s*\)/,
    );
  });
});
