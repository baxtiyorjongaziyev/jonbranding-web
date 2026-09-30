import type { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import PosmMateriallarClient from './posm-materiallar-client';
import posmUz from '@/locales/posm-uz.json';
import posmRu from '@/locales/posm-ru.json';
import posmEn from '@/locales/posm-en.json';
import posmZh from '@/locales/posm-zh.json';
import { getPageAlternates, pageTitle } from '@/lib/seo';

type Props = {
  params: Promise<{ lang: string }>;
};

// Oldin ru/en/zh sahifalar ham o'zbekcha matn bilan chiqardi.
const POSM_BY_LANG: Record<string, typeof posmUz> = { uz: posmUz, ru: posmRu, en: posmEn, zh: posmZh };

async function getPageTranslations(lang: string) {
  const dictionary = await getDictionary(lang as Locale);
  if (dictionary.posmPage) return dictionary.posmPage;
  return POSM_BY_LANG[lang] ?? posmUz;
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
    title: pageTitle(metadata.title),
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: getPageAlternates(
      (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale,
      '/xizmatlar/posm-materiallar',
    ),
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
