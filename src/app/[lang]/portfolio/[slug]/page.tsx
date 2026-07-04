import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPortfolioBySlug } from '@/lib/data/portfolio';
import { getPortfolioFallback, PortfolioProject } from '@/lib/portfolio-fallbacks';
import PortfolioDetailClient from '@/components/portfolio-detail-client';

export const revalidate = 60;

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = ['den-aroma', 'savod', 'fidda', 'boyarin', 'arfadel', 'beyaz', 'enros', 'diletta'];
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
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as 'uz' | 'ru' | 'en' | 'zh';

  const project = (await fetchPortfolioBySlug(slug)) ?? (getPortfolioFallback(safeLang, slug) as PortfolioProject | null);

  if (!project) {
    return { title: 'Keys topilmadi' };
  }

  return {
    title: project.metaTitle || `${project.title} | Jon.Branding Portfolio`,
    description: project.metaDescription || project.description,
    keywords: project.seoKeywords?.length
      ? project.seoKeywords.join(', ')
      : `${project.client}, brending, keys, dizayn, case study, premium branding`,
  };
}

const dictCache = new Map<string, any>();

async function getDictionarySafe(lang: string) {
  if (dictCache.has(lang)) return dictCache.get(lang);
  const { getDictionary } = await import('@/lib/dictionaries');
  let d;
  try { d = await getDictionary(lang as any); } catch { d = await getDictionary('uz'); }
  dictCache.set(lang, d);
  return d;
}

export default async function PortfolioDetailPage(props: Props) {
  const { lang, slug } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as 'uz' | 'ru' | 'en' | 'zh';

  const [dictionary, project] = await Promise.all([
    getDictionarySafe(safeLang),
    fetchPortfolioBySlug(slug).then(p => p ?? getPortfolioFallback(safeLang, slug) as PortfolioProject | null),
  ]);

  if (!project) {
    notFound();
  }

  const dict = dictionary?.portfolio || {};
  const backBtn = dict.backBtn || (safeLang === 'uz' ? 'Portfolioga qaytish' : safeLang === 'ru' ? 'Назад в портфолио' : safeLang === 'zh' ? '返回作品集' : 'Back to Portfolio');
  const resultsTitle = dict.resultsTitle || (safeLang === 'uz' ? 'Loyiha Erishgan Natijalar' : safeLang === 'ru' ? 'Достигнутые Результаты' : safeLang === 'zh' ? '项目达成的业绩成果' : 'Project Results');
  const transformTitle = dict.transformTitle || (safeLang === 'uz' ? 'Brend Transformatsiyasi (Avval / Keyin)' : safeLang === 'ru' ? 'Трансформация Бренда (До / После)' : safeLang === 'zh' ? '品牌转型蜕变（之前/之后）' : 'Brand Transformation');
  const ctaTitle = dict.ctaTitle || (safeLang === 'uz' ? 'Brendingizni Premium Darajaga Olib Chiqishga Tayyormisiz?' : safeLang === 'ru' ? 'Готовы ли вы вывести свой бренд на премиум-уровень?' : safeLang === 'zh' ? '您准备好将您的品牌提升到高端水平了吗？' : 'Ready to Elevate Your Brand to Premium Level?');
  const ctaDesc = dict.ctaDesc || (safeLang === 'uz' ? 'Biz bilan bog\'laning va brendingiz bozorda qanchalik kuchli ekanini tekshirish uchun Bepul Brand Audit band qiling.' : safeLang === 'ru' ? 'Свяжитесь с нами и запишитесь на бесплатный аудит бренда, чтобы узнать его истинный потенциал.' : safeLang === 'zh' ? '与我们联系并预订免费的品牌审计，以测试您的品牌在市场上的实力。' : 'Get in touch with us and book a Free Brand Audit to discover your brand\'s true potential in the market.');
  const ctaBtn = dict.ctaBtn || (safeLang === 'uz' ? 'Bepul Brand Audit Olish' : safeLang === 'ru' ? 'Получить Бесплатный Аудит' : safeLang === 'zh' ? '获取免费品牌审计' : 'Get Free Brand Audit');

  return (
    <PortfolioDetailClient 
      project={project} 
      lang={safeLang} 
      dictionary={{ backBtn, resultsTitle, transformTitle, ctaTitle, ctaDesc, ctaBtn }}
    />
  );
}
