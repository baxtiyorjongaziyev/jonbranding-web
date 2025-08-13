import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Building, Rocket, Store, Gem } from 'lucide-react';

const targetAudiences = [
  {
    icon: Rocket,
    title: "Startaplar va yangi bizneslar",
    description: "Bozorga kuchli va esda qolarli kirib kelishni xohlaydiganlar uchun.",
    problems: ["Brendim yo'q", "Qanday boshlashni bilmayapman", "Raqobatchilardan ajralib turishim kerak"]
  },
  {
    icon: Building,
    title: "Mavjud kompaniyalar",
    description: "Brendingini yangilamoqchi yoki rebrending qilmoqchi bo'lganlar uchun.",
    problems: ["Dizaynim eski", "Sotuvlarim tushib ketyapti", "Brendimiz zamon talabiga javob bermayapti"]
  },
  {
    icon: Store,
    title: "Mahsulot ishlab chiqaruvchilar",
    description: "O'z mahsulotlarini jozibador qadoq va brend bilan sotuvga olib chiqmoqchilar uchun.",
    problems: ["Qadog'im e'tibor tortmaydi", "Mahsulotim narxini ko'tara olmayapman", "Mijozlar raqobatchimni tanlayapti"]
  },
  {
    icon: Gem,
    title: "Premium segment",
    description: "O'z xizmat yoki mahsulotining yuqori qiymatini ko'rsatmoqchi bo'lganlar uchun.",
    problems: ["O'zimni qimmat sota olmayapman", "Mijozlarim qiymatimni tushunmayapti", "Statusimni ko'rsatishim kerak"]
  }
];

const TargetAudience = () => {
  return (
    <section id="target-audience" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Xizmatlarimiz kimlar uchun?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Agar siz quyidagi muammolarga duch kelayotgan bo'lsangiz, demak biz sizga yordam bera olamiz.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {targetAudiences.map((audience, index) => (
            <Card key={index} className="flex flex-col text-center shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <audience.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="!mt-4 text-xl text-dark-blue">{audience.title}</CardTitle>
                <CardDescription className="text-base !mt-2">{audience.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center">
                 <ul className="space-y-2 text-left">
                    {audience.problems.map((problem, pIndex) => (
                        <li key={pIndex} className="flex items-start text-sm text-gray-600">
                           <span className="text-red-500 mr-2 font-bold">-</span> 
                           {problem}
                        </li>
                    ))}
                 </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
