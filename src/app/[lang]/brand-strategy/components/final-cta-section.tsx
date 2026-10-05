import React, { FC } from 'react';
import { mono, PRICE } from '../data';
import { BrandStrategyForm } from './brand-strategy-form';
import { Eyebrow, PrimaryBtn, SecondaryBtn } from './ui';

export const FinalCtaSection: FC<{
  formRef: React.RefObject<HTMLDivElement | null>;
  phoneRef: React.RefObject<HTMLInputElement | null>;
  onMeetingClick: () => void;
  onQuestionClick: () => void;
}> = ({ formRef, phoneRef, onMeetingClick, onQuestionClick }) => {
  return (
    <section aria-labelledby="bs-final-cta-heading" className="bg-neutral-950 px-5 py-24 text-white sm:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-start">
          <div>
            <Eyebrow light>Keyingi qadam</Eyebrow>
            <h2
              id="bs-final-cta-heading"
              className="font-bold tracking-tight text-white"
              style={{ fontSize: 'clamp(30px, 4.4vw, 54px)', letterSpacing: '-0.04em', lineHeight: 1.1 }}
            >
              Brendingiz qanday ko‘rinishidan oldin, bozorda kim bo‘lishini aniqlang.
            </h2>
            <p className="mt-6 text-neutral-300" style={{ fontSize: 17, lineHeight: 1.65 }}>
              Biznesingizni tushunamiz, bozordagi imkoniyatni topamiz va brendingiz uchun aniq strategik yo‘nalish ishlab chiqamiz.
            </p>

            <dl className="mt-8 border-t border-white/10 pt-6">
              <dt className="text-[11px] uppercase text-neutral-400" style={mono}>
                Xizmat qiymati
              </dt>
              <dd className="mt-1 text-3xl font-bold tracking-tight text-white">{PRICE}</dd>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryBtn dark onClick={onMeetingClick}>
                Brand Strategy bo‘yicha uchrashuv
              </PrimaryBtn>
              <SecondaryBtn dark onClick={onQuestionClick}>
                Savolim bor
              </SecondaryBtn>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-xs text-neutral-400 leading-relaxed">
              <p className="font-semibold text-neutral-200 mb-1">Jon Branding yondashuvi:</p>
              Biznesingiz operatsion jarayonini tushunmasdan turib chiroyli rasmlar chizmaymiz. Avval strategik aniqlik, keyin esa dizayn.
            </div>
          </div>

          <BrandStrategyForm formRef={formRef} phoneRef={phoneRef} />
        </div>
      </div>
    </section>
  );
};
