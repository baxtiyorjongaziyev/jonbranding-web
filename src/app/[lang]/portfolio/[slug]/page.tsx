import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { fetchAllPortfolioSlugs, fetchPortfolioBySlug, findSupersedingSlug } from '@/lib/data/portfolio';
import { getLocalizedAbsoluteUrl, getLocalizedPath, locales } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import { getPortfolioFallback, PortfolioProject } from '@/lib/portfolio-fallbacks';
import { presentPortfolioProject } from '@/lib/portfolio-presentation';
import PortfolioDetailClient from '@/components/portfolio-detail-client';
import { getPageAlternates, pageTitle, ORGANIZATION_ID, SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await fetchAllPortfolioSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang, slug } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as 'uz' | 'ru' | 'en' | 'zh';

  const project = (await fetchPortfolioBySlug(slug)) ?? (getPortfolioFallback(safeLang, slug) as PortfolioProject | null);

  if (!project) {
    return { title: 'Keys topilmadi' };
  }

  return {
    title: pageTitle(project.metaTitle || `${project.title} — Keys`),
    description: project.metaDescription || project.description,
    keywords: project.seoKeywords?.length
      ? project.seoKeywords.join(', ')
      : `${project.client}, brending, keys, dizayn, case study, premium branding`,
    alternates: getPageAlternates(safeLang, `/portfolio/${slug}`),
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

  const [dictionary, sanityProject] = await Promise.all([
    getDictionarySafe(safeLang),
    fetchPortfolioBySlug(slug),
  ]);

  // Shablon keys Sanity'dagi to'liq keys bilan almashtirilgan bo'lsa — eski URL
  // yangisiga doimiy yo'naltiriladi (bitta keys, bitta manzil).
  if (!sanityProject) {
    const supersedingSlug = await findSupersedingSlug(safeLang, slug);
    if (supersedingSlug) {
      permanentRedirect(getLocalizedPath(safeLang, `/portfolio/${supersedingSlug}`));
    }
  }

  const project = sanityProject ?? (getPortfolioFallback(safeLang, slug) as PortfolioProject | null);

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

  // Keys Google va AI qidiruvlarga "agentlik bajargan loyiha" sifatida tanilishi uchun.
  const url = getLocalizedAbsoluteUrl(SITE_URL, safeLang, `/portfolio/${slug}`);
  const image = project.coverImage?.startsWith('/') ? `${SITE_URL}${project.coverImage}` : project.coverImage;
  const portfolioLabel = safeLang === 'ru' ? 'Портфолио' : safeLang === 'en' ? 'Portfolio' : safeLang === 'zh' ? '作品集' : 'Portfolio';
  const homeLabel = safeLang === 'ru' ? 'Главная' : safeLang === 'en' ? 'Home' : safeLang === 'zh' ? '首页' : 'Bosh sahifa';
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${url}#case`,
      name: project.metaTitle || project.title,
      headline: project.title,
      description: project.metaDescription || project.description,
      url,
      inLanguage: safeLang,
      ...(image ? { image } : {}),
      genre: project.categoryLabel,
      keywords: project.seoKeywords?.length ? project.seoKeywords.join(', ') : project.tags?.join(', '),
      creator: { '@id': ORGANIZATION_ID },
      ...(project.client ? { sourceOrganization: { '@type': 'Organization', name: project.client } } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeLabel, item: getLocalizedAbsoluteUrl(SITE_URL, safeLang) },
        { '@type': 'ListItem', position: 2, name: portfolioLabel, item: getLocalizedAbsoluteUrl(SITE_URL, safeLang, '/portfolio') },
        { '@type': 'ListItem', position: 3, name: project.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLd) }} />
      <PortfolioDetailClient
        project={presentPortfolioProject(project)}
        lang={safeLang}
        dictionary={{ backBtn, resultsTitle, transformTitle, ctaTitle, ctaDesc, ctaBtn }}
      />
    </>
  );
}
