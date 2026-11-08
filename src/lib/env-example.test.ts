import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';

/**
 * `.env.example` — ko'chishda (Vercel → Cloudflare) qaysi kalitlar kerakligini ko'rsatadigan yagona ro'yxat.
 * Audit paytida unda kod ishlatadigan ~40 ta o'zgaruvchi yo'q edi va Worker'ga ko'chirishda ular unutildi.
 * Kod yangi `process.env.X` / `env.X` ishlatsa, shu test uni `.env.example`ga qo'shishni talab qiladi.
 */
const sources = import.meta.glob<string>(['/src/**/*.{ts,tsx}', '!/src/**/*.test.{ts,tsx}'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** Platforma o'zi beradigan o'zgaruvchilar — sozlanmaydi. */
const PLATFORM = new Set(['NODE_ENV', 'NEXT_RUNTIME', 'VERCEL', 'VERCEL_ENV', 'CI']);

function usedInCode(): string[] {
  const names = new Set<string>();
  for (const code of Object.values(sources)) {
    for (const match of code.matchAll(/process\.env\.([A-Z][A-Z0-9_]+)/g)) names.add(match[1]);
    for (const match of code.matchAll(/\benv\??\.([A-Z][A-Z0-9_]{3,})\b/g)) names.add(match[1]);
  }
  return [...names].filter((name) => !PLATFORM.has(name)).sort();
}

const documented = new Set(
  Array.from(readFileSync('.env.example', 'utf8').matchAll(/^([A-Z][A-Z0-9_]*)=/gm), (match) => match[1]),
);

describe('.env.example', () => {
  it('reads the application sources', () => {
    expect(Object.keys(sources).length).toBeGreaterThan(100);
  });

  it('lists every environment variable the code reads', () => {
    expect(usedInCode().filter((name) => !documented.has(name))).toEqual([]);
  });

  it('keeps secrets out of the example file', () => {
    const filled = Array.from(readFileSync('.env.example', 'utf8').matchAll(/^([A-Z][A-Z0-9_]*)=(.+)$/gm), (match) => match[1]);
    expect(filled.filter((name) => /SECRET|TOKEN|KEY|PASSWORD|SESSION|HASH|JSON/.test(name))).toEqual([]);
  });
});
