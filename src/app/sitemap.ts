import type { MetadataRoute } from 'next';
import { fetchPortfolioList } from '@/lib/data/portfolio';
import { client } from '@/sanity/lib/client';
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

type SanityPostSitemapRecord = {
  slug?: string;
  lang?: string;
  publishedAt?: string;
  updatedAt?: string;
};

async function getSanityBlogEntries(): Promise<MetadataRoute.Sitemap> {
  let posts: SanityPostSitemapRecord[] = [];
  try {
    posts = await client.fetch(`*[_type == "post" && defined(slug.current)] {
      "slug": slug.current,
      "lang": language,
      publishedAt,
      "updatedAt": _updatedAt
    }`);
  } catch (error) {
    console.error('[sitemap] Failed to fetch Sanity posts:', error);
    return [];
  }

  const postsBySlug = new Map<string, Set<Locale>>();
  const lastModifiedBySlug = new Map<string, Date>();

  posts.forEach(({ slug, lang, publishedAt, updatedAt }) => {
    if (!slug) return;
    if (!locales.includes(lang as Locale)) return;
    const translatedLocales = postsBySlug.get(slug) ?? new Set<Locale>();
    translatedLocales.add(lang as Locale);
    postsBySlug.set(slug, translatedLocales);

    const timestamp = updatedAt || publishedAt;
    if (timestamp) {
      const parsed = new Date(timestamp);
      if (!Number.isNaN(parsed.getTime())) {
        const current = lastModifiedBySlug.get(slug);
        if (!current || parsed > current) lastModifiedBySlug.set(slug, parsed);
      }
    }
  });

  return Array.from(postsBySlug.entries()).flatMap(([slug, translatedLocales]) => {
    const availableLocales = locales.filter((lang) => translatedLocales.has(lang));
    const route = `/blog/${slug}`;

    return availableLocales.map((lang) => ({
      url: localizedUrl(lang, route),
      lastModified: lastModifiedBySlug.get(slug),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: getAlternates(route, availableLocales),
    }));
  });
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
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
      alternates: getAlternates(route),
    })),
  );

  const blogEntries = [
    ...getMarkdownBlogEntries(),
    ...(await getSanityBlogEntries()),
  ];
  const uniqueBlogEntries = Array.from(
    new Map(blogEntries.map((entry) => [entry.url, entry])).values(),
  );

  return [...staticPages, ...uniqueBlogEntries, ...(await getPortfolioEntries())];
}

export const revalidate = 300;
