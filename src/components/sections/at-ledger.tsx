'use client';
import type { FC } from 'react';

interface Props { lang?: string; }
type Lang = 'uz' | 'ru' | 'en' | 'zh';

const t = {
  uz: { label: 'Tanlangan mijozlar', count: '120+ brend' },
  ru: { label: 'Избранные клиенты', count: '120+ брендов' },
  en: { label: 'Selected clients', count: '120+ brands' },
  zh: { label: '精选客户', count: '120+ 品牌' },
} as const;

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

const AtLedger: FC<Props> = ({ lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <div className="py-7 border-t border-b border-[var(--at-line)] relative z-[2] bg-[var(--at-bg)]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-center">
          <div className="flex flex-col gap-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)]">
            <span>{l.label}</span>
            <span
              className="font-[family-name:var(--font-serif)] italic font-normal text-[var(--at-accent)] normal-case"
              style={{ fontSize: 28, letterSpacing: 0 }}
            >
              {l.count}
            </span>
          </div>
          <div className="flex flex-wrap gap-7 md:gap-9 md:justify-end items-center">
            {LEDGER.map((c) => (
              <span
                key={c.name}
                className="font-[family-name:var(--font-serif)] font-normal text-[var(--at-ink-2)] opacity-75 hover:opacity-100 hover:text-[var(--at-ink)] transition-all cursor-default"
                style={{ fontSize: 22 }}
              >
                {c.name}
                <sup className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--at-muted)] ml-1">
                  &apos;{c.yr}
                </sup>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtLedger;
