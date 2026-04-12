import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://jonbranding.uz';
const locales = ['uz', 'ru', 'en', 'zh'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/calculator', '/blog', '/contact', '/about'];
  const services = [
    '/xizmatlar/neymaing',
    '/xizmatlar/logo-dizayn',
    '/xizmatlar/brend-strategiya',
    '/xizmatlar/firmenniy-stil',
    '/xizmatlar/qadoqlash-dizayni',
    '/xizmatlar/reklam-kampaniyasi'
  ];

  const allRoutes = [...routes, ...services];
  
  // 1. Generate static localized pages
  const staticPages = locales.flatMap((lang) => 
    allRoutes.map((route) => ({
      url: `${BASE_URL}/${lang}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  );

  // 2. Generate blog post pages dynamically
  const blogPosts: any[] = [];
  locales.forEach((lang) => {
    const postsDir = path.join(process.cwd(), 'src/posts', lang);
    if (fs.existsSync(postsDir)) {
      const files = fs.readdirSync(postsDir);
      files.forEach((file) => {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          blogPosts.push({
            url: `${BASE_URL}/${lang}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          });
        }
      });
    }
  });

  return [...staticPages, ...blogPosts];
}
