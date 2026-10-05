import { FC } from 'react';
import Image from 'next/image';
import { DELIVERABLES, h2Style, mono } from '../data';
import { Eyebrow, Section, Tag } from './ui';

export const DeliverablesSection: FC = () => {
  return (
    <>
      {/* 5. XIZMAT TARKIBI (12 ta blok grid) */}
      <Section id="tarkib" labelledBy="bs-deliverables-heading" className="bg-neutral-50 border-t border-neutral-200/80">
        <div className="max-w-3xl">
          <Eyebrow>12 ta strategik modul</Eyebrow>
          <h2 id="bs-deliverables-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Xizmat tarkibi
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.6 }}>
            Brand Strategy 12 ta chuqur tahliliy va amaliy blokdan iborat. Har biri biznesning aniq bir savoliga javob beradi.
          </p>
        </div>

        {/* Strategy Documentation Visual */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-3 sm:p-4 shadow-sm">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100 sm:aspect-[21/9]">
            <Image
              src="/images/brand-strategy/deck.jpg"
              alt="Brand Strategy Deck Framework — Positioning, Value Proposition & Target Audience"
              fill
              sizes="(max-width: 1200px) 100vw, 1000px"
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-800">Strategik hujjat tarkibi: Bozor xaritasi, Value Proposition va auditoriya segmentatsiyasi</span>
            <span className="font-mono text-[11px] text-neutral-400">Jon Branding · Strategic Framework</span>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DELIVERABLES.map((d) => (
            <article
              key={d.num}
              className="flex flex-col rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[12px] font-bold text-blue-700" style={mono}>
                  {d.num}
                </span>
                <Tag tone="neutral">Modul</Tag>
              </div>

              <h3 className="text-lg font-bold tracking-tight text-neutral-900">{d.title}</h3>
              <p className="mt-1 text-xs font-medium text-neutral-500">{d.subtitle}</p>

              <ul className="mt-5 space-y-2 border-t border-neutral-100 pt-4 text-xs leading-relaxed text-neutral-700">
                {d.details.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-600">▪</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {d.formula && (
                <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs leading-relaxed font-mono text-neutral-800">
                  {d.formula}
                </div>
              )}

              {d.contrast && (
                <div className="mt-4 space-y-2 rounded-xl bg-neutral-50 p-3 text-xs">
                  <div className="border-b border-neutral-200/60 pb-1.5 text-neutral-500 line-through">
                    {d.contrast.left}
                  </div>
                  <div className="font-semibold text-blue-900">
                    {d.contrast.right}
                  </div>
                </div>
              )}

              {d.layers && (
                <div className="mt-4 space-y-1.5 rounded-xl bg-neutral-50 p-3 text-xs">
                  {d.layers.map((l) => (
                    <div key={l.label}>
                      <span className="font-semibold text-neutral-900">{l.label}: </span>
                      <span className="text-neutral-600">{l.question}</span>
                    </div>
                  ))}
                </div>
              )}

              {d.result && (
                <div className="mt-auto pt-5">
                  <p className="rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-[11px] font-semibold leading-snug text-blue-950">
                    Natija: {d.result}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </Section>

      {/* 6. BRAND ARCHITECTURE (Optional modul) */}
      <Section labelledBy="bs-architecture-heading">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-8 sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Eyebrow>Qo‘shimcha modul</Eyebrow>
              <h2 id="bs-architecture-heading" className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                Brand Architecture (Brend arxitekturasi)
              </h2>
            </div>
            <Tag tone="neutral">Optional / Ehtiyojga ko‘ra</Tag>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            Agar kompaniyada bir nechta brend, sub-brand, mahsulot liniyalari yoki yangi xizmat yo‘nalishlari bo‘lsa, ularning o‘zaro tizimi va bog‘liqligi ishlab chiqiladi.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Master Brand', desc: 'Asosiy kompaniya brendi va markaziy obro‘' },
              { title: 'Sub-brand', desc: 'Alohida auditoriya yoki toifaga yo‘naltirilgan brendlar' },
              { title: 'Product / Service Lines', desc: 'Har bir mahsulot va xizmat oilasining ierarxiyasi' },
            ].map((arch, i) => (
              <div key={arch.title} className="rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-sm">
                <span className="text-xs font-mono text-neutral-400">0{i + 1}</span>
                <p className="mt-2 font-bold text-neutral-900">{arch.title}</p>
                <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{arch.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-neutral-500">
            * Bu modul har bir loyiha uchun majburiy emas. Agar bitta brend bitta mahsulot bilan ishlayotgan bo‘lsa, ortiqcha murakkablashtirilmaydi.
          </p>
        </div>
      </Section>
    </>
  );
};
