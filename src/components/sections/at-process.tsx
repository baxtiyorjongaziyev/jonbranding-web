'use client';
import { getSalesFlow } from '@/lib/sales-flow';
import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


interface Props { lang?: string; onOpen?: () => void; }



export default function AtProcess({ lang = 'uz', onOpen }: Props) {
  const [open, setOpen] = useState<string | null>('01');
  const l = getSalesFlow(lang).process;
  const stepsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!stepsRef.current) return;
    const steps = stepsRef.current.querySelectorAll('.process-step');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(steps, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(steps,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, { scope: stepsRef });

  return (
    <section className="py-16 md:py-24" id="process" style={{ background: 'var(--at-paper)' }}>
      <div className="max-w-[1320px] mx-auto px-8 sm:px-5">
        {/* Header */}
        <div className="mb-12">
          <div
            className="inline-flex items-center gap-2 mb-4"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}
          >
            <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
            <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>§ 08</span>
            <span>{l.sectionLabel}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="font-bold leading-none"
              style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}
            >
              {l.heading}{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>
                {l.headingEm}
              </span>
            </h2>
            <p style={{ color: 'var(--at-ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 300 }}>
              {l.subtitle}
            </p>
          </div>
        </div>

        {/* Accordion steps */}
        <div ref={stepsRef} className="flex flex-col" style={{ borderTop: '1px solid var(--at-line)' }}>
          {l.steps.map((s) => (
            <div key={s.n} className="process-step" style={{ borderBottom: '1px solid var(--at-line)' }}>
              <button
                className="w-full flex min-h-11 items-center gap-5 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--at-accent)]"
                onClick={() => setOpen(open === s.n ? null : s.n)}
                aria-expanded={open === s.n}
                aria-controls={`process-panel-${s.n}`}
              >
                <span
                  className="shrink-0 font-bold"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: open === s.n ? 'var(--at-accent)' : 'var(--at-muted)', minWidth: 28 }}
                >
                  {s.n}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-base" style={{ color: 'var(--at-ink)' }}>{s.title}</h3>
                  <div style={{ fontSize: 13, color: 'var(--at-muted)', marginTop: 2 }}>{s.summary}</div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className="hidden sm:block text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--at-bg)', color: 'var(--at-ink-2)', fontFamily: 'var(--font-mono)' }}
                  >
                    {s.dur}
                  </span>
                  <span
                    className="text-xl leading-none transition-transform duration-200"
                    style={{ color: 'var(--at-muted)', transform: open === s.n ? 'rotate(45deg)' : 'none' }}
                  >
                    +
                  </span>
                </div>
              </button>

              <div
                id={`process-panel-${s.n}`}
                hidden={open !== s.n}
              >
                <div className="pl-[52px] pb-6 grid md:grid-cols-2 gap-5">
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--at-ink-2)' }}>{s.detail}</p>
                  <div
                    className="rounded-xl p-4"
                    style={{ background: 'var(--at-accent-soft)', border: '1px solid rgba(27,77,255,0.12)' }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--at-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                      {l.exampleLabel}
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--at-ink)' }}>{s.example}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {onOpen && (
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4" style={{ borderTop: '1px solid var(--at-line)', paddingTop: 28 }}>
            <button className="btn btn-primary" onClick={onOpen}>
              {l.cta} <span className="ar">↗</span>
            </button>
            <span style={{ fontSize: 13, color: 'var(--at-muted)' }}>
              {l.note}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
