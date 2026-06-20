import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.jonbranding.uz';
const locales = ['uz', 'ru', 'en', 'zh'] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = 'uz';

const staticRoutes = [
  '',
  '/blog',
  '/checklist',
  '/haqimizda',
  '/aloqa',
  '/privacy',
  '/quiz',
  '/pricing/sotuvchi-kartochka',
  '/sitemap',
  '/terms',
  '/portfolio',
  '/online-brief',
  '/online-brief/wizard',
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
];

function localizedUrl(lang: Locale, route: string) {
  if (lang === 'uz') {
    return `${BASE_URL}${route || '/'}`;
  }
  return `${BASE_URL}/${lang}${route}`;
}

function getMarkdownBlogEntries(): MetadataRoute.Sitemap {
  const postsDirectory = path.join(process.cwd(), 'src/posts');
  if (!fs.existsSync(postsDirectory)) return [];

  return locales.flatMap((lang) => {
    const langDirectory = path.join(postsDirectory, lang);
    if (!fs.existsSync(langDirectory)) return [];

    return fs
      .readdirSync(langDirectory)
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => ({
        url: localizedUrl(lang, `/blog/${fileName.replace(/\.md$/, '')}`),
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
        languages: Object.fromEntries(
          [
            ...locales.map((l) => [l, localizedUrl(l, `/blog/${fileName.replace(/\.md$/, '')}`)]),
            ['x-default', localizedUrl(defaultLocale, `/blog/${fileName.replace(/\.md$/, '')}`)],
          ]
        ),
      },
      }));
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Generate static localized pages with alternates
  const staticPages = staticRoutes.flatMap((route) => 
    locales.map((lang) => ({
      url: localizedUrl(lang, route),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          [
            ...locales.map((l) => [l, localizedUrl(l, route)]),
            ['x-default', localizedUrl(defaultLocale, route)],
          ]
        ),
      },
    }))
  );

  return [...staticPages, ...getMarkdownBlogEntries()];
}
