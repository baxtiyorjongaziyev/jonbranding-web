'use client';
import type { FC } from 'react';
import { Marquee } from '@/components/ui/marquee';

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
  { name: 'Arfadel', yr: '26' },
  { name: 'Beyaz', yr: '25' },
  { name: 'Enros', yr: '24' },
  { name: 'Medline', yr: '23' },
];

const AtLedger: FC<Props> = ({ lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <div className="py-7 border-t border-b border-[var(--at-line)] relative z-[2] bg-[var(--at-bg)] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center">
        <div className="flex flex-col gap-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)] px-5 md:px-8 pb-6 md:pb-0">
          <span>{l.label}</span>
          <span
            className="font-[family-name:var(--font-serif)] italic font-normal text-[var(--at-accent)] normal-case"
            style={{ fontSize: 28, letterSpacing: 0 }}
          >
            {l.count}
          </span>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--at-bg), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--at-bg), transparent)' }} />
          <Marquee pauseOnHover repeat={3} className="[--duration:35s] p-0 py-1">
            {LEDGER.map((c) => (
              <span
                key={c.name}
                className="mx-8 font-[family-name:var(--font-serif)] font-normal text-[var(--at-ink-2)] opacity-70 hover:opacity-100 hover:text-[var(--at-ink)] transition-all cursor-default"
                style={{ fontSize: 22, whiteSpace: 'nowrap' }}
              >
                {c.name}
                <sup className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--at-muted)] ml-1">
                  &apos;{c.yr}
                </sup>
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default AtLedger;
