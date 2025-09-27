
import { MetadataRoute } from 'next'
import { getAllPostSlugs } from '@/lib/blog-posts';
 
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
    // Special handling for the root uz route
    if (routePath === '' && locales.includes('uz')) {
      const uzSitemap = {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
        alternates: {
          languages: {
            uz: baseUrl,
            ru: `${baseUrl}/ru`,
          },
        },
      };
      const ruSitemap = {
        url: `${baseUrl}/ru`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
         alternates: {
          languages: {
            uz: baseUrl,
            ru: `${baseUrl}/ru`,
          },
        },
      };
      return [uzSitemap, ruSitemap];
    }
    
    return locales.map((locale) => {
      // Skip uz for root as it's handled above
      if (routePath === '' && locale === 'uz') return null;

      const url = `${baseUrl}/${locale}${routePath}`.replace(/\/$/, '');
      const priority = route === '/' ? 1.0 : (route.startsWith('/xizmatlar') || route === '/blog' ? 0.9 : 0.8);
      const changeFrequency: 'daily' | 'weekly' | 'monthly' = route === '/' ? 'daily' : 'monthly';

      return {
        url: url,
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
  }).flat().filter(Boolean) as MetadataRoute.Sitemap;

  const uniqueSitemapEntries = Array.from(new Map(sitemapEntries.map(entry => [entry.url, entry])).values());


  const blogPosts = getAllPostSlugs();
  const blogEntries = blogPosts.map(post => {
      const url = `${baseUrl}/${post.lang}/blog/${post.slug}`;
      return {
          url: url,
          lastModified: new Date(), // We don't have date info here, so using current date
          changeFrequency: 'yearly' as const,
          priority: 0.7,
          alternates: {
             languages: {
              uz: `${baseUrl}/uz/blog/${post.slug}`,
              ru: `${baseUrl}/ru/blog/${post.slug}`,
            },
          }
        };
    });

  const uniqueBlogEntries = Array.from(new Map(blogEntries.map(entry => [entry.url, entry])).values());


  return [...uniqueSitemapEntries, ...uniqueBlogEntries];
}
