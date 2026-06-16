'use client';
import type { FC } from 'react';
import Image from 'next/image';

const FEATURED = {
  name: 'ARFADEL',
  city: 'Toshkent',
  year: '2026',
  cat: 'Logotip · Firma uslubi · Tovar belgisi',
  story: "Toshkentdagi premium parfyumeriya brendiga to'liq vizual identifikatsiya yaratildi. Yangi logotip, rang tizimi va qadoq dizayni bilan brend bozorga chiqdi — 3 oy ichida 8 500+ obunachilar jamg'arildi.",
  metrics: [
    { n: '8 500+', l: 'Obunachilar' },
    { n: '3', l: 'Oy ichida' },
    { n: '100%', l: "To'liq aydentika" },
  ],
  image: '/images/cms/arfadel-brand.png',
};

const AtFeatured: FC = () => {
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
            <span>Asosiy keys · {c.year}</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4FB07A' }} />
              Faol
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
            Asosiy keys · {c.year}
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
            {c.cat}
          </div>

          <p
            className="leading-[1.6] max-w-[480px]"
            style={{ fontSize: 17, color: 'rgba(244,241,232,.75)' }}
          >
            {c.story}
          </p>

          <div
            className="grid grid-cols-3 gap-0 pt-8 mt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}
          >
            {c.metrics.map((m, i) => (
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
