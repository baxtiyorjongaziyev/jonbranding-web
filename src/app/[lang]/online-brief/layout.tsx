import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as Locale);
  const t = dict.onlineBrief?.meta || { title: "Onlayn Smart Brief", description: "Smart brief for your brand." };

  const canonicalUrl = `https://www.jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}online-brief`;

  return {
    metadataBase: new URL('https://www.jonbranding.uz'),
    title: t.title,
    description: t.description,
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
        'uz': 'https://www.jonbranding.uz/online-brief',
        'ru': 'https://www.jonbranding.uz/ru/online-brief',
        'en': 'https://www.jonbranding.uz/en/online-brief',
        'zh': 'https://www.jonbranding.uz/zh/online-brief',
      },
    },
  };
}

const OnlineBriefLayout: FC<Readonly<{ children: ReactNode, params: Promise<{ lang: string }> }>> = ({ children }) => {
  return <>{children}</>;
}

export default OnlineBriefLayout;
