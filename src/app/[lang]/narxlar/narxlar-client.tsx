'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { getSalesContent, serviceCategories } from '@/lib/sales-content';
import type { SalesUi, Service, ServiceId } from '@/lib/sales-content';
import PriceOverview from '@/components/sales/price-overview';
import LeadModal from '@/components/sales/lead-modal';
import ClientLogos from '@/components/sections/client-logos';

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

type Props = {
  lang: string;
  cases: ServiceCase[];
  quotes: ServiceQuote[];
  clientLogoLabels: { title: string; pauseLabel: string; resumeLabel: string };
  showcase: string[];
};

function ShowcaseReel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (images.length < 2 || isPaused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [images.length, isPaused]);

  return (
    <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Jon.Branding keys lavhasi"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
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
            style={{ background: i === index ? '#2554FF' : '#e5e5e5' }}
          />
        ))}
      </div>
    </div>
  );
}

const mono = { fontFamily: 'var(--font-mono), "JetBrains Mono", monospace' } as const;
const numerals = { fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' } as const;
const h2Style = { fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 } as const;

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="mb-5 inline-flex items-center justify-center gap-2 rounded-full border border-blue-500/20 bg-blue-50/80 px-3.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2554FF]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#2554FF] animate-pulse" />
      <span>{label}</span>
    </div>
  );
}

function Label({ children }: { children: string }) {
  return (
    <p className="mb-4 text-[10px] uppercase text-neutral-400" style={{ ...mono, letterSpacing: '0.12em' }}>
      {children}
    </p>
  );
}

/** Havola `#service-logo` kabi bo'lsa, shu xizmat qatorini ochadi (bosh sahifa va tez tanlovdan keladi). */
function useOpenServiceFromHash() {
  useEffect(() => {
    const openFromHash = () => {
      // Xizmat id'lari ASCII: dekodlash shart emas (noto'g'ri `%` URIError tashlardi).
      const id = window.location.hash.slice(1);
      if (!id.startsWith('service-')) return;
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);
}

type ServiceRowProps = {
  service: Service;
  number: number;
  ui: SalesUi;
  cases: ServiceCase[];
  showcase: string[];
  onCta: (service: string) => void;
};

/**
 * Bitta xizmat — yig'iladigan qator. Yopiqligida nom, narx va muddat ko'rinadi,
 * ochilganda tarkib, foyda va o'sha xizmatga bog'langan tugma.
 * Matn DOM'da qoladi: qidiruv tizimi va sahifa ichidan qidirish uni topadi.
 */
function ServiceRow({ service, number, ui, cases, showcase, onCta }: ServiceRowProps) {
  const showReel = service.id === 'brandbook' && showcase.length > 0;
  return (
    <details
      id={`service-${service.id}`}
      className="group scroll-mt-24 border-b border-neutral-200"
      onToggle={(event) => {
        if (event.currentTarget.open) {
          trackEvent({ action: 'pricing_service_open', category: 'Pricing', label: service.id, source: 'narxlar' });
        }
      }}
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 py-5 marker:hidden sm:gap-6 sm:py-6 [&::-webkit-details-marker]:hidden">
        <span className="w-6 shrink-0 text-[11px] text-neutral-400" style={mono}>
          {String(number).padStart(2, '0')}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-semibold leading-snug sm:text-xl" style={{ letterSpacing: '-0.02em' }}>
            {service.name}
          </span>
          <span className="mt-1 block text-sm text-neutral-500 sm:hidden" style={numerals}>
            {service.price} {ui.currency}
            {service.duration ? ` · ${service.duration}` : ''}
          </span>
        </span>
        <span className="hidden shrink-0 text-right sm:block">
          <span className="block text-xl font-bold" style={numerals}>
            {service.price} <span className="text-sm font-medium text-neutral-400">{ui.currency}</span>
          </span>
          {service.duration && (
            <span className="mt-0.5 block text-[11px] uppercase text-neutral-400" style={{ ...mono, letterSpacing: '0.06em' }}>
              {service.duration}
            </span>
          )}
        </span>
        <span className="hidden text-[11px] uppercase text-neutral-400 md:inline" style={{ ...mono, letterSpacing: '0.08em' }}>
          {ui.services.details}
        </span>
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-neutral-300 text-lg text-neutral-500 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
        >
          +
        </span>
      </summary>

      <div className="grid gap-10 pb-12 pt-2 sm:pl-12 md:grid-cols-2 md:gap-14">
        <div>
          <p className="text-neutral-700" style={{ fontSize: 'clamp(16px, 1.4vw, 18px)', lineHeight: 1.6, maxWidth: '40ch' }}>
            {service.lead}
          </p>

          {service.addon && (
            <p className="mt-6 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4 text-sm">
              <span className="text-neutral-600">{service.addon.label}</span>
              <span className="whitespace-nowrap font-medium" style={numerals}>{service.addon.price}</span>
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-neutral-50 p-5 sm:p-6">
            <p className="mb-2 text-[10px] uppercase text-neutral-400" style={{ ...mono, letterSpacing: '0.12em' }}>
              {ui.services.benefit}
            </p>
            <p className="text-[15px] text-neutral-900" style={{ lineHeight: 1.6 }}>{service.benefit}</p>
          </div>

          <p className="mt-6 text-sm text-neutral-500" style={{ lineHeight: 1.55 }}>
            <span className="text-[10px] uppercase text-neutral-400" style={{ ...mono, letterSpacing: '0.12em' }}>
              {ui.services.audience}{' '}
            </span>
            {service.audience}
          </p>
          {service.note && <p className="mt-3 text-xs text-neutral-400" style={{ lineHeight: 1.6 }}>{service.note}</p>}

          <button
            type="button"
            onClick={() => onCta(service.name)}
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            {service.cta}
          </button>
        </div>

        <div>
          <Label>{ui.services.deliverables}</Label>
          <ul className="flex flex-col gap-3.5">
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

          {service.proof && (
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <Label>{service.proof.label}</Label>
              <ul className="flex flex-wrap gap-x-2 gap-y-2">
                {service.proof.items.map((item) => (
                  <li key={item} className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {showReel && (
          <div className="md:col-span-2">
            <Label>{ui.services.showcase}</Label>
            <ShowcaseReel images={showcase} />
          </div>
        )}

        {!showReel && cases.length > 0 && (
          <div className="md:col-span-2">
            <Label>{ui.services.cases}</Label>
            <div className="grid gap-4 sm:grid-cols-2">
              {cases.map((item) => (
                <a
                  key={item.slug}
                  href={`/portfolio/${item.slug}`}
                  className="group/case block overflow-hidden rounded-2xl border border-neutral-200 transition-colors hover:border-neutral-400"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <Image
                      src={item.coverImage}
                      alt={[item.client || item.title, item.categoryLabel].filter(Boolean).join(' — ')}
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover/case:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/case:scale-100"
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
      </div>
    </details>
  );
}

/**
 * `/narxlar` — tartib (konversiya auditi, K-5): sarlavha va tez tanlov → paketlar →
 * "Nega arzon dizayner emas" → yig'iladigan xizmatlar → vazifa → ishonch → jarayon →
 * omillar → FAQ → suhbat. Eng foydali taklif va eng kuchli e'tiroz javobi yuqorida.
 */
export default function NarxlarClient({ lang, cases, quotes, clientLogoLabels, showcase }: Props) {
  const content = getSalesContent(lang);
  const {
    serviceGroups: SERVICE_GROUPS,
    packages: PACKAGES,
    faqs: FAQS,
    whyUs: WHY_US,
    guarantees: GUARANTEES,
    jobs: JOBS,
    processSteps: PROCESS_STEPS,
    priceFactors: PRICE_FACTORS,
    ui,
  } = content;
  const [modalOpen, setModalOpen] = useState(false);
  const [presetService, setPresetService] = useState(ui.notSure);
  useOpenServiceFromHash();

  const openModal = (service: string) => {
    setPresetService(service);
    setModalOpen(true);
  };

  const casesFor = (serviceId: ServiceId) => {
    const seen = new Set<string>();
    return serviceCategories(serviceId)
      .flatMap((category) => cases.filter((item) => item.category === category))
      .filter((item) => {
        if (seen.has(item.slug)) return false;
        seen.add(item.slug);
        return true;
      })
      .slice(0, 2);
  };

  // Raqamlash guruhlar bo'ylab davom etadi: 01…10.
  const serviceNumbers = new Map(SERVICE_GROUPS.flatMap((group) => group.items).map((service, i) => [service.id, i + 1]));

  return (
    <div className="bg-white text-black">
      {/* HERO + TEZ TANLOV */}
      <section className="px-5 sm:px-8 pt-20 pb-16 md:pt-28 md:pb-24 max-w-3xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <Eyebrow label={ui.eyebrows.prices} />
        </motion.div>
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-bold leading-[1.02]"
          style={{ fontSize: 'clamp(40px, 6.6vw, 72px)', letterSpacing: '-0.035em' }}
        >
          {ui.hero.pre} <span className="serif-highlight">{ui.hero.hi}</span>
        </motion.h1>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-6 text-neutral-600"
          style={{ fontSize: 'clamp(16px, 1.5vw, 19px)', lineHeight: 1.65, maxWidth: '38ch' }}
        >
          {ui.hero.sub}
        </motion.p>
        <PriceOverview lang={lang} local />
        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-neutral-200 pt-6"
        >
          {[
            { value: '4', label: ui.stats.experience },
            { value: '50/50', label: ui.stats.clients },
            { value: '100%', label: ui.stats.projects },
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

      {/* PAKETLAR */}
      <section id="packages" className="scroll-mt-24 px-5 sm:px-8 pb-20 md:pb-28 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <Eyebrow label={ui.eyebrows.packages} />
          <h2 className="font-bold" style={h2Style}>
            {ui.packages.pre} <span className="serif-highlight">{ui.packages.hi}</span>
          </h2>
          <p className="mx-auto mt-5 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '46ch' }}>
            {ui.packages.sub}
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
                <span className="text-sm" style={{ color: pkg.featured ? 'rgba(255,255,255,.6)' : '#737373' }}>{ui.currency}</span>
              </div>
              <p className="mb-5 text-xs" style={{ lineHeight: 1.5, color: pkg.featured ? 'rgba(255,255,255,.6)' : '#a3a3a3' }}>
                {ui.packages.separate.pre} <span style={numerals}>{pkg.separate}</span> {ui.currency}{' '}
                {ui.packages.separate.mid} <span style={numerals}>{pkg.saving}</span> {ui.currency}{' '}
                {ui.packages.separate.suf}
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
                {ui.services.duration}: {pkg.duration}
              </p>
              <button
                type="button"
                onClick={() => openModal(`${pkg.name} ${ui.modal.packageSuffix}`)}
                className={`inline-flex w-full items-center justify-center rounded-full py-4 text-sm font-semibold transition-opacity hover:opacity-90 ${pkg.featured ? 'bg-white text-black' : 'bg-black text-white'}`}
              >{ui.packages.cta}</button>
            </motion.div>
          ))}
        </div>

        <p
          className="mt-10 text-center text-[11px] uppercase text-neutral-400"
          style={{ ...mono, letterSpacing: '0.06em', lineHeight: 1.7 }}
        >
          {ui.packages.note}
        </p>
      </section>

      {/* NEGA ARZON DIZAYNER EMAS */}
      <section className="border-t border-neutral-200 px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <Eyebrow label={ui.eyebrows.difference} />
            <h2 className="font-bold" style={h2Style}>
              {ui.difference.pre} <span className="serif-highlight">{ui.difference.hi}</span>
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
              {ui.difference.guaranteesTitle}
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

      {/* ALOHIDA XIZMATLAR — YIG'ILADIGAN RO'YXAT */}
      <section className="border-t border-neutral-200 px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <Eyebrow label={ui.eyebrows.services} />
            <h2 className="font-bold" style={h2Style}>
              {ui.services.pre} <span className="serif-highlight">{ui.services.hi}</span>
            </h2>
            <p className="mx-auto mt-5 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '46ch' }}>
              {ui.services.sub}
            </p>
          </motion.div>

          <div className="flex flex-col gap-12">
            {SERVICE_GROUPS.map((group) => (
              <div key={group.title}>
                <h3
                  className="border-b border-neutral-900 pb-3 text-[11px] uppercase text-neutral-900"
                  style={{ ...mono, letterSpacing: '0.12em' }}
                >
                  {group.title}
                </h3>
                {group.items.map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    number={serviceNumbers.get(service.id) ?? 0}
                    ui={ui}
                    cases={casesFor(service.id)}
                    showcase={showcase}
                    onCta={openModal}
                  />
                ))}
              </div>
            ))}
          </div>

          <p
            className="mt-10 text-center text-[11px] uppercase text-neutral-400"
            style={{ ...mono, letterSpacing: '0.06em' }}
          >
            {ui.services.note}
          </p>
        </div>
      </section>

      {/* JTBD — BIZ NIMANI HAL QILAMIZ */}
      <section className="border-t border-neutral-200 px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <Eyebrow label={ui.eyebrows.task} />
            <h2 className="font-bold" style={h2Style}>
              {ui.jobs.pre} <span className="serif-highlight">{ui.jobs.hi}</span>
            </h2>
            <p className="mx-auto mt-5 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '46ch' }}>
              {ui.jobs.sub}
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
                >{ui.jobs.now}</p>
                <p className="mb-5 text-[15px] text-neutral-500" style={{ lineHeight: 1.6 }}>{job.pain}</p>
                <p
                  className="mb-2 text-[10px] uppercase text-neutral-400"
                  style={{ ...mono, letterSpacing: '0.12em' }}
                >{ui.jobs.withUs}</p>
                <p className="text-[15px] font-medium text-neutral-900" style={{ lineHeight: 1.6 }}>{job.gain}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IJTIMOIY ISBOT */}
      <section className="border-t border-neutral-200 py-10 md:py-14">
        <ClientLogos title={clientLogoLabels.title} pauseLabel={clientLogoLabels.pauseLabel} resumeLabel={clientLogoLabels.resumeLabel} />
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
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

      {/* ISHLASH TARTIBI */}
      <section className="border-t border-neutral-200 px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12 text-center"
          >
            <Eyebrow label={ui.eyebrows.process} />
            <h2 className="font-bold" style={h2Style}>
              {ui.process.pre} <span className="serif-highlight">{ui.process.hi}</span>
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
              {ui.process.paymentTitle}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { value: '50%', label: ui.payment.contract },
                { value: '50%', label: ui.payment.delivery },
              ].map((stage) => (
                <div key={stage.label}>
                  <p className="text-3xl font-bold" style={{ ...numerals, letterSpacing: '-0.035em' }}>{stage.value}</p>
                  <p className="mt-1.5 text-sm text-neutral-600" style={{ lineHeight: 1.5 }}>{stage.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
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
          <Eyebrow label={ui.eyebrows.factors} />
          <h2 className="font-bold" style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {ui.factors.pre} <span className="serif-highlight">{ui.factors.hi}</span>
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
            <Eyebrow label={ui.eyebrows.faq} />
            <h2 className="font-bold" style={h2Style}>
              {ui.faq.pre} <span className="serif-highlight">{ui.faq.hi}</span>
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
          <Eyebrow label={ui.eyebrows.talk} />
        </motion.div>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto max-w-2xl font-bold"
          style={{ fontSize: 'clamp(28px, 4vw, 46px)', letterSpacing: '-0.03em', lineHeight: 1.08, color: '#fff' }}
        >
          {ui.cta.pre} <span className="serif-highlight">{ui.cta.hi}</span>
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-5 text-neutral-300"
          style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '42ch' }}
        >
          {ui.cta.sub}
        </motion.p>
        <motion.button
          type="button"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          onClick={() => openModal(ui.notSure)}
          className="mt-8 rounded-full bg-white text-black font-semibold px-8 py-4 text-sm hover:opacity-90 transition-opacity"
        >
          {ui.cta.button}
        </motion.button>
      </section>

      {/* FOOTER ABOVE */}
      <p
        className="px-5 py-10 text-center text-[11px] uppercase text-neutral-400"
        style={{ ...mono, letterSpacing: '0.06em', lineHeight: 1.7 }}
      >
        {ui.footnote}
      </p>

      {/* Har tugma "... bo'yicha maslahat" — shuning uchun oyna ham maslahat oynasi, xizmat oldindan belgilangan. */}
      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} presetService={presetService} source="narxlar" lang={lang} intent="consultation" />
    </div>
  );
}
