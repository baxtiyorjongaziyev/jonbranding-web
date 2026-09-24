import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { PACKAGES, SERVICE_GROUPS } from './sales-content';

/**
 * `docs/NARXLAR.md` — barcha AI agentlar (Claude Code, Codex, Antigravity,
 * ChatGPT, Gemini) narxga tegishdan oldin o'qiydigan ma'lumotnoma.
 *
 * Noto'g'ri narx yozilgan hujjat hujjatsizlikdan battar: agent unga ishonib
 * mijozga xato raqam aytadi. Shuning uchun hujjat koddan ajralib ketsa,
 * sinov yiqiladi.
 *
 * Tekshiruv QATOR bo'yicha: narx va muddat aynan o'z xizmati yozilgan
 * jadval qatorida turishi shart. Butun hujjat bo'yicha qidirish yetarli
 * emas edi — masalan Naming narxini Logo narxiga almashtirsak, ikkala
 * raqam ham hujjatda boshqa joyda uchragani uchun sinov o'tib ketardi.
 */
const doc = readFileSync(join(process.cwd(), 'docs/NARXLAR.md'), 'utf8');

/** Markdown jadvalidan birinchi ustuni `label` bo'lgan qatorni qaytaradi. */
function tableRow(label: string): string | null {
  for (const line of doc.split('\n')) {
    if (!line.startsWith('|')) continue;
    const first = line.split('|')[1]?.replace(/\*\*/g, '').replace(/\*.*$/, '').trim();
    if (first === label) return line;
  }
  return null;
}

describe('docs/NARXLAR.md kod bilan mos', () => {
  const services = SERVICE_GROUPS.flatMap((group) => group.items);

  it.each(services.map((s) => [s.name, s.price, s.duration] as const))(
    'xizmat "%s" qatorida narx (%s) va muddat (%s) to‘g‘ri',
    (name, price, duration) => {
      const row = tableRow(name);
      expect(row, `"${name}" uchun jadval qatori topilmadi`).not.toBeNull();
      expect(row).toContain(price);
      if (duration) {
        expect(row).toContain(duration);
      }
    }
  );

  it.each(PACKAGES.map((p) => [p.name, p.price, p.separate, p.saving, p.duration] as const))(
    'paket "%s" qatorida barcha raqamlar to‘g‘ri',
    (name, price, separate, saving, duration) => {
      const row = tableRow(name);
      expect(row, `"${name}" uchun jadval qatori topilmadi`).not.toBeNull();
      expect(row).toContain(price);
      expect(row).toContain(separate);
      expect(row).toContain(saving);
      expect(row).toContain(duration);
    }
  );

  it.each(PACKAGES.map((p) => [p.name, p.features] as const))(
    'paket "%s" tarkibi o‘z qatorida to‘liq',
    (name, features) => {
      const row = tableRow(name);
      expect(row).not.toBeNull();
      for (const feature of features) {
        expect(row).toContain(feature);
      }
    }
  );

  it('hujjat narx manbasini to‘g‘ri ko‘rsatadi', () => {
    expect(doc).toContain('src/lib/sales-content.ts');
  });
});
