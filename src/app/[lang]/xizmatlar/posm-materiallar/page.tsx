import type { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import PosmMateriallarClient from './posm-materiallar-client';
import posmUzFallback from '@/locales/posm-uz.json';

type Props = {
  params: Promise<{ lang: string }>;
};

async function getPageTranslations(lang: string) {
  const dictionary = await getDictionary(lang as Locale);
  if (dictionary.posmPage) return dictionary.posmPage;
  return posmUzFallback;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const translations = await getPageTranslations(lang);
  const metadata = translations.metadata;
  const canonicalUrl =
    lang === 'uz'
      ? 'https://www.jonbranding.uz/xizmatlar/posm-materiallar'
      : `https://www.jonbranding.uz/${lang}/xizmatlar/posm-materiallar`;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [
        {
          url: '/images/cms/og-image.jpeg',
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: ['/images/cms/og-image.jpeg'],
    },
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const translations = await getPageTranslations(lang);

  return <PosmMateriallarClient translations={translations} />;
}
