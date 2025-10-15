
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: { lang: string };
};

export async function generateMetadata({ params: { lang } }: Props): Promise<Metadata> {
  const isRu = lang === 'ru';
  const isEn = lang === 'en';
  
  let t;
  if (isRu) {
    t = {
      title: 'Продающий дизайн карточек для Uzum, Yandex Market, WB и Ozon | Jon Branding',
      description: 'Профессиональный дизайн карточек товаров, который увеличивает продажи. Ознакомьтесь и закажите тарифы START, PRO и PREMIUM для маркетплейсов.',
    }
  } else if (isEn) {
    t = {
      title: 'Sales-Driven Card Design for Uzum, Yandex Market, WB & Ozon | Jon Branding',
      description: 'Professional product card design that increases sales. Explore and order START, PRO, and PREMIUM plans for marketplaces.',
    }
  } else {
    t = {
      title: 'Uzum, Yandex Market, WB va Ozon uchun sotuvchi kartochka dizayni | Jon Branding',
      description: 'Sotuvlarni oshiradigan professional mahsulot kartochkasi dizayni. Marketplace uchun START, PRO va PREMIUM tariflar bilan tanishing va buyurtma bering.',
    }
  }

  const canonicalUrl = `https://jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}pricing/obloshka`;

  return {
    metadataBase: new URL('https://jonbranding.uz'),
    title: t.title,
    description: t.description,
    openGraph: {
      title: t.title,
      description: t.description,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [
        {
          url: 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2',
          width: 1200,
          height: 630,
          alt: t.description,
        },
      ],
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': `https://jonbranding.uz/pricing/obloshka`,
        'ru': `https://jonbranding.uz/ru/pricing/obloshka`,
        'en': `https://jonbranding.uz/en/pricing/obloshka`,
      },
    },
  };
}

const ObloshkaLayout: FC<Readonly<Props>> = ({ children }) => {
  return <>{children}</>;
}

export default ObloshkaLayout;
