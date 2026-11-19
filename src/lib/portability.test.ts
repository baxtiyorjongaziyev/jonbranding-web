import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Hosting ko'chishiga (Vercel <-> Cloudflare Workers) tayyorlik qo'riqchisi.
// Batafsil: docs/KOCHISH.md

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

const files = sourceFiles('src');
const read = (f: string) => readFileSync(f, 'utf8');

describe('hosting portability', () => {
  it('firebase-admin faqat lazy require orqali yuklanadi (Workers eval)', () => {
    const offenders = files.filter((f) => {
      const content = read(f);
      if (!/(?:firebase-admin|@google-cloud\/firestore|firebase-functions)/.test(content)) return false;
      return /^\s*import\s+(?!type\b)[^;]*from\s+['"](firebase-admin|@google-cloud\/firestore|firebase-functions)/m.test(content);
    });
    expect(offenders).toEqual([]);
  });

  it("libsql faqat web transport orqali (@libsql/client/web)", () => {
    const offenders = files.filter((f) => /from\s+['"]@libsql\/client['"]/.test(read(f)));
    expect(offenders).toEqual([]);
  });

  it("Node proxy.ts yo'q: OpenNext Cloudflare faqat Edge middleware.ts'ni qo'llaydi", () => {
    expect(existsSync('src/proxy.ts')).toBe(false);
    expect(existsSync('src/middleware.ts')).toBe(true);
  });

  // Free tarifda 10 ms CPU limiti bor; Next 16.4.1 uni oshirib 500 bergan. 2026-11-08 dan
  // egasi qarori bilan 16.4.5 (xavfsizlik tuzatishlari). `^` bilan `npm install` jimgina
  // yangi versiyani olib kelardi — har yangilash deploydan oldin CPU tekshiruvi bilan
  // (docs/KOCHISH.md).
  it("next aniq versiyada mahkamlangan (^ yoki ~ yo'q)", () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.dependencies.next).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('wrangler.jsonc: rasm binding, domenlar va worker nomi', () => {
    const w = read('wrangler.jsonc');
    expect(w).toContain('"IMAGES"');
    expect(w).toContain('"custom_domain": true');
    for (const host of ['jonbranding.uz', 'www.jonbranding.uz', 'patent.jonbranding.uz']) {
      expect(w).toContain(`"pattern": "${host}"`);
    }
  });
});
