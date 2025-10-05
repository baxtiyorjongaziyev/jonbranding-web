
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';

type Props = {
  params: { lang: string };
};

export async function generateMetadata({ params: { lang } }: Props): Promise<Metadata> {
  const dict = await getDictionary(lang as Locale);
  const t = dict.brandStrategyPage.metadata;

  const canonicalUrl = `https://jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}xizmatlar/brand-strategy`;

  return {
    metadataBase: new URL('https://jonbranding.uz'),
    title: t.title,
    description: t.description,
    keywords: ["brend strategiyasi", "brend platformasi", "brending agentligi toshkent", "strategik brending", "biznes uchun strategiya"],
    openGraph: {
      title: t.title,
      description: t.description,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [
        {
          url: 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2',
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
      images: ['https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': 'https://jonbranding.uz/xizmatlar/brand-strategy',
        'ru': 'https://jonbranding.uz/ru/xizmatlar/brand-strategy',
        'en': 'https://jonbranding.uz/en/xizmatlar/brand-strategy',
      },
    },
  };
}

const BrandStrategyLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
  return <>{children}</>;
}

export default BrandStrategyLayout;

    