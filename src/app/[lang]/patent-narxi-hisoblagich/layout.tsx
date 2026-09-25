import { Metadata } from 'next';
import { ReactNode } from 'react';
import { getLocaleAlternates, getLocalizedAbsoluteUrl } from '@/lib/i18n/locale';
import { pageTitle } from '@/lib/seo';

const BASE_URL = 'https://www.jonbranding.uz';

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = ['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz';

  const titles: Record<string, string> = {
    uz: 'Patent Narxi Hisoblagich — Bepul va Tez | Jon.Branding',
    ru: 'Калькулятор Стоимости Патента — Бесплатно | Jon.Branding',
    en: 'Free Trademark Cost Calculator | Jon.Branding',
    zh: '免费商标费用计算器 | Jon.Branding',
  };

  const descriptions: Record<string, string> = {
    uz: 'Tovar belgisini roʻyxatdan oʻtkazish narxini 30 soniyada hisoblang. Davlat boji + xizmat haqi — aniq raqamlar.',
    ru: 'Рассчитайте стоимость регистрации товарного знака за 30 секунд. Госпошлина + услуга — точные цифры.',
    en: 'Calculate your trademark registration cost in 30 seconds. State fees + service — exact numbers.',
    zh: '30秒内计算商标注册费用。国家费用+服务费—精确数字。',
  };

  const path = '/patent-narxi-hisoblagich';

  return {
    metadataBase: new URL(BASE_URL),
    title: pageTitle(titles[safeLang] || titles.uz),
    description: descriptions[safeLang] || descriptions.uz,
    robots: { index: true, follow: true },
    openGraph: {
      title: titles[safeLang] || titles.uz,
      description: descriptions[safeLang] || descriptions.uz,
      url: getLocalizedAbsoluteUrl(BASE_URL, safeLang as any, path),
      siteName: 'Jon.Branding',
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630, alt: 'Jon.Branding' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[safeLang] || titles.uz,
      description: descriptions[safeLang] || descriptions.uz,
      images: ['/images/cms/og-image.jpeg'],
    },
    alternates: {
      canonical: getLocalizedAbsoluteUrl(BASE_URL, safeLang as any, path),
      languages: getLocaleAlternates(BASE_URL, path),
    },
  };
}

export default function PatentLandingLayout({ children }: Props) {
  return <>{children}</>;
}
