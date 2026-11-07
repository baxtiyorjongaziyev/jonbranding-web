import { fetchPortfolioList } from '@/lib/data/portfolio';
import type { PortfolioProject } from '@/lib/portfolio-fallbacks';
import { serviceCategories } from '@/lib/sales-content';
import type { ServiceWork } from '@/components/service-landing/types';

type WorkSource = Pick<PortfolioProject, 'slug' | 'title' | 'client' | 'category' | 'categoryLabel' | 'coverImage'>;

/**
 * Xizmat sahifasining birinchi ekrani uchun ishlar (konversiya auditi, K-9).
 * Kategoriyalar `serviceCategories()` tartibida: neyming sahifasida avval neyming keyslari,
 * keyin brend strategiyasi. Faqat muqovasi bor tasdiqlangan keyslar — to'qima ish yo'q.
 */
export function pickServiceWorks(projects: WorkSource[], serviceKey: string, limit = 3): ServiceWork[] {
  const seen = new Set<string>();
  return serviceCategories(serviceKey)
    .flatMap((category) => projects.filter((project) => project.category === category && project.coverImage))
    .filter((project) => {
      if (seen.has(project.slug)) return false;
      seen.add(project.slug);
      return true;
    })
    .slice(0, limit)
    .map((project) => ({
      slug: project.slug,
      client: project.client || project.title,
      categoryLabel: project.categoryLabel,
      coverImage: project.coverImage,
    }));
}

export async function fetchServiceWorks(serviceKey: string, lang: string, limit = 3): Promise<ServiceWork[]> {
  if (serviceCategories(serviceKey).length === 0) return [];
  return pickServiceWorks(await fetchPortfolioList(lang), serviceKey, limit);
}
