import type { Metadata } from 'next';
import Script from 'next/script';
import { Locale } from '@/lib/dictionaries';
import { getLocalizedAbsoluteUrl, getLocaleAlternates } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import { EXPERT_CHECK_SERVICE } from '@/lib/sales-content';
import ExpertCheckClient from './expert-check-client';

const BASE_URL = 'https://www.jonbranding.uz';
const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];
const ROUTE = '/expert-tekshiruv';

const TITLE = 'Ekspert tekshiruv — brend nomining patent riski';
const DESCRIPTION = `Brend nomini patentga topshirishdan oldin professional risk tahlili va yozma ekspert xulosa. ${EXPERT_CHECK_SERVICE.price} so‘m, ${EXPERT_CHECK_SERVICE.duration}.`;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';
  const url = getLocalizedAbsoluteUrl(BASE_URL, safeLang, ROUTE);
  return {
    title: TITLE,
    description: DESCRIPTION,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: getLocaleAlternates(BASE_URL, ROUTE),
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url,
      siteName: 'Jon.Branding',
      type: 'website',
    },
  };
}

const ExpertCheckPage = async (props: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await props.params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Bosh sahifa', item: getLocalizedAbsoluteUrl(BASE_URL, safeLang) },
      { '@type': 'ListItem', position: 2, name: 'Narxlar', item: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/narxlar') },
      { '@type': 'ListItem', position: 3, name: 'Ekspert tekshiruv', item: getLocalizedAbsoluteUrl(BASE_URL, safeLang, ROUTE) },
    ],
  };

  return (
    <div className="flex-grow">
      <Script
        id="json-ld-breadcrumb-expert-tekshiruv"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(breadcrumbSchema) }}
      />
      <ExpertCheckClient />
    </div>
  );
};

export default ExpertCheckPage;
