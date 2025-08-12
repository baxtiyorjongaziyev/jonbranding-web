import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, ListChecks, Star } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: "Strategiya birinchi o'rinda",
    description: "Biz har bir loyihani chuqur tahlil va strategiya bilan boshlaymiz. Dizayn shunchaki bezak emas, balki biznes maqsadingizga erishish vositasidir."
  },
  {
    icon: ListChecks,
    title: "Aniq ish jarayoni",
    description: "Brief → Tahlil → Strategiya → Dizayn → Topshirish. Har bir bosqichda siz bilan yaqin aloqada bo'lamiz va jarayonni to'liq nazorat qilasiz."
  },
  {
    icon: Star,
    title: "Natijalar o'zi gapiradi",
    description: "Bizning portfoliomiz va mijozlarimizning ijobiy fikrlari - ishimiz sifatining eng yaxshi isboti. Biz uzoq muddatli hamkorlikka intilamiz."
  }
];

const WhyUs = () => {
  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Nima uchun aynan biz?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Biz shunchaki va'da bermaymiz. Biz tizimli yondashuv orqali brendingiz uchun aniq qiymat yaratamiz.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
              <CardHeader className="items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="!mt-4 text-xl text-dark-blue">{value.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
