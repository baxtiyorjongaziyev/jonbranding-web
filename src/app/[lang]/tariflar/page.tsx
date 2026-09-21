import type { Metadata } from 'next';
import Script from 'next/script';
import { Locale } from '@/lib/dictionaries';
import { getLocalizedAbsoluteUrl, getLocaleAlternates } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import TariflarClient from './tariflar-client';

const BASE_URL = 'https://www.jonbranding.uz';
const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];

const TITLE = 'Narxlar — Baxtiyor Gaziyev';
const DESCRIPTION =
  'Branding xizmatlari narxlari: naming, logo, visual identity, brandbook, packaging, patent. Paketlar 20 mln so‘mdan.';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
      canonical: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/tariflar'),
      languages: getLocaleAlternates(BASE_URL, '/tariflar'),
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/tariflar'),
      siteName: 'Jon.Branding',
    },
  };
}

const breadcrumbLabels = { home: 'Bosh sahifa', prices: 'Narxlar' };

const TariflarPage = async (props: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await props.params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: breadcrumbLabels.home, item: getLocalizedAbsoluteUrl(BASE_URL, safeLang) },
      { '@type': 'ListItem', position: 2, name: breadcrumbLabels.prices, item: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/tariflar') },
    ],
  };

  return (
    <div className="flex-grow">
      <Script
        id="json-ld-breadcrumb-tariflar"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(breadcrumbSchema) }}
      />
      <TariflarClient />
    </div>
  );
};

export default TariflarPage;
