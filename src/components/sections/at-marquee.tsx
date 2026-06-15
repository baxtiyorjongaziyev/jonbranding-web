'use client';
import type { FC } from 'react';

const ITEMS = [
  'Qumri Coffee — +41% sotuv',
  'Teshabay osh — 3× takroriy mijoz',
  'Humo Fintech — 180K foydalanuvchi',
  'Oltin Bulut — +31% qadoqdan keyin',
  "Nur Sopol — 2× ko'rinish javonda",
  'Chilla — yangi shahar bozori',
];

const AtMarquee: FC = () => {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden py-4" style={{ backgroundColor: 'var(--at-ink)' }}>
      <div className="at-marquee-track whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-6 text-white font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">
            [{item}]
            <span className="text-[var(--at-muted)] text-base">✶</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AtMarquee;
