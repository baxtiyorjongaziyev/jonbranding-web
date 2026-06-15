'use client';
import type { FC } from 'react';
import { MockCoffee } from './at-mocks';

const FEATURED = {
  name: 'Qumri Coffee',
  city: 'Samarqand',
  year: '2025',
  cat: 'Neyming · Aydentika · Qadoq · Tovar belgisi',
  story: "Samarqanddagi mahalliy kofexona. Eski nom shevali va eslab qolinmaydigan edi. Yangi nom — joy va o'zbek qushini birga olib keldi. Qadoq, menyu va interyer bir uslubda yangilandi. 3 oydan keyin doimiy mijozlar 3 barobar ko'paydi, 6 oyda ikkinchi filial ochildi.",
  metrics: [
    { n: '+41%', l: 'Sotuv 3 oyda' },
    { n: '3×', l: 'Takroriy mijozlar' },
    { n: '2', l: 'Yangi filial' },
  ],
};

const AtFeatured: FC = () => {
  const c = FEATURED;
  return (
    <section
      className="relative overflow-hidden z-[2]"
      id="ishlar"
      style={{ background: '#0E1015', color: '#F4F1E8' }}
    >
      <div className="grid md:grid-cols-[1.1fr_1fr] min-h-[480px] md:min-h-[720px]">
        {/* Image side */}
        <div
          className="relative min-h-[320px] md:min-h-0 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #C2552A 0%, #8B3D1E 100%)' }}
        >
          <div
            className="absolute top-6 left-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] flex gap-[18px]"
            style={{ color: 'rgba(255,255,255,.7)' }}
          >
            <span>Asosiy keys · 2025</span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#4FB07A' }}
              />
              Davom etmoqda
            </span>
          </div>
          <div className="absolute inset-0 grid place-items-center p-14">
            <div style={{ width: '70%', height: '85%', maxWidth: 460 }}>
              <MockCoffee large />
            </div>
          </div>
        </div>

        {/* Body side */}
        <div
          className="flex flex-col gap-7 justify-center px-7 py-12 md:px-16 md:py-[72px]"
        >
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
                  style={{ fontSize: 'clamp(36px, 4vw, 56px)', color: '#E0744A' }}
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
