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
 */
const doc = readFileSync(join(process.cwd(), 'docs/NARXLAR.md'), 'utf8');

describe('docs/NARXLAR.md kod bilan mos', () => {
  const services = SERVICE_GROUPS.flatMap((group) => group.items);

  it.each(services.map((s) => [s.name, s.price] as const))(
    'xizmat "%s" narxi (%s) hujjatda bor',
    (name, price) => {
      expect(doc).toContain(name);
      expect(doc).toContain(price);
    }
  );

  it.each(services.map((s) => [s.name, s.duration] as const))(
    'xizmat "%s" muddati (%s) hujjatda bor',
    (_name, duration) => {
      expect(doc).toContain(duration);
    }
  );

  it.each(PACKAGES.map((p) => [p.name, p.price, p.separate, p.saving] as const))(
    'paket "%s" raqamlari hujjatda bor',
    (name, price, separate, saving) => {
      expect(doc).toContain(name);
      expect(doc).toContain(price);
      expect(doc).toContain(separate);
      expect(doc).toContain(saving);
    }
  );

  it('paket tarkibi hujjatda to‘liq keltirilgan', () => {
    for (const pack of PACKAGES) {
      for (const feature of pack.features) {
        expect(doc).toContain(feature);
      }
    }
  });

  it('hujjat narx manbasini to‘g‘ri ko‘rsatadi', () => {
    expect(doc).toContain('src/lib/sales-content.ts');
  });
});
