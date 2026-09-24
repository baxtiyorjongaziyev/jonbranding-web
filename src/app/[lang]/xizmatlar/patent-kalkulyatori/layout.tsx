import { Metadata } from 'next';
import { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import { getPageAlternates } from '@/lib/seo';

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const titles: Record<string, string> = {
    uz: 'Patent Kalkulyatori | Jon.Branding',
    ru: 'Калькулятор Патентов | Jon.Branding',
    en: 'Patent Calculator | Jon.Branding',
    zh: '专利计算器 | Jon.Branding',
  };
  return {
    title: titles[safeLang] || titles.uz,
    alternates: getPageAlternates(safeLang, '/xizmatlar/patent-kalkulyatori'),
  };
}

export default function PatentCalculatorLayout({ children }: Props) {
  return <>{children}</>;
}
