import type { Metadata } from 'next';
import Script from 'next/script';
import { Locale } from '@/lib/dictionaries';
import { getLocalizedAbsoluteUrl } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import { BRAND_STRATEGY_SERVICE } from '@/lib/sales-content';
import BrandStrategyClient from './brand-strategy-client';

const BASE_URL = 'https://www.jonbranding.uz';
const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];
const ROUTE = '/brand-strategy';

const TITLE = 'Brand Strategy xizmati — Jon Branding';
const DESCRIPTION =
  'Biznes uchun positioning, auditoriya, value proposition, differentiation va brand platform ishlab chiqish. Jon Branding Brand Strategy xizmati.';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const isUz = lang === 'uz';
  const url = getLocalizedAbsoluteUrl(BASE_URL, 'uz', ROUTE);
  return {
    title: TITLE,
    description: DESCRIPTION,
    robots: { index: isUz, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url,
      siteName: 'Jon.Branding',
      type: 'website',
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630, alt: 'Brand Strategy — Jon Branding' }],
    },
  };
}

const BrandStrategyPage = async (props: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await props.params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Bosh sahifa', item: getLocalizedAbsoluteUrl(BASE_URL, safeLang) },
      { '@type': 'ListItem', position: 2, name: 'Xizmatlar', item: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/xizmatlar') },
      { '@type': 'ListItem', position: 3, name: 'Brand Strategy', item: getLocalizedAbsoluteUrl(BASE_URL, safeLang, ROUTE) },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Brand Strategy',
    provider: {
      '@type': 'Organization',
      name: 'Jon Branding',
      url: BASE_URL,
    },
    serviceType: 'Brand Strategy',
    description: DESCRIPTION,
    offers: {
      '@type': 'Offer',
      price: BRAND_STRATEGY_SERVICE.price.replace(/\s/g, ''),
      priceCurrency: 'UZS',
      availability: 'https://schema.org/InStock',
      url: getLocalizedAbsoluteUrl(BASE_URL, 'uz', ROUTE),
    },
  };

  return (
    <div className="flex-grow">
      <Script
        id="json-ld-breadcrumb-brand-strategy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(breadcrumbSchema) }}
      />
      <Script
        id="json-ld-service-brand-strategy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(serviceSchema) }}
      />
      <BrandStrategyClient />
    </div>
  );
};

export default BrandStrategyPage;
