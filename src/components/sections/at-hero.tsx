'use client';
import { getSalesFlow } from '@/lib/sales-flow';
import { type FC, useState, useEffect } from 'react';
import Image from 'next/image';

interface PortfolioImage {
  src: string;
  name: string;
  year: string;
}

interface Props {
  onOpen: () => void;
  lang?: string;
  portfolioImages?: PortfolioImage[];
  dictionary?: {
    hero_tagline?: string;
    hero_badge?: string;
    hero_title?: string;
    hero_title_accent?: string;
    hero_title_end?: string;
    hero_description?: string;
    hero_description_bold?: string;
    hero_primary_cta?: string;
    hero_secondary_cta?: string;
  };
}

type Lang = 'uz' | 'ru' | 'en' | 'zh';

const translations = {
  uz: {
    tagline: 'Premium Brending Agentligi',
    badge: 'Bepul Brand Audit mavjud',
    h1a: 'Brendingiz',
    h1b: 'aslida',
    h1c: "qancha yo'qotyapti?",
    desc: {
      text: "Noto'g'ri qadoq, eskirgan logotip va ishonchsiz sayt orqali yuzlab mijozlarni yo'qotyapsiz. ",
      bold: 'Bepul Brand Audit orqali buni qanday tuzatishni bilib oling.',
    },
    cta1: 'Bepul Brand Audit olish ↗',
    cta2: "Xizmatlarni ko'rish →",
    stats: [
      { label: 'Yillar', value: '2019+' },
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
    desc: {
      text: 'Плохая упаковка, устаревший логотип и ненадежный сайт лишают вас сотен клиентов. ',
      bold: 'Узнайте, как это исправить с помощью бесплатного бренд-аудита.',
    },
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
    desc: {
      text: 'Poor packaging, an outdated logo, and an unreliable website are costing you hundreds of clients. ',
      bold: 'Find out how to fix it with a Free Brand Audit.',
    },
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
    desc: {
      text: '糟糕的包装、过时的标志和不可靠的网站让您失去了数百名客户。',
      bold: '通过免费品牌诊断了解如何修复它。',
    },
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
  { src: '/images/cms/portfolio/rashmilk/rashmilk-sut-1.jpg', name: 'Rash Milk', year: '2026' },
  { src: '/images/cms/portfolio/shirona/Brandbook_Page_44_Outdoor_advertisement.jpeg', name: 'Shirona', year: '2026' },
  { src: '/images/cms/portfolio/savod/savod-signage.png', name: 'Savod', year: '2025' },
  { src: '/images/cms/denaroma-hozir.webp', name: 'Den Aroma', year: '2025' },
  { src: '/images/cms/boyarin-hozir.webp', name: 'Boyarin', year: '2026' },
  { src: '/images/cms/fidda-hozir.webp', name: 'Fidda', year: '2025' },
];

const AtHero: FC<Props> = ({ onOpen, lang = 'uz', portfolioImages = [], dictionary }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const fallback = translations[(lang as Lang) in translations ? (lang as Lang) : 'uz'];
  const l = {
    ...fallback,
    tagline: dictionary?.hero_tagline ?? fallback.tagline,
    badge: getSalesFlow(lang).consultation,
    h1a: dictionary?.hero_title ?? fallback.h1a,
    h1b: dictionary?.hero_title_accent ?? fallback.h1b,
    h1c: dictionary?.hero_title_end ?? fallback.h1c,
    desc: {
      text: dictionary?.hero_description ?? fallback.desc.text,
      bold: dictionary?.hero_description_bold ?? fallback.desc.bold,
    },
    cta1: dictionary?.hero_primary_cta ?? fallback.cta1,
    cta2: dictionary?.hero_secondary_cta ?? fallback.cta2,
  };

  const pool = portfolioImages.length > 0 ? portfolioImages : DEFAULT_IMAGES;

  // Auto-advance portfolio showcase every 3.8s
  useEffect(() => {
    if (pool.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % pool.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [pool.length, isPaused]);

  // Preload all pool images into memory for instant sharp display
  useEffect(() => {
    if (typeof window === 'undefined') return;
    pool.forEach((item) => {
      if (item?.src) {
        const img = new window.Image();
        img.src = item.src;
      }
    });
  }, [pool]);

  const activeItem = pool[index % pool.length] || DEFAULT_IMAGES[0];

  return (
    <section
      className="home-hero bg-white pt-20 pb-16 md:pt-32 md:pb-24 relative overflow-hidden border-b border-slate-100"
    >
      {/* Subtle brand ambient glows */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-5 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* LEFT — Text Copy (30% black structure + 10% electric blue accents) */}
          <div className="flex-1 w-full max-w-[700px] z-20">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-50/80 px-3.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2554FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2554FF] animate-pulse" />
                {l.tagline}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-slate-600">
                {l.badge}
              </span>
            </div>

            <h1
              className="font-black text-[#0A0B0E] mb-6 text-4xl sm:text-6xl lg:text-7xl tracking-tight"
              style={{
                lineHeight: 1.02,
                letterSpacing: '-0.035em',
              }}
            >
              <span className="block">{l.h1a}</span>
              <span className="block font-[family-name:var(--font-serif)] italic font-normal text-[#2554FF]">
                {l.h1b}
              </span>
              <span className="block">{l.h1c}</span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-[500px] mb-8 font-normal">
              {l.desc.text}{' '}
              <strong className="text-[#0A0B0E] font-semibold">{l.desc.bold}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                data-testid="hero-audit-trigger"
                data-oisha-callback=""
                onClick={onOpen}
                className="inline-flex items-center justify-center gap-2 bg-[#2554FF] hover:bg-[#1B4DFF] text-white rounded-full px-8 py-4 font-semibold text-sm shadow-[0_12px_32px_-8px_rgba(37,84,255,0.4)] hover:-translate-y-0.5 transition-all"
              >
                {l.cta1}
              </button>
              <button
                onClick={() =>
                  document.getElementById('ishlar')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-400 rounded-full px-8 py-4 text-sm font-semibold text-slate-800 hover:text-black transition-all bg-white shadow-sm"
              >
                {l.cta2}
              </button>
            </div>

            {/* Quick credentials stat row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 max-w-md">
              {[
                ['9+ yil', 'bozorda'],
                ['500+', 'mijoz'],
                ['100%', 'patent kafolati'],
              ].map(([val, label]) => (
                <div key={label}>
                  <div className="text-xl sm:text-2xl font-bold text-[#0A0B0E] tracking-tight">{val}</div>
                  <div className="text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Hero Rotating Visual Showcase */}
          <div
            className="flex-1 w-full lg:max-w-[700px] xl:max-w-[800px] flex flex-col items-center justify-center gap-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <a
              href="#ishlar"
              aria-label={`${l.portfolioBadge}: ${activeItem.name}`}
              className="home-hero-project relative block w-full aspect-[4/3] lg:aspect-[4/3] xl:aspect-[5/4] overflow-hidden rounded-3xl bg-[#0A0B0E] border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.14)] group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2554FF] focus-visible:ring-offset-4"
            >
              <div className="absolute inset-0">
                <Image
                  key={activeItem.src}
                  src={activeItem.src}
                  alt={activeItem.name}
                  fill
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 1000px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex justify-between items-end">
                  <div>
                    <h2 className="text-white font-bold text-3xl md:text-5xl mb-2 tracking-tight leading-tight drop-shadow-md">
                      {activeItem.name}
                    </h2>
                    <span className="inline-block px-4 py-1.5 bg-black/60 backdrop-blur-md text-white/95 text-xs md:text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest rounded-full border border-white/20">
                      {l.portfolioBadge}{activeItem.year ? ` · ${activeItem.year}` : ''}
                    </span>
                  </div>

                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all border border-white/30 group-hover:bg-[#2554FF] group-hover:border-[#2554FF] shadow-lg">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>

            {/* Slide switcher indicators */}
            <div className="flex items-center gap-2 pt-1" aria-label="Keyslar slayderi">
              {pool.map((item, dotIdx) => (
                <button
                  key={item.src + dotIdx}
                  type="button"
                  onClick={(e) => { e.preventDefault(); setIndex(dotIdx); }}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    index % pool.length === dotIdx
                      ? 'w-7 bg-[#2554FF]'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`${item.name} keysiga o'tish`}
                  aria-current={index % pool.length === dotIdx ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AtHero;
