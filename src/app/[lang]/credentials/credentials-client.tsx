'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GUARANTEES, JOBS, PACKAGES, PROCESS_STEPS, SERVICE_GROUPS } from '@/lib/sales-content';

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

import { Deck, type DeckSlide, Display, Eyebrow, INK, mono, nums, PAPER, rise, serif, Slide, stagger } from '@/components/credentials/deck';

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
        <Eyebrow light>Jon Branding — Credentials</Eyebrow>
        <Display light size="xl">
          Brend — bu ko‘rinish emas.
          <br />
          Bu sotuv vositasi.
        </Display>
        <motion.p
          variants={rise}
          className="mt-8 max-w-xl text-base leading-relaxed sm:text-lg"
          style={{ color: 'rgba(255,255,255,.6)' }}
        >
          Nom, logo, aydentika, brandbook, qadoq va patent — bitta jamoa, bitta shartnoma.
          Ishni boshlaymiz, guvohnomani qo‘lingizga beramiz.
        </motion.p>
        <motion.div variants={rise} className="mt-14 flex flex-wrap gap-x-14 gap-y-7">
          {[
            ['9', 'yil bozorda'],
            ['500+', 'mijoz'],
            ['1000+', 'loyiha'],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-4xl sm:text-5xl" style={{ ...serif, ...nums, color: '#fff', fontWeight: 400 }}>
                {value}
              </p>
              <p className="mt-1 text-[10px] uppercase" style={{ ...mono, letterSpacing: '0.16em', color: 'rgba(255,255,255,.42)' }}>
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
            className="mt-12 grid grid-cols-3 gap-x-10 gap-y-10 sm:grid-cols-4 lg:grid-cols-6"
          >
            {logos.map((brand) => (
              <div key={brand.name} className="flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={140}
                  height={56}
                  loading="eager"
                  className="max-h-10 w-auto object-contain opacity-45 mix-blend-multiply grayscale"
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
        <motion.ul variants={rise} className="mt-12 grid gap-7 sm:grid-cols-2">
          {JOBS.map((job) => (
            <li key={job.pain} className="border-l pl-5" style={{ borderColor: 'rgba(255,255,255,.18)' }}>
              <p className="text-[15px] leading-relaxed sm:text-base" style={{ color: 'rgba(255,255,255,.64)' }}>
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
        <motion.ul variants={rise} className="mt-12 grid gap-7 sm:grid-cols-2">
          {JOBS.map((job) => (
            <li key={job.gain} className="border-l pl-5" style={{ borderColor: 'rgba(11,11,12,.18)' }}>
              <p className="text-[15px] font-medium leading-relaxed sm:text-base" style={{ color: INK }}>
                {job.gain}
              </p>
            </li>
          ))}
        </motion.ul>
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
            className="mx-auto grid min-h-full w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1.45fr] lg:gap-14"
            style={{
              paddingLeft: 'var(--cred-px)',
              paddingRight: 'var(--cred-px)',
              paddingTop: 'var(--cred-pt)',
              paddingBottom: 'var(--cred-pb)',
            }}
          >
            {/* Ish to'liq rangda va aniq ko'rinadi — xiralashtirilgan fon emas. */}
            <motion.div
              variants={rise}
              className="relative order-first aspect-[4/3] w-full overflow-hidden rounded-2xl lg:order-last"
              style={{ background: '#1a1a1c', boxShadow: '0 30px 80px -30px rgba(0,0,0,.8)' }}
            >
              <Image
                src={item.coverImage}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
                quality={85}
                priority={index === 0}
                // Chop etish nusxasi ekrandan tashqarida turadi, lazy rasm esa
                // u yerda hech qachon yuklanmaydi va PDF qop-qora chiqadi.
                loading="eager"
                className="object-cover"
              />
            </motion.div>
            <div>
              <Eyebrow light>
                Keys {String(index + 1).padStart(2, '0')}
                {item.categoryLabel ? ` · ${item.categoryLabel}` : ''}
              </Eyebrow>
              <Display light>{item.title}</Display>
              <motion.div variants={rise} className="mt-7 flex flex-col gap-3">
                <p className="text-sm" style={{ color: 'rgba(255,255,255,.6)' }}>{item.client}</p>
                {item.result ? (
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,.85)' }}>
                    <span className="text-3xl font-medium" style={{ ...nums, color: '#fff' }}>{item.result.value}</span>{' '}
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
          <motion.p variants={rise} className="mt-5 max-w-2xl text-[15px] leading-relaxed" style={{ color: 'rgba(11,11,12,.55)' }}>
            {group.intro}
          </motion.p>
          <motion.div variants={rise} className="mt-10">
            {group.items.map((item, index) => (
              <div
                key={item.name}
                className="cred-row flex flex-col gap-1.5 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                style={{ borderTop: index === 0 ? 'none' : '1px solid rgba(11,11,12,.1)' }}
              >
                <div className="min-w-0 sm:flex-1">
                  <p className="text-lg" style={{ ...serif, color: INK }}>{item.name}</p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'rgba(11,11,12,.5)' }}>{item.benefit}</p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="text-lg" style={{ ...nums, color: INK }}>
                    {item.price} <span className="text-xs" style={{ color: 'rgba(11,11,12,.4)' }}>so‘m</span>
                  </p>
                  <p className="text-[10px] uppercase" style={{ ...mono, letterSpacing: '0.14em', color: 'rgba(11,11,12,.38)' }}>
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
        <motion.div variants={rise} className="mt-11 grid gap-5 lg:grid-cols-3">
          {PACKAGES.map((pack) => (
            <div
              key={pack.name}
              className="flex flex-col rounded-xl p-6"
              style={{
                background: pack.featured ? '#fff' : 'transparent',
                border: pack.featured ? 'none' : '1px solid rgba(255,255,255,.18)',
                color: pack.featured ? INK : '#fff',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase" style={{ ...mono, letterSpacing: '0.18em' }}>
                  {pack.name}
                </p>
                {pack.badge ? (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase"
                    style={{ ...mono, letterSpacing: '0.12em', background: INK, color: '#fff' }}
                  >
                    {pack.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-5 text-3xl" style={{ ...serif, ...nums }}>
                {pack.price}
                <span className="ml-1.5 text-sm" style={{ opacity: 0.45 }}>so‘m</span>
              </p>
              <p className="mt-1.5 text-xs" style={{ opacity: 0.55 }}>
                Alohida olinsa <span style={nums}>{pack.separate}</span> — <span style={nums}>{pack.saving}</span> tejaysiz
              </p>
              <ul className="mt-5 space-y-1.5 text-sm">
                {pack.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p className="mt-auto pt-6 text-[10px] uppercase" style={{ ...mono, letterSpacing: '0.14em', opacity: 0.5 }}>
                {pack.duration}
              </p>
              <button
                type="button"
                onClick={() => openModal(`${pack.name} paket`)}
                className="cred-no-print mt-4 w-full rounded-full px-5 py-2.5 text-xs font-medium transition-opacity hover:opacity-80"
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
        <motion.p variants={rise} className="mt-7 text-xs" style={{ color: 'rgba(255,255,255,.45)' }}>
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
        <motion.div variants={rise} className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <div key={step.title} className="border-t pt-4" style={{ borderColor: 'rgba(11,11,12,.15)' }}>
              <p className="text-[10px]" style={{ ...mono, ...nums, letterSpacing: '0.16em', color: 'rgba(11,11,12,.38)' }}>
                0{index + 1}
              </p>
              <p className="mt-3 text-lg" style={{ ...serif, color: INK }}>{step.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'rgba(11,11,12,.5)' }}>{step.desc}</p>
            </div>
          ))}
        </motion.div>
        <motion.div
          variants={rise}
          className="mt-12 flex flex-wrap items-baseline gap-x-12 gap-y-3 border-t pt-6"
          style={{ borderColor: 'rgba(11,11,12,.15)' }}
        >
          <p className="text-[10px] uppercase" style={{ ...mono, letterSpacing: '0.16em', color: 'rgba(11,11,12,.45)' }}>
            To‘lov bosqichma-bosqich
          </p>
          {[['50%', 'shartnoma'], ['50%', 'topshirish']].map(([pct, when]) => (
            <p key={when} className="text-sm" style={{ color: INK }}>
              <span className="text-xl" style={{ ...serif, ...nums }}>{pct}</span>{' '}
              <span style={{ color: 'rgba(11,11,12,.5)' }}>{when}</span>
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
        <motion.ul variants={rise} className="mt-12 space-y-5">
          {GUARANTEES.map((item, index) => (
            <li key={item} className="flex gap-5 border-t pt-5" style={{ borderColor: 'rgba(11,11,12,.12)' }}>
              <span className="text-[10px]" style={{ ...mono, ...nums, letterSpacing: '0.14em', color: 'rgba(11,11,12,.35)' }}>
                0{index + 1}
              </span>
              <span className="text-[15px] leading-relaxed sm:text-base" style={{ color: INK }}>{item}</span>
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
            <Eyebrow light>Mijoz gapi</Eyebrow>
            <motion.blockquote
              variants={rise}
              className="mt-6 max-w-4xl text-[1.6rem] leading-[1.25] sm:text-[2.5rem] lg:text-[3rem]"
              style={{ ...serif, letterSpacing: '-0.02em', color: '#fff', fontWeight: 400 }}
            >
              “{quote.quote}”
            </motion.blockquote>
            <motion.footer variants={rise} className="mt-10">
              <p className="text-sm" style={{ color: '#fff' }}>{quote.name}</p>
              <p className="mt-0.5 text-[10px] uppercase" style={{ ...mono, letterSpacing: '0.16em', color: 'rgba(255,255,255,.45)' }}>
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
        <motion.p variants={rise} className="mt-8 max-w-lg text-base leading-relaxed" style={{ color: 'rgba(255,255,255,.6)' }}>
          Qisqa suhbat: biznesingizni so‘raymiz, nima kerakligini va qancha turishini aytamiz. Majburiyatsiz.
        </motion.p>
        <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => openModal('Aniq emas — maslahat kerak')}
            className="cred-no-print rounded-full bg-white px-7 py-3.5 text-sm font-medium transition-opacity hover:opacity-85"
            style={{ color: INK }}
          >
            Ariza qoldirish
          </button>
          <a
            data-oisha-phone=""
            href="tel:+998792000097"
            className="rounded-full border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-white"
            style={{ borderColor: 'rgba(255,255,255,.28)', color: '#fff' }}
          >
            +998 79 200 00 97
          </a>
          <a
            href="https://t.me/baxtiyorjongaziyev"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-white"
            style={{ borderColor: 'rgba(255,255,255,.28)', color: '#fff' }}
          >
            Telegram
          </a>
        </motion.div>
      </Slide>
    ),
  });

  return <Deck slides={slides} modalOpen={modalOpen} setModalOpen={setModalOpen} presetService={presetService} />;
}
