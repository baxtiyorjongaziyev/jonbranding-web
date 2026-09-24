'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { generateEventId, getGaClientId, trackEvent, trackLead } from '@/lib/analytics';
import { isValidPhone, normalizePhone } from '@/lib/lead-contact';
import {
  ALL_SERVICES,
  FAQS,
  GUARANTEES,
  JOBS,
  PACKAGES,
  PRICE_FACTORS,
  PROCESS_STEPS,
  SERVICE_CATEGORIES,
  SERVICE_GROUPS,
  WHY_US,
} from '@/lib/sales-content';
import LeadModal from '@/components/sales/lead-modal';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export type ServiceCase = {
  slug: string;
  title: string;
  client: string;
  category: string;
  categoryLabel: string;
  coverImage: string;
  result?: { metric: string; value: string };
};

export type ServiceQuote = { name: string; company: string; quote: string };
export type ServiceLogo = { name: string; logo: string };

type Props = {
  cases: ServiceCase[];
  quotes: ServiceQuote[];
  logos: ServiceLogo[];
  showcase: string[];
};

function ShowcaseReel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            priority={i === 0}
            className="object-cover transition-opacity duration-500 motion-reduce:transition-none"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {images.map((src, i) => (
          <span
            key={src}
            className="h-0.5 flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none"
            style={{ background: i === index ? '#000' : '#e5e5e5' }}
          />
        ))}
      </div>
    </div>
  );
}

const mono = { fontFamily: 'var(--font-mono), "JetBrains Mono", monospace' } as const;
const numerals = { fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' } as const;

function Eyebrow({ index, label, muted }: { index: string; label: string; muted?: boolean }) {
  return (
    <p
      className="mb-5 flex items-center justify-center gap-2.5 text-[11px] font-medium uppercase"
      style={{ ...mono, letterSpacing: '0.1em', color: muted ? 'rgba(255,255,255,.5)' : '#a3a3a3' }}
    >
      <span style={{ color: muted ? 'rgba(255,255,255,.85)' : '#000' }}>{index}</span>
      <span aria-hidden="true" className="inline-block h-px w-5" style={{ background: 'currentColor' }} />
      {label}
    </p>
  );
}


export default function NarxlarClient({ cases, quotes, logos, showcase }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [presetService, setPresetService] = useState('Aniq emas — maslahat kerak');

  const openModal = (service: string) => {
    setPresetService(service);
    setModalOpen(true);
  };

  const casesFor = (serviceName: string) => {
    const categories = SERVICE_CATEGORIES[serviceName];
    if (!categories) return [];
    const seen = new Set<string>();
    return categories
      .flatMap((category) => cases.filter((item) => item.category === category))
      .filter((item) => (seen.has(item.slug) ? false : seen.add(item.slug)))
      .slice(0, 2);
  };

  return (
    <div className="bg-white text-black">
      {/* HERO */}
      <section className="px-5 sm:px-8 pt-20 pb-16 md:pt-28 md:pb-24 max-w-3xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <Eyebrow index="§ 01" label="Narxlar" />
        </motion.div>
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-bold leading-[1.02]"
          style={{ fontSize: 'clamp(40px, 6.6vw, 72px)', letterSpacing: '-0.035em' }}
        >
          Narxlarimiz <span className="serif-highlight">ochiq</span>
        </motion.h1>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-6 text-neutral-600"
          style={{ fontSize: 'clamp(16px, 1.5vw, 19px)', lineHeight: 1.65, maxWidth: '38ch' }}
        >
          Hamma uchun birdek, shaffof ishlaymiz. Narxni ham yashirmaymiz, ishni ham.
        </motion.p>
        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-neutral-200 pt-6"
        >
          {[
            { value: '9', label: 'yil tajriba' },
            { value: '500+', label: 'mijoz' },
            { value: '1000+', label: 'loyiha' },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-2xl font-bold sm:text-3xl" style={numerals}>{stat.value}</span>
                <span
                  className="mt-1 block text-[11px] uppercase text-neutral-400"
                  style={{ ...mono, letterSpacing: '0.08em' }}
                >
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </section>

      {/* JTBD — BIZ NIMANI HAL QILAMIZ */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <Eyebrow index="§ 02" label="Vazifa" />
          <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Biz aslida nimani <span className="serif-highlight">hal qilamiz</span>
          </h2>
          <p className="mx-auto mt-5 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '46ch' }}>
            Mijoz bizga logo uchun kelmaydi. Mijoz bozorda jiddiy qabul qilinishi va narxini oqlay olishi uchun keladi.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {JOBS.map((job) => (
            <motion.div
              key={job.pain}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-2xl border border-neutral-200 p-6 sm:p-7"
            >
              <p
                className="mb-2 text-[10px] uppercase text-neutral-400"
                style={{ ...mono, letterSpacing: '0.12em' }}
              >
                Hozir
              </p>
              <p className="mb-5 text-[15px] text-neutral-500" style={{ lineHeight: 1.6 }}>{job.pain}</p>
              <p
                className="mb-2 text-[10px] uppercase text-neutral-400"
                style={{ ...mono, letterSpacing: '0.12em' }}
              >
                Biz bilan
              </p>
              <p className="text-[15px] font-medium text-neutral-900" style={{ lineHeight: 1.6 }}>{job.gain}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ALOHIDA XIZMATLAR */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <Eyebrow index="§ 03" label="Xizmatlar" />
          <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Bittalab <span className="serif-highlight">olish</span>
          </h2>
          <p className="mx-auto mt-5 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '46ch' }}>
            Hammasi birdan kerak emas. Hozir nima kerak bo‘lsa, shuni olasiz — har bir xizmat o‘zicha to‘liq ish
            va oxirida sizga tayyor fayllar topshiriladi.
          </p>
        </motion.div>

        <p
          className="mt-12 text-center text-[11px] uppercase text-neutral-400"
          style={{ ...mono, letterSpacing: '0.06em' }}
        >
          Narxlar xizmat uchun. Davlat bojlari alohida to‘lanadi.
        </p>
      </section>

      {/* HAR BIR XIZMAT — ALOHIDA EKRAN */}
      {ALL_SERVICES.map((service, i) => (
        <motion.section
          key={service.name}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="flex min-h-[100svh] items-center border-t border-neutral-200 px-5 py-20 sm:px-8"
        >
          <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-2 md:gap-16">
            {service.name === 'Brandbook' && showcase.length > 0 && (
              <div className="order-first md:col-span-2">
                <p
                  className="mb-4 text-[10px] uppercase text-neutral-400"
                  style={{ ...mono, letterSpacing: '0.12em' }}
                >
                  Brendbuklarimizdan lavhalar
                </p>
                <ShowcaseReel images={showcase} />
              </div>
            )}

            {service.name !== 'Brandbook' && casesFor(service.name).length > 0 && (
              <div className="order-first md:col-span-2">
                <p
                  className="mb-4 text-[10px] uppercase text-neutral-400"
                  style={{ ...mono, letterSpacing: '0.12em' }}
                >
                  Shu xizmat bo‘yicha ishlarimiz
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {casesFor(service.name).map((item) => (
                    <a
                      key={item.slug}
                      href={`/portfolio/${item.slug}`}
                      className="group block overflow-hidden rounded-2xl border border-neutral-200 transition-colors hover:border-neutral-400"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                        <Image
                          src={item.coverImage}
                          alt={`${item.client} — ${item.categoryLabel}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 45vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                        <div>
                          <p className="text-sm font-medium">{item.client}</p>
                          <p className="text-xs text-neutral-400">{item.categoryLabel}</p>
                        </div>
                        {item.result && (
                          <p className="shrink-0 text-right">
                            <span className="block text-sm font-bold" style={numerals}>{item.result.value}</span>
                            <span className="block text-[10px] text-neutral-400">{item.result.metric}</span>
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div className="md:sticky md:top-24 md:self-start">
              <p
                className="mb-6 flex items-center gap-2.5 text-[11px] uppercase text-neutral-400"
                style={{ ...mono, letterSpacing: '0.1em' }}
              >
                <span className="text-black">{String(i + 1).padStart(2, '0')}</span>
                <span aria-hidden="true" className="inline-block h-px w-5 bg-neutral-300" />
                {service.group}
              </p>

              <h3
                className="font-bold"
                style={{ fontSize: 'clamp(30px, 4.4vw, 52px)', letterSpacing: '-0.035em', lineHeight: 1.05 }}
              >
                {service.name}
              </h3>

              <p className="mt-5 text-neutral-700" style={{ fontSize: 'clamp(16px, 1.5vw, 19px)', lineHeight: 1.6, maxWidth: '34ch' }}>
                {service.lead}
              </p>

              <div className="mt-8 flex items-end gap-6 border-t border-neutral-200 pt-6">
                <div>
                  <p
                    className="mb-1.5 text-[10px] uppercase text-neutral-400"
                    style={{ ...mono, letterSpacing: '0.12em' }}
                  >
                    Narx
                  </p>
                  <p className="text-2xl font-bold sm:text-3xl" style={{ ...numerals, letterSpacing: '-0.035em' }}>
                    {service.price}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">so‘m</p>
                </div>
                <div>
                  <p
                    className="mb-1.5 text-[10px] uppercase text-neutral-400"
                    style={{ ...mono, letterSpacing: '0.12em' }}
                  >
                    Muddat
                  </p>
                  <p className="text-2xl font-bold sm:text-3xl" style={{ ...numerals, letterSpacing: '-0.035em' }}>
                    {service.duration}
                  </p>
                </div>
              </div>

              {service.addon && (
                <p className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4 text-sm">
                  <span className="text-neutral-600">{service.addon.label}</span>
                  <span className="whitespace-nowrap font-medium" style={numerals}>{service.addon.price}</span>
                </p>
              )}

              <button
                onClick={() => openModal(service.name)}
                className="mt-8 w-full rounded-full bg-black py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 md:w-auto md:px-10"
              >
                Ariza qoldirish
              </button>
            </div>

            <div>
              <p
                className="mb-4 text-[10px] uppercase text-neutral-400"
                style={{ ...mono, letterSpacing: '0.12em' }}
              >
                Nima olasiz
              </p>
              <ul className="mb-8 flex flex-col gap-3.5">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-b border-neutral-100 pb-3.5 text-[15px] text-neutral-700 last:border-b-0"
                    style={{ lineHeight: 1.55 }}
                  >
                    <span className="mt-[3px] shrink-0 text-xs text-neutral-900">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl bg-neutral-50 p-5 sm:p-6">
                <p
                  className="mb-2 text-[10px] uppercase text-neutral-400"
                  style={{ ...mono, letterSpacing: '0.12em' }}
                >
                  Bu sizga nima beradi
                </p>
                <p className="text-[15px] text-neutral-900" style={{ lineHeight: 1.6 }}>{service.benefit}</p>
              </div>

              <p className="mt-6 text-sm text-neutral-500" style={{ lineHeight: 1.55 }}>
                <span
                  className="text-[10px] uppercase text-neutral-400"
                  style={{ ...mono, letterSpacing: '0.12em' }}
                >
                  Kimga{' '}
                </span>
                {service.audience}
              </p>
              {service.note && (
                <p className="mt-3 text-xs text-neutral-400" style={{ lineHeight: 1.6 }}>{service.note}</p>
              )}

              {service.proof && (
                <div className="mt-8 border-t border-neutral-200 pt-6">
                  <p
                    className="mb-4 text-[10px] uppercase text-neutral-400"
                    style={{ ...mono, letterSpacing: '0.12em' }}
                  >
                    {service.proof.label}
                  </p>
                  <ul className="flex flex-wrap gap-x-2 gap-y-2">
                    {service.proof.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      ))}

      {/* ISHLASH TARTIBI */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-12 text-center"
        >
          <Eyebrow index="§ 04" label="Jarayon" />
          <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Qanday <span className="serif-highlight">ishlaymiz</span>
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex gap-4"
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-[13px] font-medium text-white"
                style={mono}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="mb-1 font-semibold" style={{ letterSpacing: '-0.015em' }}>{step.title}</h3>
                <p className="text-sm text-neutral-600" style={{ lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="rounded-2xl border border-neutral-200 p-6 sm:p-8"
        >
          <h3
            className="mb-6 text-[10px] uppercase text-neutral-400"
            style={{ ...mono, letterSpacing: '0.14em' }}
          >
            To‘lov bosqichlari
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { value: '50%', label: 'Shartnoma imzolanganda' },
              { value: '50%', label: 'Loyiha topshirilganda' },
            ].map((stage) => (
              <div key={stage.label}>
                <p className="text-3xl font-bold" style={{ ...numerals, letterSpacing: '-0.035em' }}>{stage.value}</p>
                <p className="mt-1.5 text-sm text-neutral-600" style={{ lineHeight: 1.5 }}>{stage.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* NARXGA TA'SIR QILUVCHI OMILLAR */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-8 text-center"
        >
          <Eyebrow index="§ 05" label="Omillar" />
          <h2 className="font-bold" style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Narxga nima <span className="serif-highlight">ta’sir qiladi</span>
          </h2>
        </motion.div>
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col gap-3"
        >
          {PRICE_FACTORS.map((factor) => (
            <li key={factor} className="flex items-start gap-3 text-sm sm:text-base text-neutral-700 border border-neutral-200 rounded-xl px-5 py-4">
              <span className="mt-0.5 shrink-0 font-semibold">•</span>
              {factor}
            </li>
          ))}
        </motion.ul>
      </section>

      {/* PAKETLAR */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <Eyebrow index="§ 06" label="Paketlar" />
          <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Bir nechtasi kerakmi? Paket <span className="serif-highlight">arzonroq</span>
          </h2>
          <p className="mx-auto mt-5 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '46ch' }}>
            Xizmatlarni alohida-alohida olgandan ko‘ra paket bilan olsangiz, ham arzonroq chiqadi,
            ham hamma narsa bitta tizimda ishlanadi.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PACKAGES.map((pkg) => (
            <motion.div
              key={pkg.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`relative flex flex-col rounded-2xl p-8 ${pkg.featured ? 'bg-black text-white md:-translate-y-3 md:shadow-2xl' : 'bg-white text-black border border-neutral-200'}`}
            >
              {pkg.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white text-black text-xs font-semibold px-4 py-1 border border-neutral-200">
                  {pkg.badge}
                </span>
              )}
              <h3
                className="mb-4 text-xs uppercase"
                style={{ ...mono, letterSpacing: '0.14em', color: pkg.featured ? 'rgba(255,255,255,.65)' : '#737373' }}
              >
                {pkg.name}
              </h3>
              <div className="mb-1.5 flex items-baseline gap-2">
                <span className="font-bold" style={{ fontSize: 'clamp(30px, 3.2vw, 38px)', ...numerals, letterSpacing: '-0.035em' }}>
                  {pkg.price}
                </span>
                <span className="text-sm" style={{ color: pkg.featured ? 'rgba(255,255,255,.6)' : '#737373' }}>so‘m</span>
              </div>
              <p className="mb-5 text-xs" style={{ lineHeight: 1.5, color: pkg.featured ? 'rgba(255,255,255,.6)' : '#a3a3a3' }}>
                Alohida olinsa <span style={numerals}>{pkg.separate}</span> so‘m — <span style={numerals}>{pkg.saving}</span> so‘m tejaysiz
              </p>
              <p className="mb-7 text-[15px]" style={{ lineHeight: 1.6, color: pkg.featured ? 'rgba(255,255,255,.75)' : '#525252' }}>
                {pkg.audience}
              </p>
              <ul className="flex flex-col gap-2.5 mb-8 flex-grow">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 shrink-0" style={{ color: pkg.featured ? '#fff' : '#000' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <p
                className="mb-5 text-[11px] uppercase"
                style={{ ...mono, letterSpacing: '0.08em', color: pkg.featured ? 'rgba(255,255,255,.5)' : '#a3a3a3' }}
              >
                Muddat: {pkg.duration}
              </p>
              <button
                onClick={() => openModal(`${pkg.name} paket`)}
                className={`w-full rounded-full py-4 text-sm font-semibold transition-opacity hover:opacity-90 ${pkg.featured ? 'bg-white text-black' : 'bg-black text-white'}`}
              >
                Ariza qoldirish
              </button>
            </motion.div>
          ))}
        </div>

        <p
          className="mt-10 text-center text-[11px] uppercase text-neutral-400"
          style={{ ...mono, letterSpacing: '0.06em', lineHeight: 1.7 }}
        >
          Muddat dizayn ishlari uchun. Patent guvohnomasi rasmiy tartibda alohida muddatda chiqadi.
        </p>
      </section>

      {/* IJTIMOIY ISBOT */}
      {(logos.length > 0 || quotes.length > 0) && (
        <section className="border-t border-neutral-200 px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mx-auto mb-12 max-w-2xl text-center"
            >
              <Eyebrow index="§ 07" label="Ishonch" />
              <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
                Biz bilan <span className="serif-highlight">ishlaganlar</span>
              </h2>
            </motion.div>

            {logos.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="mb-14 grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-6"
              >
                {logos.map((brand) => (
                  <div key={brand.name} className="relative h-10 opacity-60 transition-opacity hover:opacity-100">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="120px"
                      className="object-contain"
                      style={{ filter: 'grayscale(1)' }}
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {quotes.length > 0 && (
              <div className="grid gap-5 md:grid-cols-3">
                {quotes.map((item) => (
                  <motion.figure
                    key={item.name}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="flex flex-col rounded-2xl border border-neutral-200 p-6"
                  >
                    <blockquote className="mb-5 flex-grow text-[15px] text-neutral-700" style={{ lineHeight: 1.6 }}>
                      “{item.quote}”
                    </blockquote>
                    <figcaption className="border-t border-neutral-100 pt-4">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-neutral-400">{item.company}</p>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* NEGA AYNAN BIZ */}
      <section className="border-t border-neutral-200 px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <Eyebrow index="§ 08" label="Farq" />
            <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
              Nega arzon dizayner <span className="serif-highlight">emas</span>
            </h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {WHY_US.map((item) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl border border-neutral-200 p-6 sm:p-7"
              >
                <h3 className="mb-2 text-lg font-semibold" style={{ letterSpacing: '-0.02em' }}>{item.title}</h3>
                <p className="text-[15px] text-neutral-600" style={{ lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-6 rounded-2xl bg-neutral-50 p-6 sm:p-8"
          >
            <p
              className="mb-5 text-[10px] uppercase text-neutral-400"
              style={{ ...mono, letterSpacing: '0.14em' }}
            >
              Xavfingizni kamaytirish uchun
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {GUARANTEES.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-700" style={{ lineHeight: 1.55 }}>
                  <span className="mt-[3px] shrink-0 text-xs text-neutral-900">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-neutral-200 px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12 text-center"
          >
            <Eyebrow index="§ 09" label="Savollar" />
            <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
              Ko‘p so‘raladigan <span className="serif-highlight">savollar</span>
            </h2>
          </motion.div>

          <div className="flex flex-col">
            {FAQS.map((faq) => (
              <motion.details
                key={faq.q}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group border-b border-neutral-200 py-5"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[17px] font-medium marker:hidden">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-[15px] text-neutral-600" style={{ lineHeight: 1.65, maxWidth: '60ch' }}>
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BLOK */}
      <section className="px-5 sm:px-8 py-20 md:py-28 bg-black text-white text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <Eyebrow index="§ 10" label="Suhbat" muted />
        </motion.div>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto max-w-2xl font-bold"
          style={{ fontSize: 'clamp(28px, 4vw, 46px)', letterSpacing: '-0.03em', lineHeight: 1.08, color: '#fff' }}
        >
          Qaysi paket sizga to‘g‘ri kelishini <span className="serif-highlight">bilmayapsizmi?</span>
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-5 text-neutral-300"
          style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '42ch' }}
        >
          20 daqiqalik bepul suhbatda aytamiz. Sotmaymiz — maslahat beramiz.
        </motion.p>
        <motion.button
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          onClick={() => openModal('Aniq emas — maslahat kerak')}
          className="mt-8 rounded-full bg-white text-black font-semibold px-8 py-4 text-sm hover:opacity-90 transition-opacity"
        >
          Suhbatga yozilish
        </motion.button>
      </section>

      {/* FOOTER ABOVE */}
      <p
        className="px-5 py-10 text-center text-[11px] uppercase text-neutral-400"
        style={{ ...mono, letterSpacing: '0.06em', lineHeight: 1.7 }}
      >
        Narxlar 2026 yil sentyabr holatiga. Yakuniy narx loyiha hajmiga qarab aniqlanadi.
      </p>

      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} presetService={presetService} source="narxlar" />
    </div>
  );
}
