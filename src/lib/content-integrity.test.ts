import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPortfolioFallback, type PortfolioProject } from '@/lib/portfolio-fallbacks';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

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
  }, 30_000);

  // Oldin/Keyin keyslaridagi raqamlar (+178%, 4.2x ROAS, Top-3 ...) tasdiqlanmagan edi —
  // egasi olib tashlashni so'radi. Keys natijasi faqat haqiqiy ma'lumot bilan qaytadi.
  const NUMERIC_CLAIM = /\d+(?:[.,]\d+)?\s*(?:%|x\b|barobar|раз|倍)|ROAS|\bTop-?3\b|Топ-3|前3/i;

  it.each(['uz', 'ru', 'en', 'zh'])('portfolio fallback cases carry no unverified numbers (%s)', (lang) => {
    const projects = getPortfolioFallback(lang) as PortfolioProject[];
    const hits = projects.flatMap((project) => [
      ...(project.results ?? []).map((r) => `${project.slug} results: ${r.metric} ${r.value}`),
      ...project.body
        .filter((b) => NUMERIC_CLAIM.test(b.paragraph))
        .map((b) => `${project.slug} body: ${b.heading}`),
    ]);
    expect(hits).toEqual([]);
  });

  it('the before/after block shows no metric cards in any language', () => {
    for (const dict of [uz, ru, en, zh]) {
      expect(dict.beforeAfter).not.toHaveProperty('proofCards');
    }
    const block = readFileSync(path.join(SRC_DIR, 'components/sections/before-after.tsx'), 'utf8');
    expect(block).not.toMatch(/['"]\+?\d+(?:\.\d+)?(?:%|x)['"]/);
  });
});
