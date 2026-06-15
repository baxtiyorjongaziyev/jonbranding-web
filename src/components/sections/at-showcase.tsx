'use client';
import type { FC } from 'react';
import AtMock from './at-mocks';

interface Props { onOpen: () => void; }

const ITEMS = [
  { mock: 'coffee' as const,  name: 'Qumri',    yr: "'25", cat: 'Kofe' },
  { mock: 'osh' as const,     name: 'Teshabay', yr: "'25", cat: 'Restoran' },
  { mock: 'fintech' as const, name: 'Humo',     yr: "'24", cat: 'Fintech' },
  { mock: 'chilla' as const,  name: 'Chilla',   yr: "'23", cat: 'Moda' },
];

const OFFSETS = ['translate-y-5', '', 'translate-y-10', 'translate-y-3'];

const AtShowcase: FC<Props> = ({ onOpen }) => (
  <section className="pb-[88px] pt-6 relative z-[2]">
    <div className="max-w-[1320px] mx-auto px-5 md:px-8">
      <div className="flex justify-between items-baseline mb-6 flex-wrap gap-3.5">
        <span className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-muted)] inline-block" />
          So&apos;nggi 4 ta loyiha · 2023—2025
        </span>
        <button
          onClick={() => document.getElementById('ishlar')?.scrollIntoView({ behavior: 'smooth' })}
          className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--at-ink-2)] hover:text-[var(--at-accent)] border-b border-[var(--at-line)] hover:border-[var(--at-accent)] pb-0.5 transition-colors inline-flex items-center gap-1.5"
        >
          Barchasini ko&apos;rish — 120+ <span>↗</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        {ITEMS.map((it, i) => (
          <div
            key={i}
            onClick={onOpen}
            className={`relative rounded-[14px] overflow-hidden border border-[var(--at-line)] bg-[var(--at-bg-2)] cursor-pointer transition-transform duration-400 hover:-translate-y-1.5 ${OFFSETS[i]}`}
            style={{ aspectRatio: '3/4' }}
          >
            <div className="absolute inset-0">
              <AtMock kind={it.mock} />
            </div>
            <div
              className="absolute top-3 left-3 right-3 font-[family-name:var(--font-serif)] italic text-base z-[3]"
              style={{ color: 'rgba(255,255,255,.95)', textShadow: '0 1px 2px rgba(0,0,0,.3)' }}
            >
              {it.name}
            </div>
            <div
              className="absolute left-3 right-3 bottom-3 flex justify-between items-end font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] z-[3]"
              style={{ color: 'rgba(255,255,255,.85)', textShadow: '0 1px 2px rgba(0,0,0,.4)' }}
            >
              <span>{it.cat}</span>
              <span style={{ opacity: .7 }}>{it.yr}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AtShowcase;
