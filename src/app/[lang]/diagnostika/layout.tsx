import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';
import { getLocaleAlternates, getLocalizedAbsoluteUrl, type Locale } from '@/lib/i18n/locale';

const BASE_URL = 'https://www.jonbranding.uz';
const TITLE = 'Brend diagnostikasi — biznesingiz brendi o‘sishga tayyormi?';
const DESCRIPTION =
  '7 ta savolga javob bering va 2 daqiqada brendingizdagi asosiy o‘sish nuqtasini aniqlang. Natijada biznesingizning hozirgi bosqichi va birinchi qadamlar.';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  const canonicalUrl = getLocalizedAbsoluteUrl(BASE_URL, lang as Locale, '/diagnostika');

  return {
    metadataBase: new URL(BASE_URL),
    title: TITLE,
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
