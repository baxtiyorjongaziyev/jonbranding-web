import type { NextRequest } from 'next/server';
import { getSortedPostsData } from '@/lib/blog-posts';
import { buildRssFeedXml, type BlogFeedItem } from '@/lib/blog-feed';
import { locales, type Locale } from '@/lib/i18n/locale';
import { SITE_URL } from '@/lib/seo';
import { logger } from '@/lib/logger';
import { client } from '@/sanity/lib/client';

type SanityFeedPost = {
  slug?: string;
  lang?: string;
  title?: string;
  description?: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
};

export async function GET(request: NextRequest) {
  const requestedLang = request.nextUrl.searchParams.get('lang');
  const activeLang = locales.includes(requestedLang as Locale)
    ? (requestedLang as Locale)
    : undefined;
  const targetLocales: readonly Locale[] = activeLang ? [activeLang] : locales;

  const markdownItems: BlogFeedItem[] = targetLocales.flatMap((lang) =>
    getSortedPostsData(lang).map((post) => ({
      slug: post.slug,
      lang,
      title: post.title,
      description: post.description,
      date: post.date,
      author: post.author,
    })),
  );

  let sanityPosts: SanityFeedPost[] = [];
  try {
    sanityPosts = await client.fetch<SanityFeedPost[]>(
      `*[_type == "post" && !(_id in path("drafts.**")) && defined(slug.current) && language in $targetLocales] {
        "slug": slug.current,
        "lang": language,
        title,
        description,
        publishedAt,
        "updatedAt": _updatedAt,
        author
      }`,
      { targetLocales },
    );
  } catch (error) {
    logger.warn('[feed.xml] Failed to fetch Sanity posts; serving markdown posts only', {
      reason: error instanceof Error ? error.message : String(error),
    });
  }

  const sanityItems: BlogFeedItem[] = sanityPosts
    .filter(
      (post): post is SanityFeedPost & { slug: string; title: string; lang: Locale } =>
        Boolean(post.slug && post.title && locales.includes(post.lang as Locale)),
    )
    .map((post) => ({
      slug: post.slug,
      lang: post.lang,
      title: post.title,
      description: post.description,
      date: post.publishedAt || post.updatedAt || '',
      author: post.author,
    }));

  const feedUrl = activeLang ? `${SITE_URL}/feed.xml?lang=${activeLang}` : `${SITE_URL}/feed.xml`;
  const xml = buildRssFeedXml([...markdownItems, ...sanityItems], {
    lang: activeLang,
    feedUrl,
  });

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
