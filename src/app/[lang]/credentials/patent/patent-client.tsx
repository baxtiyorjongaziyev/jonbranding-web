'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CertificateCard from '@/components/credentials/certificate-card';
import { Deck, type DeckSlide, Display, Eyebrow, INK, mono, nums, rise, serif, Slide } from '@/components/credentials/deck';
import { certificateDays, formatCertDate, PATENT_CERTIFICATES } from '@/lib/patent-certificates';

const SERVICE = 'Patent';
const withLogo = PATENT_CERTIFICATES.filter((cert) => cert.logo);
const fastest = [...PATENT_CERTIFICATES].sort((a, b) => certificateDays(a) - certificateDays(b))[0];
const byDuration = [...PATENT_CERTIFICATES].sort((a, b) => certificateDays(a) - certificateDays(b));

function Point({ title, children, light }: { title: string; children: React.ReactNode; light?: boolean }) {
  return (
    <li className="border-l pl-5" style={{ borderColor: light ? 'rgba(255,255,255,.18)' : 'rgba(11,11,12,.18)' }}>
      <p className="text-base font-medium sm:text-lg" style={{ color: light ? '#fff' : INK }}>
        {title}
      </p>
      <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: light ? 'rgba(255,255,255,.6)' : 'rgba(11,11,12,.62)' }}>
        {children}
      </p>
    </li>
  );
}

export default function PatentClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  /** Kattalashtirilgan ma'lumotnoma (indeks `withLogo` ichida). */
  const [zoomed, setZoomed] = useState<number | null>(null);
  const [swipeX, setSwipeX] = useState<number | null>(null);

  // Ochiq ma'lumotnomada strelkalar slaydni emas, guvohnomalarni almashtiradi.
  // Capture bosqichi — Deck'ning klaviatura tinglovchisidan oldin ushlaymiz.
  useEffect(() => {
    if (zoomed === null) return;
    const onKey = (event: KeyboardEvent) => {
      const step = ['ArrowRight', 'ArrowDown', ' '].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
      if (event.key === 'Escape') setZoomed(null);
      else if (step) setZoomed((i) => (i === null ? i : (i + step + withLogo.length) % withLogo.length));
      else return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [zoomed]);

  const slides: DeckSlide[] = [
    {
      id: 'muqova',
      label: 'Muqova',
      render: () => (
        <Slide bg={INK}>
          <Eyebrow light>Jon Branding — Patentlash agentligi</Eyebrow>
          <Display light size="xl">
            Nomingiz qog‘ozda sizniki bo‘lmasa —
            <br />u sizniki emas.
          </Display>
          <motion.p variants={rise} className="mt-8 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: 'rgba(255,255,255,.6)' }}>
            Tovar belgisini ro‘yxatdan o‘tkazamiz: tekshiruvdan guvohnomagacha. Idorama-idora yurmaysiz.
          </motion.p>
          <motion.div variants={rise} className="mt-14 flex flex-wrap gap-x-14 gap-y-7">
            {[
              [String(PATENT_CERTIFICATES.length), 'guvohnoma olib berdik'],
              [`${certificateDays(fastest)} kun`, 'eng tez natija'],
              ['10 yil', 'himoya muddati'],
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
    },
    {
      id: 'xavf',
      label: 'Xavf',
      render: () => (
        <Slide>
          <Eyebrow>Ro‘yxatdan o‘tmagan brend bilan nima bo‘ladi</Eyebrow>
          <Display>Yillab qurgan brendni bir kunda yo‘qotish mumkin</Display>
          <motion.ul variants={rise} className="mt-12 grid gap-7 sm:grid-cols-2">
            <Point title="Birov sizdan oldin topshiradi">Qonun bo‘yicha nom birinchi talabnoma bergan odamniki. Siz uni 5 yil ishlatgan bo‘lsangiz ham.</Point>
            <Point title="Hammasini qaytadan qilasiz">Peshlavha, qadoq, reklama, sahifalar — nom o‘zgarsa, barchasi yangidan.</Point>
            <Point title="Raqobatchini to‘xtata olmaysiz">O‘xshash nom bilan chiqishsa, guvohnomasiz huquqiy dalilingiz yo‘q.</Point>
            <Point title="Brend aktiv bo‘lmaydi">Franshiza, investor, marketplace’da brend do‘kon — hammasi guvohnoma so‘raydi.</Point>
          </motion.ul>
        </Slide>
      ),
    },
    {
      id: 'foyda',
      label: 'Nima beradi',
      render: () => (
        <Slide bg={INK}>
          <Eyebrow light>Guvohnoma sizga nima beradi</Eyebrow>
          <Display light>Nom rasman sizniki</Display>
          <motion.ul variants={rise} className="mt-12 grid gap-7 sm:grid-cols-2">
            <Point light title="10 yil himoya">Talabnoma topshirilgan kundan boshlanadi. Keyin yana 10 yilga uzaytiriladi.</Point>
            <Point light title="Butun O‘zbekiston bo‘yicha">Ro‘yxatdagi mahsulot va xizmatlaringiz uchun nom faqat sizniki.</Point>
            <Point light title="Taqiqlash huquqi">O‘xshash nomdan foydalanganlarni rasman to‘xtatish mumkin.</Point>
            <Point light title="Sotish va ijaraga berish">Brendni sotish, franshiza yoki litsenziya berish mumkin bo‘ladi.</Point>
          </motion.ul>
        </Slide>
      ),
    },
    {
      id: 'jarayon',
      label: 'Jarayon',
      render: () => (
        <Slide>
          <Eyebrow>Qanday o‘tadi</Eyebrow>
          <Display>5 qadam — barchasini biz yuritamiz</Display>
          <motion.ol variants={rise} className="mt-12 grid gap-0">
            {[
              ['Tekshiruv', 'Nom bo‘shmi, o‘xshashi yo‘qmi. Qaysi sinflar kerakligini aniqlaymiz.', '1 ish kuni'],
              ['Talabnoma', 'Hujjatlarni tayyorlab Adliya vazirligiga topshiramiz. Himoya shu kundan boshlanadi.', '1–2 kun'],
              ['Rasmiy tekshiruv', 'Hujjatlar to‘g‘ri to‘ldirilganmi — vazirlik tekshiradi.', '~30 kun'],
              ['Ekspertiza', 'Intellektual mulk markazi nom himoyaga loyiqmi, boshqalarga o‘xshamaydimi — ko‘radi.', '~6–7 oy'],
              ['Guvohnoma', 'Davlat reestriga kiritiladi, QR-kodli guvohnoma beriladi.', 'yakun'],
            ].map(([title, desc, time], i) => (
              <li key={title} className="cred-row grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 border-t py-4" style={{ borderColor: 'rgba(11,11,12,.12)' }}>
                <span className="text-[11px]" style={{ ...mono, color: 'rgba(11,11,12,.4)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-base font-medium sm:text-lg" style={{ color: INK }}>{title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed sm:text-[15px]" style={{ color: 'rgba(11,11,12,.6)' }}>{desc}</p>
                </div>
                <span className="text-[11px] uppercase" style={{ ...mono, color: 'rgba(11,11,12,.5)' }}>{time}</span>
              </li>
            ))}
          </motion.ol>
        </Slide>
      ),
    },
    {
      id: 'tarif',
      label: 'Oddiy yoki tezkor',
      render: () => (
        <Slide bg={INK}>
          <Eyebrow light>Ikki yo‘l</Eyebrow>
          <Display light>Oddiy yoki tezkor</Display>
          <motion.div variants={rise} className="mt-12 grid gap-5 sm:grid-cols-2">
            {[
              ['Oddiy', '~7 oy', '5 000 000 so‘m', 'Shoshilinch bo‘lmasa. Himoya baribir topshirilgan kundan boshlanadi.'],
              ['Tezkor', '20–40 kun', '7 000 000 so‘m', `Investor, marketplace yoki franshiza kutayotgan bo‘lsa. Rekordimiz — ${certificateDays(fastest)} kun.`],
            ].map(([name, time, price, note]) => (
              <div key={name} className="rounded-2xl border p-7" style={{ borderColor: 'rgba(255,255,255,.16)' }}>
                <p className="text-[11px] uppercase" style={{ ...mono, letterSpacing: '0.16em', color: 'rgba(255,255,255,.5)' }}>{name}</p>
                <p className="mt-4 text-5xl" style={{ ...serif, ...nums, color: '#fff' }}>{time}</p>
                <p className="mt-3 text-lg font-medium" style={{ ...nums, color: '#fff' }}>{price}</p>
                <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,.6)' }}>{note}</p>
              </div>
            ))}
          </motion.div>
          <motion.p variants={rise} className="mt-8 text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,.5)' }}>
            Narxga davlat bojlari kirmaydi — ular alohida to‘lanadi. Tekshiruv: 880 000 so‘m (1 sinf), har qo‘shimcha sinf +440 000 so‘m.
          </motion.p>
        </Slide>
      ),
    },
    {
      id: 'sinf',
      label: 'Sinflar',
      render: () => (
        <Slide>
          <Eyebrow>Muhim tushuncha</Eyebrow>
          <Display>Patent mahsulot turi bo‘yicha beriladi</Display>
          <motion.p variants={rise} className="mt-8 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'rgba(11,11,12,.65)' }}>
            Barcha tovar va xizmatlar 45 ta sinfga bo‘lingan. Nom faqat siz tanlagan sinflarda himoyalanadi.
            Masalan, qahva sotib, kafe ham ochsangiz — 2 ta sinf kerak bo‘ladi.
          </motion.p>
          <motion.ul variants={rise} className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ['Velzo', 'avto servis', '4, 7, 35, 37'],
              ['Nurion', 'kosmetika', '3, 5, 35'],
              ['FIDDA by Sevara', 'zargarlik', '14, 35'],
            ].map(([brand, what, classes]) => (
              <li key={brand} className="rounded-xl border p-5" style={{ borderColor: 'rgba(11,11,12,.12)' }}>
                <p className="font-medium" style={{ color: INK }}>{brand}</p>
                <p className="text-[13px]" style={{ color: 'rgba(11,11,12,.55)' }}>{what}</p>
                <p className="mt-3 text-[12px] uppercase" style={{ ...mono, color: 'rgba(11,11,12,.7)' }}>sinflar: {classes}</p>
              </li>
            ))}
          </motion.ul>
          <motion.p variants={rise} className="mt-6 text-[14px]" style={{ color: 'rgba(11,11,12,.55)' }}>
            Qaysi sinflar kerakligini tekshiruvda biz aniqlab beramiz.
          </motion.p>
        </Slide>
      ),
    },
    {
      id: 'rad',
      label: 'Rad etish',
      render: () => (
        <Slide bg={INK}>
          <Eyebrow light>Nega rad etishlari mumkin</Eyebrow>
          <Display light>Shuning uchun avval tekshiramiz</Display>
          <motion.ul variants={rise} className="mt-12 grid gap-7 sm:grid-cols-2">
            <Point light title="O‘xshash nom bor">Ro‘yxatdagi belgiga o‘xshasa — hatto bir harf farq qilsa ham.</Point>
            <Point light title="Nom shunchaki tasvirlaydi">“Mazali non”, “Toza suv” kabi nomlar himoyalanmaydi.</Point>
            <Point light title="Xaridorni chalg‘itadi">Tarkib yoki kelib chiqish haqida noto‘g‘ri tasavvur bersa.</Point>
            <Point light title="Rad etilsa ham yo‘l bor">3 oy ichida Apellatsiya kengashiga, keyin 6 oy ichida sudga murojaat. Yoki nomni moslab qayta topshiramiz.</Point>
          </motion.ul>
        </Slide>
      ),
    },
    {
      id: 'natijalar',
      label: 'Natijalar',
      render: () => (
        <Slide>
          <Eyebrow>2025–2026 · haqiqiy guvohnomalar</Eyebrow>
          <Display>{PATENT_CERTIFICATES.length} ta brend — rasman himoyada</Display>
          <motion.ul variants={rise} className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {byDuration.map((cert) => (
              <li key={cert.number} className="cred-row grid grid-cols-[1fr_auto] items-baseline gap-4 border-t py-3" style={{ borderColor: 'rgba(11,11,12,.12)' }}>
                <div>
                  <p className="font-medium" style={{ color: INK }}>{cert.brand === '—' ? cert.industry : cert.brand}</p>
                  <p className="text-[12px]" style={{ ...mono, color: 'rgba(11,11,12,.5)' }}>
                    {cert.number} · {formatCertDate(cert.filed)} → {formatCertDate(cert.registered)}
                  </p>
                </div>
                <span className="text-lg" style={{ ...serif, ...nums, color: INK }}>
                  {certificateDays(cert) < 90 ? `${certificateDays(cert)} kun` : `${(certificateDays(cert) / 30.4).toFixed(1)} oy`}
                </span>
              </li>
            ))}
          </motion.ul>
        </Slide>
      ),
    },
    {
      id: 'guvohnomalar',
      label: 'Guvohnomalar',
      render: () => (
        <Slide>
          <Eyebrow>Ma’lumotnomalar</Eyebrow>
          <Display>Mijozlarimiz brendlari</Display>
          <motion.div variants={rise} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {withLogo.map((cert, i) => (
              <button
                key={cert.number}
                type="button"
                onClick={() => setZoomed(i)}
                aria-label={`${cert.brand} ma’lumotnomasini kattalashtirish`}
                className="block cursor-zoom-in text-left transition-transform duration-300 hover:-translate-y-1"
              >
                <CertificateCard cert={cert} />
              </button>
            ))}
          </motion.div>
        </Slide>
      ),
    },
    {
      id: 'keyingi-qadam',
      label: 'Keyingi qadam',
      render: () => (
        <Slide bg={INK}>
          <Eyebrow light>Keyingi qadam</Eyebrow>
          <Display light size="xl">
            Nomingizni bugun
            <br />
            tekshiramiz
          </Display>
          <motion.p variants={rise} className="mt-8 max-w-lg text-base leading-relaxed" style={{ color: 'rgba(255,255,255,.6)' }}>
            1 ish kunida javob: nom bo‘shmi, qaysi sinflar kerak, qancha vaqt va pul ketadi.
          </motion.p>
          <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openModal}
              className="cred-no-print rounded-full bg-white px-7 py-3.5 text-sm font-medium transition-opacity hover:opacity-85"
              style={{ color: INK }}
            >
              Ariza qoldirish
            </button>
            <a
              data-oisha-phone=""
              href="tel:+998792000097"
              className="rounded-full border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-white hover:text-black"
              style={{ borderColor: 'rgba(255,255,255,.28)', color: '#fff' }}
            >
              +998 79 200 00 97
            </a>
            <a
              href="https://t.me/baxtiyorjongaziyev"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-white hover:text-black"
              style={{ borderColor: 'rgba(255,255,255,.28)', color: '#fff' }}
            >
              Telegram
            </a>
          </motion.div>
        </Slide>
      ),
    },
  ];

  return (
    <>
      <Deck slides={slides} modalOpen={modalOpen} setModalOpen={setModalOpen} presetService={SERVICE} source="credentials-patent" />
      {zoomed !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${withLogo[zoomed].brand} ma’lumotnomasi`}
          onClick={() => setZoomed(null)}
          className="cred-no-print fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center p-4"
          style={{ background: 'rgba(11,11,12,.82)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="w-full"
            style={{ maxWidth: 'min(92vw, calc((100svh - 5.5rem) / 1.414))', marginBottom: '3.5rem' }}
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => setSwipeX(event.touches[0].clientX)}
            onTouchEnd={(event) => {
              if (swipeX === null) return;
              const dx = event.changedTouches[0].clientX - swipeX;
              setSwipeX(null);
              if (Math.abs(dx) < 50) return;
              setZoomed((z) => (z === null ? z : (z + (dx < 0 ? 1 : -1) + withLogo.length) % withLogo.length));
            }}
          >
            <CertificateCard cert={withLogo[zoomed]} />
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3" onClick={(event) => event.stopPropagation()}>
            {[
              ['←', -1, 'Oldingi guvohnoma'],
              ['→', 1, 'Keyingi guvohnoma'],
            ].map(([arrow, step, label], i) => (
              <button
                key={label}
                type="button"
                aria-label={label as string}
                onClick={() => setZoomed((z) => (z === null ? z : (z + (step as number) + withLogo.length) % withLogo.length))}
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: 'rgba(255,255,255,.14)', color: '#fff', order: i * 2 }}
              >
                {arrow}
              </button>
            ))}
            <span className="text-[11px] uppercase" style={{ ...mono, ...nums, letterSpacing: '0.14em', color: 'rgba(255,255,255,.6)', order: 1 }}>
              {zoomed + 1} / {withLogo.length}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
