import 'server-only';
import type { ServiceCase } from '@/components/service-landing/types';
import { fetchPortfolioList } from '@/lib/data/portfolio';

/**
 * Xizmat sahifasi uchun keyslar: avval mos kategoriyadagilar, yetmasa —
 * boshqa keyslar bilan to'ldiriladi. Rasm sifati kattaroq (w=1600).
 */
export async function fetchServiceCases(categories: string[] = [], limit = 6): Promise<ServiceCase[]> {
  const projects = (await fetchPortfolioList('uz')).filter((p) => p.coverImage);
  const matching = projects.filter((p) => p.category && categories.includes(p.category));
  const rest = projects.filter((p) => !matching.includes(p));
  return [...matching, ...rest].slice(0, limit).map((p) => ({
    slug: p.slug,
    title: p.title,
    client: p.client,
    image: p.coverImage.replace(/\?.*$/, '?w=1600&q=85&auto=format'),
  }));
}
