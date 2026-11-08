/** Sanity'dagi portfolio hujjatidan render props va caption faktlarini yasash (render, caption, batch uchun umumiy). */
import type { CaseReelProps, ReelLang } from '../../src/CaseReel';
import type { CaptionFacts } from './caption';
import { approvedResult, type Result } from './sanity';

export const IMG = '?w=1080&h=1920&fit=crop&auto=format';

export const CASE_FIELDS = `_id, _rev, "slug": slug.current, client, title, category, city, industry, description,
  "beforeImage": beforeImage.asset->url + "${IMG}",
  "afterImage": afterImage.asset->url + "${IMG}",
  "gallery": galleryImages[defined(asset)].asset->url,
  results`;

export type CaseDoc = {
  _id: string;
  _rev?: string;
  slug: string;
  client?: string | null;
  title: string;
  category?: string | null;
  city?: string | null;
  industry?: string | null;
  description?: unknown;
  beforeImage?: string | null;
  afterImage?: string | null;
  gallery?: (string | null)[] | null;
  results?: Result[];
};

export function toProps(doc: CaseDoc, lang: ReelLang): CaseReelProps {
  const r = approvedResult(doc.results);
  return {
    lang,
    client: doc.client ?? doc.title,
    title: doc.title,
    // Sanity'da bo'lmasa yorliq ko'rsatilmaydi — to'qima kategoriya yo'q.
    category: doc.category ?? null,
    beforeImage: doc.beforeImage ?? null,
    afterImage: doc.afterImage ?? null,
    gallery: (doc.gallery ?? []).filter((u): u is string => Boolean(u)).map((u) => `${u}${IMG}`),
    result: r ? { metric: r.metric!, value: r.value! } : null,
  };
}

export function toFacts(doc: CaseDoc): CaptionFacts {
  const r = approvedResult(doc.results);
  return {
    client: doc.client ?? doc.title,
    title: doc.title,
    category: doc.category ?? undefined,
    city: doc.city ?? undefined,
    industry: doc.industry ?? undefined,
    description: typeof doc.description === 'string' ? doc.description.slice(0, 600) : undefined,
    result: r ? { metric: r.metric!, value: r.value!, period: r.period! } : null,
    url: `https://jonbranding.uz/uz/portfolio/${doc.slug}`,
  };
}
