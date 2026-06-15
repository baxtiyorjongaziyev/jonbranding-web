'use client';
import { useState } from 'react';

const steps = [
  {
    n: '01',
    title: 'Brif va materiallar',
    dur: '1–2 kun',
    summary: 'Siz materiallarni yuboresiz — biz ishga tushamiz.',
    detail: 'Siz logotip fayllar, sayt manzili, ijtimoiy tarmoqlar va mavjud brend materiallarini yuborasiz. 1–2 kun ichida brif anketa yuboramiz — 20 daqiqa vaqt oladi. Hech qanday uchrashuv kerak emas.',
    example: 'Qumri Coffee brifi: 3 yillik logotip fayllar, 2 ta sayt versiyasi, Instagram profil + oqim screenshot.',
  },
  {
    n: '02',
    title: '12 mezon bo\'yicha tashxis',
    dur: '10–12 kun',
    summary: '3 ta mutaxassis har bir mezonni alohida tekshiradi.',
    detail: 'Dizayner, strateg va marketolog — har biri o\'z sohasida 4 ta mezonni tekshiradi. Ball tizimi: 0–100. Har bir mezon uchun aniq dalil va yo\'qotish hisobi. Taqqoslash: sizning natijangiz vs soha o\'rtacha.',
    example: 'Qumri Coffee natijasi: Logotip o\'qilishi 62/100, Rang konsistentligi 48/100, Raqamli adaptatsiya 31/100.',
  },
  {
    n: '03',
    title: 'Prezentatsiya va reja',
    dur: '1 kun',
    summary: 'Onlayn uchrashuv + PDF hisobot + 90 kunlik reja.',
    detail: '45–60 daqiqalik onlayn prezentatsiya (Zoom/Meet). Barcha topilmalar, reyting asoslari va tavsiyalar. 90 kunlik harakat rejasi: kim bajaradi, qancha turadi, qachon natija ko\'rinadi. Keyin 2 hafta ichida savol-javob uchun ochiqmiz.',
    example: 'Qumri Coffee: Prezentatsiyadan keyin 3 hafta ichida yangi logotip asosida qadoq qayta ishlanildi — sotuvda +18%.',
  },
];

export default function AtProcess() {
  const [open, setOpen] = useState<string | null>('01');

  return (
    <section className="py-16 md:py-24" id="jarayon" style={{ background: 'var(--at-paper)' }}>
      <div className="max-w-[1320px] mx-auto px-8 sm:px-5">
        {/* Header */}
        <div className="mb-12">
          <div
            className="inline-flex items-center gap-2 mb-4"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}
          >
            <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
            <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>§ 08</span>
            <span>Jarayon</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="font-bold leading-none"
              style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}
            >
              14 kunda{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>
                aniqlik.
              </span>
            </h2>
            <p style={{ color: 'var(--at-ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 300 }}>
              3 bosqich — barchasi masofadan. Hech qanday ofisga kelish kerak emas.
            </p>
          </div>
        </div>

        {/* Accordion steps */}
        <div className="flex flex-col" style={{ borderTop: '1px solid var(--at-line)' }}>
          {steps.map((s) => (
            <div key={s.n} style={{ borderBottom: '1px solid var(--at-line)' }}>
              <button
                className="w-full flex items-center gap-5 py-6 text-left"
                onClick={() => setOpen(open === s.n ? null : s.n)}
              >
                <span
                  className="shrink-0 font-bold"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: open === s.n ? 'var(--at-accent)' : 'var(--at-muted)', minWidth: 28 }}
                >
                  {s.n}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-base" style={{ color: 'var(--at-ink)' }}>{s.title}</h3>
                  <div style={{ fontSize: 13, color: 'var(--at-muted)', marginTop: 2 }}>{s.summary}</div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className="hidden sm:block text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--at-bg)', color: 'var(--at-ink-2)', fontFamily: 'var(--font-mono)' }}
                  >
                    {s.dur}
                  </span>
                  <span
                    className="text-xl leading-none transition-transform duration-200"
                    style={{ color: 'var(--at-muted)', transform: open === s.n ? 'rotate(45deg)' : 'none' }}
                  >
                    +
                  </span>
                </div>
              </button>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === s.n ? '400px' : '0', opacity: open === s.n ? 1 : 0 }}
              >
                <div className="pl-[52px] pb-6 grid md:grid-cols-2 gap-5">
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--at-ink-2)' }}>{s.detail}</p>
                  <div
                    className="rounded-xl p-4"
                    style={{ background: 'var(--at-accent-soft)', border: '1px solid rgba(27,77,255,0.12)' }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--at-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                      Haqiqiy misol
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--at-ink)' }}>{s.example}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
