'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Building, Rocket, Store, Gem, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const targetAudiences = [
  {
    icon: Rocket,
    title: "Startaplar va yangi bizneslar",
    description: "Bozorga kuchli va esda qolarli kirib kelishni xohlaydiganlar uchun.",
    problems: ["Brendim yo'q, bozor meni tanimaydi", "Qanday boshlashni bilmayapman", "Raqobatchilardan qanday ajralib turish mumkin?"]
  },
  {
    icon: Building,
    title: "Mavjud kompaniyalar",
    description: "Brendingini yangilamoqchi yoki rebrending qilmoqchi bo'lganlar uchun.",
    problems: ["Brendim eskirgan, jozibador emas", "Sotuvlarimiz tushib ketyapti", "Biznesimiz o'sishdan to'xtab qoldi"]
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
    problems: ["O'zimni qimmat sota olmayapman", "Mijozlarim qiymatimni tushunmayapti", "Yuqori statusimni ko'rsatishim kerak"]
  }
];

const TargetAudience = () => {
  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };

  return (
    <section id="target-audience" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Xizmatlarimiz kimlar uchun?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Agar quyidagi muammolarga duch kelayotgan bo'lsangiz, demak biz sizga yordam bera olamiz.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {targetAudiences.map((audience, index) => (
            <Card key={index} className="flex flex-col text-center shadow-lg rounded-2xl hover:shadow-xl transition-shadow bg-white">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <audience.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="!mt-4 text-xl">{audience.title}</CardTitle>
                <CardDescription className="text-base !mt-2 px-4">{audience.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center bg-red-500/5 p-6 rounded-b-2xl">
                 <h4 className="font-bold text-dark-blue mb-4">Bu muammolar sizga tanishmi?</h4>
                 <ul className="space-y-3 text-left">
                    {audience.problems.map((problem, pIndex) => (
                        <li key={pIndex} className="flex items-start text-sm text-gray-800 font-medium">
                           <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-px" />
                           <span>{problem}</span>
                        </li>
                    ))}
                 </ul>
              </CardContent>
            </Card>
          ))}
        </div>
         <div className="text-center mt-12">
            <Button onClick={handleOpenModal} size="lg" className="text-lg shadow-ocean animate-subtle-pulse">
                Mening muammom bor <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
