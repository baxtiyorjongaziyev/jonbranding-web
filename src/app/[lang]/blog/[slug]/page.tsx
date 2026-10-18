import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import { safeJsonStringify } from '@/lib/security';
import {
  defaultLocale,
  getLocalizedAbsoluteUrl,
  locales,
} from '@/lib/i18n/locale';
import {
  ORGANIZATION_ID,
  SITE_URL,
  WEBSITE_ID,
} from '@/lib/seo';
import {
  getAllPostSlugs,
  getPostData,
} from '@/lib/blog-posts';

export const revalidate = 300;

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const query = `*[_type == "post"] { "lang": language, "slug": slug.current }`;
  const markdownSlugs = getAllPostSlugs();
  try {
    const slugs = await client.fetch(query);
    return Array.from(
      new Map(
        [...markdownSlugs, ...slugs].map((item: any) => [
          `${item.lang || 'uz'}:${item.slug}`,
          { lang: item.lang || 'uz', slug: item.slug },
        ]),
      ).values(),
    );
  } catch (error) {
    console.error('[blog] Failed to generate static params:', error);
    return markdownSlugs;
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang, slug } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const query = `*[_type == "post" && slug.current == $slug && language == $lang][0] {
    title, description, "image": image.asset->url, publishedAt,
    "updatedAt": _updatedAt, author
  }`;
  let post: any = null;
  try {
    post = await client.fetch(query, { slug, lang: safeLang });
  } catch (error) {
    console.error('[blog] Failed to fetch Sanity metadata:', error);
  }
  if (!post) {
    const markdownPost = await getPostData(safeLang, slug);
    if (markdownPost) {
      post = {
        ...markdownPost,
        publishedAt: markdownPost.date,
        updatedAt: markdownPost.date,
      };
    }
  }
  if (!post) return { title: 'Maqola topilmadi' };

  const markdownLocales = getAllPostSlugs()
    .filter((item) => item.slug === slug && locales.includes(item.lang as Locale))
    .map((item) => item.lang as Locale);
  let sanityLocales: Locale[] = [];
  try {
    sanityLocales = await client.fetch<Locale[]>(
      `*[_type == "post" && slug.current == $slug && language in $locales].language`,
      { slug, locales },
    );
  } catch (error) {
    console.error('[blog] Failed to fetch translated locales:', error);
  }
  const translatedLocales = Array.from(new Set([...markdownLocales, ...sanityLocales]));
  const availableLocales = locales.filter((locale) => translatedLocales.includes(locale));
  const canonical = getLocalizedAbsoluteUrl(SITE_URL, safeLang, `/blog/${slug}`);
  const xDefault = availableLocales.includes(defaultLocale)
    ? defaultLocale
    : safeLang;

  return {
    title: { absolute: `${post.title} | Jon.Branding` },
    description: post.description || post.title,
    authors: [{ name: post.author || 'Baxtiyorjon Gaziyev', url: `${SITE_URL}/haqimizda` }],
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ...availableLocales.map((locale) => [
          locale,
          getLocalizedAbsoluteUrl(SITE_URL, locale, `/blog/${slug}`),
        ]),
        ['x-default', getLocalizedAbsoluteUrl(SITE_URL, xDefault, `/blog/${slug}`)],
      ]),
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: canonical,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || 'Baxtiyorjon Gaziyev'],
      images: post.image
        ? [{ url: post.image, alt: post.title }]
        : [{ url: '/images/cms/og-image.jpeg', alt: 'Jon.Branding' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || post.title,
      images: [post.image || '/images/cms/og-image.jpeg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export default async function BlogPostPage(props: Props) {
  const { lang, slug } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;

  const query = `*[_type == "post" && slug.current == $slug && language == $lang][0] {
    title, description, "image": image.asset->url, publishedAt,
    "updatedAt": _updatedAt, content, author, keywords,
    sources[]{title, url, publisher}
  }`;
  let post: any = null;
  try {
    post = await client.fetch(query, { slug, lang: safeLang });
  } catch (error) {
    console.error('[blog] Failed to fetch Sanity post:', error);
  }
  if (!post) {
    const markdownPost = await getPostData(safeLang, slug);
    if (markdownPost) {
      post = {
        ...markdownPost,
        publishedAt: markdownPost.date,
        updatedAt: markdownPost.date,
        keywords: [],
        sources: [],
      };
    }
  }
  if (!post) notFound();

  const dictionary = await getDictionary(safeLang);
  const canonical = getLocalizedAbsoluteUrl(SITE_URL, safeLang, `/blog/${slug}`);
  const authorIsOrganization = !post.author || /jon[.\s]?branding/i.test(post.author);
  const author = authorIsOrganization
    ? { '@id': ORGANIZATION_ID }
    : {
        '@type': 'Person',
        '@id': `${SITE_URL}/#baxtiyorjon-gaziyev`,
        name: post.author,
        url: getLocalizedAbsoluteUrl(SITE_URL, safeLang, '/haqimizda'),
      };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: safeLang === 'uz' ? 'Bosh sahifa' : safeLang === 'ru' ? 'Главная' : 'Home', item: getLocalizedAbsoluteUrl(SITE_URL, safeLang) },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: getLocalizedAbsoluteUrl(SITE_URL, safeLang, '/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
    ],
  };

  const coverImage =
    post.image && (
      post.image.startsWith('/') ||
      /^https:\/\/(cdn\.sanity\.io|images\.unsplash\.com|cdn\.prod\.website-files\.com)\//i.test(post.image)
    )
      ? post.image
      : `${SITE_URL}/images/cms/og-image.jpeg`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonical}#article`,
    headline: post.title,
    description: post.description || post.title,
    image: coverImage,
    datePublished: post.publishedAt || post.updatedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: safeLang,
    keywords: post.keywords,
    author,
    publisher: { '@id': ORGANIZATION_ID },
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    citation: post.sources?.map((source: { url: string }) => source.url),
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 text-[#0A0B0E] relative overflow-hidden border-b border-slate-100">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[130px] pointer-events-none z-0" />
      <Script id="json-ld-breadcrumb-post" type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonStringify(breadcrumbJsonLd) }} />
      <Script id="json-ld-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonStringify(articleJsonLd) }} />

      <article className="container mx-auto px-4 max-w-3xl relative z-10">
        <Link href={`/${safeLang}/blog`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#0A0B0E] transition-colors mb-8 font-medium">
          ← {safeLang === 'uz' ? 'Blogga qaytish' : safeLang === 'ru' ? 'Назад к блогу' : safeLang === 'zh' ? '返回博客' : 'Back to blog'}
        </Link>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-widest text-slate-400">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(safeLang === 'uz' ? 'uz-UZ' : safeLang === 'ru' ? 'ru-RU' : safeLang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          )}
          <span aria-hidden="true">·</span>
          <Link href={`/${safeLang}/haqimizda`} rel="author" className="hover:text-[#0A0B0E] transition-colors">
            {post.author || 'Baxtiyorjon Gaziyev'}
          </Link>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={post.updatedAt}>
                {safeLang === 'uz' ? 'Yangilangan' : safeLang === 'ru' ? 'Обновлено' : safeLang === 'zh' ? '更新于' : 'Updated'}{' '}
                {new Date(post.updatedAt).toLocaleDateString(safeLang === 'uz' ? 'uz-UZ' : safeLang === 'ru' ? 'ru-RU' : safeLang === 'zh' ? 'zh-CN' : 'en-US')}
              </time>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-4 mb-6 leading-tight text-[#0A0B0E]">
          {post.title}
        </h1>

        {post.description && (
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">{post.description}</p>
        )}

        {coverImage && (
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-12 border border-slate-200 shadow-md">
            <Image src={coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
          </div>
        )}

        {post.content && (
          <div className="prose prose-lg max-w-none [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-[#0A0B0E] [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-[#0A0B0E] [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:mb-4 [&_blockquote]:border-l-2 [&_blockquote]:border-[#2554FF] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_li]:text-slate-700 [&_strong]:text-[#0A0B0E] [&_a]:text-[#2554FF]">
            <PortableText value={post.content} />
          </div>
        )}

        {post.htmlContent && (
          <div
            className="prose prose-lg max-w-none [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A0B0E] [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#0A0B0E] [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-slate-700 [&_li]:text-slate-700 [&_strong]:text-[#0A0B0E] [&_a]:text-[#2554FF]"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />
        )}

        {post.sources?.length > 0 && (
          <aside className="mt-14 border-t border-slate-200 pt-8" aria-labelledby="article-sources">
            <h2 id="article-sources" className="text-xl font-bold text-[#0A0B0E]">
              {safeLang === 'uz' ? 'Manbalar' : safeLang === 'ru' ? 'Источники' : safeLang === 'zh' ? '来源' : 'Sources'}
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-600">
              {post.sources.map((source: { title: string; url: string; publisher?: string }) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-[#2554FF] hover:underline">
                    {source.title}
                  </a>
                  {source.publisher ? ` — ${source.publisher}` : ''}
                </li>
              ))}
            </ol>
          </aside>
        )}

        <aside className="mt-14 border-t border-slate-200 pt-8" aria-labelledby="related-services">
          <h2 id="related-services" className="text-xl font-bold text-[#0A0B0E]">
            {dictionary.answerHub.title}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {dictionary.answerHub.items.slice(0, 4).map((item: { question: string; href: string }) => (
              <li key={item.href}>
                <Link href={`/${safeLang}${item.href}`} className="text-sm text-[#2554FF] underline underline-offset-4 hover:opacity-80">
                  {item.question}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </article>
    </div>
  );
}
