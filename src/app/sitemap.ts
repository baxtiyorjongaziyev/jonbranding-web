
import { MetadataRoute } from 'next'
import { getSortedPostsData } from '@/lib/blog-posts';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jonbranding.uz';

  const locales = ['uz', 'ru'];

  const routes = [
    '/',
    '/quiz',
    '/xizmatlar',
    '/xizmatlar/brand-strategy',
    '/xizmatlar/neyming',
    '/xizmatlar/firmenniy-stil',
    '/xizmatlar/qadoq-dizayni',
    '/blog',
  ];

  const sitemapEntries = routes.flatMap((route) => {
    const routePath = route === '/' ? '' : route;
    return locales.map((locale) => {
      const url = `${baseUrl}/${locale}${routePath}`.replace(`/${locale}/`, `/${locale}/`).replace(/\/$/, '');
      const priority = route === '/' ? 1.0 : (route.startsWith('/xizmatlar') || route === '/blog' ? 0.9 : 0.8);
      const changeFrequency: 'daily' | 'weekly' | 'monthly' = route === '/' ? 'daily' : 'monthly';

      return {
        url: url.endsWith('/uz') ? baseUrl : url, // root for uz
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: {
            uz: `${baseUrl}${routePath}`,
            ru: `${baseUrl}/ru${routePath}`,
          },
        },
      };
    });
  });

  const uniqueSitemapEntries = Array.from(new Map(sitemapEntries.map(entry => [entry.url, entry])).values());


  const blogPosts = getSortedPostsData();
  const blogEntries = blogPosts.flatMap(post => {
      return locales.map(locale => {
        const url = `${baseUrl}/${locale}/blog/${post.slug}`;
        return {
            url: url,
            lastModified: new Date(post.date),
            changeFrequency: 'yearly' as const,
            priority: 0.7,
            alternates: {
               languages: {
                uz: `${baseUrl}/blog/${post.slug}`,
                ru: `${baseUrl}/ru/blog/${post.slug}`,
              },
            }
          };
      });
    });

  const uniqueBlogEntries = Array.from(new Map(blogEntries.map(entry => [entry.url, entry])).values());


  return [...uniqueSitemapEntries, ...uniqueBlogEntries];
}
