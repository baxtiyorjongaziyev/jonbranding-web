'use client';
import type { FC } from 'react';
import Image from 'next/image';
import { useRef, useState, useCallback, useEffect } from 'react';

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
    h1b: 'aslida',
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
  const [startIndex, setStartIndex] = useState(0);

  const allItems = portfolioImages.length > 0 ? portfolioImages : DEFAULT_IMAGES;
  // Create a pool of items that is at least 6 items long to avoid empty slots
  const pool = [...allItems, ...allItems, ...allItems, ...allItems, ...DEFAULT_IMAGES].slice(0, Math.max(6, allItems.length));

  useEffect(() => {
    if (pool.length <= 1) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % pool.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [pool.length]);

  const items = [];
  for (let i = 0; i < 6; i++) {
    items.push(pool[(startIndex + i) % pool.length]);
  }

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
          <div className="flex-1 w-full pb-8 lg:pb-16 max-w-[700px]">
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
              style={{ fontSize: 'clamp(48px, 6vw, 100px)', lineHeight: 0.95, letterSpacing: '-0.04em' }}
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

          {/* RIGHT — Bento Grid Portfolio */}
          <div className="flex-1 w-full lg:max-w-[700px] xl:max-w-[800px] flex flex-col gap-3 md:gap-4 pb-12 lg:pb-16">
            
            {/* Top Row: 1 Large + 2 Stacked */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 h-auto sm:h-[300px] md:h-[340px]">
              {/* Main Featured Item */}
              <div key={items[0].name} className="flex-[1.5] relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer border border-[var(--at-line)] bg-[var(--at-paper)] h-[280px] sm:h-auto animate-in fade-in duration-500">
                <Image src={items[0].src} alt={items[0].name} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 md:bottom-6 md:left-6 md:right-6">
                  <h3 className="text-white font-bold text-2xl md:text-3xl mb-2 tracking-tight leading-tight">{items[0].name}</h3>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest rounded-full">
                    PORTFOLIO · {items[0].year}
                  </span>
                </div>
                
                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </div>
              </div>
              
              {/* Right Stacked Items */}
              <div className="flex-1 flex sm:flex-col gap-3 md:gap-4">
                {[items[1], items[2]].map((item, i) => (
                  <div key={item.name + i} className="flex-1 relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer border border-[var(--at-line)] bg-[var(--at-paper)] h-[160px] sm:h-auto animate-in fade-in duration-500">
                    <Image src={item.src} alt={item.name} fill sizes="(max-width: 768px) 50vw, 200px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg md:text-xl mb-1 tracking-tight leading-snug">{item.name}</h3>
                      <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-[family-name:var(--font-mono)] uppercase tracking-widest rounded-full">
                        {item.year}
                      </span>
                    </div>
                    
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: 3 Horizontal Items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 h-auto sm:h-[180px] md:h-[200px]">
              {[items[3], items[4], items[5]].map((item, i) => (
                <div key={item.name + i} className={`relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer border border-[var(--at-line)] bg-[var(--at-paper)] h-[160px] sm:h-auto animate-in fade-in duration-500 ${i === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
                  <Image src={item.src} alt={item.name} fill sizes="(max-width: 768px) 50vw, 200px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-base md:text-lg mb-1 tracking-tight leading-snug">{item.name}</h3>
                    <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-[family-name:var(--font-mono)] uppercase tracking-widest rounded-full">
                      {item.year}
                    </span>
                  </div>
                  
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AtHero;
