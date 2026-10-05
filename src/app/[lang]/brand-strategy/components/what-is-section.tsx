import { FC } from 'react';
import { Compass, Layers, Sparkles, Target } from 'lucide-react';
import { h2Style } from '../data';
import { Eyebrow, Section } from './ui';

export const WhatIsSection: FC = () => {
  return (
    <Section labelledBy="bs-what-heading">
      <div className="text-center max-w-3xl mx-auto">
        <Eyebrow>Ta’rif</Eyebrow>
        <h2 id="bs-what-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
          Brand Strategy — biznesning bozor uchun strategik kompasidir
        </h2>
        <p className="mt-4 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.6 }}>
          U biznes qarorlarini bozor tili va mijoz qabul qiladigan qiymatga tarjima qiladi.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {[
          {
            q: 'KIM UCHUN?',
            desc: 'Eng muhim auditoriyani aniqlaymiz.',
            detail: 'Barcha odamlarga birdek sotishga urinmaymiz. Eng yuqori qiymat keltiradigan aniq segmentni belgilaymiz.',
            icon: Target,
          },
          {
            q: 'QANDAY MUAMMONI HAL QILAMIZ?',
            desc: 'Mijoz biznesni nima uchun tanlashini aniqlaymiz.',
            detail: 'Mijozning haqiqiy muammosi, xarid konteksti va qanday natijaga erishmoqchiligini ochib beramiz.',
            icon: Compass,
          },
          {
            q: 'NIMASI BILAN FARQLANAMIZ?',
            desc: 'Raqobatchilar takrorlay olmaydigan yoki ishonchli asosga ega farqni topamiz.',
            detail: 'Quruq so‘zlar emas, biznesning real imkoniyatlariga tayangan haqiqiy afzallikni shakllantiramiz.',
            icon: Sparkles,
          },
          {
            q: 'BOZORDA KIM BO‘LAMIZ?',
            desc: 'Mijoz ongida qaysi pozitsiyani egallash kerakligini belgilaymiz.',
            detail: 'Qaysi kategoriya vakili bo‘lishimiz va qanday assotsiatsiyalar uyg‘otishimiz kerakligini poydevor qilib qo‘yamiz.',
            icon: Layers,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.q}
              className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-7 sm:p-9 transition-all hover:border-neutral-300 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900" style={{ letterSpacing: '-0.02em' }}>
                {card.q}
              </h3>
              <p className="mt-2 text-base font-semibold text-blue-950">{card.desc}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{card.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50/60 p-6 text-center">
        <p className="text-base font-bold text-blue-950 sm:text-lg">
          Brand Strategy → barcha keyingi brend qarorlarining filtri
        </p>
      </div>
    </Section>
  );
};
