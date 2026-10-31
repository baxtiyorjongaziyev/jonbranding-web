'use client';

import { useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GUARANTEES, JOBS, PACKAGES, PROCESS_STEPS, SERVICE_GROUPS } from '@/lib/sales-content';

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

type Props = {
  cases: CredCase[];
  quotes: CredQuote[];
  logos: CredLogo[];
};

import { Deck, type DeckSlide, Display, Eyebrow, INK, mono, nums, PAPER, rise, serif, Slide, stagger } from '@/components/credentials/deck';
import { clientsLabel, projectsLabel } from '@/lib/company-facts';

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

export default function CredentialsClient({ cases, quotes, logos }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [presetService, setPresetService] = useState('Aniq emas — maslahat kerak');
  const openModal = useCallback((service: string) => {
    setPresetService(service);
    setModalOpen(true);
  }, []);

  const slides: DeckSlide[] = [];

  slides.push({
    id: 'muqova',
    label: 'Muqova',
    render: () => (
      <Slide bg={INK}>
        <Eyebrow light>Jon Branding — Taqdimot</Eyebrow>
        <Display light size="xl">
          Brend — bu ko‘rinish emas.
          <br />
          Bu sotuv vositasi.
        </Display>
        <motion.p
          variants={rise}
          className="mt-8 max-w-2xl text-lg sm:text-2xl font-light leading-relaxed text-white/70"
        >
          Nom, logo, aydentika, brandbook, qadoq va patent — bitta jamoa, bitta shartnoma.
          Ishni boshlaymiz, guvohnomani qo‘lingizga beramiz.
        </motion.p>
        <motion.div variants={rise} className="mt-14 flex flex-wrap gap-x-16 gap-y-8">
          {[
            ['9', 'yil bozorda'],
            [clientsLabel, 'mijoz'],
            [projectsLabel, 'loyiha'],
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
      label: 'Mijozlar',
      render: () => (
        <Slide>
          <Eyebrow>Kimlar bilan ishladik</Eyebrow>
          <Display>Bizga ishongan brendlar</Display>
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
    label: 'Muammo',
    render: () => (
      <Slide bg={INK}>
        <Eyebrow light>Tanish holat</Eyebrow>
        <Display light>Mahsulotingiz yaxshi. Lekin buni hech kim bilmaydi.</Display>
        <motion.ul variants={rise} className="mt-14 grid gap-8 sm:grid-cols-2">
          {JOBS.map((job) => (
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
    label: 'Yechim',
    render: () => (
      <Slide>
        <Eyebrow>Biz bilan ishlagandan keyin</Eyebrow>
        <Display>Nima o‘zgaradi</Display>
        <motion.ul variants={rise} className="mt-14 grid gap-8 sm:grid-cols-2">
          {JOBS.map((job) => (
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
    label: 'Nomlash ishlari',
    render: () => (
      <Slide bg={INK}>
        <Eyebrow light>Neyming · Nom ishlab chiqish</Eyebrow>
        <Display light>
          Bozorga kiritgan va patentlangan nomlarimiz
        </Display>
        <motion.p
          variants={rise}
          className="mt-6 max-w-3xl text-lg sm:text-2xl font-light leading-relaxed text-white/75"
        >
          Nom — brendning bir umrlik poydevori. Biz ishlab chiqqan har bir nom 100% patentdan o‘tadi, xaridor ongida esda qoladi va sotuvga xizmat qiladi.
        </motion.p>

        {/* 19 ta nom kartochkalari — katta va o'qilishi oson */}
        <motion.div
          variants={rise}
          className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4"
        >
          {[
            { name: 'SAVOD', field: 'Ta’lim & O‘quv markazi' },
            { name: 'SHIRONA', field: 'Kafe & Novvoyxona' },
            { name: 'FIDDA', field: 'Zargarlik brendi' },
            { name: 'REVO', field: 'Fintex & Biznes' },
            { name: 'PETRON', field: 'Polimer & Sanoat' },
            { name: 'ZAYYAN', field: 'Savdo & Distribyutsiya' },
            { name: 'GEONEST', field: 'Muhandislik & Geodeziya' },
            { name: 'RUTERA', field: 'Logistika & Transport' },
            { name: 'SOFMIR', field: 'Mebel aksessuarlari' },
            { name: 'ARFADEL', field: 'Selektiv parfyumeriya' },
            { name: 'ENROS', field: 'Texnologik servis' },
            { name: 'BELIF', field: 'Kosmetika & Go‘zallik' },
            { name: 'UNVAN', field: 'Yuridik konsalting' },
            { name: 'PARFINO', field: 'Parfyumeriya tarmog‘i' },
            { name: 'ESTEM', field: 'Stomatologiya & Tibbiyot' },
            { name: 'MERCATO', field: 'Chakana savdo' },
            { name: 'MELAMUS', field: 'Qandolat mahsulotlari' },
            { name: 'POLENTRA', field: 'Ishlab chiqarish' },
            { name: 'VITON', field: 'Farmatsevtika' },
          ].map((item) => (
            <div
              key={item.name}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
            >
              <p
                className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors"
                style={{ ...serif, fontWeight: 400 }}
              >
                {item.name}
              </p>
              <p
                className="mt-1.5 text-xs sm:text-sm leading-snug text-white/55"
              >
                {item.field}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Neyming kafolatlari va faktlar — katta shriftlarda */}
        <motion.div
          variants={rise}
          className="mt-9 flex flex-wrap items-center gap-x-12 gap-y-4 border-t border-white/10 pt-6"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-5xl font-bold text-white" style={{ ...serif, ...nums }}>100%</span>
            <span className="text-sm sm:text-base text-white/75">Patentga toza tekshiruv (IMA bazasi)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-5xl font-bold text-white" style={{ ...serif, ...nums }}>.uz / .com</span>
            <span className="text-sm sm:text-base text-white/75">Domen va username mavjudligi</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-5xl font-bold text-white" style={{ ...serif, ...nums }}>10 kun</span>
            <span className="text-sm sm:text-base text-white/75">Nom ishlab chiqish va taqdimot muddati</span>
          </div>
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
                Keys {String(index + 1).padStart(2, '0')}
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

  SERVICE_GROUPS.forEach((group) => {
    slides.push({
      id: `xizmat-${group.title}`,
      label: group.title,
      render: () => (
        <Slide>
          <Eyebrow>Xizmatlar — narxlarimiz ochiq</Eyebrow>
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
                    {item.price} <span className="text-sm sm:text-base font-medium text-black/50">so‘m</span>
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
    label: 'Paketlar',
    render: () => (
      <Slide bg={INK}>
        <Eyebrow light>Paketlar</Eyebrow>
        <Display light>Birga olinsa arzonroq</Display>
        <motion.div variants={rise} className="mt-11 grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((pack) => (
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
                <span className="ml-2 text-base sm:text-lg font-light opacity-60">so‘m</span>
              </p>
              <p className="mt-2 text-sm sm:text-base opacity-70">
                Alohida olinsa <span style={nums}>{pack.separate}</span> — <span style={nums}>{pack.saving}</span> tejaysiz
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
                onClick={() => openModal(`${pack.name} paket`)}
                className="cred-no-print mt-5 w-full rounded-full px-6 py-3.5 text-sm sm:text-base font-semibold transition-opacity hover:opacity-85"
                style={{
                  background: pack.featured ? INK : '#fff',
                  color: pack.featured ? '#fff' : INK,
                }}
              >
                Shu paketni tanlash
              </button>
            </div>
          ))}
        </motion.div>
        <motion.p variants={rise} className="mt-8 text-sm sm:text-base text-white/50">
          Muddatlar dizayn ishlariga tegishli. Patent guvohnomasi alohida: oddiy tartibda 7 oy, tezkorda 20–40 kun.
        </motion.p>
      </Slide>
    ),
  });

  slides.push({
    id: 'jarayon',
    label: 'Jarayon',
    render: () => (
      <Slide>
        <Eyebrow>Qanday ishlaymiz</Eyebrow>
        <Display>To‘rt bosqich. Har birida siz tasdiqlaysiz.</Display>
        <motion.div variants={rise} className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
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
            To‘lov bosqichma-bosqich:
          </p>
          {[['50%', 'shartnomada'], ['50%', 'topshirishda']].map(([pct, when]) => (
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
    label: 'Kafolatlar',
    render: () => (
      <Slide>
        <Eyebrow>Shartnomada yoziladi</Eyebrow>
        <Display>Xavfni o‘zimiz olamiz</Display>
        <motion.ul variants={rise} className="mt-14 space-y-6">
          {GUARANTEES.map((item, index) => (
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
            <Eyebrow light>Mijoz fikri</Eyebrow>
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
    label: 'Keyingi qadam',
    render: () => (
      <Slide bg={INK}>
        <Eyebrow light>Keyingi qadam</Eyebrow>
        <Display light size="xl">
          Qaysi paket sizga
          <br />
          to‘g‘ri kelishini
          <br />
          birga aniqlaymiz
        </Display>
        <motion.p variants={rise} className="mt-8 max-w-2xl text-lg sm:text-2xl font-light leading-relaxed text-white/70">
          Qisqa suhbat: biznesingizni so‘raymiz, nima kerakligini va qancha turishini aytamiz. Majburiyatsiz.
        </motion.p>
        <motion.div variants={rise} className="mt-12 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => openModal('Aniq emas — maslahat kerak')}
            className="cred-no-print rounded-full bg-white px-8 py-4 text-base sm:text-lg font-semibold transition-opacity hover:opacity-85 text-[#0b0b0c]"
          >
            Ariza qoldirish
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

  return <Deck slides={slides} modalOpen={modalOpen} setModalOpen={setModalOpen} presetService={presetService} />;
}
