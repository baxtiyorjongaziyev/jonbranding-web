import { Metadata } from 'next';
import { fetchPortfolioList } from '@/lib/data/portfolio';
import { PortfolioProject } from '@/lib/portfolio-fallbacks';
import { getDictionary, Locale } from '@/lib/dictionaries';
import PortfolioListClient from '@/components/portfolio-list-client';

export const revalidate = 60;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;

  const titles = {
    uz: 'Muvaffaqiyatli Keyslar va Portfolio | Jon.Branding Agentligi',
    ru: 'Портфолио и Кейсы | Брендинговое Агентство Jon.Branding',
    en: 'Case Studies and Portfolio | Jon.Branding Agency',
    zh: '成功案例与作品集 | Jon.Branding 品牌代理机构',
  };

  const descriptions = {
    uz: "Markaziy Osiyodagi premium brendlar uchun yaratilgan brend-strategiyalar, logotip, firma uslubi va sotuvchi qadoq dizayni keyslari.",
    ru: "Реальные кейсы брендинга, дизайна упаковки и логотипов для лидеров рынка в Центральной Азии с окупаемостью инвестиций.",
    en: "Real-world branding, packaging, and logo design case studies for market leaders in Central Asia with proven ROI.",
    zh: "中亚市场领导者的真实品牌、包装和标志设计案例研究，具有经证实的投资回报率。",
  };

  return {
    title: titles[safeLang] || titles.uz,
    description: descriptions[safeLang] || descriptions.uz,
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
    <div className="min-h-screen bg-[#05070f] pt-32 pb-24 text-white relative overflow-hidden">
      {/* Ambient Mesh Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[110px] pointer-events-none z-0" />
      <div className="absolute inset-0 noise-texture opacity-[0.02] pointer-events-none z-0" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            {safeLang === 'uz' ? 'Premium Portfolio' : safeLang === 'ru' ? 'Премиум Портфолио' : safeLang === 'zh' ? '高端作品集' : 'Premium Portfolio'}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            {safeLang === 'uz' 
              ? 'Bizneslarni Premium Darajaga Olib Chiqqan Loyihalarimiz' 
              : safeLang === 'ru' 
                ? 'Проекты, которые вывели бизнес на премиум уровень' 
                : safeLang === 'zh'
                  ? '助推企业跃升高端的标杆案例'
                  : 'Projects That Elevate Businesses to Premium Level'}
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
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
