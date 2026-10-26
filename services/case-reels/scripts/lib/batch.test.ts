import { describe, expect, it, vi } from 'vitest';
import { parseArgs, runBatch, type BatchDeps } from './batch';
import type { CaseDoc } from './case-data';

const LANGS = ['uz', 'ru', 'en', 'zh'] as const;
const doc = (slug: string, gallery = ['a', 'b']): CaseDoc => ({ _id: `id-${slug}`, slug, title: slug, gallery });

function deps(cases: CaseDoc[], over: Partial<BatchDeps> = {}) {
  const d = {
    listCases: vi.fn(async () => cases),
    render: vi.fn(async (c: CaseDoc, l: string) => `out/${c.slug}-${l}.mp4`),
    gate: vi.fn(async () => ({ ok: true, reasons: [] })),
    caption: vi.fn(async (_c: CaseDoc, lang) => ({ lang, text: 't', hashtags: [], needsReview: [], source: 'template', errors: [] })),
    writeJson: vi.fn(),
    readManifest: vi.fn(() => []),
    markDraft: vi.fn(async () => {}),
    log: vi.fn(),
    ...over,
  };
  return d as typeof d & BatchDeps;
}

describe('runBatch', () => {
  it('dry-run renders, writes and marks nothing', async () => {
    const d = deps([doc('a'), doc('b')]);
    const m = await runBatch({ dryRun: true, langs: ['uz'] }, d);
    expect(d.render).not.toHaveBeenCalled();
    expect(d.writeJson).not.toHaveBeenCalled();
    expect(d.markDraft).not.toHaveBeenCalled();
    expect(m).toEqual([]);
  });

  it('skips cases with fewer than 2 gallery images', async () => {
    const d = deps([doc('thin', ['a'])]);
    const m = await runBatch({ dryRun: false, langs: ['uz'] }, d);
    expect(d.render).not.toHaveBeenCalled();
    expect(m).toEqual([{ slug: 'thin', lang: null, file: null, captionFile: null, gate: { ok: false, reasons: ['gallery<2'] } }]);
  });

  it('one failing case does not stop the others', async () => {
    const d = deps([doc('bad'), doc('good')], {
      render: vi.fn(async (c: CaseDoc, l) => {
        if (c.slug === 'bad') throw new Error('remotion crashed');
        return `out/${c.slug}-${l}.mp4`;
      }),
    });
    const m = await runBatch({ dryRun: false, langs: ['uz', 'ru'] }, d);
    expect(m.filter((e) => e.slug === 'bad').every((e) => e.error === 'remotion crashed')).toBe(true);
    expect(m.filter((e) => e.slug === 'good').every((e) => e.gate.ok && !e.error)).toBe(true);
    expect(d.markDraft).toHaveBeenCalledTimes(1);
    expect(d.markDraft).toHaveBeenCalledWith(expect.objectContaining({ slug: 'good' }));
  });

  it('gate failure: no caption, no draft mark', async () => {
    const d = deps([doc('a')], { gate: vi.fn(async () => ({ ok: false, reasons: ['duration=25s'] })) });
    const m = await runBatch({ dryRun: false, langs: ['uz'] }, d);
    expect(d.caption).not.toHaveBeenCalled();
    expect(d.markDraft).not.toHaveBeenCalled();
    expect(m[0]).toMatchObject({ captionFile: null, gate: { ok: false, reasons: ['duration=25s'] } });
  });

  it('writes manifest with the documented shape', async () => {
    const d = deps([doc('a')]);
    await runBatch({ dryRun: false, langs: ['uz'] }, d);
    expect(d.writeJson).toHaveBeenCalledWith('out/manifest.json', [
      { slug: 'a', lang: 'uz', file: 'out/a-uz.mp4', captionFile: 'out/a-uz.caption.json', gate: { ok: true, reasons: [] } },
    ]);
  });

  it('a Sanity write error is logged, not thrown', async () => {
    const d = deps([doc('a')], { markDraft: vi.fn(async () => { throw new Error('403'); }) });
    await expect(runBatch({ dryRun: false, langs: ['uz'] }, d)).resolves.toHaveLength(1);
    expect(d.log).toHaveBeenCalledWith(expect.stringContaining('403'));
  });

  it('applies --limit to eligible cases only', async () => {
    const d = deps([doc('thin', ['a']), doc('ok')]);
    await runBatch({ dryRun: false, langs: ['uz'], limit: 1 }, d);
    expect(d.render).toHaveBeenCalledWith(expect.objectContaining({ slug: 'ok' }), 'uz');
  });

  it('keeps earlier manifest entries and replaces re-processed slugs', async () => {
    const old = { slug: 'prev', lang: 'uz' as const, file: 'out/prev-uz.mp4', captionFile: 'c', gate: { ok: true, reasons: [] } };
    const stale = { ...old, slug: 'a', file: 'old' };
    const d = deps([doc('a')], { readManifest: vi.fn(() => [old, stale]) });
    const m = await runBatch({ dryRun: false, langs: ['uz'] }, d);
    expect(m.map((e) => [e.slug, e.file])).toEqual([['prev', 'out/prev-uz.mp4'], ['a', 'out/a-uz.mp4']]);
  });

  it('writes the manifest before marking a case as draft', async () => {
    const order: string[] = [];
    const d = deps([doc('a')], {
      writeJson: vi.fn((f: string) => { if (f === 'out/manifest.json') order.push('manifest'); }),
      markDraft: vi.fn(async () => { order.push('draft'); }),
    });
    await runBatch({ dryRun: false, langs: ['uz'] }, d);
    expect(order.slice(0, 2)).toEqual(['manifest', 'draft']);
  });

  it('respects --limit', async () => {
    const d = deps([doc('a'), doc('b'), doc('c')]);
    await runBatch({ dryRun: false, langs: ['uz'], limit: 2 }, d);
    expect(d.render).toHaveBeenCalledTimes(2);
  });
});

describe('parseArgs', () => {
  it('defaults to all languages', () => expect(parseArgs([], LANGS)).toEqual({ dryRun: false, langs: [...LANGS] }));
  it('parses flags', () =>
    expect(parseArgs(['--dry-run', '--langs', 'uz,ru', '--limit', '3'], LANGS)).toEqual({ dryRun: true, langs: ['uz', 'ru'], limit: 3 }));
  it('rejects unknown language and bad limit', () => {
    expect(() => parseArgs(['--langs', 'uz,fr'], LANGS)).toThrow(/fr/);
    expect(() => parseArgs(['--limit', '0'], LANGS)).toThrow();
    expect(() => parseArgs(['--foo'], LANGS)).toThrow();
  });
});
