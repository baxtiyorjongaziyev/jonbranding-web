import type { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { getLocalizedAbsoluteUrl, getLocaleAlternates } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import Script from 'next/script';
import AtMarquee from '@/components/sections/at-marquee';
import AtManifesto from '@/components/sections/at-manifesto';
import ServicesOverview from '@/components/service-landing/services-overview';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';
import { buildOverviewFaqs, fillOverviewTokens } from '@/lib/service-pages/overview-facts';
import { XizmatlarHero, XizmatlarServices, XizmatlarFinalCta } from './xizmatlar-interactive';

const BASE_URL = 'https://www.jonbranding.uz';
const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';
  const dictionary = await getDictionary(safeLang);
  const currency = dictionary.serviceFacts?.currency ?? '';
  const seo = dictionary.servicesPage.seo;
  const m = {
    title: fillOverviewTokens(seo.title, safeLang, currency),
    description: fillOverviewTokens(seo.description, safeLang, currency),
    keywords: fillOverviewTokens(seo.keywords, safeLang, currency),
  };
  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/xizmatlar'),
      languages: getLocaleAlternates(BASE_URL, '/xizmatlar'),
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/xizmatlar'),
      siteName: 'Jon.Branding',
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630, alt: 'Jon.Branding xizmatlari' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: ['/images/cms/og-image.jpeg'],
    },
  };
}

const ServicesPage = async (props: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await props.params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';
  const dictionary = await getDictionary(safeLang);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: safeLang === 'ru' ? 'Главная' : safeLang === 'en' ? 'Home' : safeLang === 'zh' ? '首页' : 'Bosh sahifa', item: getLocalizedAbsoluteUrl(BASE_URL, safeLang) },
      { '@type': 'ListItem', position: 2, name: safeLang === 'ru' ? 'Услуги' : safeLang === 'en' ? 'Services' : safeLang === 'zh' ? '服务' : 'Xizmatlar', item: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/xizmatlar') },
    ],
  };

  const currency = dictionary.serviceFacts?.currency ?? '';
  const overview = dictionary.servicesPage.overview;
  const seo = dictionary.servicesPage.seo;

  return (
    <div className="flex-grow">
      <ServiceJsonLd
        lang={safeLang}
        path="/xizmatlar"
        name={overview.title}
        description={fillOverviewTokens(seo.description, safeLang, currency)}
        faqs={buildOverviewFaqs(safeLang, overview, currency)}
        faqLang={safeLang}
      />
      <Script
        id="json-ld-breadcrumb-xizmatlar"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(breadcrumbSchema) }}
      />
      <XizmatlarHero lang={safeLang} dictionary={dictionary.atelier} />
      <AtMarquee lang={safeLang} />
      <AtManifesto lang={safeLang} />
      <XizmatlarServices lang={safeLang} />
      <ServicesOverview lang={safeLang} copy={overview} currency={currency} />
      <XizmatlarFinalCta lang={safeLang} />
    </div>
  );
};

export default ServicesPage;
