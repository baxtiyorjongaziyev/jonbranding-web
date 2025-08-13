import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
    question: "Loyiha tugagandan keyin qo'llab-quvvatlash bormi?",
    answer: "Ha, loyiha tugagandan so'ng 1 oy davomida sizga brend materiallaridan to'g'ri foydalanish bo'yicha bepul maslahat va yordam beramiz."
  },
  {
    question: "Ish qanday qabul qilinadi va qanday formatdagi fayllar beriladi?",
    answer: "Loyiha yakunida biz sizga barcha kerakli fayllarni (vektor formatida .svg, .ai; rastr formatida .png, .jpg) va brandbookni (.pdf) taqdim etamiz. Ish dalolatnoma imzolangandan so'ng qabul qilingan hisoblanadi."
  }
];

const Faq = () => {
  return (
    <section id="faq" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Ko'p beriladigan savollar</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Sizni qiziqtirgan savollarga shu yerdan javob toping.
          </p>
        </div>
        <div className="mt-12 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-2xl shadow-sm bg-secondary/50 px-6">
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
    </section>
  );
};

export default Faq;
