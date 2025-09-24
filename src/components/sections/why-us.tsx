
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, ListChecks, Star } from 'lucide-react';
import CtaBlock from './cta-block';
import TiltCard from '@/components/ui/tilt-card';

const values = [
  {
    icon: Target,
    title: "Strategik yondashuv",
    description: "Biz shunchaki chiroyli rasm chizmaymiz. Har bir dizayn elementi sotuvingizni oshirishga va brendingizni mustahkamlashga xizmat qiladi."
  },
  {
    icon: ListChecks,
    title: "Shaffof jarayon",
    description: "Brief → Tahlil → Strategiya → Dizayn → Topshirish. Har bir bosqichda siz bilan yaqin aloqada bo'lamiz va jarayonni to'liq nazorat qilasiz."
  },
  {
    icon: Star,
    title: "Natija va Sadoqat",
    description: "50 dan ortiq loyiha va eng muhimi - mijozlarimizning 90% bizni o'z tanishlariga tavsiya qilishadi. Bu biz uchun eng katta yutuq."
  }
];

interface WhyUsProps {
  onCtaClick: () => void;
}

const WhyUs: React.FC<WhyUsProps> = ({ onCtaClick }) => {
  return (
    <>
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Nima uchun aynan biz?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Biz shunchaki va'da bermaymiz. Biz tizimli yondashuv orqali brendingiz uchun aniq qiymat yaratamiz.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
             <TiltCard key={index} strength={10}>
                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl h-full">
                  <CardHeader className="items-center text-center">
                    <div className="bg-primary/10 p-4 rounded-full">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="!mt-4 text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
    <CtaBlock 
        title="Bizning yondashuvimiz sizga ma'qul keldimi?"
        description="Keling, brendingizni bepul tahlil qilib, uning kuchli va zaif tomonlarini aniqlaymiz. Bu siz uchun hech qanday majburiyat yuklamaydi."
        buttonText="Brendimni bepul tahlil qiling"
        onCtaClick={onCtaClick}
      />
    </>
  );
};

export default WhyUs;
