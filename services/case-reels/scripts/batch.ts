/**
 * F-03 — Reels'i yo'q keyslarni navbat bilan render qiladi.
 *   npm run batch -- [--dry-run] [--langs uz,ru,en,zh] [--limit N]
 * Natija: out/<slug>-<til>.mp4, out/<slug>-<til>.caption.json, out/manifest.json
 * Sanity: muvaffaqiyatli keysga faqat reel.status="draft" + reel.renderedAt.
 *   SANITY_WRITE_TOKEN bo'lmasa yoki MOCK_SANITY_WRITE=true bo'lsa — yozilmaydi, logga chiqadi.
 */
import './lib/env';
import { closeSync, mkdirSync, openSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { CASE_FIELDS, toFacts, type CaseDoc } from './lib/case-data';
import { parseArgs, runBatch, type ManifestEntry } from './lib/batch';
import { geminiGenerator, makeCaption } from './lib/caption';
import { checkRendered } from './lib/quality-gate';
import { renderCase } from './lib/render';
import { sanity } from './lib/sanity';

let opts;
try {
  opts = parseArgs(process.argv.slice(2), ['uz', 'ru', 'en', 'zh']);
} catch (e) {
  console.error((e as Error).message);
  console.error('Foydalanish: npm run batch -- [--dry-run] [--langs uz,ru,en,zh] [--limit N]');
  process.exit(1);
}

// Bir vaqtda faqat bitta batch: ikki jarayon bir keysning video/caption fayllarini bir-birining ustidan yozmasin
// (egasi ko'rib tasdiqlagan versiya chiqariladigan fayl bilan bir xil qolishi shart).
const LOCK = 'out/batch.lock';
mkdirSync('out', { recursive: true });
const alive = (pid: number) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};
if (!opts.dryRun) {
  // Qulf egasining PID'i yoziladi: faqat egasi o'lgan bo'lsa (Ctrl+C, crash) qulf olib tashlanadi — yoshi muhim emas.
  let fd: number | undefined;
  try {
    fd = openSync(LOCK, 'wx');
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === 'EEXIST') {
      let stale = false;
      try {
        const pid = Number(readFileSync(LOCK, 'utf8'));
        stale = !pid || !alive(pid);
      } catch (readErr) {
        stale = (readErr as NodeJS.ErrnoException)?.code === 'ENOENT';
      }
      if (stale) {
        try {
          unlinkSync(LOCK);
        } catch (unlinkErr) {
          if ((unlinkErr as NodeJS.ErrnoException)?.code !== 'ENOENT') throw unlinkErr;
        }
        try {
          fd = openSync(LOCK, 'wx');
        } catch {
          fd = undefined;
        }
      }
    } else {
      throw err;
    }
  }
  if (fd === undefined) {
    console.error(`Boshqa batch ishlayapti (${LOCK}). Tugashini kuting.`);
    process.exit(1);
  }
  try {
    writeFileSync(fd, String(process.pid));
  } finally {
    closeSync(fd);
  }
  // Faqat o'zimizning qulfni o'chiramiz.
  process.on('exit', () => {
    try {
      if (Number(readFileSync(LOCK, 'utf8')) === process.pid) unlinkSync(LOCK);
    } catch {}
  });
  // Ctrl+C / SIGTERM'da 'exit' hodisasi chiqishi uchun.
  for (const sig of ['SIGINT', 'SIGTERM'] as const) process.on(sig, () => process.exit(130));
}

const token = process.env.SANITY_WRITE_TOKEN;
const mockWrite = process.env.MOCK_SANITY_WRITE === 'true' || !token;
const writer = token ? sanity.withConfig({ token, useCdn: false }) : null;

const key = process.env.GEMINI_API_KEY;
const generate = key && process.env.MOCK_LLM !== 'true' ? geminiGenerator(key) : undefined;

const QUERY = `*[_type == "portfolio" && !(_id in path("drafts.**")) && defined(slug.current)
  && (!defined(reel.status) || reel.status == "none")] | order(publishedAt desc) { ${CASE_FIELDS} }`;

await runBatch(opts, {
  // CDN emas: holat filtri eng yangi ma'lumotga qarashi kerak.
  listCases: () => sanity.withConfig({ useCdn: false }).fetch<CaseDoc[]>(QUERY),
  render: async (doc, lang) => renderCase(doc, lang),
  gate: (file) => checkRendered(file),
  caption: (doc, lang) => makeCaption(toFacts(doc), lang, generate),
  writeJson: (file, data) => {
    mkdirSync('out', { recursive: true });
    writeFileSync(file, JSON.stringify(data, null, 2));
  },
  readManifest: () => {
    try {
      return JSON.parse(readFileSync('out/manifest.json', 'utf8')) as ManifestEntry[];
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code === 'ENOENT') return [];
      throw err;
    }
  },
  markDraft: async (doc) => {
    const renderedAt = new Date().toISOString();
    if (mockWrite || !writer) {
      console.log(`[mock] ${doc.slug}: reel.status=draft, reel.renderedAt=${renderedAt}`);
      return;
    }
    // ifRevisionId: render paytida egasi holatni o'zgartirgan bo'lsa, yozuv rad etiladi (uning qarori ustidan yozilmaydi).
    if (!doc._rev) throw new Error('_rev yo\'q — xavfsiz yozib bo\'lmaydi');
    await writer
      .patch(doc._id)
      .ifRevisionId(doc._rev)
      .setIfMissing({ reel: {} })
      .set({ 'reel.status': 'draft', 'reel.renderedAt': renderedAt })
      .commit();
  },
  log: console.log,
});

if (opts.dryRun) console.log('ℹ️  --dry-run: hech narsa render qilinmadi va yozilmadi.');
else console.log('Tayyor: out/manifest.json. Bu draft — egasi tasdiqlamaguncha hech narsa chiqmaydi (F-06).');
