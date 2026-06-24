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
    "coverImage": coverImage.asset->url,
    "beforeImage": beforeImage.asset->url,
    "afterImage": afterImage.asset->url,
    description,
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
    "coverImage": coverImage.asset->url,
    "beforeImage": beforeImage.asset->url,
    "afterImage": afterImage.asset->url,
    description,
    body,
    results,
    "galleryImages": galleryImages[].asset->url,
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

  return merged.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function fetchPortfolioBySlug(slug: string): Promise<PortfolioProject | null> {
  try {
    return await client.fetch(SLUG_QUERY, { slug });
  } catch {
    return null;
  }
}
