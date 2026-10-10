import type { PortfolioProject } from '@/lib/portfolio-fallbacks';

// Existing project gallery, inspected 2026-10-10. Apply only to the unsuitable
// old promotional cover, so future CMS cover changes retain precedence.
const PERFONA_LOGO = 'https://cdn.sanity.io/images/h6ymmj0v/production/d7530f34143051ec24f70aa445b713ad880bd933-1280x720.jpg';

export function presentPortfolioProject<T extends PortfolioProject>(project: T): T {
  if (project.slug === 'perfona-logotip-va-brending' && project.coverImage?.includes('24f2d8b6cac168bbdd8fd3619fb58a20cf84e6aa')) {
    return { ...project, coverImage: PERFONA_LOGO };
  }
  return project;
}

// A compact home selection using existing brand artwork. Category, description,
// results and publication date always come from the actual project record.
const HOME_WORKS = [
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
    return project ? [{ ...project, coverImage: image }] : [];
  });
}

export function portfolioYear(publishedAt?: string): string {
  if (!publishedAt) return '';
  const date = new Date(publishedAt);
  return Number.isNaN(date.getTime()) ? '' : String(date.getUTCFullYear());
}
