import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

// 60-30-10 rang tizimi qo'riqchisi (CLAUDE.md, 7-qoida).
// Ratchet: eski "begona" ranglar baseline'da muzlatilgan, YANGI begona hex rang qo'shilsa test yiqiladi.
// Baseline faqat kichrayadi: rang olib tashlansa, baseline'ni yangilash so'raladi.
// Yangilash: UPDATE_PALETTE_BASELINE=1 npx vitest run src/lib/palette.test.ts

// Brend: 60% oq, 30% siyoh, 10% elektr aksent (+ hover).
const BRAND = ['#FFFFFF', '#0A0B0E', '#2554FF', '#1D4ED8'];
// Ruxsat etilgan neytrallar (matn/chiziq/fon kul ranglari) va holat ranglari (xato/muvaffaqiyat/ogohlantirish).
const NEUTRALS = ['#000000', '#E5E7EB', '#6B7280', '#F4F5F7', '#4B5563', '#D1D5DB', '#F8F9FB'];
const STATE = ['#EF4444', '#10B981', '#F59E0B'];
const ALLOWED = new Set([...BRAND, ...NEUTRALS, ...STATE]);

const BASELINE_PATH = 'src/lib/palette-baseline.json';
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6})\b/g;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx|css)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

/** fayl -> ruxsatsiz ranglar (6 xonali, katta harf; alfa-kanal olib tashlanadi) */
function scan(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const file of sourceFiles('src')) {
    const found = new Set<string>();
    for (const m of readFileSync(file, 'utf8').matchAll(HEX)) {
      const hex = m[0].slice(0, 7).toUpperCase();
      if (!ALLOWED.has(hex)) found.add(hex);
    }
    if (found.size) out[relative('.', file).split('\\').join('/')] = [...found].sort();
  }
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}

describe('60-30-10 palette guard', () => {
  const current = scan();

  if (process.env.UPDATE_PALETTE_BASELINE) {
    writeFileSync(BASELINE_PATH, JSON.stringify(current, null, 2) + '\n');
  }

  const baseline: Record<string, string[]> = existsSync(BASELINE_PATH)
    ? JSON.parse(readFileSync(BASELINE_PATH, 'utf8'))
    : {};

  it("yangi begona hex rang qo'shilmagan (brend: #FFFFFF / #0A0B0E / #2554FF)", () => {
    const added = Object.entries(current).flatMap(([file, colors]) =>
      colors.filter((c) => !(baseline[file] ?? []).includes(c)).map((c) => `${file}: ${c}`),
    );
    expect(
      added,
      "Brend tokenini ishlating (--accent, --ink, bg-[#2554FF]) yoki rangni ALLOWED'ga asosli qo'shing",
    ).toEqual([]);
  });

  it("baseline eskirmagan (tozalangan ranglar baseline'dan ham o'chirilsin)", () => {
    const stale = Object.entries(baseline).flatMap(([file, colors]) =>
      colors.filter((c) => !(current[file] ?? []).includes(c)).map((c) => `${file}: ${c}`),
    );
    expect(stale, 'UPDATE_PALETTE_BASELINE=1 npx vitest run src/lib/palette.test.ts').toEqual([]);
  });
});
