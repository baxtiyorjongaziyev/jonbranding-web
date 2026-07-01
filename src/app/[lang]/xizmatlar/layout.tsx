
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as Locale);
  
  const t = dict.servicesPage?.metadata || {
      title: "Xizmatlar | Jon.Branding",
      description: "Biznesingiz uchun professional brending xizmatlari.",
      keywords: "branding services"
  };

  const canonicalUrl = `https://www.jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}xizmatlar`;

  return {
    metadataBase: new URL('https://www.jonbranding.uz'),
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    openGraph: {
      title: t.title,
      description: t.description,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [
        {
          url: '/images/cms/og-image.jpeg',
          width: 1200,
          height: 630,
          alt: t.description,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
      images: ['/images/cms/og-image.jpeg'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': 'https://www.jonbranding.uz/xizmatlar',
        'ru': 'https://www.jonbranding.uz/ru/xizmatlar',
        'en': 'https://www.jonbranding.uz/en/xizmatlar',
        'zh': 'https://www.jonbranding.uz/zh/xizmatlar',
      },
    },
  };
}

const XizmatlarLayout: FC<Readonly<Props>> = ({ children }) => {
  return <>{children}</>;
}

export default XizmatlarLayout;
