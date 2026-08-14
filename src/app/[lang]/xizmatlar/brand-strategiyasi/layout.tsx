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

  const canonicalUrl = `https://www.jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}xizmatlar/brand-strategiyasi`;
  
  let keywords = ["brend strategiyasi", "brend platformasi", "brending agentligi toshkent", "strategik brending", "biznes uchun strategiya", "biznes upakovka"];
  if (lang === 'ru') {
    keywords = ["бренд стратегия", "платформа бренда", "брендинговое агентство ташкент", "стратегический брендинг", "стратегия для бизнеса", "упаковка бизнеса"];
  } else if (lang === 'en') {
    keywords = ["brand strategy", "brand platform", "branding agency tashkent", "strategic branding", "strategy for business", "business packaging"];
  } else if (lang === 'zh') {
    keywords = ["品牌战略", "品牌平台", "塔什干品牌代理", "战略品牌", "商业策略", "商业包装"];
  }

  return {
    metadataBase: new URL('https://www.jonbranding.uz'),
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
          url: '/images/cms/og-image.jpeg',
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
      images: ['/images/cms/og-image.jpeg'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': 'https://www.jonbranding.uz/xizmatlar/brand-strategiyasi',
        'ru': 'https://www.jonbranding.uz/ru/xizmatlar/brand-strategiyasi',
        'en': 'https://www.jonbranding.uz/en/xizmatlar/brand-strategiyasi',
        'zh': 'https://www.jonbranding.uz/zh/xizmatlar/brand-strategiyasi',
      },
    },
  };
}

const BrandStrategyLayout: FC<Readonly<{ children: ReactNode, params: Promise<{ lang: string }> }>> = ({ children }) => {
  return <>{children}</>;
}

export default BrandStrategyLayout;
