import { MetadataRoute } from 'next'
import { getAllPostSlugs } from '@/lib/blog-posts';
import { locales, defaultLocale } from '@/lib/i18n/locale';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jonbranding.uz';

  const routes = [
    '', // Home page
    '/quiz',
    '/checklist', // New checklist page
    '/xizmatlar',
    '/xizmatlar/brand-strategy',
    '/xizmatlar/neyming',
    '/xizmatlar/firmenniy-stil',
    '/xizmatlar/logo-dizayni',
    '/xizmatlar/qadoq-dizayni',
    '/xizmatlar/patent-kalkulyatori',
    '/blog',
    '/sitemap',
    '/pricing/sotuvchi-kartochka',
  ];

  const getUrl = (locale: string, route: string) => {
    const newRoute = route.startsWith('/') ? route : `/${route}`;
    if (locale === defaultLocale) {
      return `${baseUrl}${newRoute}`;
    }
    return `${baseUrl}/${locale}${newRoute}`;
  };

  // Generate URLs for static pages
  const staticPageEntries = routes.flatMap((route) => {
    const alternates: Record<string, string> = {};
    locales.forEach(locale => {
      alternates[locale] = getUrl(locale, route);
    });

    return {
      url: getUrl(defaultLocale, route),
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' as const : 'monthly' as const,
      priority: route === '' ? 1.0 : (route.startsWith('/xizmatlar') || route === '/blog' ? 0.9 : 0.8),
      alternates: {
        languages: alternates
      }
    };
  });

  // Generate URLs for blog posts
  const blogPosts = getAllPostSlugs();
  const blogEntries = blogPosts.map(post => {
      const alternates: Record<string, string> = {};
      locales.forEach(locale => {
          alternates[locale] = getUrl(locale, `/blog/${post.slug}`);
      });
      
      return {
          url: getUrl(post.lang, `/blog/${post.slug}`),
          lastModified: new Date(),
          changeFrequency: 'yearly' as const,
          priority: 0.7,
          alternates: {
              languages: alternates
          }
      };
  });
  
  // Combine all entries and remove duplicates by URL
  const allEntries = [...staticPageEntries, ...blogEntries];
  const uniqueEntriesMap = new Map<string, MetadataRoute.Sitemap[0]>();

  allEntries.forEach(entry => {
    const existingEntry = uniqueEntriesMap.get(entry.url);
    if (!existingEntry || (existingEntry.lastModified && entry.lastModified && existingEntry.lastModified < entry.lastModified)) {
      uniqueEntriesMap.set(entry.url, entry);
    }
  });

  return Array.from(uniqueEntriesMap.values());
}
