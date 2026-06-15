'use client';
import type { FC } from 'react';

const LEDGER = [
  { name: 'Qumri', yr: '25' },
  { name: 'Teshabay', yr: '25' },
  { name: 'Oltin Bulut', yr: '24' },
  { name: 'Humo', yr: '24' },
  { name: 'Nur Sopol', yr: '23' },
  { name: 'Chilla', yr: '23' },
  { name: 'Asaka Co.', yr: '22' },
  { name: "Tong Ko'ngil", yr: '22' },
];

const AtLedger: FC = () => (
  <div className="py-7 border-t border-b border-[var(--at-line)] relative z-[2] bg-[var(--at-bg)]">
    <div className="max-w-[1320px] mx-auto px-5 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-center">
        <div className="flex flex-col gap-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)]">
          <span>Tanlangan mijozlar</span>
          <span
            className="font-[family-name:var(--font-serif)] italic font-normal text-[var(--at-accent)] normal-case"
            style={{ fontSize: 28, letterSpacing: 0 }}
          >
            120+ brend
          </span>
        </div>
        <div className="flex flex-wrap gap-7 md:gap-9 md:justify-end items-center">
          {LEDGER.map((l) => (
            <span
              key={l.name}
              className="font-[family-name:var(--font-serif)] font-normal text-[var(--at-ink-2)] opacity-75 hover:opacity-100 hover:text-[var(--at-ink)] transition-all cursor-default"
              style={{ fontSize: 22 }}
            >
              {l.name}
              <sup className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--at-muted)] ml-1">
                &apos;{l.yr}
              </sup>
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AtLedger;
