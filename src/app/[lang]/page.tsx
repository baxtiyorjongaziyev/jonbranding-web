
import HomeComponent from '@/components/home-component';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Metadata } from 'next';
import { fetchComparisons } from '@/lib/data/comparisons';
import { fetchBrands } from '@/lib/data/brands';
import { fetchTestimonials } from '@/lib/data/testimonials';
import { fetchPortfolioList } from '@/lib/data/portfolio';

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
    ru: "Стратегический брендинг, нейминг и дизайн логотипов в Ташкенте. Премиальное качество для вашего бизнеса.",
    en: "Strategic branding, naming, and logo design in Tashkent. Premium quality. Brand audits, packaging, and full identity systems for Central Asian businesses.",
    zh: "在塔什干提供战略品牌、命名和标志设计。高端品牌代理服务。为中亚企业提供品牌审计、包装设计和完整视觉识别系统。"
  };

  return {
    title: titles[lang] || titles.uz,
    description: descriptions[lang] || descriptions.uz,
    keywords: "brand audit, brending uz, logo dizayn, neyming, naming, qadoq dizayn, brandbook, premium branding",
    openGraph: {
      title: titles[lang] || titles.uz,
      description: descriptions[lang] || descriptions.uz,
      type: 'website',
      locale: lang === 'uz' ? 'uz_UZ' : lang === 'ru' ? 'ru_RU' : lang === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Jon.Branding',
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630, alt: 'Jon Branding Agency' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang] || titles.uz,
      description: descriptions[lang] || descriptions.uz,
      images: ['/images/cms/og-image.jpeg'],
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

  const [comparisons, brands, testimonials, portfolioProjects] = await Promise.all([
    fetchComparisons(),
    fetchBrands(),
    fetchTestimonials(lang),
    fetchPortfolioList(lang),
  ]);

  return <HomeComponent lang={lang as Locale} dictionary={dictionary} comparisons={comparisons} brands={brands} testimonials={testimonials} portfolioProjects={portfolioProjects} />;
}
