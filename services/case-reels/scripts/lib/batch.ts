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
};

export type BatchOptions = { dryRun: boolean; langs: ReelLang[]; limit?: number };

export type BatchDeps = {
  listCases: () => Promise<CaseDoc[]>;
  render: (doc: CaseDoc, lang: ReelLang) => Promise<string>;
  gate: (file: string) => Promise<GateResult>;
  caption: (doc: CaseDoc, lang: ReelLang) => Promise<unknown>;
  writeJson: (file: string, data: unknown) => void;
  markDraft: (doc: CaseDoc) => Promise<void>;
  log: (msg: string) => void;
};

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

export async function runBatch(opts: BatchOptions, deps: BatchDeps): Promise<ManifestEntry[]> {
  const cases = (await deps.listCases()).slice(0, opts.limit ?? Infinity);
  const manifest: ManifestEntry[] = [];

  for (const doc of cases) {
    const pre = checkCase(doc);
    if (!pre.ok) {
      manifest.push({ slug: doc.slug, lang: null, file: null, captionFile: null, gate: pre });
      deps.log(`⏭  ${doc.slug}: ${pre.reasons.join(', ')}`);
      continue;
    }
    if (opts.dryRun) {
      deps.log(`• ${doc.slug} → ${opts.langs.join(', ')}`);
      continue;
    }

    let allOk = true;
    for (const lang of opts.langs) {
      const entry: ManifestEntry = { slug: doc.slug, lang, file: null, captionFile: null, gate: { ok: false, reasons: [] } };
      try {
        entry.file = await deps.render(doc, lang);
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
    if (allOk) {
      try {
        await deps.markDraft(doc);
      } catch (e) {
        deps.log(`⚠️  ${doc.slug}: Sanity'ga yozilmadi — ${errMsg(e)}`);
      }
    }
  }

  if (!opts.dryRun) deps.writeJson('out/manifest.json', manifest);
  return manifest;
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
