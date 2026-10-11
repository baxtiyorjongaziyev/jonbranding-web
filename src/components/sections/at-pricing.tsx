'use client';
import { getSalesFlow } from '@/lib/sales-flow';

interface Props {
  onOpen: () => void;
  lang?: string;
}




export default function AtPricing({ onOpen, lang = 'uz' }: Props) {
  const l = getSalesFlow(lang).pricing;

  return (
    <section className="py-20 md:py-28" id="brand-audit" style={{ background: 'var(--at-bg)' }}>
      <div className="max-w-[720px] mx-auto px-8 sm:px-5 text-center">
        <div
          className="inline-flex items-center gap-2 mb-5"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}
        >
          <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
          <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>§ 06</span>
          <span>{l.label}</span>
        </div>

        <h2
          className="font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(32px, 4.4vw, 56px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}
        >
          {l.heading}{' '}
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>
            {l.headingEm}
          </span>
        </h2>

        <div
          className="relative rounded-2xl p-8 sm:p-10 text-left mx-auto"
          style={{
            maxWidth: 480,
            background: 'var(--at-ink)',
            border: '2px solid var(--at-accent)',
          }}
        >
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ background: 'var(--at-accent)', color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
          >
            {l.badge}
          </div>

          <div className="flex items-baseline justify-center gap-1 mb-2 mt-4">
            <span className="font-bold" style={{ fontSize: 'clamp(36px, 5vw, 48px)', letterSpacing: '-0.03em', color: '#fff' }}>
              {l.label}
            </span>
          </div>
          <p className="text-center text-sm mb-7" style={{ color: 'rgba(244,241,232,.5)' }}>{l.sub}</p>

          <ul className="flex flex-col gap-3 mb-8">
            {l.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(244,241,232,.8)' }}>
                <span className="mt-0.5 shrink-0" style={{ color: 'var(--at-green)', fontSize: 14 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={onOpen}
            className="w-full font-semibold text-sm rounded-full py-4 transition-opacity duration-200 motion-reduce:transition-none hover:opacity-90"
            style={{ background: 'var(--at-accent)', color: '#fff', border: 'none' }}
          >
            {l.cta} ↗
          </button>
        </div>

        <div
          className="mt-6 rounded-2xl p-5 grid sm:grid-cols-2 gap-3 text-left"
          style={{ background: 'var(--at-green-soft)', border: '1px solid var(--at-green)' }}
        >
          {l.guarantees.map((g, i) => (
            <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--at-ink)' }}>
              <span style={{ color: 'var(--at-green)', fontWeight: 700, flexShrink: 0 }}>✓</span>
              {g}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
