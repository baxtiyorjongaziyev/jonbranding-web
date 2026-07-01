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
      title: 'ÐŸÑ€Ð¾Ð´Ð°ÑŽÑ‰Ð¸Ð¹ Ð´Ð¸Ð·Ð°Ð¹Ð½ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐµÐº Ð´Ð»Ñ Uzum, Yandex Market, WB Ð¸ Ozon | Jon Branding',
      description: 'ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð´Ð¸Ð·Ð°Ð¹Ð½ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐµÐº Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð² Ð½Ð° ÑƒÑ€Ð¾Ð²Ð½Ðµ Ma\'no Ð¸ Mountain. Ð¢Ð°Ñ€Ð¸Ñ„Ñ‹ START, PRO Ð¸ PREMIUM Ð´Ð»Ñ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð².',
    }
  } else if (isEn) {
    t = {
      title: 'Sales-Driven Card Design for Uzum, Yandex Market, WB & Ozon | Jon Branding',
      description: 'Professional product card design that increases sales. Explore our START, PRO, and PREMIUM plans.',
    }
  } else if (isZh) {
    t = {
      title: 'Uzum, Yandex Market, WB å’Œ Ozon çš„é”€å”®å¡è®¾è®¡ | Jon Branding',
      description: 'æé«˜é”€é‡çš„ä¸“ä¸šäº§å“å¡è®¾è®¡ã€‚æŽ¢ç´¢å¹¶è®¢è´­é€‚ç”¨äºŽåœ¨çº¿å¸‚åœºçš„ STARTã€PRO å’Œ PREMIUM è®¡åˆ’ã€‚',
    }
  } else {
    t = {
      title: 'Uzum, Yandex Market, WB va Ozon uchun sotuvchi kartochka dizayni | Jon Branding',
      description: 'Sotuvlarni oshiradigan professional mahsulot kartochkasi dizayni. Ma\'no va Mountain darajasidagi sifat.',
    }
  }

  const canonicalUrl = `https://www.jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}pricing/sotuvchi-kartochka`;

  return {
    metadataBase: new URL('https://www.jonbranding.uz'),
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
        'uz': `https://www.jonbranding.uz/pricing/sotuvchi-kartochka`,
        'ru': `https://www.jonbranding.uz/ru/pricing/sotuvchi-kartochka`,
        'en': `https://www.jonbranding.uz/en/pricing/sotuvchi-kartochka`,
        'zh': `https://www.jonbranding.uz/zh/pricing/sotuvchi-kartochka`,
      },
    },
  };
}

const SotuvchiKartochkaLayout: FC<Readonly<Props>> = async ({ children }) => {
  return <>{children}</>;
}

export default SotuvchiKartochkaLayout;