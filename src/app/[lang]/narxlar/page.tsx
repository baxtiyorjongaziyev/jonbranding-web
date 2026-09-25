import type { Metadata } from 'next';
import Script from 'next/script';
import { Locale } from '@/lib/dictionaries';
import { getLocalizedAbsoluteUrl, getLocaleAlternates } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import { fetchPortfolioList } from '@/lib/data/portfolio';
import { fetchTestimonials } from '@/lib/data/testimonials';
import { fetchBrands } from '@/lib/data/brands';
import NarxlarClient from './narxlar-client';
import type { ServiceCase, ServiceLogo, ServiceQuote } from './narxlar-client';

const BASE_URL = 'https://www.jonbranding.uz';
const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];

const TITLES: Record<Locale, string> = {
  uz: 'Narxlar — Baxtiyor Gaziyev',
  ru: 'Цены на брендинг — Бахтиёр Газиев',
  en: 'Branding Pricing — Bakhtiyor Gaziyev',
  zh: '品牌服务价格 — 巴赫蒂约尔·加齐耶夫',
};

const DESCRIPTIONS: Record<Locale, string> = {
  uz: 'Branding xizmatlari narxlari: naming, logo, visual identity, brandbook, packaging, patent. Paketlar 20 mln so‘mdan.',
  ru: 'Цены на услуги брендинга: нейминг, логотип, фирменный стиль, брендбук, упаковка, патент. Пакеты от 20 млн сум.',
  en: 'Branding service prices: naming, logo design, visual identity, brandbook, packaging, patent. Packages from 20M UZS.',
  zh: '品牌服务价格：命名、标志设计、视觉识别、品牌手册、包装设计、商标。套餐 2000 万苏姆起。',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';
  const title = TITLES[safeLang] || TITLES.uz;
  const description = DESCRIPTIONS[safeLang] || DESCRIPTIONS.uz;
  return {
    title,
    description,
    alternates: {
      canonical: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/narxlar'),
      languages: getLocaleAlternates(BASE_URL, '/narxlar'),
    },
    openGraph: {
      title,
      description,
      url: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/narxlar'),
      siteName: 'Jon.Branding',
    },
  };
}

const breadcrumbLabels = { home: 'Bosh sahifa', prices: 'Narxlar' };

const TariflarPage = async (props: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await props.params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';

  const [projects, testimonials, brands] = await Promise.all([
    fetchPortfolioList(safeLang),
    fetchTestimonials(safeLang),
    fetchBrands(),
  ]);

  const cases: ServiceCase[] = projects
    .filter((project) => project.coverImage)
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      client: project.client,
      category: project.category,
      categoryLabel: project.categoryLabel,
      coverImage: project.coverImage,
      result: project.results?.[0],
    }));

  const showcaseCategories = ['brandbook', 'brand-strategy', 'corporate-style'];
  const showcase: string[] = Array.from(
    new Set(
      projects
        .filter((project) => showcaseCategories.includes(project.category))
        .flatMap((project) => [...(project.galleryImages ?? []), project.afterImage, project.coverImage])
        .filter((src): src is string => Boolean(src))
    )
  ).slice(0, 8);

  const quotes: ServiceQuote[] = testimonials
    .filter((item) => item.quote && item.quote.length > 60)
    .slice(0, 3)
    .map((item) => ({ name: item.name, company: item.company, quote: item.quote }));

  const logos: ServiceLogo[] = brands
    .flatMap((brand) => (brand.logo ? [{ name: brand.name, logo: brand.logo }] : []))
    .slice(0, 16);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: breadcrumbLabels.home, item: getLocalizedAbsoluteUrl(BASE_URL, safeLang) },
      { '@type': 'ListItem', position: 2, name: breadcrumbLabels.prices, item: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/narxlar') },
    ],
  };

  return (
    <div className="flex-grow">
      <Script
        id="json-ld-breadcrumb-narxlar"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(breadcrumbSchema) }}
      />
      <NarxlarClient lang={safeLang} cases={cases} quotes={quotes} logos={logos} showcase={showcase} />
    </div>
  );
};

export default TariflarPage;
