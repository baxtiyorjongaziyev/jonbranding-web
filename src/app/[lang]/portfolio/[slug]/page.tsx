import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { client } from '@/sanity/lib/client';
import { getPortfolioFallback, PortfolioProject } from '@/lib/portfolio-fallbacks';
import { getDictionary, Locale } from '@/lib/dictionaries';
import PortfolioDetailClient from '@/components/portfolio-detail-client';
import { generateBreadcrumbSchema, generateCreativeWorkSchema, getLocalizedUrl } from '@/lib/schema-helpers';

export const revalidate = 60;

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = ['den-aroma', 'savod', 'fidda', 'boyarin'];
  const params: { lang: string; slug: string }[] = [];
  
  ['uz', 'ru', 'en', 'zh'].forEach((lang) => {
    slugs.forEach((slug) => {
      params.push({ lang, slug });
    });
  });
  
  return params;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang, slug } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;

  // 1. Fetch from Sanity
  let project: any = null;
  try {
    project = await client.fetch(`
      *[_type == "portfolio" && slug.current == $slug][0] {
        title,
        description,
        client,
        category,
        "coverImage": coverImage.asset->url
      }
    `, { slug });
  } catch (e) {}

  // 2. If not found, use fallback
  if (!project) {
    project = getPortfolioFallback(safeLang, slug);
  }

  if (!project) {
    return {
      title: 'Keys topilmadi',
    };
  }

  const canonicalUrl = getLocalizedUrl(`/portfolio/${slug}`, safeLang);

  return {
    title: `${project.title} | Jon.Branding Portfolio`,
    description: project.description,
    keywords: `${project.client}, brending, keys, dizayn, case study, premium branding`,
    openGraph: {
      title: `${project.title} | Jon.Branding Portfolio`,
      description: project.description,
      url: canonicalUrl,
      type: 'website',
      images: project.coverImage ? [{ url: project.coverImage, width: 1200, height: 630, alt: project.title }] : [],
    },
  };
}

export default async function PortfolioDetailPage(props: Props) {
  const { lang, slug } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;

  let dictionary;
  try {
    dictionary = await getDictionary(safeLang);
  } catch (e) {
    dictionary = await getDictionary('uz');
  }

  // 1. Fetch from Sanity
  let project: any = null;
  try {
    project = await client.fetch(`
      *[_type == "portfolio" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        client,
        category,
        tags,
        "coverImage": coverImage.asset->url,
        "beforeImage": beforeImage.asset->url,
        "afterImage": afterImage.asset->url,
        description,
        body,
        results,
        "galleryImages": galleryImages[].asset->url,
        order
      }
    `, { slug });
  } catch (e) {}

  // 2. Fallback to mock
  if (!project) {
    project = getPortfolioFallback(safeLang, slug);
  }

  if (!project) {
    notFound();
  }

  const breadcrumbItems = [
    { name: safeLang === 'uz' ? 'Bosh sahifa' : safeLang === 'ru' ? 'Главная' : safeLang === 'zh' ? '首页' : 'Home', path: '' },
    { name: safeLang === 'uz' ? 'Portfolio' : safeLang === 'ru' ? 'Портфолио' : safeLang === 'zh' ? '作品集' : 'Portfolio', path: '/portfolio' },
    { name: project.title, path: `/portfolio/${slug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems, safeLang);
  const creativeWorkSchema = generateCreativeWorkSchema({
    name: project.title,
    description: project.description,
    image: project.coverImage || 'https://www.jonbranding.uz/icon.svg',
    url: getLocalizedUrl(`/portfolio/${slug}`, safeLang),
    creator: 'Jon.Branding',
    dateCreated: new Date().toISOString(),
    keywords: `${project.client}, brending, case study`,
  });

  return (
    <>
      <Script
        id="portfolio-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="portfolio-creative-work-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <PortfolioDetailClient 
        project={project} 
        lang={safeLang} 
        dictionary={{
          backBtn: safeLang === 'uz' ? 'Portfolioga qaytish' : safeLang === 'ru' ? 'Назад в портфолио' : safeLang === 'zh' ? '返回作品集' : 'Back to Portfolio',
          resultsTitle: safeLang === 'uz' ? 'Loyiha Erishgan Natijalar' : safeLang === 'ru' ? 'Достигнутые Результаты' : safeLang === 'zh' ? '项目达成的业绩成果' : 'Project Results',
          transformTitle: safeLang === 'uz' ? 'Brend Transformatsiyasi (Avval / Keyin)' : safeLang === 'ru' ? 'Трансформация Бренда (До / После)' : safeLang === 'zh' ? '品牌转型蜕变（之前/之后）' : 'Brand Transformation',
          ctaTitle: safeLang === 'uz' ? 'Brendingizni Premium Darajaga Olib Chiqishga Tayyormisiz?' : safeLang === 'ru' ? 'Готовы ли вы вывести свой бренд на премиум-уровень?' : safeLang === 'zh' ? '您准备好将您的品牌提升到高端水平了吗？' : 'Ready to Elevate Your Brand to Premium Level?',
          ctaDesc: safeLang === 'uz' 
            ? 'Biz bilan bog\'laning va brendingiz bozorda qanchalik kuchli ekanini tekshirish uchun Bepul Brand Audit band qiling.' 
            : safeLang === 'ru' 
              ? 'Свяжитесь с нами и запишитесь на бесплатный аудит бренда, чтобы узнать его истинный потенциал.' 
              : safeLang === 'zh'
                ? '与我们联系并预订免费的品牌审计，以测试您的品牌在市场上的实力。'
                : 'Get in touch with us and book a Free Brand Audit to discover your brand\'s true potential in the market.',
          ctaBtn: safeLang === 'uz' ? 'Bepul Brand Audit Olish' : safeLang === 'ru' ? 'Получить Бесплатный Аудит' : safeLang === 'zh' ? '获取免费品牌审计' : 'Get Free Brand Audit',
        }}
      />
    </>
  );
}
