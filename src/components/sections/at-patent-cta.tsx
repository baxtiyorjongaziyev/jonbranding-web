'use client';
import type { FC } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  lang?: string;
  dictionary?: { eyebrow: string; title: string; sub: string; button: string };
}

// Bosh sahifadan patent kalkulyatoriga to'g'ridan-to'g'ri kirish bloki.
const AtPatentCta: FC<Props> = ({ lang = 'uz', dictionary }) => {
  if (!dictionary) return null;
  const href = lang === 'uz' ? '/xizmatlar/patent-kalkulyatori' : `/${lang}/xizmatlar/patent-kalkulyatori`;
  return (
    <section className="py-16 md:py-20 relative z-[2] border-b border-[var(--at-line)]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 rounded-[28px] bg-[#0A0B0E] text-white p-8 md:p-12">
          <div className="max-w-[720px]">
            <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-white/60 mb-4">
              {dictionary.eyebrow}
            </div>
            <h2 className="font-medium leading-[1.08]" style={{ fontSize: 'clamp(26px, 3.2vw, 44px)', letterSpacing: '-0.02em' }}>
              {dictionary.title}
            </h2>
            <p className="mt-4 text-[15px] leading-[1.55] text-white/70">{dictionary.sub}</p>
          </div>
          <Link
            href={href}
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#2554FF] px-7 py-4 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#1D4ED8]"
          >
            {dictionary.button}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AtPatentCta;
