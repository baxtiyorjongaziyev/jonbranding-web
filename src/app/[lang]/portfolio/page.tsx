import { Metadata } from 'next';
import { fetchPortfolioList } from '@/lib/data/portfolio';
import { PortfolioProject } from '@/lib/portfolio-fallbacks';
import { getDictionary, Locale } from '@/lib/dictionaries';
import PortfolioListClient from '@/components/portfolio-list-client';
import { getPageAlternates } from '@/lib/seo';

export const revalidate = 60;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;

  const titles = {
    uz: 'Muvaffaqiyatli Keyslar va Portfolio',
    ru: 'Портфолио и Кейсы',
    en: 'Case Studies and Portfolio',
    zh: '成功案例与作品集',
  };

  const descriptions = {
    uz: "Markaziy Osiyodagi premium brendlar uchun yaratilgan brend-strategiyalar, logotip, firma uslubi va sotuvchi qadoq dizayni keyslari.",
    ru: "Реальные кейсы брендинга, дизайна упаковки и логотипов для лидеров рынка в Центральной Азии с окупаемостью инвестиций.",
    en: "Real-world branding, packaging, and logo design case studies for market leaders in Central Asia with proven ROI.",
    zh: "中亚市场领导者的真实品牌、包装和标志设计案例研究，具有经证实的投资回报率。",
  };

  const alternates = getPageAlternates(safeLang, '/portfolio');

  return {
    title: titles[safeLang] || titles.uz,
    description: descriptions[safeLang] || descriptions.uz,
    alternates,
    openGraph: {
      title: titles[safeLang] || titles.uz,
      description: descriptions[safeLang] || descriptions.uz,
      type: 'website',
      url: alternates.canonical,
      locale: safeLang === 'uz' ? 'uz_UZ' : safeLang === 'ru' ? 'ru_RU' : safeLang === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Jon.Branding',
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630, alt: 'Jon Branding Portfolio' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[safeLang] || titles.uz,
      description: descriptions[safeLang] || descriptions.uz,
      images: ['/images/cms/og-image.jpeg'],
    },
  };
}

export default async function PortfolioPage(props: Props) {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;

  let dictionary;
  try {
    dictionary = await getDictionary(safeLang);
  } catch (e) {
    dictionary = await getDictionary('uz');
  }

  const projects: PortfolioProject[] = await fetchPortfolioList(safeLang);

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 text-[#0A0B0E] relative overflow-hidden">
      {/* Subtle Ambient Accent Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#2554FF]/5 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[#2554FF]/5 blur-[140px] pointer-events-none z-0" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2554FF]/8 border border-[#2554FF]/20 text-[#2554FF] text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2554FF] animate-pulse"></span>
            {safeLang === 'uz' ? 'Premium Portfolio' : safeLang === 'ru' ? 'Премиум Портфолио' : safeLang === 'zh' ? '高端作品集' : 'Premium Portfolio'}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-[#0A0B0E]">
            {safeLang === 'uz' 
              ? 'Bizneslarni Premium Darajaga Olib Chiqqan Loyihalarimiz' 
              : safeLang === 'ru' 
                ? 'Проекты, которые вывели бизнес на премиум уровень' 
                : safeLang === 'zh'
                  ? '助推企业跃升高端的标杆案例'
                  : 'Projects That Elevate Businesses to Premium Level'}
          </h1>
          
          <p className="text-base md:text-lg text-[#4B5563] leading-relaxed max-w-2xl mx-auto font-medium">
            {safeLang === 'uz'
              ? '15 daqiqalik Brand Auditda sizning mahsulotingizni qanday premium qilishni rejalashtiramiz.'
              : safeLang === 'ru'
                ? 'Реальные результаты ребрендинга и создания продающей визуальной упаковки лидеров рынка.'
                : safeLang === 'zh'
                  ? '市场领导者进行品牌重塑和打造畅销视觉包装的真实成果。'
                  : 'Proven results of transformational rebranding and selling visual identity for market leaders.'}
          </p>
        </div>

        <PortfolioListClient 
          projects={projects} 
          lang={safeLang}
          dictionary={{
            all: safeLang === 'uz' ? 'Barchasi' : safeLang === 'ru' ? 'Все' : safeLang === 'zh' ? '全部' : 'All',
            brandStrategy: safeLang === 'uz' ? 'Brend-strategiya' : safeLang === 'ru' ? 'Бренд-стратегия' : safeLang === 'zh' ? '品牌战略' : 'Brand Strategy',
            logoDesign: safeLang === 'uz' ? 'Logotip dizayni' : safeLang === 'ru' ? 'Дизайн логотипа' : safeLang === 'zh' ? '标志设计' : 'Logo Design',
            brandbook: safeLang === 'uz' ? 'Brendbuk' : safeLang === 'ru' ? 'Брендбук' : safeLang === 'zh' ? '品牌手册' : 'Brandbook',
            corporateStyle: safeLang === 'uz' ? 'Firma uslubi' : safeLang === 'ru' ? 'Фирменный стиль' : safeLang === 'zh' ? '企业视觉' : 'Corporate Style',
            packaging: safeLang === 'uz' ? 'Qadoq dizayni' : safeLang === 'ru' ? 'Дизайн упаковки' : safeLang === 'zh' ? '包装设计' : 'Packaging Design',
            naming: safeLang === 'uz' ? 'Neyming' : safeLang === 'ru' ? 'Нейминг' : safeLang === 'zh' ? '命名' : 'Naming',
            viewCase: safeLang === 'uz' ? 'Keysni ko\'rish' : safeLang === 'ru' ? 'Смотреть кейс' : safeLang === 'zh' ? '查看案例' : 'View Case Study',
            resultsTitle: safeLang === 'uz' ? 'Natijalar' : safeLang === 'ru' ? 'Результаты' : safeLang === 'zh' ? '业绩成果' : 'Results',
          }}
        />
      </div>
    </div>
  );
}
