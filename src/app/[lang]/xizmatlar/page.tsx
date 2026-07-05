import type { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { getLocalizedAbsoluteUrl, getLocaleAlternates } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import Script from 'next/script';
import AtMarquee from '@/components/sections/at-marquee';
import AtManifesto from '@/components/sections/at-manifesto';
import { XizmatlarHero, XizmatlarServices, XizmatlarFinalCta } from './xizmatlar-interactive';

const BASE_URL = 'https://www.jonbranding.uz';
const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];

const metaByLang: Record<Locale, { title: string; description: string; keywords: string }> = {
  uz: {
    title: 'Xizmatlar | Jon.Branding',
    description: 'Jon.Branding xizmatlari: neyming, logotip, brend uslubi, brendbook, qadoq va raqamli brend yechimlari.',
    keywords: 'xizmatlar, neyming, logo dizayni, brend uslubi, brendbook, qadoq dizayni, Jon Branding',
  },
  ru: {
    title: 'Услуги | Jon.Branding',
    description: 'Услуги Jon.Branding: нейминг, логотип, фирменный стиль, брендбук, упаковка и digital branding.',
    keywords: 'услуги, нейминг, логотип, фирменный стиль, брендбук, упаковка, Jon Branding',
  },
  en: {
    title: 'Services | Jon.Branding',
    description: 'Jon.Branding services: naming, logo design, brand identity, brandbook, packaging and digital brand systems.',
    keywords: 'services, naming, logo design, brand identity, brandbook, packaging, Jon Branding',
  },
  zh: {
    title: '服务 | Jon.Branding',
    description: 'Jon.Branding 服务：命名、标志设计、品牌识别、品牌手册、包装与数字品牌系统。',
    keywords: '服务, 命名, 标志设计, 品牌识别, 品牌手册, 包装, Jon Branding',
  },
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

  return (
    <main className="flex-grow">
      <Script
        id="json-ld-breadcrumb-xizmatlar"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(breadcrumbSchema) }}
      />
      <XizmatlarHero lang={safeLang} />
      <AtMarquee lang={safeLang} />
      <AtManifesto lang={safeLang} />
      <XizmatlarServices lang={safeLang} />
      <XizmatlarFinalCta lang={safeLang} />
    </main>
  );
};

export default ServicesPage;
