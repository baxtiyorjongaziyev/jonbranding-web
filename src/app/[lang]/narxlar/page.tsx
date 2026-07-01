import type { Metadata } from 'next';
import Script from 'next/script';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { getLocalizedAbsoluteUrl, getLocaleAlternates } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import { fetchTestimonials } from '@/lib/data/testimonials';
import XizmatlarClient from '../xizmatlar/xizmatlar-client';

const BASE_URL = 'https://www.jonbranding.uz';
const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];

const metaByLang: Record<Locale, { title: string; description: string; keywords: string }> = {
  uz: {
    title: 'Narxlar | Jon.Branding',
    description: 'Jon.Branding narxlari va brending paketlari: xizmatlar, tariflar, kalkulyator va natijaga yo‘naltirilgan yechimlar.',
    keywords: 'narxlar, tariflar, brending paketlari, kalkulyator, Jon Branding',
  },
  ru: {
    title: 'Цены | Jon.Branding',
    description: 'Цены Jon.Branding и пакеты брендинга: услуги, тарифы, калькулятор и решения, ориентированные на результат.',
    keywords: 'цены, тарифы, брендинг пакеты, калькулятор, Jon Branding',
  },
  en: {
    title: 'Pricing | Jon.Branding',
    description: 'Jon.Branding pricing and branding packages: services, tiers, calculator and result-driven solutions.',
    keywords: 'pricing, tiers, branding packages, calculator, Jon Branding',
  },
  zh: {
    title: '价格 | Jon.Branding',
    description: 'Jon.Branding 价格与品牌套餐：服务、档位、计算器和以结果为导向的解决方案。',
    keywords: '价格, 套餐, 品牌套餐, 计算器, Jon Branding',
  },
};

const breadcrumbLabels: Record<Locale, { home: string; prices: string }> = {
  uz: { home: 'Bosh sahifa', prices: 'Narxlar' },
  ru: { home: 'Главная', prices: 'Цены' },
  en: { home: 'Home', prices: 'Pricing' },
  zh: { home: '首页', prices: '价格' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';
  const m = metaByLang[safeLang];
  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/narxlar'),
      languages: getLocaleAlternates(BASE_URL, '/narxlar'),
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/narxlar'),
      siteName: 'Jon.Branding',
    },
  };
}

const NarxlarPage = async (props: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await props.params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';
  const dictionary = await getDictionary(safeLang);
  const testimonials = await fetchTestimonials(safeLang);
  const bl = breadcrumbLabels[safeLang] ?? breadcrumbLabels.uz;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: bl.home, item: getLocalizedAbsoluteUrl(BASE_URL, safeLang) },
      { '@type': 'ListItem', position: 2, name: bl.prices, item: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/narxlar') },
    ],
  };

  return (
    <main className="flex-grow">
      <Script
        id="json-ld-breadcrumb-narxlar"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(breadcrumbSchema) }}
      />
      <XizmatlarClient lang={safeLang} dictionary={dictionary} testimonials={testimonials} />
    </main>
  );
};

export default NarxlarPage;
