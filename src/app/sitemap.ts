
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
      const urlUz = route === '/' ? baseUrl : `${baseUrl}${route}`;
      const urlRu = route === '/' ? `${baseUrl}/ru` : `${baseUrl}/ru${route}`;
      
      const priority = route === '/' ? 1.0 : (route.startsWith('/xizmatlar') || route === '/blog' ? 0.9 : 0.8);
      const changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = route === '/' ? 'daily' : 'monthly';

      return {
        url: urlUz,
        lastModified: new Date(),
        changeFrequency: changeFrequency,
        priority: priority,
        alternates: {
          languages: {
            uz: urlUz,
            ru: urlRu,
            'x-default': urlUz,
          },
        },
      };
    });


  const blogPosts = getSortedPostsData();
  const blogEntries = blogPosts.map(post => {
      const urlUz = `${baseUrl}/blog/${post.slug}`;
      const urlRu = `${baseUrl}/ru/blog/${post.slug}`;
      
      return {
        url: urlUz,
        lastModified: new Date(post.date),
        changeFrequency: 'yearly' as const,
        priority: 0.7,
        alternates: {
           languages: {
            uz: urlUz,
            ru: urlRu,
            'x-default': urlUz,
          },
        }
      };
    });

  // Since alternates are handled within each entry, we can flatten everything,
  // but we need to avoid duplicate canonical URLs.
  // The current logic creates entries for each locale for each route, which is not ideal.
  // Let's create one entry per canonical URL with alternates.

  return [...sitemapEntries, ...blogEntries];
}
