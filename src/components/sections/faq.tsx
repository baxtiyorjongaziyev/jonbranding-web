'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CtaBlock from './cta-block';
import { BrandCard, BrandSection, SectionIntro } from '@/components/ui/design-system';

const Faq = ({ lang, dictionary }: { lang: string, dictionary: any }) => {
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
        <SectionIntro eyebrow="Objections handled" title={translations.title} description={translations.subtitle} />
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
          {objectionLabels.map((label) => (
            <span key={label} className="brand-badge">
              {label}
            </span>
          ))}
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
                {translations.faqItems.map((item: any, index: number) => (
                <BrandCard key={index} className="px-5">
                <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger 
                      className="text-left text-lg font-black text-brand-ink hover:no-underline"
                      aria-label={lang === 'uz' ? `${item.question} savoliga javobni ko'rish` : lang === 'ru' ? `Посмотреть ответ на вопрос: ${item.question}` : `View answer for: ${item.question}`}
                    >
                    {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-brand-slate pt-2 text-base leading-7">
                    {item.answer}
                    </AccordionContent>
                </AccordionItem>
                </BrandCard>
                ))}
            </Accordion>
        </div>
      </div>
      <CtaBlock 
        title={translations.ctaTitle}
        description={translations.ctaDesc}
        buttonText={translations.ctaButton}
        onCtaClick={handleOpenModal}
      />
    </BrandSection>
  )
}

export default Faq;
