'use client';

import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, X } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { ServiceLeadForm } from './service-lead-form';
import type { ServicePageContent } from './types';

const mono = { fontFamily: 'var(--font-mono), "JetBrains Mono", monospace', letterSpacing: '0.12em' } as const;
const h2Style = { fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.1 } as const;

const Eyebrow: FC<{ children: ReactNode; light?: boolean }> = ({ children, light }) => (
  <p className={`mb-4 text-[11px] font-medium uppercase ${light ? 'text-blue-300' : 'text-blue-700'}`} style={mono}>
    {children}
  </p>
);

const Section: FC<{ id?: string; children: ReactNode; className?: string }> = ({ id, children, className = '' }) => (
  <section id={id} className={`scroll-mt-20 px-5 py-20 sm:px-8 md:py-28 ${className}`}>
    <div className="mx-auto max-w-5xl">{children}</div>
  </section>
);

const btnBase =
  'inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.99]';

/**
 * Xizmat sahifasi — `/brand-strategy` bilan bir xil tuzilish:
 * hero → muammo → xizmat nima → tarkib → dalil → jarayon → kimga mos →
 * kafolatlar → keyingi xizmatlar → FAQ → ariza.
 */
export const ServiceLanding: FC<{ content: ServicePageContent; children?: ReactNode }> = ({ content: c, children }) => {
  const priceText = `${c.price} so‘m${c.priceFrom ? 'dan' : ''}`;
  const formRef = useRef<HTMLDivElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    trackEvent({ action: 'service_page_view', category: 'Service Page', label: c.serviceKey, source: c.source });
  }, [c.serviceKey, c.source]);

  const toForm = (label: string) => {
    trackEvent({ action: 'service_cta_click', category: 'Service CTA', label: `${c.serviceKey}_${label}`, source: c.source });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => phoneRef.current?.focus({ preventScroll: true }), 500);
  };

  const toContent = () => document.getElementById('tarkib')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="bg-white text-neutral-950">
      {/* 1. HERO */}
      <section className="px-5 pb-16 pt-28 sm:px-8 md:pb-24 md:pt-36">
        <div className="mx-auto max-w-5xl">
          <Eyebrow>{c.hero.eyebrow}</Eyebrow>
          <h1 className="max-w-[20ch] font-bold tracking-tight" style={{ fontSize: 'clamp(34px, 5.2vw, 62px)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            {c.hero.title}
          </h1>
          <p className="mt-6 max-w-[58ch] text-neutral-600" style={{ fontSize: 18, lineHeight: 1.65 }}>
            {c.hero.lead}
          </p>

          <dl className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-neutral-200 pt-6">
            <div>
              <dt className="text-[11px] uppercase text-neutral-400" style={mono}>Narxi</dt>
              <dd className="mt-1 text-3xl font-bold tracking-tight">{priceText}</dd>
            </div>
            {c.duration ? (
              <div>
                <dt className="text-[11px] uppercase text-neutral-400" style={mono}>Muddat</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight">{c.duration}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-[11px] uppercase text-neutral-400" style={mono}>Formati</dt>
              <dd className="mt-1 text-base font-semibold text-neutral-800">{c.hero.format}</dd>
            </div>
          </dl>

          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
            <button type="button" onClick={() => toForm('hero')} className={`${btnBase} bg-black text-white hover:bg-neutral-800`}>
              {c.hero.primaryCta}
            </button>
            <button type="button" onClick={toContent} className={`${btnBase} border border-neutral-300 text-neutral-900 hover:bg-neutral-50`}>
              Xizmat tarkibini ko‘rish
            </button>
          </div>
          {c.hero.note ? <p className="mt-6 max-w-[58ch] text-xs leading-relaxed text-neutral-500">{c.hero.note}</p> : null}
        </div>
      </section>

      {/* 2. MUAMMO */}
      <Section className="border-y border-neutral-200/80 bg-neutral-50">
        <Eyebrow>Muammo</Eyebrow>
        <h2 className="max-w-3xl font-bold" style={h2Style}>{c.problem.title}</h2>
        <p className="mt-5 max-w-2xl text-neutral-600" style={{ fontSize: 16, lineHeight: 1.65 }}>{c.problem.intro}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {c.problem.pains.map((pain) => (
            <li key={pain} className="flex gap-3 rounded-2xl border border-neutral-200 bg-white p-5 text-[15px] leading-relaxed text-neutral-700">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              {pain}
            </li>
          ))}
        </ul>
        <div className="mt-12 rounded-3xl bg-neutral-950 p-8 text-white shadow-xl sm:p-12">
          <p className="font-bold tracking-tight" style={{ fontSize: 'clamp(22px, 3vw, 34px)', lineHeight: 1.2 }}>{c.problem.statement}</p>
          <p className="mt-4 max-w-3xl text-neutral-300" style={{ fontSize: 17, lineHeight: 1.6 }}>{c.problem.statementLead}</p>
        </div>
      </Section>

      {/* 3. XIZMAT NIMA */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Eyebrow>Xizmat haqida</Eyebrow>
            <h2 className="font-bold" style={h2Style}>{c.whatIs.title}</h2>
            {c.whatIs.paragraphs.map((p) => (
              <p key={p} className="mt-5 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.7 }}>{p}</p>
            ))}
          </div>
          <div className="self-start rounded-3xl border border-neutral-200 p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase text-neutral-400" style={mono}>Bu xizmat emas</p>
            <ul className="mt-4 space-y-3">
              {c.whatIs.isNot.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-neutral-700">
                  <span className="text-red-500">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 4. TARKIB */}
      <Section id="tarkib" className="bg-neutral-50 border-y border-neutral-200/80">
        <Eyebrow>Nimalar olasiz</Eyebrow>
        <h2 className="max-w-3xl font-bold" style={h2Style}>{c.deliverables.title}</h2>
        <p className="mt-5 max-w-2xl text-neutral-600" style={{ fontSize: 16, lineHeight: 1.65 }}>{c.deliverables.lead}</p>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {c.deliverables.items.map((item, i) => (
            <article key={item.title} className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
              <p className="text-[11px] text-neutral-400" style={mono}>{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 text-xl font-bold tracking-tight">{item.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{item.subtitle}</p>
              <ul className="mt-5 space-y-2">
                {item.details.map((d) => (
                  <li key={d} className="flex gap-2.5 text-[15px] leading-relaxed text-neutral-700">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                    {d}
                  </li>
                ))}
              </ul>
              {item.result ? (
                <p className="mt-auto border-t border-neutral-100 pt-4 text-sm font-semibold text-neutral-900" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  → {item.result}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </Section>

      {/* 5. DALIL */}
      {c.proof ? (
        <section className="bg-black px-5 py-24 text-white sm:px-8 md:py-32">
          <div className="mx-auto max-w-5xl">
            <Eyebrow light>Natijalar</Eyebrow>
            <h2 className="max-w-3xl font-bold text-white" style={h2Style}>{c.proof.title}</h2>
            <p className="mt-5 max-w-2xl text-neutral-400" style={{ fontSize: 16, lineHeight: 1.65 }}>{c.proof.lead}</p>
            {c.proof.chips ? (
              <ul className="mt-10 flex flex-wrap gap-2.5">
                {c.proof.chips.map((chip) => (
                  <li key={chip} className="rounded-full border border-white/15 px-4 py-2 text-base font-semibold text-white">{chip}</li>
                ))}
              </ul>
            ) : null}
            {c.proof.quotes ? (
              <div className="mt-12 grid gap-4 md:grid-cols-2">
                {c.proof.quotes.map((q) => (
                  <figure key={q.name} className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
                    <blockquote className="text-[15px] leading-relaxed text-neutral-200">“{q.quote}”</blockquote>
                    <figcaption className="mt-5 text-sm">
                      <span className="font-semibold text-white">{q.name}</span>
                      <span className="text-neutral-500"> · {q.company}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Xizmatga xos qo'shimcha bo'lim (masalan, patent guvohnomalari). */}
      {children}

      {/* 6. JARAYON */}
      <Section>
        <Eyebrow>Jarayon</Eyebrow>
        <h2 className="max-w-3xl font-bold" style={h2Style}>{c.process.title}</h2>
        <ol className="mt-12 border-b border-neutral-200">
          {c.process.steps.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-neutral-200 py-6 sm:grid-cols-[3rem_1fr_auto]">
              <span className="text-[12px] text-neutral-400" style={mono}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="text-lg font-bold">{step.title}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-neutral-600">{step.desc}</p>
              </div>
              {step.time ? (
                <span className="col-start-2 text-[11px] uppercase text-neutral-500 sm:col-start-3" style={mono}>{step.time}</span>
              ) : null}
            </li>
          ))}
        </ol>
      </Section>

      {/* 7. KIMGA MOS + KAFOLATLAR */}
      <Section className="bg-neutral-50 border-y border-neutral-200/80">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase text-blue-700" style={mono}>Sizga mos, agar</p>
            <ul className="mt-5 space-y-3">
              {c.audience.fit.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-neutral-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase text-neutral-400" style={mono}>Hozircha kerak emas, agar</p>
            <ul className="mt-5 space-y-3">
              {c.audience.notFit.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-neutral-600">
                  <span className="text-neutral-400">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-3xl bg-neutral-950 p-6 text-white sm:p-8">
          <p className="text-[11px] font-semibold uppercase text-blue-300" style={mono}>Kafolatlar</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {c.guarantees.map((g) => (
              <li key={g} className="flex gap-3 text-[15px] leading-relaxed text-neutral-200">
                <Check className="mt-1 h-4 w-4 shrink-0 text-blue-400" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 8. KEYINGI XIZMATLAR */}
      {c.related?.length ? (
        <Section>
          <Eyebrow>Keyingi qadam</Eyebrow>
          <h2 className="max-w-3xl font-bold" style={h2Style}>Ko‘pincha birga olinadi</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {c.related.map((r) => (
              <Link key={r.href} href={r.href} className="group flex flex-col rounded-3xl border border-neutral-200 p-6 transition-colors hover:border-neutral-400">
                <p className="text-lg font-bold">{r.title}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{r.desc}</p>
                <p className="mt-5 flex items-center justify-between text-sm font-semibold">
                  {r.price}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </p>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      {/* 9. FAQ */}
      <Section className={c.related?.length ? 'border-t border-neutral-200/80' : ''}>
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="font-bold" style={h2Style}>Ko‘p beriladigan savollar</h2>
        <div className="mt-12 space-y-4">
          {c.faqs.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div key={faq.q} className="rounded-2xl border border-neutral-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between p-6 text-left text-base font-bold text-neutral-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`ml-4 h-5 w-5 shrink-0 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open ? <div className="border-t border-neutral-100 px-6 pb-6 pt-4 text-sm leading-relaxed text-neutral-600">{faq.a}</div> : null}
              </div>
            );
          })}
        </div>
      </Section>

      {/* 10. ARIZA */}
      <section className="bg-neutral-950 px-5 py-24 text-white sm:px-8 md:py-32">
        <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Eyebrow light>Keyingi qadam</Eyebrow>
            <h2 className="font-bold tracking-tight text-white" style={{ fontSize: 'clamp(30px, 4.4vw, 54px)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              {c.finalCta.title}
            </h2>
            <p className="mt-6 text-neutral-300" style={{ fontSize: 17, lineHeight: 1.65 }}>{c.finalCta.lead}</p>
            <dl className="mt-8 border-t border-white/10 pt-6">
              <dt className="text-[11px] uppercase text-neutral-400" style={mono}>Xizmat qiymati</dt>
              <dd className="mt-1 text-3xl font-bold tracking-tight text-white">{priceText}</dd>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="tel:+998792000097" data-oisha-phone="" className={`${btnBase} border border-white/30 text-white hover:bg-white/10`}>
                +998 79 200 00 97
              </a>
              <a href="https://t.me/baxtiyorjongaziyev" target="_blank" rel="noopener noreferrer" className={`${btnBase} border border-white/30 text-white hover:bg-white/10`}>
                Telegram
              </a>
            </div>
          </div>
          <ServiceLeadForm content={c} formRef={formRef} phoneRef={phoneRef} />
        </div>
      </section>
    </div>
  );
};

export default ServiceLanding;
