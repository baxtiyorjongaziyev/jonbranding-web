'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CtaBlock from './cta-block';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';
import type { FaqDictionary } from '@/lib/types/dictionary';

const Faq = ({ lang, dictionary, hideCta = false }: { lang: string, dictionary: FaqDictionary, hideCta?: boolean }) => {
  const translations = dictionary;

  const handleOpenModal = () => {
    const event = new CustomEvent('openContactModal');
    window.dispatchEvent(event);
  }

  if (!translations || !translations.faqItems) return null;

  const objectionLabels =
    lang === 'uz'
      ? ['Narx', 'Muddat', 'Natija', 'Ishonch', 'Jarayon']
      : lang === 'ru'
        ? ['Цена', 'Срок', 'Результат', 'Доверие', 'Процесс']
        : lang === 'zh'
          ? ['价格', '周期', '结果', '信任', '流程']
          : ['Price', 'Timeline', 'Outcome', 'Trust', 'Process'];

  return (
    <BrandSection id="faq" tone="light" className="border-y border-brand-line/80 bg-white py-14 sm:py-24">
      <div className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionIntro eyebrow="FAQ" title={translations.title} description={translations.subtitle} align="left" className="[&>p]:mx-0" />
            <div className="mt-8 hidden max-w-md rounded-3xl border border-brand-line/60 bg-white/70 backdrop-blur-md p-6 shadow-[0_15px_35px_rgba(0,0,0,0.02)] lg:block">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-brand-blue">Objection map</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {objectionLabels.map((label, index) => (
                  <span key={label} className="rounded-full border border-brand-line bg-white px-3 py-1.5 text-[11px] font-extrabold text-brand-slate">
                    {String(index + 1).padStart(2, '0')} {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-8 flex flex-wrap gap-2 lg:hidden">
          {objectionLabels.map((label) => (
            <span key={label} className="rounded-full border border-brand-line bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue shadow-sm">
              {label}
            </span>
          ))}
            </div>

            <Accordion type="single" collapsible defaultValue="item-0" className="w-full border-t border-brand-line">
              {translations.faqItems.map((item: any, index: number) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-brand-line">
                  <AccordionTrigger
                     className="group py-5 text-left hover:no-underline sm:py-7"
                    aria-label={item.question}
                  >
                    <span className="grid min-w-0 grid-cols-[2.75rem_1fr] items-start gap-4 pr-4">
                      <span className="font-mono text-xs font-black text-brand-blue tabular-nums">0{index + 1}</span>
                      <span className="text-lg font-black leading-snug tracking-tight text-brand-ink transition-colors duration-200 group-hover:text-brand-blue sm:text-2xl">
                        {item.question}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-7 pl-11 sm:pl-[3.75rem] text-sm leading-7 text-brand-slate sm:text-base">
                    <div className="max-w-2xl">{item.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {!hideCta && (
        <CtaBlock
          title={translations.ctaTitle ?? ''}
          description={translations.ctaDesc ?? ''}
          buttonText={translations.ctaButton ?? ''}
          onCtaClick={handleOpenModal}
        />
      )}
    </BrandSection>
  )
}

export default Faq;
