'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Slaydlar tarjimalari
const translations = {
  uz: [
    {
      id: 1,
      title: "Hozirgi bozor sharoitida brendingiz qayerda? (Vaziyat)",
      subtitle: "Kompaniyangiz ishlamoqda, reklama yoqilgan, mijozlar saytga yoki ijtimoiy tarmoqqa kirmoqda. Vaziyat barqaror ko'rinadi. Lekin bu haqiqiy potentsialingizmi?",
      theme: "dark"
    },
    {
      id: 2,
      title: "Bizneslar sezmaydigan yashirin muammolar (Muammo)",
      subtitle: "Logotip eskirgan, qadoq javonda ko'zga tashlanmaydi, sayt esa arzon ko'rinadi. Mijozlar keladi, lekin vizual ishonch his qilmagani uchun sotib olmasdan chiqib ketadi.",
      theme: "light"
    },
    {
      id: 3,
      title: "Ushbu zaifliklar sizga qanchaga tushyapti? (Oqibat)",
      subtitle: "Ishonchsiz ko'rinish sababli har bir reklama so'rovidan 15% dan 35% gacha daromad yo'qotyapsiz. Siz reklamaga pul tikyapsiz, lekin foydani raqiblar olyapti.",
      theme: "dark"
    },
    {
      id: 4,
      title: "Vizual ishonchni yechish sizga nima beradi? (Qiymat)",
      subtitle: "Premium brending vizual ishonchni 2 barobar oshiradi. Mijozlar shubhasiz xarid qiladi, reklama konversiyasi ko'tariladi va mahsulotni 20-30% qimmatroq sota olasiz.",
      theme: "blue"
    },
    {
      id: 5,
      title: "Jon Branding — Qanday yordam beramiz?",
      features: [
        "Neyming (Bozorda farqlanuvchi va esda qoluvchi nom)",
        "Aydentika (Kuchli logotip va korporativ uslub tizimi)",
        "Premium Qadoq dizayni (Javondagi eng jozibador ko'rinish)",
        "Veb-saytlar (Mijozlarni sotuvga yetaklovchi Sales Machine)"
      ],
      theme: "light"
    },
    {
      id: 6,
      title: "Bepul Brand Audit bilan boshlang",
      subtitle: "Qumri Coffee (+41% sotuv) va Oltin Bulut (+31% sotuv) kabi natijalarga erishish uchun birinchi qadamni qo'ying. 15 daqiqada brendingizdagi 3 ta eng katta zaiflikni ko'rsatamiz.",
      cta: "Bepul auditga yozilish ↗",
      theme: "blue"
    }
  ],
  ru: [
    {
      id: 1,
      title: "Где находится ваш бренд на рынке? (Ситуация)",
      subtitle: "Ваш бизнес работает, реклама запущена, клиенты заходят на сайт или в соцсети. Ситуация кажется стабильной. Но это ли ваш максимум?",
      theme: "dark"
    },
    {
      id: 2,
      title: "Скрытые проблемы, которые вы не замечаете (Проблема)",
      subtitle: "Логотип устарел, упаковка теряется на полке, сайт выглядит дешево. Клиенты приходят, но уходят без покупки, не почувствовав визуального доверия.",
      theme: "light"
    },
    {
      id: 3,
      title: "Во сколько вам обходятся эти слабости? (Последствие)",
      subtitle: "Из-за недоверия к внешнему виду вы теряете от 15% до 35% дохода с каждого лида. Вы вкладываете в трафик, но прибыль забирают другие.",
      theme: "dark"
    },
    {
      id: 4,
      title: "Что даст вам решение проблемы доверия? (Выгода)",
      subtitle: "Премиальный брендинг удваивает визуальное доверие. Клиенты покупают без сомнений, конверсия рекламы растет, и вы продаете продукт на 20-30% дороже.",
      theme: "blue"
    },
    {
      id: 5,
      title: "Jon Branding — Чем мы можем помочь?",
      features: [
        "Нейминг (Выделяющееся и запоминающееся имя)",
        "Айдентика (Сильный логотип и система фирменного стиля)",
        "Премиум дизайн упаковки (Заметность на полке с первой секунды)",
        "Веб-сайты (Системы конверсии уровня Sales Machine)"
      ],
      theme: "light"
    },
    {
      id: 6,
      title: "Начнем с бесплатного Бренд-Аудита",
      subtitle: "Сделайте первый шаг к результатам вроде Qumri Coffee (+41% продаж) и Oltin Bulut (+31% продаж). За 15 минут укажем на 3 главные слабости бренда.",
      cta: "Получить аудит бесплатно ↗",
      theme: "blue"
    }
  ],
  en: [
    {
      id: 1,
      title: "Where is your brand in today's market? (Situation)",
      subtitle: "Your business is running, ads are active, customers visit your site or social media. The situation seems stable. But is this your true potential?",
      theme: "dark"
    },
    {
      id: 2,
      title: "Hidden problems you fail to notice (Problem)",
      subtitle: "The logo is outdated, the packaging fails to stand out, and the website looks cheap. Customers visit, but leave without buying because they feel no visual trust.",
      theme: "light"
    },
    {
      id: 3,
      title: "What are these weaknesses costing you? (Implication)",
      subtitle: "Due to lack of visual trust, you are losing 15% to 35% of revenue from every single lead. You invest in traffic, but competitors reap the profits.",
      theme: "dark"
    },
    {
      id: 4,
      title: "What does solving visual trust give you? (Need-Payoff)",
      subtitle: "Premium branding doubles visual trust. Customers buy without hesitation, ad conversion increases, and you can sell your product at a 20-30% premium.",
      theme: "blue"
    },
    {
      id: 5,
      title: "Jon Branding — How can we help?",
      features: [
        "Naming (Distinct and highly memorable business name)",
        "Identity (Strong logo and unified corporate style system)",
        "Premium Packaging (The most eye-catching look on the shelf)",
        "Websites (Conversion-driven web solutions to generate sales)"
      ],
      theme: "light"
    },
    {
      id: 6,
      title: "Start with a Free Brand Audit",
      subtitle: "Take the first step towards results like Qumri Coffee (+41% sales) and Oltin Bulut (+31% sales). In 15 minutes, we will reveal your 3 biggest brand weaknesses.",
      cta: "Get Free Audit ↗",
      theme: "blue"
    }
  ],
  zh: [
    {
      id: 1,
      title: "在当前的市场环境下，您的品牌处于什么位置？(现状)",
      subtitle: "您的业务正在运行，广告已投放，客户正在访问您的网站或社交媒体。一切看似稳定。但这真的是您的全部潜力吗？",
      theme: "dark"
    },
    {
      id: 2,
      title: "企业往往忽视的隐性问题 (问题)",
      subtitle: "标志陈旧、包装在货架上被淹没、网站显得廉价。客户来了，但因为缺乏视觉信任感，未购买便离开了。",
      theme: "light"
    },
    {
      id: 3,
      title: "这些视觉弱点让您付出了什么代价？(影响)",
      subtitle: "由于缺乏信任感，您在每次广告获客中流失了15%到35%的潜在收入。您为流量付费，但利润却被竞争对手夺走。",
      theme: "dark"
    },
    {
      id: 4,
      title: "解决信任度能为您带来什么收益？(需求价值)",
      subtitle: "高端品牌建设使视觉信任度倍增。客户购买时不再犹豫，广告转化率显著提升，您的产品可实现20-30%的溢价销售。",
      theme: "blue"
    },
    {
      id: 5,
      title: "Jon Branding — 我们如何助您成功？",
      features: [
        "命名（在同类市场中脱颖而出且便于传播的名称）",
        "视觉识别（高端独特的标志与完备的品牌视觉系统）",
        "高端包装设计（让您的产品在货架上成为吸睛焦点）",
        "定制化营销网站（真正为您企业获客的销售机器网站）"
      ],
      theme: "light"
    },
    {
      id: 6,
      title: "从免费的品牌审计开始",
      subtitle: "迈出走向成功的第一步，像Qumri Coffee（销量+41%）和Oltin Bulut（销量+31%）一样实现增长。仅需15分钟，我们将指出品牌最大的3个弱点。",
      cta: "免费获取审计报告 ↗",
      theme: "blue"
    }
  ]
} as const;

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  features?: readonly string[];
  theme: "dark" | "light" | "blue";
  cta?: string;
}

export default function PresentationPage() {
  const params = useParams();
  const rawLang = params?.lang as string;
  const lang = (['uz', 'ru', 'en', 'zh'].includes(rawLang) ? rawLang : 'uz') as keyof typeof translations;

  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesList = (translations[lang] || translations.uz) as unknown as Slide[];
  const slideRef = useRef<HTMLDivElement>(null);

  // Klaviatura orqali slaydni boshqarish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, slidesList.length - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slidesList.length]);

  // Slayderni faol indeksga avtomatik scroll qilish
  useEffect(() => {
    if (slideRef.current) {
      const targetElement = slideRef.current.children[currentSlide] as HTMLElement;
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentSlide]);

  // Foydalanuvchi scroll qilganda faol slayd indeksini aniqlash
  const handleScroll = () => {
    if (!slideRef.current) return;
    const scrollPosition = slideRef.current.scrollTop;
    const clientHeight = slideRef.current.clientHeight;
    if (clientHeight > 0) {
      const index = Math.round(scrollPosition / clientHeight);
      if (index !== currentSlide && index >= 0 && index < slidesList.length) {
        setCurrentSlide(index);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0A0A] overflow-hidden flex flex-col">
      
      {/* Yuqori panel: Orqaga qaytish va Progress bar */}
      <div className="fixed top-0 inset-x-0 h-16 z-[10000] px-6 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <Link 
            href={`/${lang}`} 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
        </div>

        {/* Sahifa ko'rsatkichi (Slide index) */}
        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/60 font-mono text-xs backdrop-blur-md">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slidesList.length).padStart(2, '0')}
        </div>
      </div>

      {/* Slaydlar konteyneri */}
      <div 
        ref={slideRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {slidesList.map((slide, index) => {
          const isActive = index === currentSlide;
          
          return (
            <section 
              key={slide.id} 
              className={`
                relative h-full w-full flex-shrink-0 snap-start flex flex-col items-center justify-center p-6 md:p-16 text-center select-none
                ${slide.theme === 'dark' ? 'bg-[#0A0A0A] text-white' : ''}
                ${slide.theme === 'light' ? 'bg-[#F2EFE6] text-[#0E1015]' : ''}
                ${slide.theme === 'blue' ? 'bg-[#1B4DFF] text-white' : ''}
              `}
            >
              
              {/* Orqa fon nozik shovqin teksturasi */}
              <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-repeat bg-center" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

              <div className="max-w-[1000px] w-full mx-auto flex flex-col items-center justify-center z-10 px-4">
                
                {/* Asosiy Slayd Sarlavhasi */}
                <h1 
                  className="font-extrabold mb-6 md:mb-10 font-[family-name:var(--font-jakarta)] leading-[1.08] tracking-tight"
                  style={{ fontSize: 'clamp(36px, 5.5vw, 76px)', letterSpacing: '-0.035em' }}
                >
                  {slide.title.split('\n').map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h1>
                
                {/* Slayd Ta'rifi */}
                {slide.subtitle && (
                  <p 
                    className="text-base md:text-2xl leading-relaxed opacity-85 max-w-[850px] font-normal"
                    style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {slide.subtitle}
                  </p>
                )}

                {/* Slayd Xususiyatlari / Punktlar */}
                {slide.features && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full mt-6 text-left max-w-[900px]">
                    {slide.features.map((feat: string, i: number) => (
                      <div 
                        key={i} 
                        className={`
                          p-5 md:p-6 rounded-2xl border transition-all duration-300
                          ${slide.theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : ''}
                          ${slide.theme === 'light' ? 'bg-black/5 border-black/10 hover:bg-black/8 text-[#0E1015]' : ''}
                        `}
                      >
                        <div className="font-semibold text-lg md:text-xl leading-snug">{feat}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Action Tugmasi */}
                {slide.cta && (
                  <div className="mt-10 md:mt-14">
                    <Link 
                      href={`/${lang}#aloqa`} 
                      className="inline-flex items-center justify-center bg-white text-[#1B4DFF] rounded-full px-10 py-5 font-bold text-lg md:text-xl hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                    >
                      {slide.cta}
                    </Link>
                  </div>
                )}
                
              </div>
              
              {/* Pastki o'tish indikatori (Scroll indicator) */}
              {index !== slidesList.length - 1 && (
                <button 
                  onClick={() => setCurrentSlide(index + 1)}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer transition-opacity hover:opacity-100 opacity-40 active:scale-90"
                  aria-label="Next slide"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce text-current"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                </button>
              )}
            </section>
          );
        })}
      </div>

      {/* Ekran ostidagi Progress bar indikatori */}
      <div className="fixed bottom-0 inset-x-0 h-1 bg-white/10 z-[10000]">
        <div 
          className="h-full bg-[#1B4DFF] transition-all duration-500 ease-out" 
          style={{ width: `${((currentSlide + 1) / slidesList.length) * 100}%` }}
        />
      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
