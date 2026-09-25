import { client } from '@/sanity/lib/client';
import { getPortfolioFallback, PortfolioProject } from '@/lib/portfolio-fallbacks';

const LIST_QUERY = `
  *[_type == "portfolio"] | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    client,
    category,
    city,
    industry,
    tags,
    "coverImage": coverImage.asset->url + "?w=800&q=80&auto=format",
    "beforeImage": beforeImage.asset->url + "?w=1200&q=85&auto=format",
    "afterImage": afterImage.asset->url + "?w=1200&q=85&auto=format",
    "galleryImages": galleryImages[].asset->url + "?w=1200&q=80&auto=format",
    description,
    metaTitle,
    metaDescription,
    seoKeywords,
    results,
    featured,
    order,
    publishedAt,
    _updatedAt
  }
`;

const SLUG_QUERY = `
  *[_type == "portfolio" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    client,
    category,
    tags,
    "coverImage": coverImage.asset->url + "?w=1200&q=85&auto=format",
    "beforeImage": beforeImage.asset->url + "?w=1400&q=85&auto=format",
    "afterImage": afterImage.asset->url + "?w=1400&q=85&auto=format",
    description,
    metaTitle,
    metaDescription,
    seoKeywords,
    body,
    results,
    "galleryImages": galleryImages[].asset->url + "?w=1200&q=80&auto=format",
    order,
    publishedAt
  }
`;

/**
 * Sanity'dagi keys shablon (fallback) keysning o'rnini egallaganmi: bir xil slug,
 * uning davomi (`den-aroma` → `den-aroma-brend-transformatsiyasi`) yoki bir xil nom.
 * Aks holda bitta keys ikki URL'da chiqib, Google'da dublikat bo'lardi.
 */
export function supersedesFallback(
  project: Pick<PortfolioProject, 'slug' | 'title'>,
  fallback: Pick<PortfolioProject, 'slug' | 'title'>,
): boolean {
  if (!project.slug || !fallback.slug) return false;
  return (
    project.slug === fallback.slug ||
    project.slug.startsWith(`${fallback.slug}-`) ||
    project.title?.toLowerCase() === fallback.title?.toLowerCase()
  );
}

async function fetchSanityPortfolioList(): Promise<PortfolioProject[]> {
  try {
    return (await client.fetch(LIST_QUERY)) ?? [];
  } catch (e) {
    console.error('Sanity portfolio fetch failed, using fallback:', e);
    return [];
  }
}

/** Fallback slug'i Sanity'dagi keys bilan almashtirilgan bo'lsa, yangi slug. */
export async function findSupersedingSlug(lang: string, fallbackSlug: string): Promise<string | null> {
  const fallback = getPortfolioFallback(lang, fallbackSlug) as PortfolioProject | null;
  if (!fallback) return null;
  const sanity = await fetchSanityPortfolioList();
  const match = sanity.find((p) => p.slug !== fallbackSlug && supersedesFallback(p, fallback));
  return match?.slug ?? null;
}

export async function fetchPortfolioList(lang: string): Promise<PortfolioProject[]> {
  const sanity = await fetchSanityPortfolioList();

  const fallbacks: PortfolioProject[] = (getPortfolioFallback(lang) as PortfolioProject[]) ?? [];
  const merged = [...sanity];

  fallbacks.forEach((item) => {
    const exists = merged.some((p) => supersedesFallback(p, item));
    if (!exists) merged.push(item);
  });

  return merged.sort((a, b) => {
    const aIsFallback = a._id?.startsWith('fallback-') || false;
    const bIsFallback = b._id?.startsWith('fallback-') || false;

    if (aIsFallback && !bIsFallback) return 1;
    if (!aIsFallback && bIsFallback) return -1;

    // Qo'lda kiritilgan tartib (masalan 1..999) bo'lsa, uni hurmat qilamiz
    const aManual = typeof a.order === 'number' && a.order < 10000;
    const bManual = typeof b.order === 'number' && b.order < 10000;
    if (aManual && bManual) return (a.order ?? 999) - (b.order ?? 999);
    if (aManual) return -1;
    if (bManual) return 1;

    // Aks holda, eng yangi loyihalar eng birinchi chiqadi
    const aTime = new Date((a as any).publishedAt || 0).getTime();
    const bTime = new Date((b as any).publishedAt || 0).getTime();
    return bTime - aTime;
  });
}


export async function fetchPortfolioBySlug(slug: string): Promise<PortfolioProject | null> {
  try {
    return await client.fetch(SLUG_QUERY, { slug });
  } catch {
    return null;
  }
}
