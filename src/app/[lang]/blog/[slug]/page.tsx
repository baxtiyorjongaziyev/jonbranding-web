
import { getPostData, getAllPostSlugs } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogPostClient from '@/components/blog-post-client';
import Script from 'next/script';
import { BlogPost } from '@/lib/types';

type Props = {
  params: { slug: string; lang: string };
};

export async function generateMetadata({ params: { slug, lang } }: Props): Promise<Metadata> {
  const post = await getPostData(lang, slug);

  if (!post) {
    return {
      title: 'Maqola topilmadi',
    };
  }
  
  const canonicalUrl = `https://jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}blog/${post.slug}`;


  return {
    title: `${post.title} | Jon.Branding Blog`,
    description: post.description,
     alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': `https://jonbranding.uz/blog/${post.slug}`,
        'ru': `https://jonbranding.uz/ru/blog/${post.slug}`,
      },
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
        url: 'https://img2.teletype.in/files/92/3c/923cd394-a437-47e1-86a1-51e1a2a3eb38.png',
      },
    },
  };
};

const BlogPostPage = async ({ params: { lang, slug } }: { params: { lang: string, slug: string } }) => {
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
