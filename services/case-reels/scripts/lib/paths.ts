import { resolve, sep } from 'node:path';

const OUT = resolve('out');

/** Manifest/indeksdan kelgan yo'l faqat `out/` ichida bo'lishi shart (traversal va symlink'dan himoya). */
export function inOut(p: string): string {
  const abs = resolve(p);
  if (abs !== OUT && !abs.startsWith(OUT + sep)) throw new Error(`Yo'l out/ tashqarisida: ${p}`);
  return abs;
}
