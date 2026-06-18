import type { Metadata } from 'next';
import { Locale } from '@/lib/dictionaries';
import HaqimizClient from './haqimizda-client';

const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];
const BASE_URL = 'https://www.jonbranding.uz';

const metaByLang: Record<Locale, { title: string; description: string }> = {
  uz: {
    title: 'Haqimizda — Jon.Branding | Markaziy Osiyo Premium Brend Atelye',
    description: 'Jon.Branding — 2019 yildan Markaziy Osiyodagi premium brending agentligi. 120+ brend, 240+ loyiha, 7 yil tajriba.',
  },
  ru: {
    title: 'О нас — Jon.Branding | Премиум брендинговое агентство Центральной Азии',
    description: 'Jon.Branding — премиум брендинговое агентство Центральной Азии с 2019 года. 120+ брендов, 240+ проектов, 7 лет опыта.',
  },
  en: {
    title: 'About Us — Jon.Branding | Central Asia Premium Brand Atelier',
    description: 'Jon.Branding — Central Asia premium branding agency since 2019. 120+ brands, 240+ projects, 7 years of experience.',
  },
  zh: {
    title: '关于我们 — Jon.Branding | 中亚高端品牌工坊',
    description: 'Jon.Branding — 中亚高端品牌机构，成立于2019年。120+品牌，240+项目，7年经验。',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = VALID_LOCALES.includes(lang as Locale) ? (lang as Locale) : 'uz';
  const m = metaByLang[safeLang];
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${BASE_URL}/${safeLang}/haqimizda`,
      languages: {
        uz: `${BASE_URL}/uz/haqimizda`,
        ru: `${BASE_URL}/ru/haqimizda`,
        en: `${BASE_URL}/en/haqimizda`,
        zh: `${BASE_URL}/zh/haqimizda`,
        'x-default': `${BASE_URL}/uz/haqimizda`,
      },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const safeLang = VALID_LOCALES.includes(lang as Locale) ? (lang as Locale) : 'uz';
  return <HaqimizClient lang={safeLang} />;
}
