/**
 * F-02 — sifat darvozasi. Sof funksiyalar; ffprobe chaqiruvi injeksiya qilinadi (testda soxta).
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

export const SPEC = { width: 1080, height: 1920, fps: 30, minSec: 7, maxSec: 20, minGallery: 2 } as const;

export type GateResult = { ok: boolean; reasons: string[] };
export type ProbeInfo = { width: number; height: number; fps: number; durationSec: number };
export type Probe = (file: string) => Promise<ProbeInfo>;

/** Render'dan oldin: galereyada kamida 2 ta rasm bo'lishi shart. */
export function checkCase(c: { gallery?: unknown[] | null }): GateResult {
  const n = Array.isArray(c.gallery) ? c.gallery.filter(Boolean).length : 0;
  return n < SPEC.minGallery ? { ok: false, reasons: [`gallery<${SPEC.minGallery}`] } : { ok: true, reasons: [] };
}

/** "30/1", "30000/1001" kabi kasrni songa aylantiradi. */
export function parseRate(rate: string): number {
  const [n, d] = rate.split('/').map(Number);
  return d ? n / d : n;
}

/** Render'dan keyin: o'lcham, fps, davomiylik. */
export function checkVideo(p: ProbeInfo): GateResult {
  const reasons: string[] = [];
  if (p.width !== SPEC.width || p.height !== SPEC.height) reasons.push(`size=${p.width}x${p.height}`);
  if (Math.abs(p.fps - SPEC.fps) > 0.001) reasons.push(`fps=${Number(p.fps.toFixed(3))}`);
  if (!(p.durationSec >= SPEC.minSec && p.durationSec <= SPEC.maxSec)) reasons.push(`duration=${p.durationSec}s`);
  return { ok: reasons.length === 0, reasons };
}

const run = promisify(execFile);

export const ffprobe: Probe = async (file) => {
  const { stdout } = await run('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate:format=duration',
    '-of', 'json', file,
  ]);
  const j = JSON.parse(stdout) as { streams?: { width: number; height: number; r_frame_rate: string }[]; format?: { duration: string } };
  const s = j.streams?.[0];
  if (!s) throw new Error(`video oqimi yo'q: ${file}`);
  return { width: s.width, height: s.height, fps: parseRate(s.r_frame_rate), durationSec: Number(j.format?.duration) };
};

export async function checkRendered(file: string, probe: Probe = ffprobe): Promise<GateResult> {
  try {
    return checkVideo(await probe(file));
  } catch (e) {
    return { ok: false, reasons: [`probe-failed: ${(e as Error).message}`] };
  }
}
