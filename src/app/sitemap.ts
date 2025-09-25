
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

  const sitemapEntries = locales.flatMap((locale) => 
    routes.map((route) => {
      const url = locale === 'uz' 
        ? `${baseUrl}${route}`
        : `${baseUrl}/${locale}${route}`;
      
      const priority = route === '/' ? 1 : (route === '/blog' || route === '/xizmatlar' ? 0.9 : 0.8);
      
      return {
        url: url,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: priority,
        alternates: {
          languages: {
            uz: `${baseUrl}${route}`,
            ru: `${baseUrl}/ru${route}`,
          },
        },
      };
    })
  );


  const blogPosts = getSortedPostsData();
  const blogEntries = locales.flatMap((locale) => 
    blogPosts.map(post => {
      const url = locale === 'uz' 
        ? `${baseUrl}/blog/${post.slug}`
        : `${baseUrl}/${locale}/blog/${post.slug}`;
      
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
    })
  );

  return [...sitemapEntries, ...blogEntries];
}
