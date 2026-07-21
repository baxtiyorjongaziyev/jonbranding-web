import type { MetadataRoute } from 'next';
import { fetchPortfolioList } from '@/lib/data/portfolio';
import { getAllPostSlugs } from '@/lib/blog-posts';
import {
  defaultLocale,
  getLocalizedAbsoluteUrl,
  locales,
  type Locale,
} from '@/lib/i18n/locale';

const BASE_URL = 'https://www.jonbranding.uz';

const staticRoutes = [
  '',
  '/blog',
  '/checklist',
  '/diagnostika',
  '/haqimizda',
  '/aloqa',
  '/privacy',
  '/quiz',
  '/sitemap',
  '/terms',
  '/portfolio',
  '/online-brief',
  '/online-brief/wizard',
  '/pricing/sotuvchi-kartochka',
  '/narxlar',
  '/xizmatlar',
  '/xizmatlar/neyming',
  '/xizmatlar/logo-dizayni',
  '/xizmatlar/brand-strategiyasi',
  '/xizmatlar/firmenniy-stil',
  '/xizmatlar/qadoq-dizayni',
  '/xizmatlar/car-wrap-design',
  '/xizmatlar/posm-materiallar',
  '/xizmatlar/brandbook',
  '/xizmatlar/patent-kalkulyatori',
] as const;

function localizedUrl(lang: Locale, route: string) {
  return getLocalizedAbsoluteUrl(BASE_URL, lang, route || '/');
}

function getAlternates(route: string, availableLocales: readonly Locale[] = locales) {
  const xDefaultLocale = availableLocales.includes(defaultLocale)
    ? defaultLocale
    : availableLocales[0];

  return {
    languages: Object.fromEntries([
      ...availableLocales.map((lang) => [lang, localizedUrl(lang, route)]),
      ['x-default', localizedUrl(xDefaultLocale, route)],
    ]),
  };
}

function getMarkdownBlogEntries(): MetadataRoute.Sitemap {
  const postsBySlug = new Map<string, Set<Locale>>();

  getAllPostSlugs().forEach(({ slug, lang }) => {
    if (!locales.includes(lang as Locale)) return;
    const translatedLocales = postsBySlug.get(slug) ?? new Set<Locale>();
    translatedLocales.add(lang as Locale);
    postsBySlug.set(slug, translatedLocales);
  });

  return Array.from(postsBySlug.entries()).flatMap(([slug, translatedLocales]) => {
    const availableLocales = locales.filter((lang) => translatedLocales.has(lang));
    const route = `/blog/${slug}`;

    return availableLocales.map((lang) => ({
      url: localizedUrl(lang, route),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: getAlternates(route, availableLocales),
    }));
  });
}

async function getPortfolioEntries(): Promise<MetadataRoute.Sitemap> {
  const projectsBySlug = new Map<string, Set<Locale>>();
  const projectsByLocale = await Promise.all(
    locales.map(async (lang) => [lang, await fetchPortfolioList(lang)] as const),
  );

  projectsByLocale.forEach(([lang, projects]) => {
    projects.forEach(({ slug }) => {
      if (!slug) return;
      const availableLocales = projectsBySlug.get(slug) ?? new Set<Locale>();
      availableLocales.add(lang);
      projectsBySlug.set(slug, availableLocales);
    });
  });

  return Array.from(projectsBySlug.entries()).flatMap(([slug, translatedLocales]) => {
    const availableLocales = locales.filter((lang) => translatedLocales.has(lang));
    const route = `/portfolio/${slug}`;

    return availableLocales.map((lang) => ({
      url: localizedUrl(lang, route),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: getAlternates(route, availableLocales),
    }));
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = staticRoutes.flatMap((route) =>
    locales.map((lang) => ({
      url: localizedUrl(lang, route),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
      alternates: getAlternates(route),
    })),
  );

  return [...staticPages, ...getMarkdownBlogEntries(), ...(await getPortfolioEntries())];
}
