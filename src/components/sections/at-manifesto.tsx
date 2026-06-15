'use client';
import type { FC } from 'react';

const AtManifesto: FC = () => (
  <section className="py-[120px] relative z-[2] border-b border-[var(--at-line)]">
    <div className="max-w-[1320px] mx-auto px-5 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-8 md:gap-14 items-start">
        <div className="pt-3">
          <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)] mb-3.5">
            — Manifest
          </div>
          <div className="text-sm leading-[1.55] text-[var(--at-ink-2)] max-w-[240px]">
            Tashxis — bu professional ko&apos;rik. Aniq raqamlar, aniq xulosalar, aniq harakat.
            Taxmin va his bilan biznesni yo&apos;qotmaymiz.
          </div>
        </div>
        <p
          className="font-medium text-[var(--at-ink)] leading-[1.04]"
          style={{ fontSize: 'clamp(32px, 4.6vw, 72px)', letterSpacing: '-0.03em' }}
        >
          Tashxissiz{' '}
          <span className="line-through decoration-[var(--at-terra)] decoration-[4px] text-[var(--at-muted)] font-normal">
            tuzatish
          </span>{' '}
          —
          <br />
          bu{' '}
          <span className="font-[family-name:var(--font-serif)] italic font-normal text-[var(--at-accent)]">
            qorong&apos;ida
          </span>{' '}
          o&apos;q otish.
          <br />
          Avval ko&apos;rinmagan teshikni topamiz, keyin yopamiz. Tartib shu —
          aks holda{' '}
          <strong className="font-semibold">siz pul to&apos;laysiz, raqib daromad oladi.</strong>
        </p>
      </div>
    </div>
  </section>
);

export default AtManifesto;
