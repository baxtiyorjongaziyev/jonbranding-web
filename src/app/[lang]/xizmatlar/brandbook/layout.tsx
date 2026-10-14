
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { pageTitle } from '@/lib/seo';
import { fillServiceFacts, getServiceFacts } from '@/lib/service-facts';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as Locale);
  const t = dict.brandbookPage?.metadata || { 
    title: "Brandbook Development", 
    description: "Rules for your brand identity",
    keywords: "brandbook, guideline"
  };

  const facts = getServiceFacts(lang, 'brandbook');
  const title = fillServiceFacts(t.title, facts);
  const description = fillServiceFacts(t.description, facts);

  const canonicalUrl = `https://www.jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}xizmatlar/brandbook`;

  return {
    metadataBase: new URL('https://www.jonbranding.uz'),
    title: pageTitle(title),
    description: description,
    keywords: t.keywords,
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [
        {
          url: '/images/cms/og-image.jpeg',
          width: 1200,
          height: 630,
          alt: description,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/images/cms/og-image.jpeg'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': 'https://www.jonbranding.uz/xizmatlar/brandbook',
        'ru': 'https://www.jonbranding.uz/ru/xizmatlar/brandbook',
        'en': 'https://www.jonbranding.uz/en/xizmatlar/brandbook',
        'zh': 'https://www.jonbranding.uz/zh/xizmatlar/brandbook',
      },
    },
  };
}

const BrandbookLayout: FC<Readonly<Props>> = ({ children }) => {
  return <>{children}</>;
}

export default BrandbookLayout;
