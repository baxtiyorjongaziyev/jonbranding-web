import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.jonbranding.uz';

export default function robots(): MetadataRoute.Robots {
  const protectedPaths = ['/admin/', '/studio/', '/api/'];
  const searchableBots = [
    'OAI-SearchBot',
    'ChatGPT-User',
    'PerplexityBot',
    'ClaudeBot',
    'Googlebot',
    'Bingbot',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: protectedPaths,
      },
      ...searchableBots.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: protectedPaths,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
