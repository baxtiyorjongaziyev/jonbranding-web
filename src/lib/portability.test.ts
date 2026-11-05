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
const source = new Map(files.map((file) => [file, readFileSync(file, 'utf8')]));
const read = (f: string) => source.get(f) ?? readFileSync(f, 'utf8');

describe('hosting portability', () => {
  it('firebase-admin faqat lazy require orqali yuklanadi (Workers eval)', () => {
    const offenders = files.filter((f) =>
      /^\s*import\s+(?!type\b)[^;]*from\s+['"](firebase-admin|@google-cloud\/firestore|firebase-functions)/m.test(read(f)),
    );
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

  it('wrangler.jsonc: rasm binding, domenlar va worker nomi', () => {
    const w = read('wrangler.jsonc');
    expect(w).toContain('"IMAGES"');
    expect(w).toContain('"custom_domain": true');
    for (const host of ['jonbranding.uz', 'www.jonbranding.uz', 'patent.jonbranding.uz']) {
      expect(w).toContain(`"pattern": "${host}"`);
    }
  });
});
