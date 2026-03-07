
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as Locale);
  const t = dict.brandStrategyPage?.metadata || { title: "Brand Strategy", description: "" };

  const canonicalUrl = `https://jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}xizmatlar/brand-strategy`;
  
  let keywords = ["brend strategiyasi", "brend platformasi", "brending agentligi toshkent", "strategik brending", "biznes uchun strategiya", "biznes upakovka"];
  if (lang === 'ru') {
    keywords = ["бренд стратегия", "платформа бренда", "брендинговое агентство ташкент", "стратегический брендинг", "стратегия для бизнеса", "упаковка бизнеса"];
  } else if (lang === 'en') {
    keywords = ["brand strategy", "brand platform", "branding agency tashkent", "strategic branding", "strategy for business", "business packaging"];
  } else if (lang === 'zh') {
    keywords = ["品牌策略", "品牌平台", "塔什干品牌代理", "战略品牌", "商业策略", "商业包装"];
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
        'uz': 'https://jonbranding.uz/xizmatlar/brand-strategy',
        'ru': 'https://jonbranding.uz/ru/xizmatlar/brand-strategy',
        'en': 'https://jonbranding.uz/en/xizmatlar/brand-strategy',
        'zh': 'https://jonbranding.uz/zh/xizmatlar/brand-strategy',
      },
    },
  };
}

const BrandStrategyLayout: FC<Readonly<{ children: ReactNode, params: Promise<{ lang: string }> }>> = ({ children }) => {
  return <>{children}</>;
}

export default BrandStrategyLayout;
