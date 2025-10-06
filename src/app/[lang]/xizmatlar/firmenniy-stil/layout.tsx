
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';

type Props = {
  params: { lang: string };
};

export async function generateMetadata({ params: { lang } }: Props): Promise<Metadata> {
  const dict = await getDictionary(lang as Locale);
  const t = dict.corporateStylePage.metadata;

  const canonicalUrl = `https://jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}xizmatlar/firmenniy-stil`;

  let keywords = ["firma uslubi yaratish", "brend dizayn toshkent", "korporativ aydentika", "brandbook tayyorlash", "vizual uslub", "biznes upakovka"];
  if (lang === 'ru') {
    keywords = ["создание фирменного стиля", "бренд дизайн ташкент", "корпоративная айдентика", "разработка брендбука", "визуальный стиль", "упаковка бизнеса"];
  } else if (lang === 'en') {
    keywords = ["corporate identity creation", "brand design tashkent", "corporate identity", "brandbook development", "visual style", "business packaging"];
  }

  return {
    metadataBase: new URL('https://jonbranding.uz'),
    title: t.title,
    description: t.description,
    keywords,
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
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
      images: ['https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': 'https://jonbranding.uz/xizmatlar/firmenniy-stil',
        'ru': 'https://jonbranding.uz/ru/xizmatlar/firmenniy-stil',
        'en': 'https://jonbranding.uz/en/xizmatlar/firmenniy-stil',
      },
    },
  };
}

const FirmenniyStilLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
  return <>{children}</>;
}

export default FirmenniyStilLayout;
