import type { Metadata } from 'next';
import { Locale } from '@/lib/dictionaries';
import { getLocalizedAbsoluteUrl, getLocaleAlternates } from '@/lib/i18n/locale';
import AloqaClient from './aloqa-client';

const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];
const BASE_URL = 'https://www.jonbranding.uz';

const metaByLang: Record<Locale, { title: string; description: string }> = {
  uz: {
    title: "Aloqa — Jon.Branding | Toshkent Brending Agentligi",
    description: 'Jon.Branding bilan bog\'laning — Telefon: +998 33 645 00 97, Telegram, Instagram. Online brifing, brend tashxisi va konsultatsiya uchun murojaat qiling. 6 yillik tajriba, 240+ loyiha.',
  },
  ru: {
    title: 'Контакты — Jon.Branding | Брендинговое агентство Ташкент',
    description: 'Свяжитесь с Jon.Branding — Телефон: +998 33 645 00 97, Telegram, Instagram. Онлайн брифинг, бренд-диагностика и консультация. 6 лет опыта, 240+ проектов.',
  },
  en: {
    title: 'Contact — Jon.Branding | Branding Agency Tashkent',
    description: 'Contact Jon.Branding — Phone: +998 33 645 00 97, Telegram, Instagram. Online briefing, brand audit and consultation available. 6 years of experience, 240+ projects.',
  },
  zh: {
    title: '联系我们 — Jon.Branding | 塔什干品牌机构',
    description: '联系 Jon.Branding — 电话：+998 33 645 00 97，Telegram，Instagram。提供在线简报、品牌诊断和咨询。6年经验，240+项目。',
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
      canonical: getLocalizedAbsoluteUrl(BASE_URL, safeLang, '/aloqa'),
      languages: getLocaleAlternates(BASE_URL, '/aloqa'),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const safeLang = VALID_LOCALES.includes(lang as Locale) ? (lang as Locale) : 'uz';
  return <AloqaClient lang={safeLang} />;
}
