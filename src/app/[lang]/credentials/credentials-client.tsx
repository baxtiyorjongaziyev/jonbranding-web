'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import LeadModal from '@/components/sales/lead-modal';
import {
  GUARANTEES,
  JOBS,
  PACKAGES,
  PROCESS_STEPS,
  SERVICE_GROUPS,
  WHY_US,
} from '@/lib/sales-content';

export type CredCase = {
  slug: string;
  title: string;
  client: string;
  categoryLabel: string;
  coverImage: string;
  result?: { metric: string; value: string };
};

export type CredQuote = { name: string; company: string; quote: string };
export type CredLogo = { name: string; logo: string };

type Props = {
  cases: CredCase[];
  quotes: CredQuote[];
  logos: CredLogo[];
};

const mono = { fontFamily: 'var(--font-mono), "JetBrains Mono", monospace' } as const;
const numerals = { fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const FACTS = [
  { value: '9', unit: 'yil', label: 'Bozorda' },
  { value: '500+', unit: '', label: 'Mijoz' },
  { value: '1000+', unit: '', label: 'Loyiha' },
  { value: '4', unit: 'bosqich', label: 'Ish jarayoni' },
];

/** Sahifa ketma-ket raqamlangan bo'limlardan iborat — sotuvchi "uchinchi bo'lim" deb ayta oladi. */
function Section({
  id,
  index,
  label,
  title,
  dark,
  children,
}: {
  id: string;
  index: string;
  label: string;
  title?: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="cred-section border-t px-5 py-20 sm:px-8 sm:py-24"
      style={{
        borderColor: dark ? 'rgba(255,255,255,.14)' : '#ebebeb',
        background: dark ? '#0a0a0a' : '#fff',
        color: dark ? '#fff' : '#0a0a0a',
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <p
          className="mb-4 flex items-center gap-2.5 text-[11px] font-medium uppercase"
          style={{ ...mono, letterSpacing: '0.1em', color: dark ? 'rgba(255,255,255,.45)' : '#a3a3a3' }}
        >
          <span style={{ color: dark ? '#fff' : '#000' }}>{index}</span>
          <span aria-hidden="true" className="inline-block h-px w-5" style={{ background: 'currentColor' }} />
          {label}
        </p>
        {title ? (
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mb-10 max-w-3xl text-3xl font-bold sm:text-4xl"
            style={{ letterSpacing: '-0.035em', lineHeight: 1.1, color: dark ? '#fff' : '#0a0a0a' }}
          >
            {title}
          </motion.h2>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export default function CredentialsClient({ cases, quotes, logos }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [presetService, setPresetService] = useState('Aniq emas — maslahat kerak');

  const openModal = (service: string) => {
    setPresetService(service);
    setModalOpen(true);
  };

  return (
    <div className="bg-white text-[#0a0a0a]">
      <style>{`
        @media print {
          .cred-no-print { display: none !important; }
          .cred-section { break-inside: avoid; page-break-inside: avoid; padding: 24px 0 !important; }
          .cred-cover { min-height: auto !important; }
          a[href]:after { content: none !important; }
        }
      `}</style>

      {/* Muqova */}
      <section
        className="cred-cover cred-section flex min-h-[92svh] flex-col justify-between px-5 py-16 sm:px-8"
        style={{ background: '#0a0a0a', color: '#fff' }}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <span className="text-[11px] font-medium uppercase" style={{ ...mono, letterSpacing: '0.12em', color: 'rgba(255,255,255,.5)' }}>
            Jon Branding — Credentials
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="cred-no-print rounded-full border px-4 py-2 text-[11px] font-medium uppercase transition-colors hover:bg-white hover:text-black"
            style={{ ...mono, letterSpacing: '0.08em', borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}
          >
            PDF yuklab olish
          </button>
        </div>

        <div className="mx-auto w-full max-w-6xl py-16">
          <h1
            className="max-w-4xl text-[2.6rem] font-bold sm:text-6xl lg:text-7xl"
            style={{ letterSpacing: '-0.045em', lineHeight: 0.98, color: '#fff' }}
          >
            Brendni ko‘rinishdan
            <br />
            sotuv vositasiga aylantiramiz
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: 'rgba(255,255,255,.62)' }}>
            Nom, logo, aydentika, brandbook, qadoq va patent — bitta joyda, bitta shartnoma ostida.
            Ishni boshlaymiz, guvohnomani qo‘lingizga beramiz.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 border-t pt-8 sm:grid-cols-4" style={{ borderColor: 'rgba(255,255,255,.14)' }}>
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <p className="text-3xl font-bold sm:text-4xl" style={{ ...numerals, color: '#fff' }}>
                {fact.value}
                {fact.unit ? <span className="ml-1 text-base font-medium" style={{ color: 'rgba(255,255,255,.5)' }}>{fact.unit}</span> : null}
              </p>
              <p className="mt-1.5 text-[11px] uppercase" style={{ ...mono, letterSpacing: '0.1em', color: 'rgba(255,255,255,.45)' }}>
                {fact.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mijozlar */}
      {logos.length > 0 ? (
        <Section id="mijozlar" index="§ 01" label="Kimlar bilan ishladik" title="Bizga ishongan brendlar">
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl sm:grid-cols-4 lg:grid-cols-6" style={{ background: '#ebebeb' }}>
            {logos.map((brand) => (
              <div key={brand.name} className="flex aspect-[3/2] items-center justify-center bg-white p-5">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={48}
                  className="max-h-9 w-auto object-contain opacity-60 grayscale"
                />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Ishlar */}
      {cases.length > 0 ? (
        <Section id="ishlar" index="§ 02" label="Portfolio" title="Qilgan ishlarimiz">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((item) => (
              <motion.article
                key={item.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 text-[11px] uppercase" style={{ ...mono, letterSpacing: '0.1em', color: '#a3a3a3' }}>
                  {item.categoryLabel}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold" style={{ letterSpacing: '-0.02em' }}>
                  {item.title}
                </h3>
                {item.result ? (
                  <p className="mt-1.5 text-sm text-neutral-500">
                    <span className="font-semibold text-black" style={numerals}>{item.result.value}</span>{' '}
                    {item.result.metric}
                  </p>
                ) : (
                  <p className="mt-1.5 text-sm text-neutral-500">{item.client}</p>
                )}
              </motion.article>
            ))}
          </div>
        </Section>
      ) : null}

      {/* JTBD */}
      <Section id="muammo" index="§ 03" label="Nimani hal qilamiz" title="Mijozlarimiz biz bilan nimadan qutuladi" dark>
        <div className="grid gap-px overflow-hidden rounded-xl sm:grid-cols-2" style={{ background: 'rgba(255,255,255,.14)' }}>
          {JOBS.map((job) => (
            <div key={job.pain} className="p-6 sm:p-8" style={{ background: '#0a0a0a' }}>
              <p className="text-[11px] uppercase" style={{ ...mono, letterSpacing: '0.1em', color: 'rgba(255,255,255,.4)' }}>
                Hozir
              </p>
              <p className="mt-2 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,.62)' }}>{job.pain}</p>
              <p className="mt-6 text-[11px] uppercase" style={{ ...mono, letterSpacing: '0.1em', color: 'rgba(255,255,255,.4)' }}>
                Keyin
              </p>
              <p className="mt-2 text-base font-medium leading-relaxed" style={{ color: '#fff' }}>{job.gain}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Xizmatlar va narxlar */}
      <Section id="xizmatlar" index="§ 04" label="Xizmatlar" title="Narxlarimiz ochiq — hamma uchun birdek">
        <div className="space-y-12">
          {SERVICE_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-xl font-semibold" style={{ letterSpacing: '-0.025em' }}>{group.title}</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-neutral-500">{group.intro}</p>

              <div className="mt-5 overflow-hidden rounded-xl border" style={{ borderColor: '#ebebeb' }}>
                {group.items.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex flex-col gap-2 p-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                    style={{ borderTop: index === 0 ? 'none' : '1px solid #ebebeb' }}
                  >
                    <div className="min-w-0 sm:flex-1">
                      <p className="font-semibold" style={{ letterSpacing: '-0.015em' }}>{item.name}</p>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-500">{item.benefit}</p>
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <p className="font-semibold" style={numerals}>
                        {item.price} <span className="text-sm font-normal text-neutral-400">so‘m</span>
                      </p>
                      <p className="mt-0.5 text-[11px] uppercase" style={{ ...mono, letterSpacing: '0.08em', color: '#a3a3a3' }}>
                        {item.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => openModal('Aniq emas — maslahat kerak')}
          className="cred-no-print mt-10 rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
        >
          Xizmat bo‘yicha savol berish
        </button>
      </Section>

      {/* Paketlar */}
      <Section id="paketlar" index="§ 05" label="Paketlar" title="Birga olinsa arzonroq">
        <div className="grid gap-5 lg:grid-cols-3">
          {PACKAGES.map((pack) => (
            <div
              key={pack.name}
              className="flex flex-col rounded-2xl border p-7"
              style={{
                borderColor: pack.featured ? '#0a0a0a' : '#ebebeb',
                borderWidth: pack.featured ? 2 : 1,
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase" style={{ ...mono, letterSpacing: '0.12em' }}>
                  {pack.name}
                </p>
                {pack.badge ? (
                  <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-medium uppercase text-white" style={{ ...mono, letterSpacing: '0.08em' }}>
                    {pack.badge}
                  </span>
                ) : null}
              </div>

              <p className="mt-5 text-3xl font-bold" style={{ ...numerals }}>
                {pack.price} <span className="text-base font-normal text-neutral-400">so‘m</span>
              </p>
              <p className="mt-1.5 text-sm text-neutral-500">
                Alohida olinsa <span style={numerals}>{pack.separate}</span> — <span className="font-medium text-black" style={numerals}>{pack.saving}</span> tejaysiz
              </p>

              <p className="mt-5 text-sm leading-relaxed text-neutral-600">{pack.audience}</p>

              <ul className="mt-5 space-y-2 text-sm">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-black" />
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[11px] uppercase" style={{ ...mono, letterSpacing: '0.08em', color: '#a3a3a3' }}>
                Muddat: {pack.duration}
              </p>

              <button
                type="button"
                onClick={() => openModal(`${pack.name} paket`)}
                className="cred-no-print mt-6 w-full rounded-full px-6 py-3 text-sm font-medium transition-opacity hover:opacity-85"
                style={{
                  background: pack.featured ? '#0a0a0a' : '#fff',
                  color: pack.featured ? '#fff' : '#0a0a0a',
                  border: pack.featured ? 'none' : '1px solid #0a0a0a',
                }}
              >
                Shu paketni tanlash
              </button>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-neutral-500">
          Paket muddatlari dizayn ishlariga tegishli. Patent guvohnomasi alohida chiqadi: oddiy tartibda 7 oy, tezkorda 20–40 kun.
        </p>
      </Section>

      {/* Jarayon */}
      <Section id="jarayon" index="§ 06" label="Qanday ishlaymiz" title="To‘rt bosqich, har birida siz tasdiqlaysiz">
        <div className="grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-4" style={{ background: '#ebebeb', borderColor: '#ebebeb' }}>
          {PROCESS_STEPS.map((step, index) => (
            <div key={step.title} className="bg-white p-6">
              <p className="text-[11px]" style={{ ...mono, ...numerals, letterSpacing: '0.1em', color: '#a3a3a3' }}>
                0{index + 1}
              </p>
              <p className="mt-3 font-semibold" style={{ letterSpacing: '-0.02em' }}>{step.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: '#ebebeb' }}>
          <p className="text-sm font-medium">To‘lov bosqichma-bosqich</p>
          <div className="flex gap-6 text-sm">
            <span><span className="font-semibold" style={numerals}>50%</span> <span className="text-neutral-500">shartnoma</span></span>
            <span><span className="font-semibold" style={numerals}>30%</span> <span className="text-neutral-500">konsepsiya</span></span>
            <span><span className="font-semibold" style={numerals}>20%</span> <span className="text-neutral-500">topshirish</span></span>
          </div>
        </div>
      </Section>

      {/* Nega biz + kafolatlar */}
      <Section id="nega-biz" index="§ 07" label="Nega aynan biz" title="Dizaynerdan nimasi bilan farq qiladi">
        <div className="grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2" style={{ background: '#ebebeb', borderColor: '#ebebeb' }}>
          {WHY_US.map((item) => (
            <div key={item.title} className="bg-white p-6 sm:p-7">
              <p className="font-semibold" style={{ letterSpacing: '-0.02em' }}>{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border p-6 sm:p-7" style={{ borderColor: '#ebebeb' }}>
          <p className="text-[11px] uppercase" style={{ ...mono, letterSpacing: '0.1em', color: '#a3a3a3' }}>
            Shartnomada yoziladi
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {GUARANTEES.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-black" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Mijozlar gapi */}
      {quotes.length > 0 ? (
        <Section id="fikrlar" index="§ 08" label="Mijozlar gapi" title="Biz bilan ishlaganlar nima deydi">
          <div className="grid gap-6 lg:grid-cols-3">
            {quotes.map((quote) => (
              <blockquote key={quote.name} className="rounded-xl border p-6" style={{ borderColor: '#ebebeb' }}>
                <p className="text-sm leading-relaxed text-neutral-700">“{quote.quote}”</p>
                <footer className="mt-5">
                  <p className="text-sm font-semibold">{quote.name}</p>
                  <p className="text-[11px] uppercase" style={{ ...mono, letterSpacing: '0.08em', color: '#a3a3a3' }}>
                    {quote.company}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </Section>
      ) : null}

      {/* CTA */}
      <section className="cred-section border-t px-5 py-24 sm:px-8" style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,.14)' }}>
        <div className="mx-auto w-full max-w-6xl">
          <p className="mb-4 flex items-center gap-2.5 text-[11px] font-medium uppercase" style={{ ...mono, letterSpacing: '0.1em', color: 'rgba(255,255,255,.45)' }}>
            <span style={{ color: '#fff' }}>§ 09</span>
            <span aria-hidden="true" className="inline-block h-px w-5" style={{ background: 'currentColor' }} />
            Keyingi qadam
          </p>
          <h2 className="max-w-2xl text-3xl font-bold sm:text-5xl" style={{ letterSpacing: '-0.04em', lineHeight: 1.05, color: '#fff' }}>
            Qaysi paket sizga to‘g‘ri kelishini birga aniqlaymiz
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed" style={{ color: 'rgba(255,255,255,.62)' }}>
            Qisqa suhbat — biznesingizni so‘raymiz, nima kerakligini va qancha turishini aytamiz. Majburiyatsiz.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openModal('Aniq emas — maslahat kerak')}
              className="cred-no-print rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-opacity hover:opacity-85"
            >
              Ariza qoldirish
            </button>
            <a
              href="tel:+998336450097"
              className="rounded-full border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-white hover:text-black"
              style={{ borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}
            >
              +998 33 645 00 97
            </a>
            <a
              href="https://t.me/baxtiyorjon_gaziyev"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-white hover:text-black"
              style={{ borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}
            >
              Telegram
            </a>
          </div>
        </div>
      </section>

      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        presetService={presetService}
        source="credentials"
      />
    </div>
  );
}
