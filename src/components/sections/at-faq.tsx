'use client';
import { getSalesFlow } from '@/lib/sales-flow';
import { useState } from 'react';

interface Props { lang?: string; onOpen?: () => void; }



export default function AtFaq({ lang = 'uz', onOpen }: Props) {
  const [open, setOpen] = useState<number>(0);
  const l = getSalesFlow(lang).faq;

  return (
    <section className="py-16 md:py-24" id="savol" style={{ background: 'var(--at-bg)' }}>
      <div className="max-w-[1320px] mx-auto px-8 sm:px-5">
        <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 mb-5" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}>
              <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
              <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>{l.sectionN}</span>
              {l.label}
            </span>
            <h2 className="font-bold leading-none mb-5" style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', letterSpacing: '-0.045em', color: 'var(--at-ink)' }}>
              {l.heading}<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>{l.headingEm}</span>
            </h2>
            <p style={{ color: 'var(--at-ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 280 }}>{l.note}</p>
            <a href="mailto:salom@jonbranding.uz" className="inline-flex items-center gap-2 mt-6 font-semibold text-sm rounded-full px-4 py-3" style={{ border: '1px solid var(--at-line)', background: 'var(--at-paper)', color: 'var(--at-ink)' }}>
              salom@jonbranding.uz <span style={{ color: 'var(--at-accent)' }}>↗</span>
            </a>
          </div>
          <div className="flex flex-col" style={{ borderTop: '1px solid var(--at-line)' }}>
            {l.faqs.map((f, i) => (
              <div key={i} style={{ borderBottom: i < l.faqs.length - 1 ? '1px solid var(--at-line)' : 'none' }}>
                <button
                  className="w-full flex min-h-11 items-start gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--at-accent)]"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span className="shrink-0 w-7 text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--at-muted)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="flex-1 font-semibold text-base" style={{ color: 'var(--at-ink)' }}>{f.q}</h3>
                  <span aria-hidden="true" className="shrink-0 text-xl leading-none transition-transform duration-200 motion-reduce:transition-none" style={{ color: 'var(--at-muted)', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  hidden={open !== i}
                >
                  <p className="pl-11 pb-5 text-sm leading-relaxed" style={{ color: 'var(--at-ink-2)' }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {onOpen && (
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4" style={{ borderTop: '1px solid var(--at-line)', paddingTop: 28 }}>
            <button className="btn btn-primary" onClick={onOpen}>
              {l.cta} <span className="ar">↗</span>
            </button>
            <span style={{ fontSize: 13, color: 'var(--at-muted)' }}>
              {l.footerNote}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
