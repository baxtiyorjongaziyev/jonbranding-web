
import { getPostData, getAllPostSlugs } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogPostClient from '@/components/blog-post-client';
import Script from 'next/script';
import { BlogPost } from '@/lib/types';
import { Locale } from '@/lib/dictionaries';
import {
  defaultLocale,
  getLocalizedAbsoluteUrl,
  getLocaleAlternates,
  locales,
} from '@/lib/i18n/locale';

type Props = {
  params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug, lang } = await props.params;
  const safeLang = locales.includes(lang as Locale) ? (lang as Locale) : defaultLocale;
  const post = await getPostData(safeLang, slug);

  if (!post) {
    return {
      title: 'Maqola topilmadi',
    };
  }
  const canonicalPath = `/blog/${post.slug}`;
  const canonicalUrl = getLocalizedAbsoluteUrl('https://www.jonbranding.uz', safeLang, canonicalPath);


  return {
    title: `${post.title} | Jon.Branding Blog`,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
      languages: getLocaleAlternates('https://www.jonbranding.uz', canonicalPath),
    },
    openGraph: {
      title: `${post.title} | Jon.Branding Blog`,
      description: post.description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Jon.Branding Blog`,
      description: post.description,
      images: [post.image],
    },
  };
}

const generateJsonLd = (post: BlogPost) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Jon.Branding',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cdn.sanity.io/images/h6ymmj0v/production/72162c1dda9eef2ea1d02ef7c5e14bc45659eafe-741x174.png',
      },
    },
  };
};

const BlogPostPage = async (props: Props) => {
  const { lang, slug } = await props.params;
  const post = await getPostData(lang, slug);

  if (!post) {
    notFound();
  }
  
  const jsonLd = generateJsonLd(post);

  return (
    <>
      <Script
        id="blog-post-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} />
    </>
  );
};

export default BlogPostPage;
