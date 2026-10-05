import { FC } from 'react';
import Image from 'next/image';
import { h2Style, mono, PRICE, PROCESS_STEPS } from '../data';
import { Eyebrow, Section } from './ui';

export const ProcessAndAudienceSection: FC = () => {
  return (
    <>
      {/* 11. JARAYON (7 bosqich) */}
      <Section labelledBy="bs-process-heading" className="bg-neutral-50 border-t border-neutral-200/80">
        <div className="max-w-2xl">
          <Eyebrow>Qadamlar</Eyebrow>
          <h2 id="bs-process-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Ish jarayoni
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Strategiya taxminlarga emas, aniq ketma-ketlik va tadqiqotga asoslanadi.
          </p>
        </div>

        {/* Workshop Collaboration Visual */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-3 sm:p-4 shadow-sm">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100 sm:aspect-[21/9]">
            <Image
              src="/images/brand-strategy/workshop.jpg"
              alt="Jon Branding B2B Brand Strategy Workshop with Business Leadership"
              fill
              sizes="(max-width: 1200px) 100vw, 1000px"
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-800">Strategik sessiya: Positioning, JTBD va Messaging ustunlari ustida jonli tahlil</span>
            <span className="font-mono text-[11px] text-neutral-400">Jon Branding · Strategic Workshop</span>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.num}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-base font-bold text-blue-700">{step.num}</span>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 12. KIMLAR UCHUN? */}
      <Section labelledBy="bs-who-heading">
        <div className="max-w-2xl">
          <Eyebrow>Auditoriya</Eyebrow>
          <h2 id="bs-who-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Bu xizmat kimlar uchun?
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Brand Strategy bozorga jiddiy qaraydigan va o‘sishni rejalashtirayotgan kompaniyalar uchun mo‘ljallangan:
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Yangi brend',
              desc: 'Bozorga chiqishdan oldin yo‘nalish va joylashuvni xatosiz aniqlash uchun.',
            },
            {
              title: 'Rebranding',
              desc: 'Faqat tashqi ko‘rinishni emas, kompaniyaning positioning’ini ham qayta ko‘rib chiqish uchun.',
            },
            {
              title: 'O‘sayotgan biznes',
              desc: 'Marketing, sotuv va rahbariyatni bitta umumiy tushuncha va yo‘nalishga keltirish uchun.',
            },
            {
              title: 'Yangi bozor',
              desc: 'Yangi iste’molchi segmenti, yangi hudud yoki eksportga chiqishdan oldin.',
            },
            {
              title: 'Bir nechta yo‘nalish',
              desc: 'Mahsulotlar, xizmatlar yoki sub-brandlar o‘rtasidagi tizimli munosabatni qurish uchun.',
            },
            {
              title: 'Premium segment',
              desc: 'Yuqoriroq narx va qiymatni bozorda asoslash va arzon raqobatdan chiqish uchun.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 13. KIMGA HOZIR KERAK EMAS? (Ishonch bo'limi) */}
      <Section labelledBy="bs-not-for-heading" className="bg-neutral-50 border-y border-neutral-200/80">
        <div className="max-w-2xl">
          <Eyebrow>Ochiq munosabat</Eyebrow>
          <h2 id="bs-not-for-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Kimga hozir Brand Strategy kerak emas?
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Brand Strategy har bir biznesga shu zahoti kerak emas. Biz hamma loyihani ham bu xizmatga olmaymiz:
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            'Faqat tezkor logo kerak bo‘lgan mikro loyiha',
            'Hali mahsuloti yoki biznes modeli aniqlanmagan boshlang‘ich g‘oya',
            'Strategik qaror qabul qiladigan rahbar jarayonda qatnashmaydigan loyiha',
            'Faqat qisqa muddatli reklama kampaniyasi kerak bo‘lgan biznes',
          ].map((text) => (
            <div key={text} className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-700">
              <span className="text-neutral-400">✕</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-neutral-900 p-6 text-white text-center">
          <p className="text-base font-semibold sm:text-lg">
            Brand Strategy — qaror qabul qilishga tayyor biznes uchun.
          </p>
        </div>
      </Section>

      {/* 14. 48 MILLION NIMAGA? (Objection handling) */}
      <Section labelledBy="bs-price-reason-heading">
        <div className="max-w-3xl">
          <Eyebrow>Biznes qiymati</Eyebrow>
          <h2 id="bs-price-reason-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            {PRICE} nimaga to‘lanadi?
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.6 }}>
            Bu xizmatga qanday qarash kerak?
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
            <span className="text-xs font-semibold uppercase text-red-600" style={mono}>
              Noto‘g‘ri framing
            </span>
            <p className="mt-3 text-lg font-bold text-neutral-900">
              «Prezentatsiya uchun 48 million»
            </p>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
              Agar qog‘oz yoki slaydlar soniga qaralsa, bu qimmat ko‘rinishi mumkin.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-blue-600 bg-blue-50/50 p-7">
            <span className="text-xs font-semibold uppercase text-blue-700" style={mono}>
              To‘g‘ri framing
            </span>
            <p className="mt-3 text-lg font-bold text-blue-950">
              «Kompaniyaning keyingi yillardagi brend qarorlariga asos bo‘ladigan strategik tizim uchun»
            </p>
            <p className="mt-2 text-sm text-blue-900/80 leading-relaxed">
              Bu marketing byudjetini behuda sochmaslik, raqobatchi bilan narx urushiga kirmaslik va yagona yo‘nalishda rivojlanish vositasi.
            </p>
          </div>
        </div>

        {/* Value stack */}
        <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-7 sm:p-9 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase text-neutral-400" style={mono}>
            Value Stack — xizmat ichidagi strategik qatlamlar:
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {[
              'Business diagnosis',
              '+',
              'Market research',
              '+',
              'Competitor analysis',
              '+',
              'Audience JTBD',
              '+',
              'Positioning',
              '+',
              'Value Proposition',
              '+',
              'Differentiation',
              '+',
              'Brand Platform',
              '+',
              'Messaging Pillars',
              '+',
              'Strategy Map',
              '+',
              'Creative Brief',
            ].map((item, i) => (
              <span
                key={i}
                className={
                  item === '+'
                    ? 'text-neutral-400 font-bold'
                    : 'rounded-lg bg-neutral-100 px-3 py-1.5 text-neutral-800'
                }
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-6 border-t border-neutral-100 pt-4 text-sm font-medium text-neutral-700">
            Narx sahifalar soniga emas, biznes uchun qabul qilinadigan strategik qarorlar hajmiga bog‘liq.
          </p>
        </div>
      </Section>

      {/* 15. JTBD SECTION (Qora fon) */}
      <section aria-labelledby="bs-jtbd-heading" className="bg-black px-5 py-24 text-white sm:px-8 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow light>Mijozning ichki maqsadi</Eyebrow>
          <blockquote
            id="bs-jtbd-heading"
            className="font-bold tracking-tight text-white leading-tight"
            style={{ fontSize: 'clamp(26px, 4.2vw, 50px)', letterSpacing: '-0.03em' }}
          >
            «Biznesim o‘sayotganida, brendim kim uchun va nimasi bilan boshqalardan farq qilishini aniqlamoqchiman — shunda marketing, sotuv va dizayn bir xil yo‘nalishda ishlaydi.»
          </blockquote>
          <p className="mt-8 text-neutral-400" style={{ fontSize: 18, lineHeight: 1.6 }}>
            Brand Strategy’ning vazifasi — “chiroyli brend” emas, <span className="text-white font-semibold">aniq brend</span> qurishga yordam berish.
          </p>
        </div>
      </section>
    </>
  );
};
