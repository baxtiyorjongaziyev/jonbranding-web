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
      title: "Brendingiz aslida qancha yo'qotyapti?",
      subtitle: "Noto'g'ri qadoq, eskirgan logotip va ishonchsiz veb-sayt sababli yuzlab potensial mijozlar har kuni raqobatchilarni tanlamoqda.",
      theme: "dark"
    },
    {
      id: 2,
      title: "Reklama sotmaydi, agar brendingiz zaif bo'lsa",
      subtitle: "Siz qanchalik ko'p reklama qilmang, agar mijoz mahsulotingizni ko'rganda «arzon» yoki «ishonchsiz» degan hisni tuysa, reklama byudjetingiz havoga uchadi.",
      theme: "light"
    },
    {
      id: 3,
      title: "Jon Branding — Premium Brending Agentligi",
      subtitle: "Biz shunchaki \"chiroyli rasm\" chizmaymiz. Biz biznesingizni bozorda to'g'ri joylashtirib (pozitsiyalab), mijoz ko'zida uning qadrini oshiramiz va sotishni osonlashtiramiz.",
      theme: "blue"
    },
    {
      id: 4,
      title: "Sizga qanday yordam bera olamiz?",
      features: [
        "Neyming (Bozorda farqlanuvchi va esda qoluvchi nom)",
        "Aydentika (Kuchli logotip va korporativ uslub tizimi)",
        "Premium Qadoq dizayni (Javondagi eng jozibador ko'rinish)",
        "Veb-saytlar (Mijozlarni sotuvga yetaklovchiSales Machine)"
      ],
      theme: "light"
    },
    {
      id: 5,
      title: "Hamkorlarimiz erishgan aniq natijalar",
      features: [
        "Qumri Coffee (+41% sotuv, 3× takroriy mijoz)",
        "Oltin Bulut (+31% sotuv yangi qadoqdan keyin)",
        "Humo Fintech (180K+ faol foydalanuvchi)",
        "Nur Sopol (Supermarket javonida 2× ko'proq ko'rinish)"
      ],
      theme: "dark"
    },
    {
      id: 6,
      title: "Bepul Brand Audit bilan boshlaymiz",
      subtitle: "Hozirgi brendingiz nima uchun kam sotayotganini 15 daqiqada tahlil qilib, 3 ta eng katta zaiflik va ularni tuzatish rejasini ko'rsatamiz. Majburiyatsiz.",
      cta: "Bepul auditga yozilish ↗",
      theme: "blue"
    }
  ],
  ru: [
    {
      id: 1,
      title: "Сколько ваш бренд теряет на самом деле?",
      subtitle: "Из-за плохой упаковки, устаревшего логотипа и ненадежного сайта сотни потенциальных клиентов ежедневно уходят к конкурентам.",
      theme: "dark"
    },
    {
      id: 2,
      title: "Реклама не продает, если бренд слабый",
      subtitle: "Сколько бы вы ни тратили на рекламу, если при виде вашего продукта клиент чувствует «дешевизну» или «ненадежность», ваш бюджет тратится впустую.",
      theme: "light"
    },
    {
      id: 3,
      title: "Jon Branding — Премиум Бренд-Ателье",
      subtitle: "Мы не просто рисуем «красивые картинки». Мы правильно позиционируем ваш бизнес на рынке, повышаем его ценность в глазах клиента и облегчаем продажи.",
      theme: "blue"
    },
    {
      id: 4,
      title: "Чем мы можем помочь?",
      features: [
        "Нейминг (Выделяющееся и запоминающееся имя)",
        "Айдентика (Сильный логотип и система фирменного стиля)",
        "Премиум-дизайн упаковки (Самый привлекательный вид на полке)",
        "Веб-сайты (Конвертящие веб-решения уровня Sales Machine)"
      ],
      theme: "light"
    },
    {
      id: 5,
      title: "Реальные результаты наших партнеров",
      features: [
        "Qumri Coffee (+41% продаж, 3× повторных клиентов)",
        "Оltin Bulut (+31% продаж после изменения упаковки)",
        "Humo Fintech (180K+ активных пользователей)",
        "Nur Sopol (В 2 раза больше видимости на полках)"
      ],
      theme: "dark"
    },
    {
      id: 6,
      title: "Начнем с бесплатного Бренд-Аудита",
      subtitle: "За 15 минут проанализируем ваш бренд, укажем на 3 ключевые слабости и дадим план по их устранению. Без обязательств.",
      cta: "Получить аудит бесплатно ↗",
      theme: "blue"
    }
  ],
  en: [
    {
      id: 1,
      title: "How much is your brand actually losing?",
      subtitle: "Due to poor packaging, an outdated logo, and an unreliable website, hundreds of potential clients choose competitors every single day.",
      theme: "dark"
    },
    {
      id: 2,
      title: "Ads don't sell if your brand is weak",
      subtitle: "No matter how much you spend on marketing, if a customer perceives your brand as 'cheap' or 'unreliable', your budget goes down the drain.",
      theme: "light"
    },
    {
      id: 3,
      title: "Jon Branding — Premium Brand Atelier",
      subtitle: "We don't just draw 'pretty pictures'. We position your business properly in the market, increase its perceived value, and make selling effortless.",
      theme: "blue"
    },
    {
      id: 4,
      title: "How can we help you?",
      features: [
        "Naming (Distinct and highly memorable business name)",
        "Identica (Strong logo and unified corporate style system)",
        "Premium Packaging (The most eye-catching look on the shelf)",
        "Websites (Conversion-driven web solutions to generate sales)"
      ],
      theme: "light"
    },
    {
      id: 5,
      title: "Proven results of our partners",
      features: [
        "Qumri Coffee (+41% sales, 3× repeat customers)",
        "Oltin Bulut (+31% sales increase with new packaging)",
        "Humo Fintech (180K+ active mobile app users)",
        "Nur Sopol (2× better visibility on store shelves)"
      ],
      theme: "dark"
    },
    {
      id: 6,
      title: "Let's start with a Free Brand Audit",
      subtitle: "We will analyze your current brand in 15 minutes, identify the 3 biggest weaknesses, and share a roadmap to fix them. No obligations.",
      cta: "Get Free Audit ↗",
      theme: "blue"
    }
  ],
  zh: [
    {
      id: 1,
      title: "您的品牌实际上损失了多少？",
      subtitle: "由于包装差、标志过时以及网站不可靠，成百上千的潜在客户每天都会选择您的竞争对手。",
      theme: "dark"
    },
    {
      id: 2,
      title: "如果品牌薄弱，广告也无济于事",
      subtitle: "无论您投入多少营销预算，如果客户觉得您的品牌“廉价”或“不可靠”，您的预算就等于白费。",
      theme: "light"
    },
    {
      id: 3,
      title: "Jon Branding — 精英品牌工作室",
      subtitle: "我们不只是绘制“好看的图片”。我们精准定位您的商业市场，提升客户眼中的品牌价值，让销售变得轻而易举。",
      theme: "blue"
    },
    {
      id: 4,
      title: "我们能如何帮助您？",
      features: [
        "命名（在市场中脱颖而出且易记的品牌名称）",
        "视觉识别（强大的标志及统一的企业形象识别系统）",
        "高端包装设计（货架上最夺目的外观表现）",
        "转化型网站（高转化率网络解决方案，打造销售机器）"
      ],
      theme: "light"
    },
    {
      id: 5,
      title: "我们合作伙伴的真实成果",
      features: [
        "Qumri Coffee（销量增长41%，老客户增加3倍）",
        "Oltin Bulut（采用新包装后销量增长31%）",
        "Humo Fintech（拥有超过18万活跃移动应用用户）",
        "Nur Sopol（在超市货架上的可见度提升2倍）"
      ],
      theme: "dark"
    },
    {
      id: 6,
      title: "从免费的品牌审计开始",
      subtitle: "我们将在15分钟内分析您当前的品牌，找出3个最大弱点并提供解决方案路线图。无任何强制约束。",
      cta: "获取免费品牌审计 ↗",
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
