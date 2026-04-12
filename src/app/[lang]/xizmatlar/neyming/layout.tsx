import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);
  const t = dict.namingPage?.metadata || { 
    title: "Naming Services", 
    description: "Professional naming for your brand",
    keywords: "naming, brand name, branding"
  };

  const canonicalUrl = `https://jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}xizmatlar/neyming`;

  return {
    metadataBase: new URL('https://jonbranding.uz'),
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
        'uz': 'https://jonbranding.uz/xizmatlar/neyming',
        'ru': 'https://jonbranding.uz/ru/xizmatlar/neyming',
        'en': 'https://jonbranding.uz/en/xizmatlar/neyming',
        'zh': 'https://jonbranding.uz/zh/xizmatlar/neyming',
      },
    },
  };
}

const NamingLayout: FC<Readonly<Props>> = ({ children }) => {
  return <>{children}</>;
}

export default NamingLayout;