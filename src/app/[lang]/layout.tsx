
import { ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { locales, defaultLocale } from '@/lib/i18n/locale';
import { Metadata } from 'next';

const BASE_URL = 'https://jonbranding.uz';
const OG_IMAGE_URL = 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2';

export async function generateMetadata(props: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const currentLang = locales.includes(rawLang) ? rawLang : defaultLocale;
  
  const titles = {
    uz: "Jon.Branding | Toshkentdagi Professional Brending Agentligi: Logo va Neyming",
    ru: "Jon.Branding | Брендинговое Агентство в Ташкенте: Дизайн и Стратегия",
    en: "Jon.Branding | Premier Branding Agency in Uzbekistan: Logo & Naming",
    zh: "Jon.Branding | 乌兹别克斯坦领先的品牌代理机构"
  };

  const descriptions = {
    uz: "Ma'no, Mountain, Abba darajasidagi premium brend strategiyasi, neyming va logotip dizayni. Toshkentda natijali aydentika va brandbook yaratish.",
    ru: "Стратегический брендинг, нейминг и дизайн логотипов в Ташкенте. Премиальное качество на уровне Ma'no, Mountain, Abba.",
    en: "Strategic branding, naming, and logo design in Tashkent. Premium quality on par with Ma'no, Mountain, Abba.",
    zh: "在塔什干提供战略品牌、命名和标志设计。高端品牌代理服务。"
  };

  const keywords = {
    uz: "branding, ma'no branding, brending uz, logo dizayn, neyming, naming, qadoq dizayn, brandbook, brandbuk, brendbuk, mountain branding, abba marketing, minim, redfox",
    ru: "брендинг, логотип, нейминг, дизайн упаковки, брендбук, брендинговое агентство ташкент, abba, mountain, ma'no, minim, redfox",
    en: "branding agency uzbekistan, logo design tashkent, naming services, brandbook development, mountain branding, abba marketing, minim, redfox",
    zh: "品牌代理, 标志设计, 命名服务, 包装设计, 品牌手册, Ma'no, Mountain, Abba"
  };

  return {
    title: titles[currentLang],
    description: descriptions[currentLang],
    keywords: keywords[currentLang],
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${currentLang === defaultLocale ? '' : currentLang}`,
      languages: {
        'uz': `${BASE_URL}/uz`,
        'ru': `${BASE_URL}/ru`,
        'en': `${BASE_URL}/en`,
        'zh': `${BASE_URL}/zh`,
      },
    },
    openGraph: {
      title: titles[currentLang],
      description: descriptions[currentLang],
      url: `${BASE_URL}/${currentLang}`,
      siteName: 'Jon.Branding',
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'Jon Branding Agency' }],
      type: 'website',
      locale: currentLang,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[currentLang],
      description: descriptions[currentLang],
      images: [OG_IMAGE_URL],
    },
  };
}

export default async function LangLayout(props: {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  
  return (
    <>
      <Header lang={lang} dictionary={dictionary.header} />
      {props.children}
      <Footer lang={lang} dictionary={dictionary.footer} />
    </>
  );
}
