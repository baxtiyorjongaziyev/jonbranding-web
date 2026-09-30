import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';
import { getLocaleAlternates, getLocalizedAbsoluteUrl, type Locale } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/dictionaries';
import { pageTitle } from '@/lib/seo';

const BASE_URL = 'https://www.jonbranding.uz';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang: Locale = ['uz', 'ru', 'en', 'zh'].includes(lang) ? (lang as Locale) : 'uz';
  const canonicalUrl = getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/diagnostika');
  // Sarlavha endi har tilda o'z tilida (avval 4 tilda ham o'zbekcha edi).
  const { title: TITLE, description: DESCRIPTION } = (await getDictionary(safeLang)).diagnostics.meta;

  return {
    metadataBase: new URL(BASE_URL),
    title: pageTitle(TITLE),
    description: DESCRIPTION,
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630, alt: TITLE }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
      images: ['/images/cms/og-image.jpeg'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: getLocaleAlternates(BASE_URL, '/diagnostika'),
    },
  };
}

const DiagnosticsLayout: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;

export default DiagnosticsLayout;
