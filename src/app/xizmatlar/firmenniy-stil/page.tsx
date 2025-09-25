
'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Palette, PenTool, ClipboardCheck } from 'lucide-react';
import Image from 'next/image';
import Parallax from '@/components/parallax-provider';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const PickTwoSelector = dynamic(() => import('@/components/sections/pick-two-selector'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});


const processSteps = [
    {
        icon: Layers,
        title: "Tadqiqot va konsepsiya",
        description: "Auditoriya, bozor, raqobatchilar va brendning o'rnini tahlil qilamiz. Vizual uslubda aks ettirilishi kerak bo'lgan asosiy ma'no va g'oyalarni aniqlaymiz."
    },
    {
        icon: Palette,
        title: "Vizual kodni ishlab chiqish",
        description: "Brendning yaxlit obrazini shakllantiradigan logotip, firma ranglari, tipografika, grafika, ikonografiya, maket tamoyillarini yaratamiz."
    },
    {
        icon: PenTool,
        title: "Firma uslubi tizimi",
        description: "Barcha formatlarda — qadoqdan tortib raqamli muhitgacha — vizual obrazning izchilligini saqlashga yordam beradigan moslashuvchan elementlarni ishlab chiqamiz."
    },
    {
        icon: ClipboardCheck,
        title: "Yakunlash va gaydlayn",
        description: "Brend har qanday tashuvchida yagona obrazni saqlab qolishi uchun uslubdan foydalanish qoidalari yozilgan gaydlaynni yaratamiz."
    },
];

const FirmenniyStilPage: FC = () => {

  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };

  return (
    <>
        <main className="flex-grow pt-20">
        <Parallax speed={0.1}>
            <section className="py-20 sm:py-28 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-blue">
                Firma Uslubini Ishlab Chiqish
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-700">
                Brendning asosiy elementlaridan biri — uning vizual tarkibiy qismidir. Aynan u g'oyalarni, ma'nolarni va qadriyatlarni ko'rish, his qilish va eslab qolish mumkin bo'lgan obrazlarga aylantiradi.
                </p>
            </div>
            </section>
        </Parallax>

        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Brendni idrok etish rasmdan boshlanadi</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                        <p>
                            Zamonaviy dunyoda vizual ma'lumotlar matn yoki so'zlarga qaraganda tezroq qabul qilinadi va o'zlashtiriladi. Biz bir zumlik taassurotlar davrida yashayapmiz: odamlarga brend haqida tasavvur hosil qilish uchun bir soniya kifoya qiladi va bu ko'pincha uning vizual obrazi orqali sodir bo'ladi.
                        </p>
                        <p>
                            G'oyaning auditoriya ongida mustahkamlanishi uchun u haqida shunchaki aytib berishning o'zi kamlik qiladi — uni vizual elementlar bilan kuchaytirish muhimdir. Savodli ishlab chiqilgan firma uslubi brend qadriyatlarini ortiqcha tushuntirishlarsiz namoyon etishga, kerakli hissiyot va assotsiatsiyalarni bir zumda uyg'otishga imkon beradi.
                        </p>
                        </div>
                    </div>
                    <div className="lg:order-last">
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-0">
                            <Image 
                                src="https://picsum.photos/seed/visual-perception/800/600"
                                width={800}
                                height={600}
                                data-ai-hint="visual perception moodboard"
                                alt="Brand perception moodboard"
                                className="rounded-2xl object-cover"/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
        
        <PickTwoSelector onCtaClick={handleOpenModal} />

        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="lg:order-last">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Firma uslubi — bu tizim</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                        <p>
                            Bu shunchaki go'zallik haqida emas, balki samaradorlik, ma'no va nazorat haqida. Brend o'zining vizual obrazini rivojlantirishda ko'p qirrali va izchil bo'lib qolishi uchun grafik elementlar to'plamini yaratish kerak.
                        </p>
                        <p>
                            Bunday to'plam har doim biznesning vazifalari va imkoniyatlariga qarab individual ravishda tanlanadi. Minimal to'plamga logotip, ranglar, shriftlar, fotosurat uslubi, reklama tashuvchilarining uslubi va yaxlit obrazni yaratadigan boshqa elementlar kiradi.
                        </p>
                        <p className="font-bold text-dark-blue">
                            Vizual uslub aniq va izchil qurilganda, u brend obrazini boshqarish va muloqot qilish uchun kuchli vositaga aylanadi. Uning barcha elementlari bir-biriga mos kelganda, brend professional, ishonchli va taniladigan sifatida qabul qilinadi.
                        </p>
                        </div>
                    </div>
                    <div>
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-0">
                            <Image 
                                src="https://picsum.photos/seed/design-system/800/600"
                                width={800}
                                height={600}
                                data-ai-hint="design system grid"
                                alt="Design system grid"
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
                    <h2 className="text-3xl sm:text-4xl font-bold">Firma uslubini qanday yaratamiz?</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                        Biz firma uslubini ishlab chiqishga tizimli yondashamiz, toki har bir detal brendning tanilishi va uning strategiyasi uchun ishlasin.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {processSteps.map((step, index) => (
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
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Firma uslubi — o'sish vositasi</h2>
                    <p className="mt-4 text-lg text-gray-700">
                        Kuchli aydentikaga ega brendlar tezroq taniladi, uzoq vaqt esda qoladi va ko'proq ishonch uyg'otadi. Biz shunchaki vizual uslub emas, balki brendning o'sishiga, izchil va boshqariladigan bo'lishiga yordam beradigan vosita yaratamiz.
                    </p>
                </div>
            </div>
        </section>
        </main>
        <ServiceSections />
    </>
  );
};

export default FirmenniyStilPage;
