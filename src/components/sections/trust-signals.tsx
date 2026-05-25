import React from 'react';
import { Award, TrendingUp, Users, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';

interface TrustSignal {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

interface TrustSignalsDictionary {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  signals?: TrustSignal[];
}

const getDefaultSignals = (lang: string): TrustSignal[] => {
  if (lang === 'ru') {
    return [
      {
        icon: <Award className="h-8 w-8 text-blue-600" />,
        title: 'Премиум качество',
        description: 'Работаем только с амбициозными брендами, которые хотят премиум-позиционирование',
        highlight: '100% удовлетворение',
      },
      {
        icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
        title: 'Доказанные результаты',
        description: 'Наши клиенты видят рост осознания бренда и увеличение конверсии на 40-60%',
        highlight: '+150 успешных проектов',
      },
      {
        icon: <Users className="h-8 w-8 text-blue-600" />,
        title: 'Эксперт-команда',
        description: 'Стратеги, дизайнеры и аналитики с опытом работы с Fortune 500',
        highlight: '9+ лет в индустрии',
      },
      {
        icon: <Shield className="h-8 w-8 text-blue-600" />,
        title: 'Гарантия качества',
        description: 'Неограниченные правки до полного удовлетворения вашими результатами',
        highlight: 'Гарантия возврата',
      },
      {
        icon: <Zap className="h-8 w-8 text-blue-600" />,
        title: 'Быстрое выполнение',
        description: 'Проекты завершаются в среднем за 4-8 недель без потери качества',
        highlight: 'На сроке + на бюджет',
      },
      {
        icon: <CheckCircle2 className="h-8 w-8 text-blue-600" />,
        title: 'Полная поддержка',
        description: 'Встроенная поддержка после запуска: гайдлайны, тренинги, доработки',
        highlight: '3-6 месяцев поддержки',
      },
    ];
  } else if (lang === 'en') {
    return [
      {
        icon: <Award className="h-8 w-8 text-blue-600" />,
        title: 'Premium Quality',
        description: 'We only work with ambitious brands committed to premium positioning',
        highlight: '100% satisfaction rate',
      },
      {
        icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
        title: 'Proven Results',
        description: 'Our clients see 40-60% increase in brand awareness and conversion rates',
        highlight: '+150 successful projects',
      },
      {
        icon: <Users className="h-8 w-8 text-blue-600" />,
        title: 'Expert Team',
        description: 'Strategists, designers and analysts with Fortune 500 experience',
        highlight: '9+ years in industry',
      },
      {
        icon: <Shield className="h-8 w-8 text-blue-600" />,
        title: 'Quality Guarantee',
        description: 'Unlimited revisions until you are completely satisfied with results',
        highlight: 'Money-back guarantee',
      },
      {
        icon: <Zap className="h-8 w-8 text-blue-600" />,
        title: 'Fast Delivery',
        description: 'Projects completed in 4-8 weeks on average without quality loss',
        highlight: 'On time + on budget',
      },
      {
        icon: <CheckCircle2 className="h-8 w-8 text-blue-600" />,
        title: 'Full Support',
        description: 'Built-in post-launch support: guidelines, training, updates',
        highlight: '3-6 months support included',
      },
    ];
  } else if (lang === 'zh') {
    return [
      {
        icon: <Award className="h-8 w-8 text-blue-600" />,
        title: '高端品质',
        description: '只与致力于高端定位的雄心勃勃品牌合作',
        highlight: '100% 满意度',
      },
      {
        icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
        title: '成果显著',
        description: '我们的客户品牌认知度和转化率平均增长 40-60%',
        highlight: '+150 成功案例',
      },
      {
        icon: <Users className="h-8 w-8 text-blue-600" />,
        title: '专家团队',
        description: '拥有财富 500 强经验的战略家、设计师和分析师',
        highlight: '9+ 年行业经验',
      },
      {
        icon: <Shield className="h-8 w-8 text-blue-600" />,
        title: '品质保证',
        description: '无限修改直到您完全满意',
        highlight: '退款保证',
      },
      {
        icon: <Zap className="h-8 w-8 text-blue-600" />,
        title: '快速交付',
        description: '平均 4-8 周完成项目，不降低质量',
        highlight: '按时按预算',
      },
      {
        icon: <CheckCircle2 className="h-8 w-8 text-blue-600" />,
        title: '全面支持',
        description: '内置启动后支持：指南、培训、更新',
        highlight: '包括 3-6 个月支持',
      },
    ];
  }
  // Default to Uzbek
  return [
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: 'Premium Sifati',
      description: 'Faqat premium pozitsiyonlashga intilayotgan ishtiyoqli brendlar bilan ishlaydi',
      highlight: '100% qoniqish',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: 'Isbotlangan Natijalari',
      description: 'Bizning mijozlar brend faryodini va konversiya ko\'paytirish 40-60% ko\'pida ko\'radi',
      highlight: '+150 muvaffaqiyatli loyiha',
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Mutaxassis Jamoasi',
      description: 'Fortune 500 kompaniyalari bilan ishlash tajribasi bo\'lgan strateglar va dizaynerlar',
      highlight: '9+ yil tajriba',
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Sifat Kafolati',
      description: 'Sizning qoniqishingizga qadar cheksiz ravista',
      highlight: 'Puli qaytarish kafolati',
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: 'Tez Yetkazish',
      description: 'Loyihalar o\'rtacha 4-8 haftada sifat yo\'qotmasdan tugadi',
      highlight: 'Muddatda + byujetda',
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-blue-600" />,
      title: 'Toliq Qo\'llab-quvvatlash',
      description: 'O\'rnatilgan tashkilot-keyingi qo\'llab-quvvatlash: qo\'llanmalar, treninglar',
      highlight: '3-6 oylik qo\'llab-quvvatlash',
    },
  ];
};

interface TrustSignalsProps {
  lang: string;
  dictionary?: TrustSignalsDictionary;
}

const TrustSignals: React.FC<TrustSignalsProps> = ({ lang, dictionary }) => {
  const defaultSignals = getDefaultSignals(lang);
  const signals = dictionary?.signals || defaultSignals;

  const title = dictionary?.title || (
    lang === 'uz' ? 'Nima uchun Jon.Branding bilan ishlash kerak?' :
    lang === 'ru' ? 'Почему выбирают Jon.Branding?' :
    lang === 'en' ? 'Why Choose Jon.Branding?' :
    '为什么选择 Jon.Branding？'
  );

  const subtitle = dictionary?.subtitle || (
    lang === 'uz' ? 'Biz faqat premium sifatli brending xizmatlarini taqdim etamiz, bu yerda har bir loyiha bizning imiji' :
    lang === 'ru' ? 'Мы предоставляем только премиум-качество брендинга, где каждый проект - это наша репутация' :
    lang === 'en' ? 'We provide only premium-quality branding where every project represents our reputation' :
    '我们只提供高端品质的品牌服务，每个项目都是我们的声誉'
  );

  return (
    <BrandSection tone="light" className="bg-brand-paper py-16 sm:py-24 border-b border-brand-line/80">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow={dictionary?.eyebrow}
          title={title}
          description={subtitle}
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl border border-brand-line bg-white/70 backdrop-blur-sm hover:border-blue-400 hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="mb-4 inline-flex p-3 rounded-xl bg-blue-100/50 group-hover:bg-blue-100 transition-colors duration-300">
                  {signal.icon}
                </div>

                <h3 className="text-lg font-bold text-brand-ink mb-2">
                  {signal.title}
                </h3>

                <p className="text-sm text-brand-slate mb-4 leading-relaxed">
                  {signal.description}
                </p>

                {signal.highlight && (
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                    {signal.highlight}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrandSection>
  );
};

export default TrustSignals;
