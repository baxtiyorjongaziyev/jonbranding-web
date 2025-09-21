'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CtaBlock from './cta-block';
import { type FaqItem } from '@/lib/types';
import { useState, useEffect } from 'react';

const staticFaqItems: FaqItem[] = [
   {
    question: "Nima uchun narxlar qat'iy belgilanmagan?",
    answer: "Har bir loyiha o'ziga xos. Narx loyihaning murakkabligi, ish hajmi va sizning vazifalaringizga qarab individual ravishda hisoblanadi. Biz sizning brendingiz uchun eng maqbul yechimni taklif qilamiz."
  },
  {
    question: "Ish jarayoni qanday quriladi?",
    answer: "Jarayon bosqichlarga bo'lingan: tadqiqot, strategiya, vizual uslub, kommunikatsiya. Har bir bosqich siz bilan kelishilgan holda amalga oshiriladi va siz jarayonni to'liq nazorat qilasiz."
  },
  {
    question: "Faqat logotip buyurtma qilsam bo'ladimi?",
    answer: "Biz shunchaki logotip emas, balki brendni taniladigan va samarali qiladigan to'laqonli identifikatsiya tizimini ishlab chiqamiz. Bu sizning biznesingizga uzoq muddatli qiymat yaratadi."
  },
  {
    question: "To'lov shartlari qanday?",
    answer: "Standart sxema — 50% oldindan to'lov, 50% loyiha topshirilgandan so'ng. Sizning qulayligingiz uchun individual shartlarni ham muhokama qilishimiz mumkin."
  },
  {
    question: "Ish qancha vaqt davom etadi?",
    answer: "Muddlatlar xizmat turiga bog'liq. Masalan, logotip yaratish — 2-4 hafta, brend-strategiya — 8 haftadan boshlanadi. Yakuniy muddat loyiha tasdiqlangandan so'ng aniq bo'ladi."
  },
  {
    question: "Loyiha tugagandan keyin qo'llab-quvvatlash bormi?",
    answer: "Ha, loyiha tugagandan so'ng 1 oy davomida sizga brend materiallaridan to'g'ri foydalanish bo'yicha bepul maslahat va yordam beramiz."
  },
];

const FaqClient = ({ items }: { items: FaqItem[] }) => {
  const handleOpenModal = () => {
    const event = new CustomEvent('openContactModal');
    window.dispatchEvent(event);
  }
  
  return (
    <section id="faq" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="lg:sticky top-24">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-foreground">
                    Frequently Asked 
                    <br />
                    <span className="font-extrabold">Questions</span>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Eng ko'p beriladigan savollarga shu yerdan javob toping.
                </p>
            </div>
            <div className="max-w-3xl">
                <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
                    {items.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left text-lg font-semibold text-foreground">
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
      </div>
      <CtaBlock 
        title="Ikkilanishlarga o'rin qoldirmang!"
        description="Barcha savollaringizga javob oldingizmi? Keling, loyihangizni muhokama qilamiz va brendingizni keyingi bosqichga olib chiqamiz."
        buttonText="Barcha savollarga javob oldim, boshlashga tayyorman!"
        onCtaClick={handleOpenModal}
      />
    </section>
  )
}

const Faq = () => {
  const [faqItems, setFaqItems] = useState<FaqItem[]>(staticFaqItems);

  useEffect(() => {
    // Data is now static, no need to fetch
    setFaqItems(staticFaqItems);
  }, []);
  

  return <FaqClient items={faqItems} />;
};

export default Faq;
