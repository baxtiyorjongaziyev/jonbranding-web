'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Deck, type DeckSlide, Display, Eyebrow, INK, mono, nums, rise, serif, Slide, stagger } from '@/components/credentials/deck';
import { clientsLabel, projectsLabel, yearsLabel } from '@/lib/company-facts';
import type { CredentialsCopy } from '@/lib/credentials-content';
import type { Job, Package, ProcessStep, ServiceGroup } from '@/lib/sales-content/types';

export type CredCase = {
  slug: string;
  title: string;
  client: string;
  categoryLabel: string;
  coverImage: string;
  galleryImages?: string[];
  result?: { metric: string; value: string };
};

export type CredQuote = { name: string; company: string; quote: string };
export type CredLogo = { name: string; logo: string };

/**
 * Serverda til bo'yicha tanlangan sotuv kontenti. Client butun
 * `sales-content` modulini emas, faqat shu qismni oladi.
 */
export type CredentialsSales = {
  serviceGroups: ServiceGroup[];
  packages: Package[];
  guarantees: string[];
  jobs: Job[];
  processSteps: ProcessStep[];
  currency: string;
  payment: { contract: string; delivery: string };
  packageSeparate: { pre: string; mid: string; suf: string };
  packageSuffix: string;
  notSure: string;
};

type Props = {
  cases: CredCase[];
  quotes: CredQuote[];
  logos: CredLogo[];
  sales: CredentialsSales;
  copy: CredentialsCopy;
  lang: string;
};

function CaseImageRotator({
  images,
  title,
  priority,
}: {
  images: string[];
  title: string;
  priority?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Preload all case images in background so transitions are instant
  useEffect(() => {
    if (!images || images.length <= 1) return;
    images.forEach((src) => {
      if (typeof window !== 'undefined' && src) {
        const img = new window.Image();
        img.src = src;
      }
    });
  }, [images]);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [images.length, isPaused]);

  const activeImage = images[currentIndex] || images[0];

  return (
    <motion.div
      variants={rise}
      className="relative order-first aspect-[4/3] w-full overflow-hidden rounded-2xl lg:order-last select-none group"
      style={{ background: '#141416', boxShadow: '0 30px 80px -30px rgba(0,0,0,.8)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 h-full w-full">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeImage + currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={activeImage}
              alt={`${title} - visual ${currentIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 720px"
              quality={75}
              priority={priority && currentIndex === 0}
              loading={currentIndex === 0 ? 'eager' : 'lazy'}
              unoptimized={activeImage.startsWith('https://cdn.sanity.io/')}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle indicator bar when multiple images exist */}
      {images.length > 1 && (
        <div className="cred-no-print absolute bottom-3.5 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 rounded-full bg-black/75 px-3 py-1.5 backdrop-blur-md border border-white/15">
            {images.slice(0, 8).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
            {images.length > 8 && (
              <span className="text-xs font-mono font-medium text-white/70 ml-1">
                +{images.length - 8}
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white/90 rounded-full bg-black/75 px-3 py-1.5 backdrop-blur-md border border-white/15">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default function CredentialsClient({ cases, quotes, logos, sales, copy, lang }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [presetService, setPresetService] = useState(sales.notSure);
  const openModal = useCallback((service: string) => {
    setPresetService(service);
    setModalOpen(true);
  }, []);

  // Nomlar `sales-content` dagi naming proof'dan olinadi — ikkinchi ro'yxat yo'q.
  const namingService = sales.serviceGroups
    .flatMap((group) => group.items)
    .find((item) => item.id === 'naming');
  const namingNames = (namingService?.proof?.items ?? []).map((name) => ({
    name,
    field: copy.naming.fields[name.toUpperCase()] ?? '',
  }));

  const slides: DeckSlide[] = [];

  slides.push({
    id: 'muqova',
    label: copy.nav.cover,
    render: () => (
      <Slide bg={INK}>
        <Eyebrow light>{copy.cover.eyebrow}</Eyebrow>
        <Display light size="xl">
          {copy.cover.title.map((line, i) => (
            <Fragment key={line}>
              {i > 0 ? <br /> : null}
              {line}
            </Fragment>
          ))}
        </Display>
        <motion.p
          variants={rise}
          className="mt-8 max-w-2xl text-lg sm:text-2xl font-light leading-relaxed text-white/70"
        >
          {copy.cover.subtitle}
        </motion.p>
        <motion.div variants={rise} className="mt-14 flex flex-wrap gap-x-16 gap-y-8">
          {[
            [yearsLabel(), copy.cover.stats.years],
            [clientsLabel, copy.cover.stats.clients],
            [projectsLabel, copy.cover.stats.projects],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-5xl sm:text-7xl font-normal text-white" style={{ ...serif, ...nums }}>
                {value}
              </p>
              <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-widest text-white/50" style={mono}>
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </Slide>
    ),
  });

  if (logos.length > 0) {
    slides.push({
      id: 'mijozlar',
      label: copy.nav.clients,
      render: () => (
        <Slide>
          <Eyebrow>{copy.clients.eyebrow}</Eyebrow>
          <Display>{copy.clients.title}</Display>
          <motion.div
            variants={rise}
            className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-5"
          >
            {logos.map((brand) => (
              <div
                key={brand.name}
                className="group flex h-24 sm:h-28 items-center justify-center rounded-2xl bg-white p-4 sm:p-5 shadow-xs border border-black/[0.08] transition-all duration-300 hover:shadow-lg hover:scale-[1.03]"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={180}
                  height={72}
                  loading="eager"
                  className="max-h-14 sm:max-h-16 w-auto max-w-[150px] sm:max-w-[175px] object-contain transition-transform duration-300 group-hover:scale-105 filter-none"
                />
              </div>
            ))}
          </motion.div>
        </Slide>
      ),
    });
  }

  slides.push({
    id: 'muammo',
    label: copy.nav.problem,
    render: () => (
      <Slide bg={INK}>
        <Eyebrow light>{copy.problem.eyebrow}</Eyebrow>
        <Display light>{copy.problem.title}</Display>
        <motion.ul variants={rise} className="mt-14 grid gap-8 sm:grid-cols-2">
          {sales.jobs.map((job) => (
            <li key={job.pain} className="border-l-2 pl-6 sm:pl-8" style={{ borderColor: 'rgba(255,255,255,.25)' }}>
              <p className="text-lg sm:text-2xl font-light leading-relaxed text-white/75">
                {job.pain}
              </p>
            </li>
          ))}
        </motion.ul>
      </Slide>
    ),
  });

  slides.push({
    id: 'yechim',
    label: copy.nav.solution,
    render: () => (
      <Slide>
        <Eyebrow>{copy.solution.eyebrow}</Eyebrow>
        <Display>{copy.solution.title}</Display>
        <motion.ul variants={rise} className="mt-14 grid gap-8 sm:grid-cols-2">
          {sales.jobs.map((job) => (
            <li key={job.gain} className="border-l-2 pl-6 sm:pl-8" style={{ borderColor: 'rgba(11,11,12,.25)' }}>
              <p className="text-lg sm:text-2xl font-medium leading-relaxed" style={{ color: INK }}>
                {job.gain}
              </p>
            </li>
          ))}
        </motion.ul>
      </Slide>
    ),
  });

  slides.push({
    id: 'neyming',
    label: copy.nav.naming,
    render: () => (
      <Slide bg={INK}>
        <Eyebrow light>{copy.naming.eyebrow}</Eyebrow>
        <Display light>{copy.naming.title}</Display>
        <motion.p
          variants={rise}
          className="mt-6 max-w-3xl text-lg sm:text-2xl font-light leading-relaxed text-white/75"
        >
          {copy.naming.intro}
        </motion.p>

        {/* Nom kartochkalari — nomlar va sohalar bitta manbadan */}
        <motion.div
          variants={rise}
          className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4"
        >
          {namingNames.map((item) => (
            <div
              key={item.name}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
            >
              <p
                className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors"
                style={{ ...serif, fontWeight: 400 }}
              >
                {item.name}
              </p>
              {item.field ? (
                <p className="mt-1.5 text-xs sm:text-sm leading-snug text-white/55">
                  {item.field}
                </p>
              ) : null}
            </div>
          ))}
        </motion.div>

        {/* Neyming kafolatlari va faktlar — katta shriftlarda */}
        <motion.div
          variants={rise}
          className="mt-9 flex flex-wrap items-center gap-x-12 gap-y-4 border-t border-white/10 pt-6"
        >
          {copy.naming.facts.map((fact) => (
            <div key={fact.label} className="flex items-center gap-3">
              <span className="text-3xl sm:text-5xl font-bold text-white" style={{ ...serif, ...nums }}>{fact.value}</span>
              <span className="text-sm sm:text-base text-white/75">{fact.label}</span>
            </div>
          ))}
        </motion.div>
      </Slide>
    ),
  });

  cases.forEach((item, index) => {
    slides.push({
      id: `keys-${item.slug}`,
      label: item.title,
      render: () => (
        <div className="cred-slide cred-dark cred-case h-full w-full overflow-y-auto" style={{ background: INK }}>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mx-auto grid min-h-full w-full max-w-7xl items-center gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14"
            style={{
              paddingLeft: 'var(--cred-px)',
              paddingRight: 'var(--cred-px)',
              paddingTop: 'var(--cred-pt)',
              paddingBottom: 'var(--cred-pb)',
            }}
          >
            {/* Ish to'liq rangda va animatsiya bilan almashib turadi */}
            <CaseImageRotator
              images={item.galleryImages && item.galleryImages.length > 0 ? item.galleryImages : [item.coverImage]}
              title={item.title}
              priority={index === 0}
            />
            <div>
              <Eyebrow light>
                {copy.cases.eyebrow} {String(index + 1).padStart(2, '0')}
                {item.categoryLabel ? ` · ${item.categoryLabel}` : ''}
              </Eyebrow>
              <Display light>{item.title}</Display>
              <motion.div variants={rise} className="mt-8 flex flex-col gap-4">
                <p className="text-lg sm:text-2xl font-light leading-relaxed text-white/75">{item.client}</p>
                {item.result ? (
                  <p className="mt-2 text-base sm:text-xl text-white/90">
                    <span className="text-4xl sm:text-6xl font-bold text-white mr-2" style={{ ...serif, ...nums }}>{item.result.value}</span>{' '}
                    {item.result.metric}
                  </p>
                ) : null}
              </motion.div>
            </div>
          </motion.div>
        </div>
      ),
    });
  });

  sales.serviceGroups.forEach((group) => {
    slides.push({
      id: `xizmat-${group.title}`,
      label: group.title,
      render: () => (
        <Slide>
          <Eyebrow>{copy.services.eyebrow}</Eyebrow>
          <Display>{group.title}</Display>
          <motion.p variants={rise} className="mt-6 max-w-3xl text-lg sm:text-2xl font-light leading-relaxed text-black/65">
            {group.intro}
          </motion.p>
          <motion.div variants={rise} className="mt-10">
            {group.items.map((item, index) => (
              <div
                key={item.name}
                className="cred-row flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-12"
                style={{ borderTop: index === 0 ? 'none' : '1px solid rgba(11,11,12,.12)' }}
              >
                <div className="min-w-0 sm:flex-1">
                  <p className="text-2xl sm:text-3xl font-normal" style={{ ...serif, color: INK }}>{item.name}</p>
                  <p className="mt-2 text-base sm:text-lg leading-relaxed text-black/60">{item.benefit}</p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="text-2xl sm:text-4xl font-normal" style={{ ...nums, color: INK }}>
                    {item.price} <span className="text-sm sm:text-base font-medium text-black/50">{sales.currency}</span>
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold font-mono tracking-wider uppercase text-black/50">
                    {item.duration}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </Slide>
      ),
    });
  });

  slides.push({
    id: 'paketlar',
    label: copy.nav.packages,
    render: () => (
      <Slide bg={INK}>
        <Eyebrow light>{copy.packages.eyebrow}</Eyebrow>
        <Display light>{copy.packages.title}</Display>
        <motion.div variants={rise} className="mt-11 grid gap-6 lg:grid-cols-3">
          {sales.packages.map((pack) => (
            <div
              key={pack.name}
              className="flex flex-col rounded-2xl p-7 sm:p-8"
              style={{
                background: pack.featured ? '#fff' : 'transparent',
                border: pack.featured ? 'none' : '1px solid rgba(255,255,255,.2)',
                color: pack.featured ? INK : '#fff',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest" style={mono}>
                  {pack.name}
                </p>
                {pack.badge ? (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                    style={{ ...mono, background: INK, color: '#fff' }}
                  >
                    {pack.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-6 text-4xl sm:text-5xl lg:text-6xl" style={{ ...serif, ...nums }}>
                {pack.price}
                <span className="ml-2 text-base sm:text-lg font-light opacity-60">{sales.currency}</span>
              </p>
              <p className="mt-2 text-sm sm:text-base opacity-70">
                {sales.packageSeparate.pre} <span style={nums}>{pack.separate}</span> {sales.packageSeparate.mid}{' '}
                <span style={nums}>{pack.saving}</span> {sales.packageSeparate.suf}
              </p>
              <ul className="mt-6 space-y-2.5 text-base sm:text-lg">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="opacity-40">―</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-8 text-xs sm:text-sm font-bold font-mono uppercase tracking-widest opacity-60">
                {pack.duration}
              </p>
              <button
                type="button"
                onClick={() => openModal(`${pack.name} ${sales.packageSuffix}`)}
                className="cred-no-print mt-5 w-full rounded-full px-6 py-3.5 text-sm sm:text-base font-semibold transition-opacity hover:opacity-85"
                style={{
                  background: pack.featured ? INK : '#fff',
                  color: pack.featured ? '#fff' : INK,
                }}
              >
                {copy.packages.cta}
              </button>
            </div>
          ))}
        </motion.div>
        <motion.p variants={rise} className="mt-8 text-sm sm:text-base text-white/50">
          {copy.packages.note}
        </motion.p>
      </Slide>
    ),
  });

  slides.push({
    id: 'jarayon',
    label: copy.nav.process,
    render: () => (
      <Slide>
        <Eyebrow>{copy.process.eyebrow}</Eyebrow>
        <Display>{copy.process.title}</Display>
        <motion.div variants={rise} className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {sales.processSteps.map((step, index) => (
            <div key={step.title} className="border-t-2 pt-5 border-black/15">
              <p className="text-2xl sm:text-4xl font-mono font-bold text-black/35" style={nums}>
                0{index + 1}
              </p>
              <p className="mt-4 text-xl sm:text-3xl font-normal" style={{ ...serif, color: INK }}>{step.title}</p>
              <p className="mt-2 text-base sm:text-lg leading-relaxed text-black/60">{step.desc}</p>
            </div>
          ))}
        </motion.div>
        <motion.div
          variants={rise}
          className="mt-14 flex flex-wrap items-baseline gap-x-14 gap-y-4 border-t-2 pt-7 border-black/15"
        >
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black/60" style={mono}>
            {copy.process.paymentLabel}
          </p>
          {[['50%', sales.payment.contract], ['50%', sales.payment.delivery]].map(([pct, when]) => (
            <p key={when} className="text-base sm:text-lg text-black">
              <span className="text-2xl sm:text-4xl font-normal mr-2" style={{ ...serif, ...nums }}>{pct}</span>{' '}
              <span className="text-black/60">{when}</span>
            </p>
          ))}
        </motion.div>
      </Slide>
    ),
  });

  slides.push({
    id: 'kafolat',
    label: copy.nav.guarantees,
    render: () => (
      <Slide>
        <Eyebrow>{copy.guarantees.eyebrow}</Eyebrow>
        <Display>{copy.guarantees.title}</Display>
        <motion.ul variants={rise} className="mt-14 space-y-6">
          {sales.guarantees.map((item, index) => (
            <li key={item} className="flex items-baseline gap-6 border-t-2 pt-6 border-black/10">
              <span className="text-lg sm:text-2xl font-mono font-bold text-black/40" style={nums}>
                0{index + 1}
              </span>
              <span className="text-lg sm:text-2xl font-normal leading-relaxed text-[#0b0b0c]">{item}</span>
            </li>
          ))}
        </motion.ul>
      </Slide>
    ),
  });

  if (quotes.length > 0) {
    quotes.forEach((quote) => {
      slides.push({
        id: `fikr-${quote.name}`,
        label: quote.company || quote.name,
        render: () => (
          <Slide bg={INK}>
            <Eyebrow light>{copy.quote.eyebrow}</Eyebrow>
            <motion.blockquote
              variants={rise}
              className="mt-8 max-w-5xl text-2xl sm:text-4xl lg:text-5xl font-normal leading-snug text-white"
              style={{ ...serif, letterSpacing: '-0.02em', fontWeight: 400 }}
            >
              “{quote.quote}”
            </motion.blockquote>
            <motion.footer variants={rise} className="mt-12">
              <p className="text-xl sm:text-2xl font-semibold text-white">{quote.name}</p>
              <p className="mt-1 text-xs sm:text-sm font-mono uppercase tracking-widest text-white/55">
                {quote.company}
              </p>
            </motion.footer>
          </Slide>
        ),
      });
    });
  }

  slides.push({
    id: 'cta',
    label: copy.nav.cta,
    render: () => (
      <Slide bg={INK}>
        <Eyebrow light>{copy.cta.eyebrow}</Eyebrow>
        <Display light size="xl">
          {copy.cta.title.map((line, i) => (
            <Fragment key={line}>
              {i > 0 ? <br /> : null}
              {line}
            </Fragment>
          ))}
        </Display>
        <motion.p variants={rise} className="mt-8 max-w-2xl text-lg sm:text-2xl font-light leading-relaxed text-white/70">
          {copy.cta.subtitle}
        </motion.p>
        <motion.div variants={rise} className="mt-12 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => openModal(sales.notSure)}
            className="cred-no-print rounded-full bg-white px-8 py-4 text-base sm:text-lg font-semibold transition-opacity hover:opacity-85 text-[#0b0b0c]"
          >
            {copy.cta.button}
          </button>
          <a
            data-oisha-phone=""
            href="tel:+998792000097"
            className="rounded-full border border-white/30 px-8 py-4 text-base sm:text-lg font-semibold text-white transition-colors hover:bg-white hover:text-black"
          >
            +998 79 200 00 97
          </a>
          <a
            href="https://t.me/baxtiyorjongaziyev"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/30 px-8 py-4 text-base sm:text-lg font-semibold text-white transition-colors hover:bg-white hover:text-black"
          >
            Telegram
          </a>
        </motion.div>
      </Slide>
    ),
  });

  return (
    <Deck
      slides={slides}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      presetService={presetService}
      lang={lang}
    />
  );
}
