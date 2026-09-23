'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import LeadModal from '@/components/sales/lead-modal';
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

const mono = { fontFamily: 'var(--font-mono), "JetBrains Mono", monospace' } as const;
const serif = { fontFamily: 'var(--font-serif), "Instrument Serif", serif' } as const;
const nums = { fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' } as const;

const INK = '#0b0b0c';
const PAPER = '#f4f2ee';

/** Slayd ichidagi bloklar ketma-ket chiqadi — taqdimotda urg'u shunday tushadi. */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <motion.p
      variants={rise}
      className="text-[10px] font-medium uppercase sm:text-[11px]"
      style={{ ...mono, letterSpacing: '0.18em', color: light ? 'rgba(255,255,255,.5)' : 'rgba(11,11,12,.45)' }}
    >
      {children}
    </motion.p>
  );
}

function Display({
  children,
  light,
  size = 'lg',
}: {
  children: React.ReactNode;
  light?: boolean;
  size?: 'lg' | 'xl';
}) {
  return (
    <motion.h2
      variants={rise}
      className={size === 'xl' ? 'cred-display-xl leading-[0.95]' : 'cred-display-lg leading-[1.02]'}
      style={{ ...serif, letterSpacing: '-0.025em', color: light ? '#fff' : INK, fontWeight: 400 }}
    >
      {children}
    </motion.h2>
  );
}

/** Har bir slayd butun ekranni egallaydi; chop etishda esa oddiy sahifaga aylanadi. */
function Slide({
  children,
  bg = PAPER,
  pad = true,
}: {
  children: React.ReactNode;
  bg?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={`cred-slide h-full w-full overflow-y-auto${bg === INK ? ' cred-dark' : ''}`}
      style={{ background: bg }}
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center"
        style={
          pad
            ? {
                paddingLeft: 'var(--cred-px)',
                paddingRight: 'var(--cred-px)',
                paddingTop: 'var(--cred-pt)',
                paddingBottom: 'var(--cred-pb)',
              }
            : undefined
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function CredentialsClient({ cases, quotes, logos }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [presetService, setPresetService] = useState('Aniq emas — maslahat kerak');
  const openModal = useCallback((service: string) => {
    setPresetService(service);
    setModalOpen(true);
  }, []);

  const slides: { id: string; label: string; render: () => React.ReactNode }[] = [];

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
        <div className="cred-slide cred-dark cred-case relative h-full w-full overflow-hidden" style={{ background: INK }}>
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            sizes="100vw"
            priority={index === 0}
            // Chop etish nusxasi ekrandan tashqarida turadi, lazy rasm esa
            // u yerda hech qachon yuklanmaydi va PDF qop-qora chiqadi.
            loading="eager"
            className="object-cover"
            style={{ opacity: 0.55 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(11,11,12,.92) 0%, rgba(11,11,12,.35) 55%, rgba(11,11,12,.55) 100%)' }}
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-end"
            style={{
              paddingLeft: 'var(--cred-px)',
              paddingRight: 'var(--cred-px)',
              paddingTop: 'var(--cred-pt)',
              paddingBottom: 'var(--cred-pb)',
            }}
          >
            <Eyebrow light>{item.categoryLabel}</Eyebrow>
            <Display light>{item.title}</Display>
            <motion.div variants={rise} className="mt-7 flex flex-wrap items-baseline gap-x-10 gap-y-3">
              <p className="text-sm" style={{ color: 'rgba(255,255,255,.6)' }}>{item.client}</p>
              {item.result ? (
                <p className="text-sm" style={{ color: 'rgba(255,255,255,.85)' }}>
                  <span className="text-2xl font-medium" style={{ ...nums, color: '#fff' }}>{item.result.value}</span>{' '}
                  {item.result.metric}
                </p>
              ) : null}
            </motion.div>
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
            href="tel:+998336450097"
            className="rounded-full border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-white"
            style={{ borderColor: 'rgba(255,255,255,.28)', color: '#fff' }}
          >
            +998 33 645 00 97
          </a>
          <a
            href="https://t.me/baxtiyorjon_gaziyev"
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

function Deck({
  slides,
  modalOpen,
  setModalOpen,
  presetService,
}: {
  slides: { id: string; label: string; render: () => React.ReactNode }[];
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  presetService: string;
}) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  /**
   * Chop etish nusxasi faqat PDF so'ralganda DOM'ga qo'yiladi.
   *
   * Ilgari u doim `display:none` konteynerda turardi va `next/image` undagi
   * rasmlarni hech qachon yuklamas edi (lazy + ko'rinmaydigan ota-element),
   * shuning uchun PDF'dagi keys sahifalari qop-qora chiqardi. Endi nusxa
   * so'ralganda yaratiladi, rasmlar yuklanishi kutiladi, keyin oyna ochiladi.
   */
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (!printing) return;
    let cancelled = false;

    const run = async () => {
      // Brauzerga nusxani chizishga ulgurish uchun bitta kadr beramiz.
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      const images = Array.from(document.querySelectorAll<HTMLImageElement>('.cred-print-all img'));
      await Promise.all(
        images.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                const done = () => resolve(null);
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
                // Rasm qotib qolsa ham chop etishni to'xtatib qo'ymaymiz.
                window.setTimeout(done, 8000);
              })
        )
      );
      if (cancelled) return;
      window.print();
      setPrinting(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [printing]);

  const go = useCallback(
    (next: number) => setIndex((current) => Math.min(total - 1, Math.max(0, next === -1 ? current : next))),
    [total]
  );

  // Klaviatura — taqdimot paytida sichqonchaga qo'l urmaslik uchun.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (modalOpen) return;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        setIndex((current) => Math.min(total - 1, current + 1));
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        setIndex((current) => Math.max(0, current - 1));
      } else if (event.key === 'Home') {
        setIndex(0);
      } else if (event.key === 'End') {
        setIndex(total - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total, modalOpen]);

  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    // Faqat aniq gorizontal svayp — vertikal scroll slayd ichida ishlashi kerak.
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    setIndex((current) => Math.min(total - 1, Math.max(0, current + (dx < 0 ? 1 : -1))));
  };

  const current = slides[index];

  return (
    <div
      className={`cred-root relative h-[100svh] w-full overflow-hidden${printing ? ' cred-printing' : ''}`}
      style={{ background: INK }}
    >
      <style>{`
        /* Slayd ichki bo'shliqlari ekran o'lchamiga ergashadi. Pastdagi
           qiymat boshqaruv paneli balandligini ham qo'shadi, aks holda
           oxirgi qator panel ostida qolib ketadi. */
        .cred-slide {
          --cred-px: clamp(1.25rem, 4vw, 3rem);
          --cred-pt: clamp(1.75rem, 7vh, 5rem);
          --cred-pb: calc(clamp(1.75rem, 7vh, 5rem) + 3.5rem);
        }
        /* Telefon landshafti va past oynalar: bo'sh joy keskin qisqaradi. */
        @media (max-height: 560px) {
          .cred-slide { --cred-pt: 0.875rem; --cred-pb: 3.25rem; }
        }

        .cred-display-lg { font-size: clamp(1.75rem, 4.2vw + 0.4rem, 4rem); }
        .cred-display-xl { font-size: clamp(2rem, 5.6vw + 0.5rem, 5.75rem); }
        @media (max-height: 560px) {
          .cred-display-lg { font-size: clamp(1.35rem, 3.6vh + 0.5rem, 2.35rem); }
          .cred-display-xl { font-size: clamp(1.5rem, 4.6vh + 0.5rem, 3rem); }
        }

        /* Uzun ro'yxatli slaydlar kichik ekranda zichroq bo'ladi. */
        @media (max-width: 640px), (max-height: 560px) {
          .cred-row { padding-top: 0.7rem; padding-bottom: 0.7rem; }
        }

        /* Mono yorliqlar telefonda 10px da juda mayda — biroz kattalashtiramiz. */
        @media (max-width: 480px) {
          .cred-slide [class*="text-[10px]"] { font-size: 11px; }
        }

        /* Nusxa ekranda ko'rinmaydi, lekin joylashuvi hisoblanadi —
           shunda rasmlar yuklanadi. */
        .cred-print-all {
          position: fixed;
          left: -200vw;
          top: 0;
          width: 100vw;
          pointer-events: none;
        }

        @media print {
          .cred-print-all { position: static !important; left: auto !important; width: auto !important; }
          /* Sahifa o'lchami slayd nisbatiga moslashtiriladi, hoshiyasiz —
             aks holda har slayd tasodifiy joyda kesiladi. */
          @page { size: A4 landscape; margin: 0; }

          .cred-chrome, .cred-no-print { display: none !important; }
          /* Nusxa mavjud bo'lgandagina jonli deki yashiriladi. Aks holda
             Ctrl/Cmd+P bosilganda sahifa umuman bo'sh chiqardi. */
          .cred-printing .cred-live { display: none !important; }
          .cred-printing .cred-print-all { display: block !important; }

          .cred-root {
            height: auto !important;
            overflow: visible !important;
            background: #fff !important;
          }

          /* Har bir slayd — aniq bitta sahifa. Balandlik belgilanishi shart:
             height:auto bo'lsa keys slaydidagi to'liq ekranli rasm (fill)
             o'lchamsiz ota-element ichida yig'ilib, matn ustiga chiqib ketadi. */
          .cred-slide {
            height: 209mm !important;
            min-height: 0 !important;
            overflow: hidden !important;
            break-after: page;
            page-break-after: always;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .cred-print-all > div:last-child .cred-slide {
            break-after: auto;
            page-break-after: auto;
          }

          /* Qorong'i slaydlar fonini saqlab qolamiz. Busiz brauzer "Background
             graphics" belgilanmagan holda fonni tashlab, oq ustiga oq matn
             chiqaradi yoki ranglarni o'zicha o'zgartiradi. */
          .cred-root, .cred-slide, .cred-dark, .cred-dark * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Faqat animatsiya siljishini bekor qilamiz. Shaffoflikka tegilmaydi:
             keys rasmidagi 0.55, logotiplardagi 45% va so'ngan matnlar
             dizaynning bir qismi, ularsiz PDF'da ierarxiya yo'qoladi. */
          .cred-print-all * {
            transform: none !important;
          }
        }
      `}</style>

      {/* Yuqoridagi progress chizig'i */}
      <div className="cred-chrome pointer-events-none absolute inset-x-0 top-0 z-30 h-[2px]" style={{ background: 'rgba(255,255,255,.12)' }}>
        <div
          className="h-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${((index + 1) / total) * 100}%`, background: 'rgba(255,255,255,.75)' }}
        />
      </div>

      {/* Slayd maydoni */}
      <div className="cred-live cred-deck h-full w-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="h-full w-full"
          >
            {current.render()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chop etishda barcha slaydlar ketma-ket chiqadi */}
      {printing ? (
        <div className="cred-print-all">
          {slides.map((slide) => (
            <div key={slide.id}>{slide.render()}</div>
          ))}
        </div>
      ) : null}

      {/* Boshqaruv paneli */}
      {/* Panel ortidagi xiralik: slayd uzun bo'lib scroll qilinganda matn
          panel ostidan o'tib ketishi kerak, kesilgandek ko'rinmasligi uchun. */}
      <div
        className="cred-chrome pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24"
        style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', maskImage: 'linear-gradient(to top, #000 55%, transparent)', WebkitMaskImage: 'linear-gradient(to top, #000 55%, transparent)' }}
      />
      <div className="cred-chrome pointer-events-none absolute inset-x-0 bottom-0 z-30 px-5 pb-5 sm:px-8 sm:pb-6">
        <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4">
          <span
            className="rounded-full px-3 py-1.5 text-[10px] uppercase backdrop-blur-sm"
            style={{ ...mono, ...nums, letterSpacing: '0.14em', background: 'rgba(11,11,12,.55)', color: 'rgba(255,255,255,.75)' }}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} — {current.label}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPrinting(true)}
              disabled={printing}
              className="rounded-full px-3.5 py-2 text-[10px] uppercase backdrop-blur-sm transition-opacity hover:opacity-75"
              style={{ ...mono, letterSpacing: '0.12em', background: 'rgba(11,11,12,.55)', color: 'rgba(255,255,255,.75)' }}
            >
              PDF{printing ? ' ···' : ''}
            </button>
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Oldingi slayd"
              className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-opacity hover:opacity-75 disabled:opacity-25"
              style={{ background: 'rgba(11,11,12,.55)', color: '#fff' }}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === total - 1}
              aria-label="Keyingi slayd"
              className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-opacity hover:opacity-75 disabled:opacity-25"
              style={{ background: 'rgba(11,11,12,.55)', color: '#fff' }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        presetService={presetService}
        source="credentials"
      />
    </div>
  );
}
