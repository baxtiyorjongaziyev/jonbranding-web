
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const isRu = lang === 'ru';
  const t = {
    uz: {
      title: "Blog | Jon.Branding",
      description: "Brending, marketing va dizayn olamidagi so'nggi yangiliklar, maslahatlar va tahliliy maqolalar. Biznesingizni o'stirishga yordam beramiz."
    },
    ru: {
      title: "Ð‘Ð»Ð¾Ð³ | Jon.Branding",
      description: "ÐŸÐ¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ Ð½Ð¾Ð²Ð¾ÑÑ‚Ð¸, ÑÐ¾Ð²ÐµÑ‚Ñ‹ Ð¸ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ ÑÑ‚Ð°Ñ‚ÑŒÐ¸ Ð¸Ð· Ð¼Ð¸Ñ€Ð° Ð±Ñ€ÐµÐ½Ð´Ð¸Ð½Ð³Ð°, Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¸Ð½Ð³Ð° Ð¸ Ð´Ð¸Ð·Ð°Ð¹Ð½Ð°. ÐŸÐ¾Ð¼Ð¾Ð³Ð°ÐµÐ¼ Ð²Ð°ÑˆÐµÐ¼Ñƒ Ð±Ð¸Ð·Ð½ÐµÑÑƒ Ñ€Ð°ÑÑ‚Ð¸."
    },
    en: {
      title: "Blog | Jon.Branding",
      description: "Latest news, tips and analytical articles from the world of branding, marketing and design. We help your business grow."
    }
  };
  // @ts-ignore
  const translations = t[lang as keyof typeof t] || t.uz;
  const canonicalUrl = `https://www.jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}blog`;

  return {
    metadataBase: new URL('https://www.jonbranding.uz'),
    title: translations.title,
    description: translations.description,
    openGraph: {
      title: translations.title,
      description: translations.description,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [
        {
          url: '/images/cms/og-image.jpeg',
          width: 1200,
          height: 630,
          alt: translations.description,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: translations.title,
      description: translations.description,
      images: ['/images/cms/og-image.jpeg'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': 'https://www.jonbranding.uz/blog',
        'ru': 'https://www.jonbranding.uz/ru/blog',
        'en': 'https://www.jonbranding.uz/en/blog',
      },
    },
  };
}

const BlogLayout: FC<Readonly<{ children: ReactNode, params: Promise<{ lang: string }> }>> = ({ children }) => {
  return <>{children}</>;
}

export default BlogLayout;
