import { FC } from 'react';
import { ArrowDown } from 'lucide-react';
import { h2Style, mono } from '../data';
import { Eyebrow, Section } from './ui';

export const ProblemSection: FC = () => {
  return (
    <>
      {/* 2. MUAMMO */}
      <Section labelledBy="bs-problem-heading" className="bg-neutral-50 border-y border-neutral-200/80">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Eyebrow>Muammo</Eyebrow>
            <h2 id="bs-problem-heading" className="font-bold text-neutral-950" style={h2Style}>
              Brend strategiyasiz biznesda nima sodir bo‘ladi?
            </h2>
            <p className="mt-5 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
              Tadbirkorda ko‘pincha:
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm font-medium text-neutral-700">
              {['logo bor', 'Instagram bor', 'reklama ishlayapti', 'sayt bor', 'sotuvchilar ishlayapti'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
              lekin har biri biznesni boshqacha tushuntiradi.
            </p>
          </div>

          {/* Visual flow: Rahbar, Marketing, Sotuvchi, Dizayn -> Mijoz */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
            <p className="mb-4 text-[11px] font-semibold uppercase text-neutral-400" style={mono}>
              Biznesdagi odatiy holat
            </p>
            <div className="space-y-3">
              {[
                { actor: 'Rahbar', says: '«Biz eng innovatsion va sifatlimiz»' },
                { actor: 'Marketing', says: '«Aksiya va arzon narx bilan kelyapmiz»' },
                { actor: 'Sotuvchi', says: '«Mijozga nima kerak bo‘lsa, shuni beramiz»' },
                { actor: 'Dizayn', says: 'Rang-barang va boshqacha taassurot beradi' },
              ].map((row) => (
                <div key={row.actor} className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 text-sm">
                  <span className="font-bold text-neutral-900">{row.actor}</span>
                  <span className="text-neutral-600">{row.says}</span>
                </div>
              ))}
            </div>

            <div className="my-4 flex justify-center">
              <ArrowDown className="h-5 w-5 text-neutral-400" />
            </div>

            <div className="rounded-2xl border-2 border-dashed border-red-300 bg-red-50/50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700" style={mono}>
                Iste’molchi savoli
              </p>
              <p className="mt-1 text-base font-bold text-neutral-900">
                Mijoz: «Siz aslida nimasi bilan boshqachasiz?»
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 rounded-3xl bg-neutral-950 p-8 text-white sm:p-12 shadow-xl">
          <p className="font-bold tracking-tight text-white" style={{ fontSize: 'clamp(22px, 3vw, 34px)', lineHeight: 1.2 }}>
            Muammo logoda emas. Muammo — brendning bozordagi o‘rni aniqlanmaganida.
          </p>
          <p className="mt-4 max-w-3xl text-neutral-300" style={{ fontSize: 17, lineHeight: 1.6 }}>
            Brand Strategy kompaniyaning marketingi, dizayni va kommunikatsiyasi uchun yagona yo‘nalish beradi.
          </p>
        </div>
      </Section>

      {/* 3. ENG MUHIM SAVOL (Minimal qora section) */}
      <section aria-labelledby="bs-core-question" className="bg-black px-5 py-24 text-white sm:px-8 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow light>Eng muhim savol</Eyebrow>
          <h2
            id="bs-core-question"
            className="font-bold tracking-tight text-white"
            style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Nega mijoz bozordagi boshqa variantlar ichidan aynan sizni tanlashi kerak?
          </h2>

          <div className="mx-auto mt-10 max-w-2xl text-left rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-wider text-neutral-400" style={mono}>
              Kompaniyalarning odatiy javoblari:
            </p>
            <ul className="mt-4 space-y-2 text-base text-neutral-300">
              <li className="flex items-center gap-2">
                <span className="text-red-400">✕</span> «Sifatimiz yaxshi»
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✕</span> «Professional jamoamiz bor»
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✕</span> «Individual yondashamiz»
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✕</span> «Narximiz yaxshi»
              </li>
            </ul>
            <p className="mt-6 border-t border-white/10 pt-4 text-sm text-neutral-400 leading-relaxed">
              Agar javobingiz shulardan iborat bo‘lsa, bu hali kuchli positioning emas.
            </p>
          </div>

          <p
            className="mx-auto mt-10 max-w-2xl font-semibold text-blue-400"
            style={{ fontSize: 'clamp(20px, 2.6vw, 28px)', lineHeight: 1.35 }}
          >
            Chunki raqobatchilarning ko‘pi ham aynan shu gaplarni aytadi.
          </p>
        </div>
      </section>
    </>
  );
};
