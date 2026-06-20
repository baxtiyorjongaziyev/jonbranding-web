'use client';
import type { FC } from 'react';
import Image from 'next/image';

interface Props { lang?: string; }
type Lang = 'uz' | 'ru' | 'en' | 'zh';

const t = {
  uz: {
    caseLabel: 'Asosiy keys',
    status: 'Faol',
    cat: 'Logotip · Firma uslubi · Tovar belgisi',
    story: "Toshkentdagi premium parfyumeriya brendiga to'liq vizual identifikatsiya yaratildi. Yangi logotip, rang tizimi va qadoq dizayni bilan brend bozorga chiqdi — 3 oy ichida 8 500+ obunachilar jamg'arildi.",
    metrics: [
      { n: '8 500+', l: 'Obunachilar' },
      { n: '3', l: 'Oy ichida' },
      { n: '100%', l: "To'liq aydentika" },
    ],
  },
  ru: {
    caseLabel: 'Ключевой кейс',
    status: 'Активен',
    cat: 'Логотип · Фирменный стиль · Товарный знак',
    story: 'Создана полная визуальная идентичность для премиум-парфюмерного бренда в Ташкенте. С новым логотипом, цветовой системой и дизайном упаковки бренд вышел на рынок — за 3 месяца набрал 8 500+ подписчиков.',
    metrics: [
      { n: '8 500+', l: 'Подписчиков' },
      { n: '3', l: 'Месяца' },
      { n: '100%', l: 'Полная айдентика' },
    ],
  },
  en: {
    caseLabel: 'Featured case',
    status: 'Active',
    cat: 'Logo · Visual Identity · Trademark',
    story: 'Full visual identity created for a premium perfumery brand in Tashkent. With a new logo, color system, and packaging design, the brand launched — gaining 8,500+ followers in 3 months.',
    metrics: [
      { n: '8 500+', l: 'Followers' },
      { n: '3', l: 'Months' },
      { n: '100%', l: 'Full identity' },
    ],
  },
  zh: {
    caseLabel: '主要案例',
    status: '进行中',
    cat: '标志 · 视觉识别 · 商标',
    story: '为塔什干一个高端香水品牌打造了完整的视觉识别系统。新标志、色彩体系和包装设计帮助品牌成功上市——3个月内积累了8500+粉丝。',
    metrics: [
      { n: '8 500+', l: '粉丝' },
      { n: '3', l: '个月' },
      { n: '100%', l: '完整识别系统' },
    ],
  },
} as const;

const FEATURED = {
  name: 'ARFADEL',
  city: 'Toshkent',
  year: '2026',
  image: '/images/cms/arfadel-brand.png',
};

const AtFeatured: FC<Props> = ({ lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  const c = FEATURED;
  return (
    <section
      className="relative overflow-hidden z-[2]"
      id="ishlar"
      style={{ background: '#0E1015', color: '#F4F1E8' }}
    >
      <div className="grid md:grid-cols-[1.1fr_1fr] min-h-[480px] md:min-h-[680px]">
        {/* Image side */}
        <div className="relative min-h-[320px] md:min-h-0 overflow-hidden bg-[#1A1210]">
          <Image
            src={c.image}
            alt={c.name}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
          <div
            className="absolute top-6 left-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] flex gap-[18px]"
            style={{ color: 'rgba(255,255,255,.75)' }}
          >
            <span>{l.caseLabel} · {c.year}</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4FB07A' }} />
              {l.status}
            </span>
          </div>
        </div>

        {/* Body side */}
        <div className="flex flex-col gap-7 justify-center px-7 py-12 md:px-16 md:py-[72px]">
          <span
            className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em]"
            style={{ color: 'rgba(255,255,255,.55)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4FB07A' }} />
            {l.caseLabel} · {c.year}
          </span>

          <h2
            className="font-bold leading-[0.92]"
            style={{ fontSize: 'clamp(48px, 6vw, 96px)', letterSpacing: '-0.04em' }}
          >
            {c.name}
            <br />
            <span
              className="font-[family-name:var(--font-serif)] italic font-normal"
              style={{ color: '#E0744A' }}
            >
              {c.city}.
            </span>
          </h2>

          <div
            className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.06em]"
            style={{ color: 'rgba(244,241,232,.55)' }}
          >
            {l.cat}
          </div>

          <p
            className="leading-[1.6] max-w-[480px]"
            style={{ fontSize: 17, color: 'rgba(244,241,232,.75)' }}
          >
            {l.story}
          </p>

          <div
            className="grid grid-cols-3 gap-0 pt-8 mt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}
          >
            {l.metrics.map((m, i) => (
              <div
                key={i}
                className={i > 0 ? 'pl-5' : ''}
                style={{
                  paddingRight: i < 2 ? 20 : 0,
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,.08)' : 'none',
                }}
              >
                <div
                  className="font-[family-name:var(--font-serif)] italic font-normal leading-none"
                  style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', color: '#E0744A' }}
                >
                  {m.n}
                </div>
                <div
                  className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] mt-2.5"
                  style={{ color: 'rgba(255,255,255,.55)' }}
                >
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AtFeatured;
