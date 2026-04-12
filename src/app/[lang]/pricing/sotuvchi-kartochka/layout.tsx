import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const isRu = lang === 'ru';
  const isEn = lang === 'en';
  const isZh = lang === 'zh';
  
  let t;
  if (isRu) {
    t = {
      title: 'Продающий дизайн карточек для Uzum, Yandex Market, WB и Ozon | Jon Branding',
      description: 'Профессиональный дизайн карточек товаров на уровне Ma\'no и Mountain. Тарифы START, PRO и PREMIUM для маркетплейсов.',
    }
  } else if (isEn) {
    t = {
      title: 'Sales-Driven Card Design for Uzum, Yandex Market, WB & Ozon | Jon Branding',
      description: 'Professional product card design that increases sales. Explore our START, PRO, and PREMIUM plans.',
    }
  } else if (isZh) {
    t = {
      title: 'Uzum, Yandex Market, WB 和 Ozon 的销售卡设计 | Jon Branding',
      description: '提高销量的专业产品卡设计。探索并订购适用于在线市场的 START、PRO 和 PREMIUM 计划。',
    }
  } else {
    t = {
      title: 'Uzum, Yandex Market, WB va Ozon uchun sotuvchi kartochka dizayni | Jon Branding',
      description: 'Sotuvlarni oshiradigan professional mahsulot kartochkasi dizayni. Ma\'no va Mountain darajasidagi sifat.',
    }
  }

  const canonicalUrl = `https://jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}pricing/sotuvchi-kartochka`;

  return {
    metadataBase: new URL('https://jonbranding.uz'),
    title: t.title,
    description: t.description,
    keywords: ["sotuvchi rasm", "uzum kartochka dizayn", "wildberries dizayn", "marketpleyslar uchun dizayn", "branding uz", "logo", "neyming", "Ma'no", "Abba", "Mountain", "Minim", "Redfox"],
    openGraph: {
      title: t.title,
      description: t.description,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [
        {
          url: '/images/cms/og-image.jpeg',
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
        'uz': `https://jonbranding.uz/pricing/sotuvchi-kartochka`,
        'ru': `https://jonbranding.uz/ru/pricing/sotuvchi-kartochka`,
        'en': `https://jonbranding.uz/en/pricing/sotuvchi-kartochka`,
        'zh': `https://jonbranding.uz/zh/pricing/sotuvchi-kartochka`,
      },
    },
  };
}

const SotuvchiKartochkaLayout: FC<Readonly<Props>> = async ({ children }) => {
  return <>{children}</>;
}

export default SotuvchiKartochkaLayout;