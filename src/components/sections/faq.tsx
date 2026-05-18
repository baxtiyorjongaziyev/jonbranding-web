'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CtaBlock from './cta-block';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';

const Faq = ({ lang, dictionary, hideCta = false }: { lang: string, dictionary: any, hideCta?: boolean }) => {
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
    <BrandSection id="faq" tone="soft">
      <div className="container mx-auto px-4">
        <SectionIntro eyebrow="FAQ" title={translations.title} description={translations.subtitle} />

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
          {objectionLabels.map((label) => (
            <span key={label} className="rounded-full border border-brand-line bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue shadow-sm">
              {label}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {translations.faqItems.map((item: any, index: number) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-brand-line bg-white/90 px-5 sm:px-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
                <AccordionItem value={`item-${index}`} className="border-none">
                  <AccordionTrigger
                    className="py-5 sm:py-6 text-left text-base font-bold leading-snug text-brand-ink hover:no-underline sm:text-lg sm:leading-normal"
                    aria-label={item.question}
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-sm sm:text-base leading-relaxed text-brand-slate">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </div>

      {!hideCta && (
        <CtaBlock
          title={translations.ctaTitle}
          description={translations.ctaDesc}
          buttonText={translations.ctaButton}
          onCtaClick={handleOpenModal}
        />
      )}
    </BrandSection>
  )
}

export default Faq;
