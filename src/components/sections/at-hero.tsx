'use client';
import type { FC } from 'react';

interface Props {
  onOpen: () => void;
}

const AtHero: FC<Props> = ({ onOpen }) => {
  return (
    <section className="bg-[var(--at-bg)] pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* LEFT */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--at-green)] animate-pulse" />
                Markaziy Osiyo · Brand atelier · Est. 2019
              </div>
              <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest border border-[var(--at-line)] rounded-full px-3 py-1 text-[var(--at-ink-2)] bg-[var(--at-paper)]">
                2026 · Yangi paketlar endi mavjud
              </span>
            </div>
            <h1
              className="font-bold leading-none text-[var(--at-ink)]"
              style={{ fontSize: 'clamp(56px, 9.5vw, 156px)', lineHeight: 0.88, letterSpacing: '-0.045em', fontWeight: 700 }}
            >
              <span className="block">Brendingiz</span>
              <span className="block relative text-[var(--at-accent)] font-[family-name:var(--font-serif)] italic not-italic">
                aslida
                <sup className="font-[family-name:var(--font-mono)] not-italic text-[var(--at-muted)]" style={{ fontSize: '0.22em', top: '-0.6em', letterSpacing: '0' }}>*</sup>
              </span>
              <span className="block">qancha yo&apos;qotyapti?</span>
            </h1>
          </div>
          {/* RIGHT */}
          <div className="flex flex-col gap-6 md:pt-4">
            <p className="text-[var(--at-ink-2)] text-lg leading-relaxed">
              Brend tashxisi — biznesingizning ko&apos;rinmas yo&apos;qotishlarini topish.{' '}
              <strong className="text-[var(--at-ink)] font-semibold">14 kun · 12 mezon · 30—50 betlik hisobot · aniq raqamlarda.</strong>{' '}
              Bepul mini-tashxis bilan boshlang — keyin xohlasangiz to&apos;liqqa o&apos;tasiz.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={onOpen} className="inline-flex items-center gap-2 bg-[var(--at-accent)] text-white rounded-full px-6 py-3.5 font-semibold text-sm hover:-translate-y-0.5 transition-transform w-fit">
                Bepul mini-tashxis boshlash ↗
              </button>
              <button onClick={() => document.getElementById('narxlar')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-[var(--at-ink-2)] hover:text-[var(--at-ink)] transition-colors w-fit">
                yoki paketlarni ko&apos;ring →
              </button>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)] leading-relaxed">
              ↳ 30 daq · Spamsiz · Majburiyatsiz ·{' '}
              <span className="text-[var(--at-terra)]">Iyul oyida 4 joy qoldi</span>
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-[var(--at-line)] pt-6 mt-2">
              {[
                { label: "O'tkazildi", value: '240+ tashxis' },
                { label: 'Bu oyda', value: '4 joy qoldi' },
                { label: 'Hisobot tayyor', value: '14 kun' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)] uppercase tracking-wider mb-1">{m.label}</div>
                  <div className="text-sm font-semibold text-[var(--at-ink)]">{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AtHero;
