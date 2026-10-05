import { FC } from 'react';
import Image from 'next/image';
import { mono, PRICE } from '../data';
import { HeroStrategyMap } from './hero-strategy-map';
import { Eyebrow, PrimaryBtn, SecondaryBtn } from './ui';

export const HeroSection: FC<{
  onMeetingClick: () => void;
  onDeliverablesClick: () => void;
}> = ({ onMeetingClick, onDeliverablesClick }) => {
  return (
    <section aria-labelledby="bs-hero-heading" className="px-5 pb-16 pt-24 sm:px-8 md:pb-24 md:pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Eyebrow>BRAND STRATEGY</Eyebrow>
          <h1
            id="bs-hero-heading"
            className="font-bold tracking-tight text-neutral-950"
            style={{ fontSize: 'clamp(34px, 5.2vw, 62px)', letterSpacing: '-0.04em', lineHeight: 1.05 }}
          >
            Brendingiz bozorda qaysi joyni egallashi kerakligini aniqlaymiz
          </h1>
          <p className="mt-6 max-w-[54ch] text-neutral-600" style={{ fontSize: 18, lineHeight: 1.65 }}>
            Kim uchun ishlaysiz, nimasi bilan farqlanasiz, nima va’da qilasiz va odamlar nega aynan sizni tanlashi kerak — bularni bitta strategik tizimga keltiramiz.
          </p>

          <dl className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-neutral-200 pt-6">
            <div>
              <dt className="text-[11px] uppercase text-neutral-400" style={mono}>
                Strategik xizmat narxi
              </dt>
              <dd className="mt-1 text-3xl font-bold tracking-tight text-neutral-950">{PRICE}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase text-neutral-400" style={mono}>
                Formati
              </dt>
              <dd className="mt-1 text-base font-semibold text-neutral-800">
                Rahbar bilan to‘g‘ridan-to‘g‘ri strategik jarayon
              </dd>
            </div>
          </dl>

          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
            <PrimaryBtn onClick={onMeetingClick}>
              Brand Strategy bo‘yicha uchrashuv
            </PrimaryBtn>
            <SecondaryBtn onClick={onDeliverablesClick}>
              Xizmat tarkibini ko‘rish
            </SecondaryBtn>
          </div>

          <p className="mt-6 max-w-[58ch] text-xs leading-relaxed text-neutral-500">
            Bu 30–40 betlik quruq taqdimot emas — biznesingiz bozorda kim bo‘lishi, kim uchun ishlashi va nima deyishi kerakligini belgilab beradigan tizim.
          </p>
        </div>

        <HeroStrategyMap />
      </div>

      {/* Hero Visual Banner */}
      <div className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-900 shadow-xl">
        <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
          <Image
            src="/images/brand-strategy/hero.jpg"
            alt="Jon Branding — Brand Strategy Boardroom & Executive Deliverables"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white sm:bottom-6 sm:left-6 sm:right-6">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-blue-300">Executive Process</p>
              <p className="text-sm font-semibold sm:text-base">Kompaniya ta’sischilari va top-menejment bilan strategik konsultatsiya</p>
            </div>
            <span className="rounded-full border border-white/20 bg-black/40 px-3.5 py-1 text-[11px] font-mono text-neutral-300 backdrop-blur">
              Jon Branding · Strategy System
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
