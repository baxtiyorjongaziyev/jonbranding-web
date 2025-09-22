import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jonbranding.uz';

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

  const sitemapEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : (route === '/blog' || route === '/xizmatlar' ? 0.9 : 0.8),
  }));

  const blogEntries = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  return [...sitemapEntries, ...blogEntries];
}
`