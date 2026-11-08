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
      title: 'Продающий дизайн карточек для Uzum, Yandex Market, WB и Ozon',
      description: 'Профессиональный дизайн карточек товаров. Тарифы START, PRO и PREMIUM для маркетплейсов.',
    }
  } else if (isEn) {
    t = {
      title: 'Sales-Driven Card Design for Uzum, Yandex Market, WB & Ozon',
      description: 'Professional product card design that increases sales. Explore our START, PRO, and PREMIUM plans.',
    }
  } else if (isZh) {
    t = {
      title: 'Uzum, Yandex Market, WB 和 Ozon 的销售卡设计',
      description: '提高销量的专业产品卡设计。探索并订购适用于在线市场的 START、PRO 和 PREMIUM 计划。',
    }
  } else {
    t = {
      title: 'Uzum, Yandex Market, WB va Ozon uchun sotuvchi kartochka dizayni',
      description: 'Sotuvlarni oshiradigan professional mahsulot kartochkasi dizayni.',
    }
  }

  // Sahifa matni hozircha faqat o'zbekcha: boshqa tillar uz versiyaga canonical
  // va noindex (aks holda ru/en/zh URL'lar o'zbekcha matnning dublikati bo'ladi).
  const isUz = lang === 'uz';
  const canonicalUrl = 'https://www.jonbranding.uz/pricing/sotuvchi-kartochka';

  return {
    metadataBase: new URL('https://www.jonbranding.uz'),
    title: t.title,
    description: t.description,
    keywords: ["sotuvchi rasm", "uzum kartochka dizayn", "wildberries dizayn", "marketpleyslar uchun dizayn", "branding uz", "logo", "neyming"],
    robots: { index: isUz, follow: true },
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
    },
  };
}

const SotuvchiKartochkaLayout: FC<Readonly<Props>> = async ({ children }) => {
  return <>{children}</>;
}

export default SotuvchiKartochkaLayout;