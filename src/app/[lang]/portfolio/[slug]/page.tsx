import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPortfolioBySlug } from '@/lib/data/portfolio';
import { getPortfolioFallback, PortfolioProject } from '@/lib/portfolio-fallbacks';
import { getDictionary, Locale } from '@/lib/dictionaries';
import PortfolioDetailClient from '@/components/portfolio-detail-client';

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

  const project = (await fetchPortfolioBySlug(slug)) ?? (getPortfolioFallback(safeLang, slug) as PortfolioProject | null);

  if (!project) {
    return {
      title: 'Keys topilmadi',
    };
  }

  return {
    title: `${project.title} | Jon.Branding Portfolio`,
    description: project.description,
    keywords: `${project.client}, brending, keys, dizayn, case study, premium branding`,
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

  const project = (await fetchPortfolioBySlug(slug)) ?? (getPortfolioFallback(safeLang, slug) as PortfolioProject | null);

  if (!project) {
    notFound();
  }

  return (
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
        galleryClose: safeLang === 'uz' ? 'Yopish' : safeLang === 'ru' ? 'Закрыть' : safeLang === 'zh' ? '关闭' : 'Close',
        galleryPrev: safeLang === 'uz' ? 'Oldingi' : safeLang === 'ru' ? 'Предыдущий' : safeLang === 'zh' ? '上一个' : 'Previous',
        galleryNext: safeLang === 'uz' ? 'Keyingi' : safeLang === 'ru' ? 'Следующий' : safeLang === 'zh' ? '下一个' : 'Next',
      }}
    />
  );
}
