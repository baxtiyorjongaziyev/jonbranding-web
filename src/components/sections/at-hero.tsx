'use client';
import type { FC } from 'react';
import Image from 'next/image';
import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface PortfolioImage {
  src: string;
  name: string;
  year: string;
}

interface Props {
  onOpen: () => void;
  lang?: string;
  portfolioImages?: PortfolioImage[];
}

type Lang = 'uz' | 'ru' | 'en' | 'zh';

const translations = {
  uz: {
    tagline: 'Premium Brending Agentligi',
    badge: 'Bepul Brand Audit mavjud',
    h1a: 'Brendingiz',
    h1b: 'aslida*',
    h1c: "qancha yo'qotyapti?",
    desc: { text: "Noto'g'ri qadoq, eskirgan logotip va ishonchsiz sayt orqali yuzlab mijozlarni yo'qotyapsiz. ", bold: "Bepul Brand Audit orqali buni qanday tuzatishni bilib oling." },
    cta1: 'Bepul Brand Audit olish ↗',
    cta2: "Xizmatlarni ko'rish →",
    stats: [
      { label: "Yillar", value: '2019+' },
      { label: "O'zgarishlar", value: 'Doimiy' },
      { label: 'Sifat', value: 'Premium' },
    ],
    portfolioBadge: 'Premium brend',
  },
  ru: {
    tagline: 'Премиальное Брендинговое Агентство',
    badge: 'Доступен Бесплатный Аудит',
    h1a: 'Сколько теряет',
    h1b: 'ваш',
    h1c: 'бренд на самом деле?',
    desc: { text: 'Плохая упаковка, устаревший логотип и ненадежный сайт лишают вас сотен клиентов. ', bold: 'Узнайте, как это исправить с помощью бесплатного бренд-аудита.' },
    cta1: 'Получить Бесплатный Аудит ↗',
    cta2: 'Посмотреть услуги →',
    stats: [
      { label: 'Годы', value: '2019+' },
      { label: 'Изменения', value: 'Постоянно' },
      { label: 'Качество', value: 'Премиум' },
    ],
    portfolioBadge: 'Премиум бренд',
  },
  en: {
    tagline: 'Premium Branding Agency',
    badge: 'Free Brand Audit Available',
    h1a: 'How much is',
    h1b: 'your',
    h1c: 'brand actually losing?',
    desc: { text: 'Poor packaging, an outdated logo, and an unreliable website are costing you hundreds of clients. ', bold: 'Find out how to fix it with a Free Brand Audit.' },
    cta1: 'Get Free Brand Audit ↗',
    cta2: 'View services →',
    stats: [
      { label: 'Years', value: '2019+' },
      { label: 'Changes', value: 'Constant' },
      { label: 'Quality', value: 'Premium' },
    ],
    portfolioBadge: 'Premium brand',
  },
  zh: {
    tagline: '高端品牌机构',
    badge: '提供免费品牌诊断',
    h1a: '您的品牌',
    h1b: '实际上',
    h1c: '在损失多少？',
    desc: { text: '糟糕的包装、过时的标志和不可靠的网站让您失去了数百名客户。', bold: '通过免费品牌诊断了解如何修复它。' },
    cta1: '获取免费品牌诊断 ↗',
    cta2: '查看服务 →',
    stats: [
      { label: '年份', value: '2019+' },
      { label: '变化', value: '持续' },
      { label: '质量', value: '高端' },
    ],
    portfolioBadge: '高端品牌',
  },
} as const;

const DEFAULT_IMAGES: PortfolioImage[] = [
  { src: '/images/cms/beyaz-gold.jpg', name: 'Beyaz', year: '2026' },
  { src: '/images/cms/arfadel-cover.jpg', name: 'ARFADEL', year: '2026' },
  { src: '/images/cms/enros-cover.jpg', name: 'Enros', year: '2025' },
  { src: '/images/cms/boyarin-hozir.png', name: 'Boyarin', year: '2026' },
  { src: '/images/cms/savod-hozir.png', name: 'Savod', year: '2025' },
  { src: '/images/cms/fidda-hozir.png', name: 'Fidda', year: '2025' },
];

const AtHero: FC<Props> = ({ onOpen, lang = 'uz', portfolioImages = [] }) => {
  const l = translations[(lang as Lang) in translations ? (lang as Lang) : 'uz'];
  const sectionRef = useRef<HTMLElement>(null);
  const [spot, setSpot] = useState({ x: -999, y: -999, visible: false });
  const [activeIndex, setActiveIndex] = useState(0);

  const pool = portfolioImages.length > 0 ? portfolioImages : DEFAULT_IMAGES;

  useEffect(() => {
    if (pool.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pool.length);
    }, 3500); // 3.5 seconds fast transition
    return () => clearInterval(timer);
  }, [pool.length]);

  const activeItem = pool[activeIndex];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpot((s) => ({ ...s, visible: false }));
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-[var(--at-bg)] pt-16 pb-16 md:pt-24 relative overflow-hidden"
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.visible ? 1 : 0,
          background: `radial-gradient(600px circle at ${spot.x}px ${spot.y}px, rgba(27,77,255,0.07), transparent 60%)`,
        }}
      />
      
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* LEFT — Text Copy */}
          <div className="flex-1 w-full pb-8 lg:pb-16 max-w-[700px] z-20">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--at-green)] animate-pulse" />
                {l.tagline}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest border border-[var(--at-line)] rounded-full px-3 py-1 text-[var(--at-ink-2)] bg-[var(--at-paper)]">
                {l.badge}
              </span>
            </div>

            <h1
              className="font-bold text-[var(--at-ink)] mb-8"
              style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 0.95, letterSpacing: '-0.03em' }}
            >
              <span className="block">{l.h1a}</span>
              <span className="block text-[var(--at-accent)] font-[family-name:var(--font-serif)] italic">
                {l.h1b}
                <sup className="font-[family-name:var(--font-mono)] not-italic text-[var(--at-muted)]" style={{ fontSize: '0.22em', top: '-0.6em', letterSpacing: '0' }}>*</sup>
              </span>
              <span className="block">{l.h1c}</span>
            </h1>

            <p className="text-[var(--at-ink-2)] text-base md:text-lg leading-relaxed max-w-[480px] mb-8">
              {l.desc.text}
              <strong className="text-[var(--at-ink)]">{l.desc.bold}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpen}
                className="inline-flex items-center justify-center gap-2 bg-[var(--at-accent)] text-white rounded-full px-7 py-4 font-semibold text-sm hover:-translate-y-0.5 transition-transform"
              >
                {l.cta1}
              </button>
              <button
                onClick={() => document.getElementById('narxlar')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 border border-[var(--at-line)] rounded-full px-7 py-4 text-sm text-[var(--at-ink-2)] hover:text-[var(--at-ink)] hover:border-[var(--at-ink)] transition-colors bg-[var(--at-paper)]"
              >
                {l.cta2}
              </button>
            </div>
          </div>

          {/* RIGHT — Single Image Slideshow */}
          <div className="flex-1 w-full lg:max-w-[700px] xl:max-w-[800px] pb-12 lg:pb-16 flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3] rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-[var(--at-line)] bg-[var(--at-paper)] shadow-2xl group cursor-pointer">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0"
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Image 
                    src={activeItem.src} 
                    alt={activeItem.name} 
                    fill 
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 800px" 
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex justify-between items-end">
                    <div>
                      <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-white font-bold text-3xl md:text-5xl mb-3 tracking-tight leading-tight drop-shadow-lg"
                      >
                        {activeItem.name}
                      </motion.h2>
                      <motion.span 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs md:text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest rounded-full shadow-lg"
                      >
                        PORTFOLIO · {activeItem.year}
                      </motion.span>
                    </div>
                    
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-colors border border-white/20 group-hover:bg-white/20 shadow-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AtHero;
