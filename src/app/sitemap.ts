
import { MetadataRoute } from 'next'
import { getAllPostSlugs } from '@/lib/blog-posts';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jonbranding.uz';

  const locales = ['uz', 'ru', 'en'];

  const routes = [
    '/',
    '/quiz',
    '/xizmatlar',
    '/xizmatlar/brand-strategy',
    '/xizmatlar/neyming',
    '/xizmatlar/firmenniy-stil',
    '/xizmatlar/logo-dizayni',
    '/xizmatlar/qadoq-dizayni',
    '/xizmatlar/patent-kalkulyatori',
    '/blog',
    '/sitemap', // Added sitemap page
  ];

  const sitemapEntries = locales.flatMap((locale) =>
    routes.map((route) => {
      const isDefaultLang = locale === 'uz';
      const routePath = route === '/' ? '' : route;

      // Handle root URL for default language
      if (routePath === '' && isDefaultLang) {
        return {
          url: baseUrl,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 1.0,
          alternates: {
            languages: {
              uz: baseUrl,
              ru: `${baseUrl}/ru`,
              en: `${baseUrl}/en`,
            },
          },
        };
      }

      // Skip creating default lang URL with prefix for root
      if (routePath === '' && !isDefaultLang) {
         return {
          url: `${baseUrl}/${locale}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 1.0,
           alternates: {
            languages: {
              uz: baseUrl,
              ru: `${baseUrl}/ru`,
              en: `${baseUrl}/en`,
            },
          },
        };
      }
      
      if (routePath === '') return null; // Already handled

      const url = `${baseUrl}/${locale}${routePath}`;
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
            en: `${baseUrl}/en${routePath}`,
          },
        },
      };
    })
  ).flat().filter(Boolean) as MetadataRoute.Sitemap;

  // Remove duplicates that might be created by the logic
  const uniqueSitemapEntries = Array.from(new Map(sitemapEntries.map(entry => [entry.url, entry])).values());


  const blogPosts = getAllPostSlugs();
  const blogEntries = locales.flatMap(locale => 
      blogPosts
        .filter(post => post.lang === locale)
        .map(post => {
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
                  en: `${baseUrl}/en/blog/${post.slug}`, // Assuming you will have EN blog posts
                },
              }
            };
        })
    );

  const uniqueBlogEntries = Array.from(new Map(blogEntries.map(entry => [entry.url, entry])).values());


  return [...uniqueSitemapEntries, ...uniqueBlogEntries];
}
