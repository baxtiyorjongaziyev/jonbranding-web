
import HomeComponent from '@/components/home-component';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const lang = (['uz', 'ru', 'en', 'zh'].includes(rawLang) ? rawLang : 'uz') as Locale;
  const titles = {
    uz: "Jon.Branding | Bepul Brand Audit va premium brend strategiyasi",
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

  return {
    title: titles[lang] || titles.uz,
    description: descriptions[lang] || descriptions.uz,
    keywords: "brand audit, brending uz, logo dizayn, neyming, naming, qadoq dizayn, brand strategiya, brandbook, premium branding",
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

  let comparisons: any[] = [];
  try {
    comparisons = await client.fetch(`
      *[_type == "comparison" && defined(oldImg.asset) && defined(newImg.asset)]
        | order(coalesce(order, 999) asc, _createdAt asc) {
          _id,
          "brand": coalesce(brand, name, title, "Loyiha"),
          "oldImg": oldImg.asset->url,
          "newImg": newImg.asset->url,
          "oldHint": coalesce(oldHint, "Before"),
          "newHint": coalesce(newHint, "After"),
          "order": coalesce(order, 999)
        }
    `);
  } catch {}

  return <HomeComponent lang={lang as Locale} dictionary={dictionary} comparisons={comparisons} />;
}
