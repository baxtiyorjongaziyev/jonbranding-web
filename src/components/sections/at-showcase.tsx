'use client';
import type { FC } from 'react';
import Image from 'next/image';

interface Props { onOpen: () => void; lang?: string; }
type Lang = 'uz' | 'ru' | 'en' | 'zh';

const t = {
  uz: {
    label: "So'nggi loyihalar · 2025—2026",
    viewAll: 'Barcha ishlar ↗',
    cats: ['Parfyumeriya', 'Premium brend', 'Sutchilik', 'Energiya'],
  },
  ru: {
    label: 'Последние проекты · 2025—2026',
    viewAll: 'Все работы ↗',
    cats: ['Парфюмерия', 'Премиум бренд', 'Молочная продукция', 'Энергетика'],
  },
  en: {
    label: 'Recent projects · 2025—2026',
    viewAll: 'All works ↗',
    cats: ['Perfumery', 'Premium brand', 'Dairy', 'Energy'],
  },
  zh: {
    label: '最新项目 · 2025—2026',
    viewAll: '所有作品 ↗',
    cats: ['香水', '高端品牌', '乳制品', '能源'],
  },
} as const;

const ITEMS = [
  { src: '/images/cms/arfadel-cover.webp', name: 'ARFADEL', yr: "'26", color: '#1A1210' },
  { src: '/images/cms/beyaz-gold.webp', name: 'Beyaz', yr: "'26", color: '#2C3A2A' },
  { src: '/images/cms/boyarin-hozir.webp', name: 'Boyarin', yr: "'26", color: '#0A1C3A' },
  { src: '/images/cms/enros-cover.webp', name: 'Enros', yr: "'25", color: '#0D0D1A' },
];

const OFFSETS = ['md:translate-y-5', '', 'md:translate-y-10', 'md:translate-y-3'];

const AtShowcase: FC<Props> = ({ onOpen, lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <section className="pb-[88px] pt-6 relative z-[2]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex justify-between items-baseline mb-6 flex-wrap gap-3.5">
          <span className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-muted)] inline-block" />
            {l.label}
          </span>
          <button
            onClick={() => document.getElementById('ishlar')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--at-ink-2)] hover:text-[var(--at-accent)] border-b border-[var(--at-line)] hover:border-[var(--at-accent)] pb-0.5 transition-colors"
          >
            {l.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {ITEMS.map((it, i) => (
            <div
              key={i}
              onClick={onOpen}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
              role="button"
              tabIndex={0}
              className={`relative rounded-2xl overflow-hidden border border-[var(--at-line)] cursor-pointer group transition-transform duration-500 hover:-translate-y-2 ${OFFSETS[i]}`}
              style={{ aspectRatio: '3/4', background: it.color }}
            >
              <Image
                src={it.src}
                alt={it.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

              <div
                className="absolute top-3 left-3 right-3 font-[family-name:var(--font-serif)] italic text-base z-[3]"
                style={{ color: 'rgba(255,255,255,.95)', textShadow: '0 1px 3px rgba(0,0,0,.5)' }}
              >
                {it.name}
              </div>
              <div
                className="absolute left-3 right-3 bottom-3 flex justify-between items-end font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] z-[3]"
                style={{ color: 'rgba(255,255,255,.85)' }}
              >
                <span>{l.cats[i]}</span>
                <span style={{ opacity: .65 }}>{it.yr}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AtShowcase;
