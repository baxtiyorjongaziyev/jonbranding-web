import { FC } from 'react';
import Image from 'next/image';
import { Check, X } from 'lucide-react';
import { h2Style, mono, PRICE } from '../data';
import { Eyebrow, Section, Tag } from './ui';

export const ComparisonSection: FC = () => {
  return (
    <>
      {/* 7. MIJOZ 48 000 000 SO‘MGA NIMA OLADI? */}
      <Section labelledBy="bs-deliverables-doc-heading" className="bg-black text-white">
        <Eyebrow light>{PRICE}ga nima olasiz?</Eyebrow>
        <h2 id="bs-deliverables-doc-heading" className="font-bold tracking-tight text-white" style={h2Style}>
          Strategiya faqat uchrashuv bilan tugamaydi
        </h2>
        <p className="mt-4 max-w-2xl text-neutral-300" style={{ fontSize: 17, lineHeight: 1.6 }}>
          Natijada qo‘lingizda keyingi yillarda butun jamoangiz va pudratchilaringiz uchun bosh qo‘llanma bo‘ladigan 3 ta asosiy strategik hujjat topshiriladi.
        </p>

        {/* Deliverables Mockup Showcase */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-3 sm:p-4 backdrop-blur">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-900 sm:aspect-[21/9]">
            <Image
              src="/images/brand-strategy/deliverables.jpg"
              alt="Brand Strategy Deliverables Set — Executive Hardcover Book, Strategy Map & Platform Guide"
              fill
              sizes="(max-width: 1200px) 100vw, 1000px"
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 text-xs text-neutral-400">
            <span className="font-semibold text-white">Qo‘lingizga topshiriladigan jismoniy va raqamli boshqaruv to‘plami</span>
            <span className="font-mono text-[11px] text-blue-300">Executive Deliverables · 2026</span>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400" style={mono}>
              01 · Asosiy hujjat
            </span>
            <h3 className="mt-3 text-xl font-bold text-white">Brand Strategy Deck</h3>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              Professional strategik taqdimot hujjati. Taxminan 30–40+ sahifada biznes, bozor, auditoriya, raqobatchilar, positioning, value proposition, differentiation, brand essence, personality va messaging to‘liq ochib beriladi.
            </p>
            <div className="mt-6 border-t border-white/10 pt-4 text-xs text-neutral-400">
              * Sahifalar soni qat’iy kafolat emas — tarkib loyiha ko‘lamiga qarab belgilanadi.
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-blue-500/40 bg-blue-950/30 p-7 backdrop-blur">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-300" style={mono}>
              02 · Bitta sahifada
            </span>
            <h3 className="mt-3 text-xl font-bold text-white">Brand Strategy Map</h3>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              Butun strategik yo‘nalish bitta ko‘rgazmali xaritada:
            </p>
            <div className="mt-4 space-y-1 rounded-xl bg-black/40 p-3 text-[11px] font-mono text-neutral-300">
              <p>AUDIENCE ↓ PROBLEM</p>
              <p>↓ POSITIONING</p>
              <p>↓ VALUE PROPOSITION</p>
              <p>↓ DIFFERENTIATION</p>
              <p>↓ REASON TO BELIEVE</p>
              <p>↓ BRAND ESSENCE & PERSONALITY</p>
            </div>
            <p className="mt-4 text-xs font-semibold text-blue-200">
              Rahbar 2 daqiqada butun strategik yo‘nalishni ko‘ra oladi.
            </p>
          </div>

          <div className="flex flex-col rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400" style={mono}>
              03 · Amaliy ko‘prik
            </span>
            <h3 className="mt-3 text-xl font-bold text-white">Creative Brief</h3>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              Strategiyani amaliy ishga ulaydigan hujjat. Keyingi Naming, Logo, Visual Identity, Packaging, Website va Marketing ishlari uchun aniq strategik yo‘nalish va vazifalar belgilab beriladi.
            </p>
            <div className="mt-auto border-t border-white/10 pt-5">
              <p className="text-xs font-semibold text-white">
                Strategiya PDF ichida qolib ketmasligi kerak. U keyingi qarorlarga ishlashi kerak.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. OLDIN / KEYIN (Comparison) */}
      <Section labelledBy="bs-comparison-heading">
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow>O‘zgarish</Eyebrow>
          <h2 id="bs-comparison-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Brand Strategy’dan oldin va keyin
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* OLDIN */}
          <div className="rounded-3xl border border-red-200 bg-red-50/30 p-7 sm:p-9">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-red-950">Brand Strategy’dan oldin</h3>
              <Tag tone="neutral">Noaniqlik</Tag>
            </div>
            <ul className="space-y-3 text-sm text-neutral-700">
              {[
                '«Hamma bizning mijozimiz» degan noaniq tushuncha',
                '«Sifatimiz yaxshi» degan umumiy gaplar',
                'Raqobatchilardan farq tushunarsiz',
                'Marketing har safar boshqacha gapiradi',
                'Sotuvchi har bir mijozga boshqacha tushuntiradi',
                'Dizayn subyektiv («menga yoqdi / yoqmadi») tanlanadi',
                'Rahbar mayda operatsion qarorlarga doim aralashishga majbur',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* KEYIN */}
          <div className="rounded-3xl border-2 border-neutral-900 bg-white p-7 sm:p-9 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-950">Brand Strategy’dan keyin</h3>
              <Tag tone="blue">Strategik aniqlik</Tag>
            </div>
            <ul className="space-y-3 text-sm text-neutral-800">
              {[
                'Asosiy daromad keltiruvchi auditoriya aniq',
                'Hal qilinayotgan asosiy muammo aniq',
                'Bozordagi positioning aniq belgilangan',
                'Farqlanish real asoslar bilan mustahkamlangan',
                'Mijozga beriladigan asosiy va’da aniq',
                'Marketing va sotuv messaging’i bitta yo‘nalishda',
                'Dizayn va kreativ jamoa uchun aniq Creative Brief bor',
                'Barcha keyingi brend qarorlari uchun filtr mavjud',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 9. BRAND STRATEGY NIMA EMAS? */}
      <Section labelledBy="bs-not-heading" className="bg-neutral-50 border-y border-neutral-200/80">
        <div className="max-w-2xl">
          <Eyebrow>Tushunmovchiliklarni yo‘qotish</Eyebrow>
          <h2 id="bs-not-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Brand Strategy nima emas?
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Ko‘p kompaniyalar brend strategiyasini boshqa sohalar bilan adashtiradi. Chegaralarni aniq belgilaymiz:
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-7">
            <h3 className="text-base font-bold text-neutral-900">Brand Strategy ≠ Marketing Strategy</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p className="rounded-xl bg-blue-50/70 p-3 font-semibold text-blue-950">
                Brand Strategy: Kim bo‘lamiz va nima deymiz?
              </p>
              <p className="rounded-xl bg-neutral-100 p-3 text-neutral-600">
                Marketing Strategy: Qayerda, qachon va qanday sotamiz?
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-7">
            <h3 className="text-base font-bold text-neutral-900">Brand Strategy ≠ Business Strategy</h3>
            <div className="mt-4 text-sm leading-relaxed text-neutral-600">
              Brand Strategy kompaniyaning barcha biznes qarorlarini (moliya, logistika, yuridik) almashtirmaydi. U biznesning bozor va mijoz bilan bog‘lanadigan brend qismini boshqaradi.
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-7">
            <h3 className="text-base font-bold text-neutral-900">Brand Strategy ≠ Visual Identity</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p className="rounded-xl bg-blue-50/70 p-3 font-semibold text-blue-950">
                Brand Strategy: Bozorda kim bo‘lamiz?
              </p>
              <p className="rounded-xl bg-neutral-100 p-3 text-neutral-600">
                Visual Identity: Qanday ko‘rinamiz?
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-7">
            <h3 className="text-base font-bold text-neutral-900">Brand Strategy ≠ Brandbook</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p className="rounded-xl bg-blue-50/70 p-3 font-semibold text-blue-950">
                Brand Strategy: Yo‘nalishni belgilaydi (Direction)
              </p>
              <p className="rounded-xl bg-neutral-100 p-3 text-neutral-600">
                Brandbook: Tayyor vizual tizimni ishlatish qoidalarini belgilaydi (Rules)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-neutral-900 p-6 text-center text-white">
          <p className="font-mono text-sm tracking-wider uppercase text-neutral-300">
            Strategy → Direction &nbsp;|&nbsp; Identity → Expression &nbsp;|&nbsp; Brandbook → Rules
          </p>
        </div>
      </Section>

      {/* 10. JON BRANDING TIZIMIDA QAYERDA? */}
      <Section labelledBy="bs-system-heading">
        <Eyebrow>Tizimli yondashuv</Eyebrow>
        <h2 id="bs-system-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
          Jon Branding tizimida Brand Strategy qayerda?
        </h2>
        <p className="mt-4 max-w-2xl text-neutral-600" style={{ fontSize: 16, lineHeight: 1.6 }}>
          Strategiya keyingi xizmatlarni almashtirmaydi. Ularga aniq va o‘zgarmas yo‘nalish beradi.
        </p>

        {/* Visual flow 7 xizmat */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-semibold uppercase text-neutral-500" style={mono}>
            Tabiiy strategik ketma-ketlik:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: 'Brand Strategy', main: true },
              { name: 'Naming' },
              { name: 'Logo' },
              { name: 'Visual Identity' },
              { name: 'Brandbook' },
              { name: 'Packaging' },
              { name: 'Patent' },
            ].map((srv, idx) => (
              <div key={srv.name} className="flex items-center gap-2">
                <span
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    srv.main
                      ? 'border-2 border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                      : 'border border-neutral-200 bg-white text-neutral-800'
                  }`}
                >
                  {srv.name}
                </span>
                {idx < 6 && <span className="text-neutral-400">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-xs font-semibold uppercase text-neutral-400" style={mono}>
            Mavjud brendlar uchun yo‘l:
          </p>
          <p className="mt-2 text-base font-semibold text-neutral-900">
            Brand Audit → Brand Strategy → Rebranding / Identity
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            Agar brendingiz allaqachon mavjud bo‘lsa, avval audit orqali hozirgi holatni ko‘ramiz, keyin positioning’ni qayta ko‘rib chiqamiz.
          </p>
        </div>
      </Section>
    </>
  );
};
