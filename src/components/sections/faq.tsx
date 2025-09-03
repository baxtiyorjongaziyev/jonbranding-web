'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CtaBlock from './cta-block';
import { getFaqItems, type FaqItem } from '@/lib/airtable';
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
    <section id="faq" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Ko'p beriladigan savollar</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Sizni qiziqtirgan savollarga shu yerdan javob toping.
          </p>
        </div>
        <div className="mt-12 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-2xl shadow-sm bg-secondary/70 px-6 hover:bg-secondary transition-colors duration-300">
                <AccordionTrigger className="text-left font-bold text-dark-blue hover:no-underline text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pt-2 text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
    const fetchFaqs = async () => {
      try {
        const airtableItems = await getFaqItems();
        if (airtableItems.length > 0) {
          setFaqItems(airtableItems);
        }
      } catch (error) {
        console.error("Failed to fetch FAQ items from Airtable, using static data.", error);
      }
    };
    fetchFaqs();
  }, []);
  

  return <FaqClient items={faqItems} />;
};

export default Faq;
