
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
  const t = dict.corporateStylePage?.metadata || { 
    title: "Corporate Style", 
    description: "Visual identity system",
    keywords: "corporate identity, branding"
  };

  const canonicalUrl = `https://jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}xizmatlar/firmenniy-stil`;

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
        'uz': 'https://jonbranding.uz/xizmatlar/firmenniy-stil',
        'ru': 'https://jonbranding.uz/ru/xizmatlar/firmenniy-stil',
        'en': 'https://jonbranding.uz/en/xizmatlar/firmenniy-stil',
      },
    },
  };
}

const FirmenniyStilLayout: FC<Readonly<Props>> = ({ children }) => {
  return <>{children}</>;
}

export default FirmenniyStilLayout;
