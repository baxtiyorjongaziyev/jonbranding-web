import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// "Atelier" dizayn shablonidan qolgan to'qima mijozlar va natijalar. Ular hech
// qachon Jon.Branding mijozi bo'lmagan — saytga qaytib kirmasligi kerak.
// Mijoz natijasi faqat portfolio'dagi tasdiqlangan keysdan olinadi.
const FABRICATED_CLIENTS = [
  'Qumri Coffee',
  'Teshabay osh',
  'Humo Fintech',
  'Oltin Bulut',
  'Nur Sopol',
  "Sardor Ro'ziyev",
  'Malika Karimova',
  'Rustam Xolmatov',
];

const SRC_DIR = path.resolve(process.cwd(), 'src');
const SELF = path.resolve(process.cwd(), 'src/lib/content-integrity.test.ts');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(tsx?|json|md)$/.test(name) && full !== SELF ? [full] : [];
  });
}

describe('content integrity', () => {
  it('does not show fabricated clients or results anywhere in the site source', () => {
    const hits = sourceFiles(SRC_DIR).flatMap((file) => {
      const text = readFileSync(file, 'utf8').toLowerCase();
      return FABRICATED_CLIENTS.filter((name) => text.includes(name.toLowerCase())).map(
        (name) => `${path.relative(SRC_DIR, file)}: ${name}`,
      );
    });
    expect(hits).toEqual([]);
  });
});
