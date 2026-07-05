import { client } from '@/sanity/lib/client';
import { getPortfolioFallback, PortfolioProject } from '@/lib/portfolio-fallbacks';

const LIST_QUERY = `
  *[_type == "portfolio"] | order(order asc, publishedAt desc) {
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
    description,
    metaTitle,
    metaDescription,
    seoKeywords,
    results,
    featured,
    order
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
    order
  }
`;

export async function fetchPortfolioList(lang: string): Promise<PortfolioProject[]> {
  let sanity: PortfolioProject[] = [];
  try {
    sanity = await client.fetch(LIST_QUERY);
  } catch (e) {
    console.error('Sanity portfolio fetch failed, using fallback:', e);
  }

  const fallbacks: PortfolioProject[] = (getPortfolioFallback(lang) as PortfolioProject[]) ?? [];
  const merged = [...sanity];

  fallbacks.forEach((item) => {
    const exists = merged.some(
      (p) => p.slug === item.slug || p.title.toLowerCase() === item.title.toLowerCase()
    );
    if (!exists) merged.push(item);
  });

  return merged.sort((a, b) => {
    const aIsFallback = a._id?.startsWith('fallback-') || false;
    const bIsFallback = b._id?.startsWith('fallback-') || false;

    if (aIsFallback && !bIsFallback) return 1;
    if (!aIsFallback && bIsFallback) return -1;

    return (a.order ?? 999) - (b.order ?? 999);
  });
}

export async function fetchPortfolioBySlug(slug: string): Promise<PortfolioProject | null> {
  try {
    return await client.fetch(SLUG_QUERY, { slug });
  } catch {
    return null;
  }
}
