'use client';
import type { FC } from 'react';
import { getSalesFlow } from '@/lib/sales-flow';

interface Props { lang?: string; }

const AtManifesto: FC<Props> = ({ lang = 'uz' }) => {
  const c = getSalesFlow(lang).manifest;
  return (
    <section className="py-[120px] relative z-[2] border-b border-[var(--at-line)]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-8 md:gap-14 items-start">
          <div className="pt-3">
            <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)] mb-3.5">
              {c.label}
            </div>
            <div className="text-sm leading-[1.55] text-[var(--at-ink-2)] max-w-[240px]">
              {c.sub}
            </div>
          </div>
          <p
            className="font-medium text-[var(--at-ink)] leading-[1.04] whitespace-pre-line"
            style={{ fontSize: 'clamp(32px, 4.6vw, 72px)', letterSpacing: '-0.03em' }}
          >
            {c.pre}{' '}
            <span className="line-through decoration-[var(--at-terra)] decoration-[4px] text-[var(--at-muted)] font-normal">
              {c.strike}
            </span>{' '}
            {c.mid}{' '}
            <span className="font-[family-name:var(--font-serif)] italic font-normal text-[var(--at-accent)]">
              {c.italic}
            </span>{' '}
            {c.post}{' '}
            <strong className="font-semibold">{c.bold}</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AtManifesto;
