import type { Metadata } from 'next';
import { Locale } from '@/lib/dictionaries';
import AloqaClient from './aloqa-client';

const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];
const BASE_URL = 'https://www.jonbranding.uz';

const metaByLang: Record<Locale, { title: string; description: string }> = {
  uz: {
    title: "Aloqa — Jon.Branding | Toshkent Brending Agentligi",
    description: 'Jon.Branding bilan bog\'laning. Telefon: +998 33 645 00 97. Online brifing, Telegram, Instagram.',
  },
  ru: {
    title: 'Контакты — Jon.Branding | Брендинговое агентство Ташкент',
    description: 'Свяжитесь с Jon.Branding. Телефон: +998 33 645 00 97. Онлайн брифинг, Telegram, Instagram.',
  },
  en: {
    title: 'Contact — Jon.Branding | Branding Agency Tashkent',
    description: 'Contact Jon.Branding. Phone: +998 33 645 00 97. Online briefing, Telegram, Instagram.',
  },
  zh: {
    title: '联系我们 — Jon.Branding | 塔什干品牌机构',
    description: '联系 Jon.Branding。电话：+998 33 645 00 97。在线简报、Telegram、Instagram。',
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
      canonical: `${BASE_URL}/${safeLang}/aloqa`,
      languages: {
        uz: `${BASE_URL}/uz/aloqa`,
        ru: `${BASE_URL}/ru/aloqa`,
        en: `${BASE_URL}/en/aloqa`,
        zh: `${BASE_URL}/zh/aloqa`,
        'x-default': `${BASE_URL}/uz/aloqa`,
      },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const safeLang = VALID_LOCALES.includes(lang as Locale) ? (lang as Locale) : 'uz';
  return <AloqaClient lang={safeLang} />;
}
