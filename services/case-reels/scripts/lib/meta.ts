/**
 * F-07 — Instagram Reels'ni Meta Graph API orqali chiqarish (PRD §10 Q2).
 * Oqim: video ommaviy URL'ga (Sanity CDN) → media container (REELS) → status FINISHED → media_publish → permalink.
 * Barcha tarmoq chaqiruvlari `GraphCall` orqali — testda soxta, MOCK_META=true da tarmoqqa chiqmaydi.
 */
export const GRAPH = 'https://graph.facebook.com/v21.0';

export type GraphCall = (method: 'GET' | 'POST', path: string, params: Record<string, string>) => Promise<any>;

export function graphApi(token: string): GraphCall {
  return async (method, path, params) => {
    const qs = new URLSearchParams({ ...params, access_token: token });
    const url = method === 'GET' ? `${GRAPH}/${path}?${qs}` : `${GRAPH}/${path}`;
    const res = await fetch(url, {
      method,
      ...(method === 'POST' ? { body: qs, headers: { 'content-type': 'application/x-www-form-urlencoded' } } : {}),
      signal: AbortSignal.timeout(60_000),
    });
    const json = (await res.json()) as { error?: { message: string } };
    if (!res.ok || json.error) throw new Error(`Graph ${path}: ${json.error?.message ?? res.status}`);
    return json;
  };
}

export function mockGraph(log: (m: string) => void): GraphCall {
  let n = 0;
  return async (method, path, params) => {
    log(`[mock meta] ${method} ${path} ${JSON.stringify({ ...params, caption: params.caption?.slice(0, 60) })}`);
    if (path.endsWith('/media')) return { id: `container-${++n}` };
    if (path.endsWith('/media_publish')) return { id: `media-${n}` };
    if (params.fields === 'status_code') return { status_code: 'FINISHED' };
    if (params.fields === 'permalink') return { permalink: `https://www.instagram.com/reel/mock-${n}/` };
    return {};
  };
}

export type PublishDeps = {
  graph: GraphCall;
  igUserId: string;
  sleep: (ms: number) => Promise<void>;
  /** Kutish chegarasi: Instagram videoni qayta ishlashi bir necha daqiqa olishi mumkin. */
  maxPolls?: number;
  /** media_publish'dan OLDIN: keys hali ham bizga band qilinganmi (egasi rad etmaganmi)? false bo'lsa chiqarilmaydi. */
  stillClaimed: () => Promise<boolean>;
  /** media_publish muvaffaqiyatli bo'lishi bilan darhol (permalink'dan oldin) — takroriy post bo'lmasligi uchun. */
  onPublished: (mediaId: string) => Promise<void>;
};

/** Ommaviy video URL va caption'dan Reel chiqaradi. permalink topilmasa null (post baribir chiqqan va yozilgan). */
export async function publishReel(videoUrl: string, caption: string, deps: PublishDeps): Promise<{ mediaId: string; permalink: string | null }> {
  const container = await deps.graph('POST', `${deps.igUserId}/media`, {
    media_type: 'REELS',
    video_url: videoUrl,
    caption,
    share_to_feed: 'true',
  });
  const maxPolls = deps.maxPolls ?? 30;
  for (let i = 0; ; i++) {
    const { status_code } = await deps.graph('GET', container.id, { fields: 'status_code' });
    if (status_code === 'FINISHED') break;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') throw new Error(`Instagram video qayta ishlamadi: ${status_code}`);
    if (i + 1 >= maxPolls) throw new Error('Instagram video tayyor bo\'lmadi (timeout)');
    await deps.sleep(10_000);
  }
  if (!(await deps.stillClaimed())) throw new Error("Keys holati o'zgargan (masalan rad etilgan) — chiqarilmadi");
  const published = await deps.graph('POST', `${deps.igUserId}/media_publish`, { creation_id: container.id });
  await deps.onPublished(published.id);
  try {
    const { permalink } = await deps.graph('GET', published.id, { fields: 'permalink' });
    return { mediaId: published.id, permalink: permalink ?? null };
  } catch {
    return { mediaId: published.id, permalink: null };
  }
}

/** Caption + hashtaglar; Instagram limiti 2200 belgi. */
export function igCaption(text: string, hashtags: string[]): string {
  const full = `${text}\n\n${hashtags.join(' ')}`.trim();
  if (full.length > 2200) throw new Error(`Caption ${full.length} belgi — Instagram limiti 2200`);
  return full;
}

/** Joriy slot kaliti (Toshkent, UTC+5), masalan "2026-10-26T09". Birinchi slotdan oldin — null. */
export function slotKey(now: Date, slotsHour: number[] = [9, 13, 19]): string | null {
  const local = new Date(now.getTime() + 5 * 3600_000);
  const hour = local.getUTCHours();
  const slot = [...slotsHour].reverse().find((h) => hour >= h);
  if (slot === undefined) return null;
  return `${local.toISOString().slice(0, 10)}T${String(slot).padStart(2, '0')}`;
}
