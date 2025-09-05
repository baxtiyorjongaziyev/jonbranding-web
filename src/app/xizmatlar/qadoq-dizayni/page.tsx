
'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Palette, Box, Check, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Parallax from '@/components/parallax-provider';
import ServiceSections from '@/components/sections/service-sections';
import React from 'react';

const processSteps = [
    {
        icon: Search,
        title: "Tahlil va strategiya",
        description: "Mahsulotingiz, auditoriya, raqobatchilar va qadoq ishlatiladigan muhitni o'rganamiz. Kategoriyaning vizual kodini tahlil qilamiz."
    },
    {
        icon: Palette,
        title: "Konsepsiya va dizayn",
        description: "To'plangan ma'lumotlar asosida mahsulot mohiyatini aks ettiruvchi vizual g'oyalarni ishlab chiqamiz: rang, grafika, tipografika va boshqalar."
    },
    {
        icon: Box,
        title: "Yakunlash va tayyorlash",
        description: "Tanlangan konsepsiyaning barcha texnik jihatlarini (har xil formatlarga moslashtirish, bosmaga tayyorlash) puxta ishlab chiqamiz."
    },
];

const QadoqDizayniPage: FC = () => {

  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };

  return (
    <>
        <main className="flex-grow">
        <Parallax speed={0.5}>
            <section className="py-20 sm:py-28 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-blue">
                Qadoq Dizaynini Ishlab Chiqish
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-700">
                Yuqori raqobat sharoitida qadoq ko'pincha asosiy marketing vositasiga aylanadi. U brendni peshtaxtada ajratib ko'rsatadi, uning tarixini so'zlab beradi va bir qarashdayoq auditoriya bilan aloqa o'rnatadi.
                </p>
            </div>
            </section>
        </Parallax>

        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Qadoq — brend kimligini tashuvchidan ko'ra ko'proq narsa</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                        <p>
                            Qadoq — bu savdo nuqtalarida brend bilan birinchi aloqa, mahsulot haqida bir zumda tasavvur hosil qiluvchi vizual murojaatdir. Ko'p hollarda aynan qadoq odamning xarid qilish yoki qilmaslik qarorini belgilaydi.
                        </p>
                        <p>
                            Agentligimizning maqsadi — shunchaki estetik va chiroyli qadoq yaratish emas, balki biznes vazifalariga javob beradigan va uning o'sishiga yordam beradigan samarali vositani yaratishdir.
                        </p>
                        </div>
                    </div>
                    <div className="lg:order-last">
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-0">
                            <Image src="https://picsum.photos/800/610" width={800} height={610} data-ai-hint="product packaging shelf" alt="Do'kon peshtaxtasidagi mahsulotlar" className="rounded-2xl object-cover"/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold">Qadoqni qanday yaratamiz?</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                        Biz qadoqni ishlab chiqishga alohida dizayn sifatida emas, balki biznes uchun ishlashi va auditoriya kutganlariga mos kelishi kerak bo'lgan kompleks tizim sifatida yondashamiz. Jarayonimiz bir nechta asosiy bosqichlarni o'z ichiga oladi:
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {processSteps.map((step, index) => (
                    <Card key={index} className="text-center shadow-lg rounded-2xl bg-secondary/50 transform hover:-translate-y-2 transition-transform duration-300">
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

        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Qadoq shunchaki e'tiborni tortmaydi, balki sotadi</h2>
                    <p className="mt-4 text-lg text-gray-700">
                        Yaxshi qadoq dizayni — bu shunchaki chiroyli bezak emas, balki biznes uchun ishlaydigan vositadir. Biz funksional, strategik jihatdan puxta o'ylangan dizaynni ishlab chiqamiz, bunda qadoq to'laqonli savdo vositasi bo'lib xizmat qiladi.
                    </p>
                </div>
                <div className="mt-10">
                    <Button onClick={handleOpenModal} size="lg" className="text-lg shadow-ocean animate-subtle-pulse whitespace-normal h-auto">
                    Mahsulotim uchun dizayn yaratish <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </section>
        </main>
        <React.Suspense fallback={<div>Loading sections...</div>}>
            <ServiceSections />
        </React.Suspense>
    </>
  );
};

export default QadoqDizayniPage;
