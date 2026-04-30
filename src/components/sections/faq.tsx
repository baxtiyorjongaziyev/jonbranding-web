'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CtaBlock from './cta-block';

const Faq = ({ lang, dictionary }: { lang: string, dictionary: any }) => {
  const translations = dictionary;
  
  const handleOpenModal = () => {
    const event = new CustomEvent('openContactModal');
    window.dispatchEvent(event);
  }
  
  if (!translations || !translations.faqItems) return null;

  return (
    <section id="faq" className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              {translations.title}
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
              {translations.subtitle}
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
                {translations.faqItems.map((item: any, index: number) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger 
                      className="text-left text-lg font-semibold text-foreground"
                      aria-label={lang === 'uz' ? `${item.question} savoliga javobni ko'rish` : lang === 'ru' ? `Посмотреть ответ на вопрос: ${item.question}` : `View answer for: ${item.question}`}
                    >
                    {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-2 text-base">
                    {item.answer}
                    </AccordionContent>
                </AccordionItem>
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
    </section>
  )
}

export default Faq;