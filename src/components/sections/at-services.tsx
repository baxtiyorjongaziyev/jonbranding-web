'use client';
import type { FC } from 'react';

interface Props { onOpen: () => void; }

const SERVICES = [
  { num: '01', name: 'Neyming', desc: "Bozor tahlili, 40+ variant, tilshunos tekshiruvi, domen va social hisoblari band qilish.", time: '2–4 hafta' },
  { num: '02', name: 'Logotip & Aydentika', desc: "Logotip tizimi, rang palitrasi, tipografika, qo'llash qoidalari, real misollar.", time: '3–5 hafta' },
  { num: '03', name: 'Brendbuk', desc: "40+ betlik to'liq qo'llanma — rang, shrift, ovoz, misollar, qoidalar.", time: '2–3 hafta' },
  { num: '04', name: 'Qadoq dizayni', desc: 'Mokap, bosmaga tayyor fayl, retsept va texnik chizmalar. SKU tizimi.', time: '4–8 hafta' },
  { num: '05', name: 'Tovar belgisi', desc: "O'zbekiston, MDH va xalqaro miqyosda davlat himoyasi. To'liq jarayon.", time: '4–9 oy' },
  { num: '06', name: 'Raqamli brend', desc: 'Sayt, ijtimoiy tarmoq shablonlari, prezentatsiya, banner, motion.', time: '4–8 hafta' },
];

const AtServices: FC<Props> = ({ onOpen }) => (
  <section className="py-[120px] relative z-[2]" id="xizmat">
    <div className="max-w-[1320px] mx-auto px-5 md:px-8">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-16">
        <h2
          className="font-bold text-[var(--at-ink)]"
          style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.95, letterSpacing: '-0.035em' }}
        >
          Brend — boshidan
          <br />
          <span className="font-[family-name:var(--font-serif)] italic font-normal">oxirigacha.</span>
        </h2>
        <div>
          <span className="inline-flex items-center gap-2 mb-3.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-accent)] inline-block" />
            <span>§ 02</span>
            <span>Xizmatlar</span>
          </span>
          <p className="text-[var(--at-ink-2)] text-sm leading-[1.55]">
            Neyming, aydentika, qadoq, tovar belgisi va raqamli ko&apos;rinish —{' '}
            <strong className="text-[var(--at-ink)]">bir joyda, bir jamoa, bir narxda.</strong>{' '}
            Har biri alohida ham buyurtma qilinadi.
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--at-ink)]">
        {SERVICES.map((s) => (
          <div
            key={s.num}
            onClick={onOpen}
            className="group border-b border-[var(--at-line)] cursor-pointer hover:bg-[var(--at-paper)] transition-all duration-300"
          >
            <div
              className="grid items-center gap-6 py-8 px-2 group-hover:px-6 transition-all duration-300"
              style={{ gridTemplateColumns: '90px 1.4fr 2fr 0.8fr 80px' }}
            >
              <div
                className="font-[family-name:var(--font-serif)] italic font-normal text-[var(--at-muted)] leading-none group-hover:text-[var(--at-accent)] transition-colors"
                style={{ fontSize: 36 }}
              >
                {s.num}
              </div>
              <div
                className="font-semibold text-[var(--at-ink)]"
                style={{ fontSize: 'clamp(20px, 2.4vw, 30px)', letterSpacing: '-0.025em', lineHeight: 1.05 }}
              >
                {s.name}
              </div>
              <div className="text-sm text-[var(--at-ink-2)] leading-[1.55] hidden md:block">{s.desc}</div>
              <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--at-muted)] hidden md:block">
                {s.time}
              </div>
              <div className="justify-self-end w-11 h-11 rounded-full border border-[var(--at-line)] grid place-items-center text-sm group-hover:bg-[var(--at-accent)] group-hover:text-white group-hover:border-[var(--at-accent)] group-hover:-rotate-45 transition-all duration-300">
                ↗
              </div>
            </div>
            <div className="md:hidden px-2 pb-4 -mt-2 grid grid-cols-2 gap-x-4">
              <div className="text-xs text-[var(--at-ink-2)] leading-[1.55] col-span-2">{s.desc}</div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] text-[var(--at-muted)] mt-2">{s.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AtServices;
