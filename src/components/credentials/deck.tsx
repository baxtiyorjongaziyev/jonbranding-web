'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LeadModal from '@/components/sales/lead-modal';

export type DeckSlide = { id: string; label: string; render: () => React.ReactNode };

export const mono = { fontFamily: 'var(--font-mono), "JetBrains Mono", monospace' } as const;
export const serif = { fontFamily: 'var(--font-serif), "Instrument Serif", serif' } as const;
export const nums = { fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' } as const;

export const INK = '#0b0b0c';
export const PAPER = '#f4f2ee';

/** Slayd ichidagi bloklar ketma-ket chiqadi — taqdimotda urg'u shunday tushadi. */
export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
export const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <motion.p
      variants={rise}
      className="text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm"
      style={{ ...mono, color: light ? 'rgba(255,255,255,.65)' : 'rgba(11,11,12,.6)' }}
    >
      {children}
    </motion.p>
  );
}

export function Display({
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
export function Slide({
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

export function Deck({
  slides,
  modalOpen,
  setModalOpen,
  presetService,
  source = 'credentials',
}: {
  slides: DeckSlide[];
  source?: string;
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

        .cred-display-lg { font-size: clamp(2.1rem, 4.8vw + 0.4rem, 4.5rem); }
        .cred-display-xl { font-size: clamp(2.5rem, 6.2vw + 0.5rem, 6rem); }
        @media (max-height: 560px) {
          .cred-display-lg { font-size: clamp(1.5rem, 4vh + 0.5rem, 2.6rem); }
          .cred-display-xl { font-size: clamp(1.75rem, 5vh + 0.5rem, 3.2rem); }
        }

        /* Uzun ro'yxatli slaydlar kichik ekranda zichroq bo'ladi. */
        @media (max-width: 640px), (max-height: 560px) {
          .cred-row { padding-top: 0.7rem; padding-bottom: 0.7rem; }
        }

        /* Kichik ekranda shriftlarni mutanosib saqlash */
        @media (max-width: 480px) {
          .cred-slide [class*="text-[10px]"] { font-size: 12px; }
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
        <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-4">
          <span
            className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur-md sm:text-sm"
            style={{ ...mono, ...nums, background: 'rgba(11,11,12,.7)', color: 'rgba(255,255,255,.9)', border: '1px solid rgba(255,255,255,.1)' }}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} — {current.label}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setPrinting(true)}
              disabled={printing}
              className="rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-opacity hover:opacity-85"
              style={{ ...mono, background: 'rgba(11,11,12,.7)', color: 'rgba(255,255,255,.9)', border: '1px solid rgba(255,255,255,.1)' }}
            >
              PDF{printing ? ' ···' : ''}
            </button>
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Oldingi slayd"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full backdrop-blur-md transition-opacity hover:opacity-85 disabled:opacity-25 text-base sm:text-lg"
              style={{ background: 'rgba(11,11,12,.7)', color: '#fff', border: '1px solid rgba(255,255,255,.1)' }}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === total - 1}
              aria-label="Keyingi slayd"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full backdrop-blur-md transition-opacity hover:opacity-85 disabled:opacity-25 text-base sm:text-lg"
              style={{ background: 'rgba(11,11,12,.7)', color: '#fff', border: '1px solid rgba(255,255,255,.1)' }}
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
        source={source}
      />
    </div>
  );
}
