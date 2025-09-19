
'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Search, ShieldCheck, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Parallax from '@/components/parallax-provider';
import ServiceSections from '@/components/sections/service-sections';
import React from 'react';
import placeholderImages from '@/app/lib/placeholder-images.json';
import TrademarkCalculator from '@/components/sections/trademark-calculator';
import { Separator } from '@/components/ui/separator';

const creationSteps = [
    {
        icon: Search,
        title: "Tadqiqot",
        description: "Bozorni, auditoriyani, raqobatchilarni va ma'noviy yo'nalishlarni o'rganamiz."
    },
    {
        icon: Lightbulb,
        title: "Konsepsiyalarni shakllantirish",
        description: "Nom izlash uchun mumkin bo'lgan vektorlarni aniqlaymiz."
    },
    {
        icon: CheckCircle,
        title: "G'oyalarni yaratish va sinovdan o'tkazish",
        description: "Variantlar ro'yxatini tuzamiz, ohangini, ma'nosini va salohiyatini sinab ko'ramiz."
    },
    {
        icon: ShieldCheck,
        title: "Tekshirish va yakunlash",
        description: "Ro'yxatdan o'tkazish imkoniyatini tahlil qilamiz, domen va assotsiatsiyalarni tekshiramiz va eng yaxshilarini tanlaymiz."
    },
];

const NamingPage: FC = () => {

  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };
  
  const namingBrainstormImage = placeholderImages['naming-brainstorm'];
  const namingIdeaImage = placeholderImages['naming-idea'];

  return (
    <>
        <main className="flex-grow">
        <Parallax speed={0.5}>
            <section className="py-20 sm:py-28 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-blue">
                Neyming — Kuchli Brend Nomi
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-700">
                Brend nomi — bu u haqidagi birinchi taassurot, uning energiyasi, xarakteri va so'zda ifodalangan g'oyasi. Yaxshi nom shunchaki chiroyli eshitilmaydi, u mohiyatni yetkazadi, esda qoladi va brendning raqobatchilar orasida ajralib turishiga yordam beradi.
                </p>
            </div>
            </section>
        </Parallax>

        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Nomi brend strategiyasining bir qismidir</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                        <p>
                            Yaxshi nom assotsiatsiyalarni, tanilishni va hissiy aloqani qo'llab-quvvatlaydi. Bunday nomni yaratish — bu strategik ish bo'lib, unda brendning pozitsiyasi, bozor, maqsadli auditoriya va kompaniyaning uzoq muddatli maqsadlari hisobga olinadi.
                        </p>
                        <p>
                            Biz neymingga brendingning muhim elementi sifatida yondashamiz. Bu tasodifiy g'oyalar to'plami emas, balki har bir so'z ma'noga ega bo'lgan puxta o'ylangan ishdir.
                        </p>
                        </div>
                    </div>
                    <div className="lg:order-last">
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-0">
                            <Image 
                                src={namingBrainstormImage.src}
                                width={namingBrainstormImage.width}
                                height={namingBrainstormImage.height}
                                data-ai-hint={namingBrainstormImage.hint}
                                alt={namingBrainstormImage.alt}
                                className="rounded-2xl object-cover"/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="lg:order-last">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Har bir kuchli nom g'oyadan boshlanadi</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                        <p>
                            Nom izlashdan oldin, biz asosiy savolni beramiz: bu brend nima haqida? Qanday his-tuyg'ular va obrazlarni uyg'otishi kerak? Shuning uchun biz mahsulotni, uning auditoriyasini va muhitini diqqat bilan tahlil qilamiz, ideal nomni izlash uchun ma'noviy yo'nalishlarni aniqlaymiz.
                        </p>
                        <p>
                            U hissiyot, metafora, madaniy kod, professional til yoki hatto so'z o'yiniga qurilishi mumkin. Asosiysi — u ishlashi, mohiyatni yetkazishi va brendning esda qolishiga yordam berishi kerak.
                        </p>
                        </div>
                    </div>
                    <div>
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-0">
                            <Image 
                                src={namingIdeaImage.src}
                                width={namingIdeaImage.width}
                                height={namingIdeaImage.height}
                                data-ai-hint={namingIdeaImage.hint}
                                alt={namingIdeaImage.alt}
                                className="rounded-2xl object-cover"/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold">Nomni qanday yaratamiz?</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                        Agentligimizda neyming ishlab chiqish — har bir bosqichi muhim bo'lgan aniq jarayondir:
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {creationSteps.map((step, index) => (
                    <Card key={index} className="text-center shadow-lg rounded-2xl bg-white transform hover:-translate-y-2 transition-transform duration-300">
                        <CardContent className="p-8">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                                <step.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-blue">{step.title}</h3>
                            <p className="mt-2 text-gray-600">{step.description}</p>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Nomni tekshirish — yaratishdan kam emas</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                        Daho g'oya ham, agar uni ro'yxatdan o'tkazish imkoni bo'lmasa yoki nomaqbul assotsiatsiyalarga ega bo'lsa, ishlamaydi. Biz nomlarni bir nechta asosiy parametrlar bo'yicha tekshiramiz:
                    </p>
                </div>
                <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <Card className="bg-secondary/50 p-6 rounded-xl"><h4 className="font-bold">Huquqiy tozalik</h4><p className="text-gray-600 mt-1">Tovar belgisini kerakli mintaqa va sinfda ro'yxatdan o'tkazish imkoniyatini tahlil qilamiz.</p></Card>
                    <Card className="bg-secondary/50 p-6 rounded-xl"><h4 className="font-bold">Domenlar va raqamli muhit</h4><p className="text-gray-600 mt-1">Raqamli muhitda nomlarning mavjudligini tekshiramiz.</p></Card>
                    <Card className="bg-secondary/50 p-6 rounded-xl"><h4 className="font-bold">Ma'no va assotsiatsiyalar</h4><p className="text-gray-600 mt-1">O'qilishi, ohangi, mumkin bo'lgan assotsiativ qator, madaniy idrok va brend toifasiga muvofiqligini tekshiramiz.</p></Card>
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24 bg-secondary">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Tovar Belgisi Xarajatlari</h2>
                  <p className="mt-4 text-lg text-gray-700">
                     Neyming (nom tanlash) — ijodiy jarayon, Patentlash esa — yuridik. Jamoamizdagi patent mutaxassisi yordamida tovar belgisini ro'yxatdan o'tkazish bilan bog'liq barcha xarajatlarni (davlat bojlari va xizmat haqi) shu yerda taxminan hisoblang.
                  </p>
              </div>
              <Separator className="my-12" />
              <TrademarkCalculator />
          </div>
        </section>

        </main>
        <React.Suspense fallback={<div>Loading sections...</div>}>
            <ServiceSections />
        </React.Suspense>
    </>
  );
};

export default NamingPage;
