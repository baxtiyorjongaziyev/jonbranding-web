
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: { lang: string };
};

export async function generateMetadata({ params: { lang } }: Props): Promise<Metadata> {
  const isRu = lang === 'ru';
  const t = {
    uz: {
      title: 'Marketplace uchun mahsulot obloşkasi dizayni | Jon Branding',
      description: 'Sotuvlarni oshiradigan professional mahsulot obloshkasi dizayni. Marketplace uchun START, PRO va PREMIUM tariflar bilan tanishing va buyurtma bering.',
    },
    ru: {
      title: 'Дизайн обложки товара для маркетплейса | Jon Branding',
      description: 'Профессиональный дизайн обложки товара, который увеличивает продажи. Ознакомьтесь и закажите тарифы START, PRO и PREMIUM для маркетплейсов.',
    }
  }
  const translations = isRu ? t.ru : t.uz;
  const canonicalUrl = `https://jonbranding.uz/${isRu ? 'ru/' : ''}pricing/obloshka`;

  return {
    metadataBase: new URL('https://jonbranding.uz'),
    title: translations.title,
    description: translations.description,
    openGraph: {
      title: translations.title,
      description: translations.description,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [
        {
          url: 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2',
          width: 1200,
          height: 630,
          alt: translations.description,
        },
      ],
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': `https://jonbranding.uz/pricing/obloshka`,
        'ru': `https://jonbranding.uz/ru/pricing/obloshka`,
      },
    },
  };
}

const ObloshkaLayout: FC<Readonly<Props>> = ({ children }) => {
  return <>{children}</>;
}

export default ObloshkaLayout;
