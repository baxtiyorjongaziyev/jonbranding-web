import { publicPortfolioResults } from '@/lib/portfolio-evidence';
import type { PortfolioProject } from '@/lib/portfolio-fallbacks';

// Existing project gallery, inspected 2026-10-10. Apply only to the unsuitable
// old promotional cover, so future CMS cover changes retain precedence.
const PERFONA_LOGO = 'https://cdn.sanity.io/images/h6ymmj0v/production/d7530f34143051ec24f70aa445b713ad880bd933-1280x720.jpg';

export function optimizeSanityUrl(url?: string, width = 1200, quality = 75): string {
  if (!url || typeof url !== 'string' || !url.startsWith('https://cdn.sanity.io/')) return url || '';
  const base = url.split('?')[0];
  return `${base}?w=${width}&q=${quality}&auto=format`;
}

export function presentPortfolioProject<T extends PortfolioProject>(project: T): T {
  let modified = false;
  let current = project;

  if (project.results?.length) {
    const pubResults = publicPortfolioResults(project.results);
    if (pubResults !== project.results) {
      current = { ...current, results: pubResults };
      modified = true;
    }
  }

  // The audited Den Aroma CMS case contains unattributed market-impact copy.
  // Keep its actual artwork; withhold that narrative until it has evidence.
  if ((current.slug === 'den-aroma' || current.slug.startsWith('den-aroma-')) && current.body?.length) {
    current = { ...current, body: [] };
    modified = true;
  }

  if (current.slug === 'perfona-logotip-va-brending' && current.coverImage?.includes('24f2d8b6cac168bbdd8fd3619fb58a20cf84e6aa')) {
    current = { ...current, coverImage: optimizeSanityUrl(PERFONA_LOGO, 1000, 75) };
    modified = true;
  } else if (current.coverImage?.startsWith('https://cdn.sanity.io/')) {
    const optCover = optimizeSanityUrl(current.coverImage, 1000, 75);
    if (optCover !== current.coverImage) {
      current = { ...current, coverImage: optCover };
      modified = true;
    }
  }

  if (current.beforeImage?.startsWith('https://cdn.sanity.io/')) {
    const optBefore = optimizeSanityUrl(current.beforeImage, 1200, 75);
    if (optBefore !== current.beforeImage) {
      current = { ...current, beforeImage: optBefore };
      modified = true;
    }
  }

  if (current.afterImage?.startsWith('https://cdn.sanity.io/')) {
    const optAfter = optimizeSanityUrl(current.afterImage, 1200, 75);
    if (optAfter !== current.afterImage) {
      current = { ...current, afterImage: optAfter };
      modified = true;
    }
  }

  if (Array.isArray(current.galleryImages) && current.galleryImages.some((img) => img?.startsWith('https://cdn.sanity.io/'))) {
    const optGallery = current.galleryImages.map((img) => optimizeSanityUrl(img, 1200, 75));
    current = { ...current, galleryImages: optGallery };
    modified = true;
  }

  return modified ? current : project;
}

// A compact home selection using existing brand artwork. Category, description,
// results and publication date always come from the actual project record.
const HOME_WORKS = [
  { slug: 'rashmilk', image: '/images/cms/portfolio/rashmilk/rashmilk-sut-1.jpg' },
  { slug: 'shirona', image: '/images/cms/portfolio/shirona/shirona-cover.jpg' },
  { slug: 'savod', image: '/images/cms/portfolio/savod/savod-cover.png' },
  { slug: 'den-aroma', image: '/images/cms/denaroma-hozir.webp' },
  { slug: 'fidda', image: '/images/cms/fidda-hozir.webp' },
  { slug: 'boyarin', image: '/images/cms/boyarin-hozir.webp' },
  { slug: 'arfadel', image: '/images/cms/arfadel-cover.webp' },
  { slug: 'enros', image: '/images/cms/enros-cover.webp' },
  { slug: 'beyaz', image: '/images/cms/beyaz-cover.webp' },
] as const;

export function selectHomePortfolioProjects<T extends { slug: string; coverImage: string }>(projects: T[]): T[] {
  return HOME_WORKS.flatMap(({ slug, image }) => {
    const project = projects.find((p) => p.slug === slug || p.slug.startsWith(`${slug}-`));
    if (!project) return [];
    const coverImage = (project.coverImage?.startsWith('https://cdn.sanity.io/') ? project.coverImage : image) || project.coverImage;
    return [{ ...project, coverImage }];
  });
}

export function portfolioYear(publishedAt?: string): string {
  if (!publishedAt) return '';
  const date = new Date(publishedAt);
  return Number.isNaN(date.getTime()) ? '' : String(date.getUTCFullYear());
}
