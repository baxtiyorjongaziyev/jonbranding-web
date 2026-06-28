'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/client';

const translations = {
  uz: [
    { id: 1, type: 'cover', title: 'Jon Branding\nPremium Agentlik', subtitle: 'Biz faqat chiroyli dizayn emas, balki sotuvchi tizimlar (Sales Machine) yaratamiz.', theme: 'dark' },
    { id: 2, type: 'about', title: 'Nega aynan biz?', subtitle: 'Bizning yondashuvimiz oddiy: Mijozlaringiz ishonchini qozonadigan va daromadingizni oshiradigan brendlar yaratish. 50+ dan ortiq muvaffaqiyatli loyihalar.', theme: 'light' },
    { id: 3, type: 'services', title: 'Xizmatlarimiz', features: ['Neyming va Strategiya', 'Logotip va Aydentika', 'Premium Qadoq dizayni', 'Veb-saytlar va UI/UX'], theme: 'blue' },
    { id: 4, type: 'portfolio', title: 'Tanlangan Loyihalar', subtitle: 'Bizning ishlarimiz o\'zi uchun gapiradi', theme: 'dark' },
    { id: 5, type: 'testimonials', title: 'Mijozlarimiz fikri', subtitle: '"Jon Branding bilan ishlaganimizdan so\'ng, sotuvlarimiz 40% ga oshdi va mijozlarimiz brendimizni yangi darajada qabul qila boshladi."\n— Qumri Coffee asoschisi', theme: 'light' },
    { id: 6, type: 'cta', title: 'Biznesingizni yangi bosqichga olib chiqing', cta: 'Loyiha boshlash ↗', theme: 'blue' }
  ],
  ru: [
    { id: 1, type: 'cover', title: 'Jon Branding\nПремиум Агентство', subtitle: 'Мы создаем не просто красивый дизайн, а продающие системы (Sales Machine).', theme: 'dark' },
    { id: 2, type: 'about', title: 'Почему именно мы?', subtitle: 'Наш подход прост: создание брендов, которые завоевывают доверие клиентов и увеличивают вашу прибыль. Более 50+ успешных проектов.', theme: 'light' },
    { id: 3, type: 'services', title: 'Наши услуги', features: ['Нейминг и Стратегия', 'Логотип и Айдентика', 'Премиум дизайн упаковки', 'Веб-сайты и UI/UX'], theme: 'blue' },
    { id: 4, type: 'portfolio', title: 'Избранные проекты', subtitle: 'Наши работы говорят сами за себя', theme: 'dark' },
    { id: 5, type: 'testimonials', title: 'Отзывы клиентов', subtitle: '"После работы с Jon Branding наши продажи выросли на 40%, и клиенты стали воспринимать наш бренд на совершенно новом уровне."\n— Основатель Qumri Coffee', theme: 'light' },
    { id: 6, type: 'cta', title: 'Выведите бизнес на новый уровень', cta: 'Начать проект ↗', theme: 'blue' }
  ],
  en: [
    { id: 1, type: 'cover', title: 'Jon Branding\nPremium Agency', subtitle: 'We don\'t just create beautiful designs, we build sales machines.', theme: 'dark' },
    { id: 2, type: 'about', title: 'Why choose us?', subtitle: 'Our approach is simple: we create brands that win your customers\' trust and increase your revenue. Over 50+ successful projects.', theme: 'light' },
    { id: 3, type: 'services', title: 'Our Services', features: ['Naming & Strategy', 'Logo & Identity', 'Premium Packaging', 'Websites & UI/UX'], theme: 'blue' },
    { id: 4, type: 'portfolio', title: 'Selected Works', subtitle: 'Our work speaks for itself', theme: 'dark' },
    { id: 5, type: 'testimonials', title: 'Client Testimonials', subtitle: '"After working with Jon Branding, our sales increased by 40% and our customers began to perceive our brand at a whole new level."\n— Founder of Qumri Coffee', theme: 'light' },
    { id: 6, type: 'cta', title: 'Take your business to the next level', cta: 'Start Project ↗', theme: 'blue' }
  ],
  zh: [
    { id: 1, type: 'cover', title: 'Jon Branding\n高端品牌机构', subtitle: '我们不仅创造美丽的设计，更打造销售机器。', theme: 'dark' },
    { id: 2, type: 'about', title: '为什么选择我们？', subtitle: '我们的方法很简单：打造赢得客户信任并增加您收入的品牌。超过50个成功案例。', theme: 'light' },
    { id: 3, type: 'services', title: '我们的服务', features: ['命名与战略', '标志与视觉识别', '高端包装设计', '网站与用户体验'], theme: 'blue' },
    { id: 4, type: 'portfolio', title: '精选案例', subtitle: '我们的作品说明了一切', theme: 'dark' },
    { id: 5, type: 'testimonials', title: '客户评价', subtitle: '"与Jon Branding合作后，我们的销售额增长了40%，客户开始以全新的水平看待我们的品牌。"\n— Qumri Coffee创始人', theme: 'light' },
    { id: 6, type: 'cta', title: '将您的业务提升到新水平', cta: '启动项目 ↗', theme: 'blue' }
  ]
} as const;

export default function PresentationClient({ lang, portfolioCases }: { lang: string, portfolioCases: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const slidesList = (translations[lang as keyof typeof translations] || translations.uz) as unknown as any[];

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0A0A] overflow-hidden flex flex-col font-sans">
      <div className="fixed top-0 inset-x-0 h-16 z-[10000] px-6 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <Link 
            href={`/${lang}`} 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/60 font-mono text-xs backdrop-blur-md">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slidesList.length).padStart(2, '0')}
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {slidesList.map((slide, index) => {
            if (index !== currentSlide) return null;
            return (
              <motion.section 
                key={slide.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`
                  absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 md:p-16 text-center select-none
                  ${slide.theme === 'dark' ? 'bg-[#0A0A0A]' : ''}
                  ${slide.theme === 'light' ? 'bg-[#F2EFE6]' : ''}
                  ${slide.theme === 'blue' ? 'bg-[#1B4DFF]' : ''}
                `}
              >
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-repeat bg-center" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

                <div className="max-w-[1000px] w-full mx-auto flex flex-col items-center justify-center z-10 px-4">
                  <h1 
                    className="font-extrabold mb-6 md:mb-10 leading-[1.08] tracking-tight"
                    style={{ fontSize: 'clamp(36px, 5vw, 76px)', letterSpacing: '-0.03em', color: slide.theme === 'light' ? '#0E1015' : '#FFFFFF' }}
                  >
                    {slide.title.split('\n').map((line: string, i: number) => (
                      <span key={i} className="block">{line}</span>
                    ))}
                  </h1>
                  
                  {slide.subtitle && (
                    <p 
                      className="text-base md:text-2xl leading-relaxed opacity-85 max-w-[850px]"
                      style={{ color: slide.theme === 'light' ? '#0E1015' : '#FFFFFF' }}
                    >
                      {slide.subtitle.split('\n').map((line: string, i: number) => (
                        <span key={i} className="block mb-2">{line}</span>
                      ))}
                    </p>
                  )}

                  {slide.type === 'portfolio' && portfolioCases && portfolioCases.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-10">
                      {portfolioCases.slice(0, 3).map((item: any, i: number) => (
                        <div key={i} className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-white/5 border border-white/10 group">
                          {item.mainImage && (
                            <Image 
                              src={urlFor(item.mainImage).width(600).height(450).url()} 
                              alt={item.title} 
                              fill 
                              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                            <h3 className="text-white font-bold text-xl text-left">{item.title}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {slide.features && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full mt-10 text-left max-w-[800px]">
                      {slide.features.map((feat: string, i: number) => (
                        <div 
                          key={i} 
                          className={`
                            p-5 md:p-6 rounded-2xl border transition-all duration-300
                            ${slide.theme === 'dark' ? 'bg-white/5 border-white/10' : ''}
                            ${slide.theme === 'light' ? 'bg-black/5 border-black/10' : ''}
                            ${slide.theme === 'blue' ? 'bg-white/10 border-white/20' : ''}
                          `}
                        >
                          <div className="font-semibold text-lg md:text-xl" style={{ color: slide.theme === 'light' ? '#0E1015' : '#FFFFFF' }}>{feat}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {slide.cta && (
                    <div className="mt-10 md:mt-14 pointer-events-auto">
                      <Link 
                        href={`/${lang}#aloqa`} 
                        className="inline-flex items-center justify-center bg-white text-[#1B4DFF] rounded-full px-10 py-5 font-bold text-lg md:text-xl hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                      >
                        {slide.cta}
                      </Link>
                    </div>
                  )}
                </div>
              </motion.section>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 inset-x-0 h-16 z-[10000] flex items-center justify-between px-6 pointer-events-none">
        <div className="pointer-events-auto">
          <button 
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all active:scale-95 ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white/10'} ${slidesList[currentSlide].theme === 'light' ? 'border-black/20 text-black' : 'border-white/20 text-white'}`}
            disabled={currentSlide === 0}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </div>
        <div className="pointer-events-auto">
          <button 
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slidesList.length - 1))}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all active:scale-95 ${currentSlide === slidesList.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white/10'} ${slidesList[currentSlide].theme === 'light' ? 'border-black/20 text-black' : 'border-white/20 text-white'}`}
            disabled={currentSlide === slidesList.length - 1}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 h-1 bg-white/10 z-[10000]">
        <div 
          className="h-full transition-all duration-500 ease-out" 
          style={{ width: `${((currentSlide + 1) / slidesList.length) * 100}%`, backgroundColor: slidesList[currentSlide].theme === 'blue' ? '#0A0A0A' : '#1B4DFF' }}
        />
      </div>
    </div>
  );
}
