
import HomeComponent from '@/components/home-component';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { staticBrands, staticTestimonials, staticTestimonialsRu, staticTestimonialsEn, staticTestimonialsZh } from '@/lib/static-data';
import type { Brand, Testimonial } from '@/lib/types';

export const revalidate = 60;

type Props = {
  params: { lang: Locale };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = props.params;
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
  const { lang } = props.params;

  let dictionary;
  try {
    dictionary = await getDictionary(lang);
  } catch (e) {
    console.error("Page dictionary load error, falling back to 'uz':", e);
    dictionary = await getDictionary('uz');
  }

  let brands: Brand[] = [];
  try {
    const rawBrands = await client.fetch(`
      *[_type == "brand"] | order(coalesce(order, 999) asc, _createdAt asc) {
        _id,
        name,
        "logo": coalesce(logoUrl, logo.asset->url),
        hiddenInHero,
        "order": coalesce(order, 999)
      }
    `);
    if (rawBrands?.length > 0) brands = rawBrands;
  } catch {}

  if (brands.length === 0) brands = staticBrands;

  let testimonials: Testimonial[] = [];
  try {
    const rawTestimonials = await client.fetch(`
      *[_type == "testimonial"] | order(coalesce(order, 999) asc, _createdAt asc) {
        _id,
        name,
        avatar,
        "image": coalesce(image.asset->url, ""),
        imageHint,
        videoUrl,
        audioUrl,
        company,
        quote,
        "order": coalesce(order, 999)
      }
    `);
    if (rawTestimonials?.length > 0) {
      testimonials = rawTestimonials.map((t: any) => ({
        name: t.name,
        avatar: t.avatar || t.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
        image: t.image || '',
        imageHint: t.imageHint || '',
        videoUrl: t.videoUrl,
        audioUrl: t.audioUrl,
        company: t.company?.[lang] || t.company?.uz || '',
        quote: t.quote?.[lang] || t.quote?.uz || '',
      }));
    }
  } catch {}

  if (testimonials.length === 0) {
    const staticMap: Record<string, Testimonial[]> = {
      ru: staticTestimonialsRu,
      en: staticTestimonialsEn,
      zh: staticTestimonialsZh,
    };
    testimonials = staticMap[lang] ?? staticTestimonials;
  }

  return <HomeComponent lang={lang} dictionary={dictionary} brands={brands} testimonials={testimonials} />;
}
