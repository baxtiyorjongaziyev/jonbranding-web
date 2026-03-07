
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
  const t = dict.logoDesignPage?.metadata || { title: "Logo Design", description: "Strategic logo design for business" };

  const canonicalUrl = `https://jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}xizmatlar/logo-dizayni`;

  return {
    metadataBase: new URL('https://jonbranding.uz'),
    title: t.title,
    description: t.description,
    keywords: ["logo dizayn", "logotip yaratish", "brending uz", "ma'no branding", "toshkentda logo", "professional logo", "mountain", "abba", "minim"],
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
        'uz': 'https://jonbranding.uz/xizmatlar/logo-dizayni',
        'ru': 'https://jonbranding.uz/ru/xizmatlar/logo-dizayni',
        'en': 'https://jonbranding.uz/en/xizmatlar/logo-dizayni',
        'zh': 'https://jonbranding.uz/zh/xizmatlar/logo-dizayni',
      },
    },
  };
}

const LogoDesignLayout: FC<Readonly<Props>> = ({ children }) => {
  return <>{children}</>;
}

export default LogoDesignLayout;
