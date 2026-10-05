import { Metadata } from 'next';
import { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import { getPageAlternates, pageTitle } from '@/lib/seo';
import { getDictionary } from '@/lib/dictionaries';

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  // /patent-narxi-hisoblagich shu sahifaga birlashtirildi (308) — SEO matnlar lug'atda.
  const page = (await getDictionary(safeLang)).patentCalculatorPage;
  const title: string = page.seoTitle;
  const description: string = page.seoDescription;
  const alternates = getPageAlternates(safeLang, '/xizmatlar/patent-kalkulyatori');
  return {
    title: pageTitle(title),
    description,
    alternates,
    // Ota /xizmatlar layout'ining openGraph'i (url va sarlavha) meros o'tmasligi uchun.
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: 'Jon.Branding',
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/cms/og-image.jpeg'],
    },
  };
}

export default function PatentCalculatorLayout({ children }: Props) {
  return <>{children}</>;
}
