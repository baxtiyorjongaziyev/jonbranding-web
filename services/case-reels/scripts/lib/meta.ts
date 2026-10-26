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
};

/** Ommaviy video URL va caption'dan Reel chiqaradi; permalink qaytaradi. Xato bo'lsa throw. */
export async function publishReel(videoUrl: string, caption: string, deps: PublishDeps): Promise<{ mediaId: string; permalink: string }> {
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
  const published = await deps.graph('POST', `${deps.igUserId}/media_publish`, { creation_id: container.id });
  const { permalink } = await deps.graph('GET', published.id, { fields: 'permalink' });
  return { mediaId: published.id, permalink };
}

/** Caption + hashtaglar; Instagram limiti 2200 belgi. */
export function igCaption(text: string, hashtags: string[]): string {
  const full = `${text}\n\n${hashtags.join(' ')}`.trim();
  if (full.length > 2200) throw new Error(`Caption ${full.length} belgi — Instagram limiti 2200`);
  return full;
}

/** Bugungi slotlar (Toshkent, UTC+5) bo'yicha: shu soatda yana post chiqmagan bo'lsa true. */
export function slotOpen(now: Date, lastPublishedAt: string | null, slotsHour: number[] = [9, 13, 19]): boolean {
  const tashkentHour = (now.getUTCHours() + 5) % 24;
  const slot = [...slotsHour].reverse().find((h) => tashkentHour >= h);
  if (slot === undefined) return false;
  if (!lastPublishedAt) return true;
  // Shu slot boshlanishidan keyin allaqachon chiqarilgan bo'lsa — yopiq (kuniga 3 tadan oshmaydi).
  const slotStart = new Date(now);
  slotStart.setUTCHours(slot - 5, 0, 0, 0);
  if (slot - 5 < 0) slotStart.setUTCDate(slotStart.getUTCDate() - 1);
  return new Date(lastPublishedAt) < slotStart;
}
