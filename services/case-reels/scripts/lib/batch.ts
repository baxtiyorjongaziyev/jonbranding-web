/**
 * F-03 — Reels'i yo'q keyslarni navbat bilan render qilish. Barcha tashqi ishlar `deps` orqali (testda soxta).
 */
import type { ReelLang } from '../../src/CaseReel';
import type { CaseDoc } from './case-data';
import { checkCase, type GateResult } from './quality-gate';

export type ManifestEntry = {
  slug: string;
  lang: ReelLang | null;
  file: string | null;
  captionFile: string | null;
  gate: GateResult;
  error?: string;
  /** Video oxirgi render qilingan vaqt: Telegram preview versiyasi shundan olinadi (video almashsa o'zgaradi). */
  renderedAt?: string;
};

export type BatchOptions = { dryRun: boolean; langs: ReelLang[]; limit?: number };

export type BatchDeps = {
  listCases: () => Promise<CaseDoc[]>;
  render: (doc: CaseDoc, lang: ReelLang) => Promise<string>;
  gate: (file: string) => Promise<GateResult>;
  caption: (doc: CaseDoc, lang: ReelLang) => Promise<unknown>;
  writeJson: (file: string, data: unknown) => void;
  /** Oldingi out/manifest.json (yo'q bo'lsa []). F-06 ko'rmagan draftlar yo'qolmasligi uchun. */
  readManifest: () => ManifestEntry[];
  markDraft: (doc: CaseDoc) => Promise<void>;
  log: (msg: string) => void;
};

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

export async function runBatch(opts: BatchOptions, deps: BatchDeps): Promise<ManifestEntry[]> {
  const manifest: ManifestEntry[] = [];
  const previous = opts.dryRun ? [] : deps.readManifest();
  // Oldingi ishga tushirishlardagi yozuvlar saqlanadi; shu safar ishlangan keyslarniki yangilanadi.
  const persist = () => {
    const touched = new Set(manifest.map((e) => e.slug));
    const merged = [...previous.filter((e) => !touched.has(e.slug)), ...manifest];
    deps.writeJson('out/manifest.json', merged);
    return merged;
  };
  const eligible: CaseDoc[] = [];
  // Avval galereya tekshiruvi, keyin --limit: aks holda yaroqsiz keys navbatni abadiy to'sib qo'yadi.
  for (const doc of await deps.listCases()) {
    const pre = checkCase(doc);
    if (pre.ok) eligible.push(doc);
    else {
      manifest.push({ slug: doc.slug, lang: null, file: null, captionFile: null, gate: pre });
      deps.log(`⏭  ${doc.slug}: ${pre.reasons.join(', ')}`);
    }
  }

  for (const doc of eligible.slice(0, opts.limit ?? Infinity)) {
    if (opts.dryRun) {
      deps.log(`• ${doc.slug} → ${opts.langs.join(', ')}`);
      continue;
    }

    let allOk = true;
    for (const lang of opts.langs) {
      const entry: ManifestEntry = { slug: doc.slug, lang, file: null, captionFile: null, gate: { ok: false, reasons: [] } };
      try {
        entry.file = await deps.render(doc, lang);
        entry.renderedAt = new Date().toISOString();
        entry.gate = await deps.gate(entry.file);
        if (entry.gate.ok) {
          entry.captionFile = `out/${doc.slug}-${lang}.caption.json`;
          deps.writeJson(entry.captionFile, await deps.caption(doc, lang));
        }
      } catch (e) {
        entry.error = errMsg(e);
      }
      if (!entry.gate.ok || entry.error) allOk = false;
      manifest.push(entry);
      deps.log(`${entry.gate.ok && !entry.error ? '✅' : '❌'} ${doc.slug} [${lang}]${entry.error ? ` — ${entry.error}` : ''}`);
    }

    // Sanity'ga faqat "draft" yoziladi va faqat barcha tillar o'tganda. approved/published — faqat egasi (F-06).
    // Draft belgisidan OLDIN manifest diskka yoziladi: batch to'xtasa ham tayyor ish F-06 uchun yo'qolmaydi.
    persist();
    if (allOk) {
      try {
        await deps.markDraft(doc);
      } catch (e) {
        deps.log(`⚠️  ${doc.slug}: Sanity'ga yozilmadi — ${errMsg(e)}`);
      }
    }
  }

  return opts.dryRun ? manifest : persist();
}

export function parseArgs(argv: string[], allLangs: readonly ReelLang[]): BatchOptions {
  const opts: BatchOptions = { dryRun: false, langs: [...allLangs] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--langs') {
      const langs = (argv[++i] ?? '').split(',').filter(Boolean) as ReelLang[];
      const bad = langs.filter((l) => !allLangs.includes(l));
      if (!langs.length || bad.length) throw new Error(`--langs noto'g'ri: ${bad.join(',') || '(bo\'sh)'}`);
      opts.langs = langs;
    } else if (a === '--limit') {
      const n = Number(argv[++i]);
      if (!Number.isInteger(n) || n < 1) throw new Error('--limit musbat butun son bo\'lishi kerak');
      opts.limit = n;
    } else throw new Error(`Noma'lum argument: ${a}`);
  }
  return opts;
}
