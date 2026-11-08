import type { Metadata } from 'next';
import { Locale } from '@/lib/dictionaries';
import { getLocalizedAbsoluteUrl, getLocaleAlternates } from '@/lib/i18n/locale';
import HaqimizClient from './haqimizda-client';
import { safeJsonStringify } from '@/lib/security';
import { ORGANIZATION_ID, FOUNDER_ID } from '@/lib/seo';
import { FOUNDED_YEAR, clientsLabel, projectsLabel, yearsLabel } from '@/lib/company-facts';

const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];
const BASE_URL = 'https://www.jonbranding.uz';

const metaByLang: Record<Locale, { title: string; description: string }> = {
  uz: {
    title: 'Haqimizda — Jon.Branding | Markaziy Osiyo Premium Brend Atelye',
    description: `Jon.Branding — ${FOUNDED_YEAR} yildan Markaziy Osiyodagi premium brending agentligi. ${clientsLabel} mijoz, ${projectsLabel} loyiha, ${yearsLabel()} yil tajriba.`,
  },
  ru: {
    title: 'О нас — Jon.Branding | Премиум брендинговое агентство Центральной Азии',
    description: `Jon.Branding — премиум брендинговое агентство Центральной Азии с ${FOUNDED_YEAR} года. ${clientsLabel} клиентов, ${projectsLabel} проектов, ${yearsLabel()} лет опыта.`,
  },
  en: {
    title: 'About Us — Jon.Branding | Central Asia Premium Brand Atelier',
    description: `Jon.Branding — Central Asia premium branding agency since ${FOUNDED_YEAR}. ${clientsLabel} clients, ${projectsLabel} projects, ${yearsLabel()} years of experience.`,
  },
  zh: {
    title: '关于我们 — Jon.Branding | 中亚高端品牌工坊',
    description: `Jon.Branding — 中亚高端品牌机构，成立于${FOUNDED_YEAR}年。${clientsLabel}客户，${projectsLabel}项目，${yearsLabel()}年经验。`,
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = VALID_LOCALES.includes(lang as Locale) ? (lang as Locale) : 'uz';
  const m = metaByLang[safeLang];
  return {
    // Sarlavhada brend bor — shablon uni ikkinchi marta qo'shmasin.
    title: { absolute: m.title },
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
      url: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/haqimizda'),
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/haqimizda'),
      languages: getLocaleAlternates(BASE_URL, '/haqimizda'),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const safeLang = VALID_LOCALES.includes(lang as Locale) ? (lang as Locale) : 'uz';
  const url = getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/haqimizda');
  // Agentlik va asoschi tugunlari layout'dagi umumiy grafda; bu sahifa ularga bog'lanadi.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${url}#about`,
    url,
    name: metaByLang[safeLang].title,
    description: metaByLang[safeLang].description,
    inLanguage: safeLang,
    about: { '@id': ORGANIZATION_ID },
    mainEntity: { '@id': ORGANIZATION_ID },
    mentions: { '@id': FOUNDER_ID },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLd) }} />
      <HaqimizClient lang={safeLang} />
    </>
  );
}
