import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CtaBlock from './cta-block';

const faqItems = [
  {
    question: "Narxlar qaysi valyutada ko'rsatilgan va to'lov qanday amalga oshiriladi?",
    answer: "Barcha narxlar AQSH dollarida (USD) ko'rsatilgan. To'lov O'zbekiston so'mida, to'lov kunidagi Markaziy Bank kursi bo'yicha amalga oshiriladi. Biz shartnoma asosida ishlaymiz va to'lovni bank hisob raqami orqali qabul qilamiz."
  },
  {
    question: "Loyiha qancha vaqt davom etadi?",
    answer: "Odatda, loyihaning murakkabligiga qarab, logo dizayni 2-3 hafta, to'liq brandbook esa 4-6 hafta vaqt oladi. Bu muddatlar sizning qayta aloqangiz tezligiga ham bog'liq."
  },
  {
    question: "Dizayn yoqmasa, o'zgartirishlar kiritish mumkinmi?",
    answer: "Albatta. Har bir bosqichda siz bilan kelishgan holda ishlaymiz. Odatda, paketga 2-3 marta o'zgartirish kiritish imkoniyati kiradi. Bizning maqsadimiz - siz 100% mamnun bo'lgan natijaga erishish."
  },
  {
    question: "Agar natijadan ko'nglim to'lmasa-chi? Qanday kafolat bor?",
    answer: "Sizning mamnunligingiz biz uchun birinchi o'rinda. Shuning uchun biz '100% Mamnuniyat Kafolati'ni taklif qilamiz. Agar dizayn konsepsiyasining dastlabki variantlaridan ko'nglingiz to'lmasa, biz siz bilan birga ishlab, sizga to'liq ma'qul keladigan yo'nalishni topmagunimizcha qayta ishlaymiz yoki to'lovingizni qaytarib beramiz."
  },
  {
    question: "Loyiha tugagandan keyin qo'llab-quvvatlash bormi?",
    answer: "Ha, loyiha tugagandan so'ng 1 oy davomida sizga brend materiallaridan to'g'ri foydalanish bo'yicha bepul maslahat va yordam beramiz."
  },
  {
    question: "Ish qanday qabul qilinadi va qanday formatdagi fayllar beriladi?",
    answer: "Loyiha yakunida biz sizga barcha kerakli fayllarni (vektor formatida .svg, .ai; rastr formatida .png, .jpg) va brandbookni (.pdf) taqdim etamiz. Ish dalolatnoma imzolangandan so'ng qabul qilingan hisoblanadi."
  }
];

interface FaqProps {
  onCtaClick: () => void;
}

const Faq: React.FC<FaqProps> = ({ onCtaClick }) => {
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
            {faqItems.map((item, index) => (
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
        onCtaClick={onCtaClick}
      />
    </section>
  );
};

export default Faq;
