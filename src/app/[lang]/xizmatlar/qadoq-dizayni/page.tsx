'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Palette, Box } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const t = {
    uz: {
        title: "Qadoq Dizaynini Ishlab Chiqish",
        subtitle: "Yuqori raqobat sharoitida qadoq ko'pincha asosiy marketing vositasiga aylanadi. U brendni peshtaxtada ajratib ko'rsatadi, uning tarixini so'zlab beradi va bir qarashdayoq auditoriya bilan aloqa o'rnatadi.",
        section1_title: "Qadoq — brend kimligini tashuvchidan ko'ra ko'proq narsa",
        section1_p1: "Qadoq — bu savdo nuqtalarida brend bilan birinchi aloqa, mahsulot haqida bir zumda tasavvur hosil qiluvchi vizual murojaatdir. Ko'p hollarda aynan qadoq odamning xarid qilish yoki qilmaslik qarorini belgilaydi.",
        section1_p2: "Agentligimizning maqsadi — shunchaki estetik va chiroyli qadoq yaratish emas, balki biznes vazifalariga javob beradigan va uning o'sishiga yordam beradigan samarali vositani yaratishdir.",
        process_title: "Qadoqni qanday yaratamiz?",
        process_subtitle: "Biz qadoqni ishlab chiqishga alohida dizayn sifatida emas, balki biznes uchun ishlashi va auditoriya kutganlariga mos kelishi kerak bo'lgan kompleks tizim sifatida yondashamiz. Jarayonimiz bir nechta asosiy bosqichlarni o'z ichiga oladi:",
        process_steps: [
            { icon: Search, title: "Tahlil va strategiya", description: "Mahsulotingiz, auditoriya, raqobatchilar va qadoq ishlatiladigan muhitni o'rganamiz. Kategoriyaning vizual kodini tahlil qilamiz." },
            { icon: Palette, title: "Konsepsiya va dizayn", description: "To'plangan ma'lumotlar asosida mahsulot mohiyatini aks ettiruvchi vizual g'oyalarni ishlab chiqamiz: rang, grafika, tipografika va boshqalar." },
            { icon: Box, title: "Yakunlash va tayyorlash", description: "Tanlangan konsepsiyaning barcha texnik jihatlarini (har xil formatlarga moslashtirish, bosmaga tayyorlash) puxta ishlab chiqamiz." }
        ],
        cta_title: "Qadoq shunchaki e'tiborni tortmaydi, balki sotadi",
        cta_description: "Yaxshi qadoq dizayni — bu shunchaki chiroyli bezak emas, balki biznes uchun ishlaydigan vositadir. Biz funksional, strategik jihatdan puxta o'ylangan dizaynni ishlab chiqamiz, bunda qadoq to'laqonli savdo vositasi bo'lib xizmat qiladi.",
    },
    ru: {
        title: "Разработка дизайна упаковки",
        subtitle: "В условиях высокой конкуренции упаковка часто становится ключевым маркетинговым инструментом. Она выделяет бренд на полке, рассказывает его историю и устанавливает контакт с аудиторией с первого взгляда.",
        section1_title: "Упаковка — это больше, чем просто носитель идентичности бренда",
        section1_p1: "Упаковка — это первый контакт с брендом в точках продаж, визуальное обращение, которое мгновенно создает представление о продукте. Во многих случаях именно упаковка определяет решение человека о покупке.",
        section1_p2: "Цель нашего агентства — не просто создать эстетичную и красивую упаковку, а создать эффективный инструмент, который отвечает бизнес-задачам и способствует его росту.",
        process_title: "Как мы создаем упаковку?",
        process_subtitle: "Мы подходим к разработке упаковки не как к отдельному дизайну, а как к комплексной системе, которая должна работать на бизнес и соответствовать ожиданиям аудитории. Наш процесс включает несколько ключевых этапов:",
        process_steps: [
            { icon: Search, title: "Анализ и стратегия", description: "Изучаем ваш продукт, аудиторию, конкурентов и среду, в которой используется упаковка. Анализируем визуальный код категории." },
            { icon: Palette, title: "Концепция и дизайн", description: "На основе собранных данных разрабатываем визуальные идеи, отражающие суть продукта: цвет, графика, типографика и т.д." },
            { icon: Box, title: "Завершение и подготовка", description: "Тщательно прорабатываем все технические аспекты выбранной концепции (адаптация под разные форматы, подготовка к печати)." }
        ],
        cta_title: "Упаковка не просто привлекает внимание, она продает",
        cta_description: "Хороший дизайн упаковки — это не просто красивое оформление, а работающий на бизнес инструмент. Мы разрабатываем функциональный, стратегически продуманный дизайн, где упаковка служит полноценным инструментом продаж.",
    }
}


const QadoqDizayniPage: FC<{ params: { lang: string } }> = ({ params }) => {
  const { lang } = params;

  const translations = lang === 'ru' ? t.ru : t.uz;
  const processSteps = translations.process_steps;

  return (
    <>
        <main className="flex-grow pt-20">
            <section className="py-20 sm:py-28 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-blue">
                {translations.title}
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-700">
                {translations.subtitle}
                </p>
            </div>
            </section>

        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.section1_title}</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                            <p>{translations.section1_p1}</p>
                            <p>{translations.section1_p2}</p>
                        </div>
                    </div>
                    <div className="lg:order-last">
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-0">
                            <Image 
                                src="https://img1.teletype.in/files/84/db/84dbe512-edc1-4386-a986-29114e8d8be2.png"
                                width={800}
                                height={600}
                                data-ai-hint="product packaging shelf"
                                alt="Products on a store shelf"
                                className="rounded-2xl object-cover"/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold">{translations.process_title}</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                        {translations.process_subtitle}
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
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.cta_title}</h2>
                    <p className="mt-4 text-lg text-gray-700">
                        {translations.cta_description}
                    </p>
                </div>
            </div>
        </section>
        </main>
        <ServiceSections lang={lang} />
    </>
  );
};

export default QadoqDizayniPage;
