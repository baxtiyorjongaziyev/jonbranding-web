
import HomeComponent from '@/components/home-component';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Metadata } from 'next';
import { fetchComparisons } from '@/lib/data/comparisons';

export const revalidate = 60;

type Props = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return ['uz', 'ru', 'en', 'zh'].map((lang) => ({ lang }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const lang = (['uz', 'ru', 'en', 'zh'].includes(rawLang) ? rawLang : 'uz') as Locale;
  const titles = {
    uz: "Jon.Branding | Bepul Brand Audit va premium logotip dizayni",
    ru: "Jon.Branding | Брендинговое Агентство в Ташкенте: Дизайн и Стратегия",
    en: "Jon.Branding | Premier Branding Agency in Uzbekistan: Logo & Naming",
    zh: "Jon.Branding | 乌兹别克斯坦领先的品牌代理机构"
  };

  const descriptions = {
    uz: "15 daqiqalik Brand Auditda nom, logo, qadoq, sayt va kommunikatsiyangiz xaridor ko'zida qanchalik ishonchli ko'rinishini tekshiramiz.",
    ru: "Стратегический брендинг, нейминг и дизайн логотипов в Ташкенте. Премиальное качество на уровне Ma'no, Mountain, Abba.",
    en: "Strategic branding, naming, and logo design in Tashkent. Premium quality on par with Ma'no, Mountain, Abba.",
    zh: "在塔什干提供战略品牌、命名和标志设计。高端品牌代理服务。"
  };

  const BASE_URL = 'https://www.jonbranding.uz';
  return {
    title: titles[lang] || titles.uz,
    description: descriptions[lang] || descriptions.uz,
    keywords: "brand audit, brending uz, logo dizayn, neyming, naming, qadoq dizayn, brandbook, premium branding",
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: {
        uz: `${BASE_URL}/uz`,
        ru: `${BASE_URL}/ru`,
        en: `${BASE_URL}/en`,
        zh: `${BASE_URL}/zh`,
        'x-default': `${BASE_URL}/uz`,
      },
    },
    openGraph: {
      title: titles[lang] || titles.uz,
      description: descriptions[lang] || descriptions.uz,
      url: `${BASE_URL}/${lang}`,
      siteName: 'Jon.Branding',
      type: 'website',
    },
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;

  let dictionary;
  try {
    dictionary = await getDictionary(lang as Locale);
  } catch (e) {
    console.error("Page dictionary load error, falling back to 'uz':", e);
    dictionary = await getDictionary('uz');
  }

  const comparisons = await fetchComparisons();

  return <HomeComponent lang={lang as Locale} dictionary={dictionary} comparisons={comparisons} />;
}
