import type { Metadata } from 'next';
import Script from 'next/script';
import { getDictionary, Locale } from '@/lib/dictionaries';
import XizmatlarClient from './xizmatlar-client';

const BASE_URL = 'https://www.jonbranding.uz';

const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];

const metaByLang: Record<Locale, { title: string; description: string; keywords: string }> = {
  uz: {
    title: 'Brending xizmatlari — neyming, logotip, brendbuk | Jon.Branding',
    description: 'Neyming, logotip dizayni, brend strategiyasi, brendbuk va qadoq dizayni. Xaridor tanlaydigan brend tizimi — Jon.Branding.',
    keywords: 'brending xizmatlari, neyming, logotip, brendbuk, brend strategiyasi, qadoq dizayni, brending agentligi toshkent',
  },
  ru: {
    title: 'Услуги брендинга — нейминг, логотип, брендбук | Jon.Branding',
    description: 'Нейминг, дизайн логотипа, стратегия бренда, брендбук и дизайн упаковки. Бренд-система, которую выбирают покупатели — Jon.Branding.',
    keywords: 'услуги брендинга, нейминг, логотип, брендбук, стратегия бренда, дизайн упаковки, брендинговое агентство ташкент',
  },
  en: {
    title: 'Branding Services — Naming, Logo, Brandbook | Jon.Branding',
    description: 'Naming, logo design, brand strategy, brandbook and packaging design. A brand system buyers choose — Jon.Branding.',
    keywords: 'branding services, naming, logo design, brandbook, brand strategy, packaging design, branding agency tashkent',
  },
  zh: {
    title: '品牌服务 — 命名、标志、品牌手册 | Jon.Branding',
    description: '命名、标志设计、品牌战略、品牌手册和包装设计。打造买家首选的品牌体系 — Jon.Branding。',
    keywords: '品牌服务, 命名, 标志设计, 品牌手册, 品牌战略, 包装设计, 塔什干品牌机构',
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
      canonical: `${BASE_URL}/${safeLang}/xizmatlar`,
      languages: {
        'uz': `${BASE_URL}/uz/xizmatlar`,
        'ru': `${BASE_URL}/ru/xizmatlar`,
        'en': `${BASE_URL}/en/xizmatlar`,
        'zh': `${BASE_URL}/zh/xizmatlar`,
        'x-default': `${BASE_URL}/uz/xizmatlar`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${BASE_URL}/${safeLang}/xizmatlar`,
      siteName: 'Jon.Branding',
    },
  };
}

const breadcrumbLabels: Record<Locale, { home: string; services: string }> = {
  uz: { home: 'Bosh sahifa', services: 'Xizmatlar' },
  ru: { home: 'Главная', services: 'Услуги' },
  en: { home: 'Home', services: 'Services' },
  zh: { home: '首页', services: '服务' },
};

const XizmatlarPage = async (props: { params: Promise<{ lang: Locale }> }) => {
    const { lang } = await props.params;
    const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';
    const dictionary = await getDictionary(safeLang);
    const bl = breadcrumbLabels[safeLang] ?? breadcrumbLabels.uz;

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: bl.home, item: `${BASE_URL}/${safeLang}` },
        { '@type': 'ListItem', position: 2, name: bl.services, item: `${BASE_URL}/${safeLang}/xizmatlar` },
      ],
    };

    return (
      <main className="flex-grow">
          <Script
            id="json-ld-breadcrumb-xizmatlar"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
          <XizmatlarClient lang={safeLang} dictionary={dictionary} />
      </main>
    );
};

export default XizmatlarPage;
