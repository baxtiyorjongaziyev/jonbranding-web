
import HomeComponent from '@/components/home-component';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  // NEXT 15: await params
  const { lang } = await props.params;
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

  return {
    title: titles[lang] || titles.uz,
    description: descriptions[lang] || descriptions.uz,
    keywords: "branding, ma'no branding, brending uz, logo dizayn, neyming, naming, qadoq dizayn, brandbook, mountain branding, abba marketing, minim, redfox",
  };
}

export default async function Page(props: Props) {
  // NEXT 15: await params
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  return <HomeComponent lang={lang} dictionary={dictionary} />;
}
