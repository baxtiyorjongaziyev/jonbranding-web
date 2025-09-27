'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Search, ShieldCheck, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import TrademarkCalculator from '@/components/sections/trademark-calculator';
import { Separator } from '@/components/ui/separator';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});


const t = {
    uz: {
        title: "Neyming — Kuchli Brend Nomi",
        subtitle: "Brend nomi — bu u haqidagi birinchi taassurot, uning energiyasi, xarakteri va so'zda ifodalangan g'oyasi. Yaxshi nom shunchaki chiroyli eshitilmaydi, u mohiyatni yetkazadi, esda qoladi va brendning raqobatchilar orasida ajralib turishiga yordam beradi.",
        section1_title: "Nomi brend strategiyasining bir qismidir",
        section1_p1: "Yaxshi nom assotsiatsiyalarni, tanilishni va hissiy aloqani qo'llab-quvvatlaydi. Bunday nomni yaratish — bu strategik ish bo'lib, unda brendning pozitsiyasi, bozor, maqsadli auditoriya va kompaniyaning uzoq muddatli maqsadlari hisobga olinadi.",
        section1_p2: "Biz neymingga brendingning muhim elementi sifatida yondashamiz. Bu tasodifiy g'oyalar to'plami emas, balki har bir so'z ma'noga ega bo'lgan puxta o'ylangan ishdir.",
        section2_title: "Har bir kuchli nom g'oyadan boshlanadi",
        section2_p1: "Nom izlashdan oldin, biz asosiy savolni beramiz: bu brend nima haqida? Qanday his-tuyg'ular va obrazlarni uyg'otishi kerak? Shuning uchun biz mahsulotni, uning auditoriyasini va muhitini diqqat bilan tahlil qilamiz, ideal nomni izlash uchun ma'noviy yo'nalishlarni aniqlaymiz.",
        section2_p2: "U hissiyot, metafora, madaniy kod, professional til yoki hatto so'z o'yiniga qurilishi mumkin. Asosiysi — u ishlashi, mohiyatni yetkazishi va brendning esda qolishiga yordam berishi kerak.",
        process_title: "Nomni qanday yaratamiz?",
        process_subtitle: "Agentligimizda neyming ishlab chiqish — har bir bosqichi muhim bo'lgan aniq jarayondir:",
        process_steps: [
            { icon: Search, title: "Tadqiqot", description: "Bozorni, auditoriyani, raqobatchilarni va ma'noviy yo'nalishlarni o'rganamiz." },
            { icon: Lightbulb, title: "Konsepsiyalarni shakllantirish", description: "Nom izlash uchun mumkin bo'lgan vektorlarni aniqlaymiz." },
            { icon: CheckCircle, title: "G'oyalarni yaratish va sinovdan o'tkazish", description: "Variantlar ro'yxatini tuzamiz, ohangini, ma'nosini va salohiyatini sinab ko'ramiz." },
            { icon: ShieldCheck, title: "Tekshirish va yakunlash", description: "Ro'yxatdan o'tkazish imkoniyatini tahlil qilamiz, domen va assotsiatsiyalarni tekshiramiz va eng yaxshilarini tanlaymiz." }
        ],
        check_title: "Nomni tekshirish — yaratishdan kam emas",
        check_subtitle: "Daho g'oya ham, agar uni ro'yxatdan o'tkazish imkoni bo'lmasa yoki nomaqbul assotsiatsiyalarga ega bo'lsa, ishlamaydi. Biz nomlarni bir nechta asosiy parametrlar bo'yicha tekshiramiz:",
        check_points: [
            { title: "Huquqiy tozalik", description: "Tovar belgisi ro'yxatdan o'tkazish imkoniyatini tahlil qilamiz." },
            { title: "Domenlar va raqamli muhit", description: "Raqamli muhitda nomlarning mavjudligini tekshiramiz." },
            { title: "Ma'no va assotsiatsiyalar", description: "O'qilishi, ohangi, mumkin bo'lgan assotsiativ qator, madaniy idrok va brend toifasiga muvofiqligini tekshiramiz." }
        ],
        calculator_title: "Tovar Belgisi Xarajatlari",
        calculator_subtitle: "Neyming (nom tanlash) — ijodiy jarayon, Patentlash esa — yuridik. Jamoamizdagi patent mutaxassisi yordamida tovar belgisini ro'yxatdan o'tkazish bilan bog'liq barcha xarajatlarni (davlat bojlari va xizmat haqi) shu yerda taxminan hisoblang.",
    },
    ru: {
        title: "Нейминг — Сильное имя бренда",
        subtitle: "Имя бренда — это первое впечатление о нем, его энергия, характер и идея, выраженная в слове. Хорошее имя не просто красиво звучит, оно передает суть, запоминается и помогает бренду выделиться среди конкурентов.",
        section1_title: "Имя — часть бренд-стратегии",
        section1_p1: "Хорошее имя поддерживает ассоциации, узнаваемость и эмоциональную связь. Создание такого имени — это стратегическая работа, в которой учитывается позиционирование бренда, рынок, целевая аудитория и долгосрочные цели компании.",
        section1_p2: "Мы подходим к неймингу как к важному элементу брендинга. Это не случайный набор идей, а продуманная работа, где каждое слово имеет значение.",
        section2_title: "Каждое сильное имя начинается с идеи",
        section2_p1: "Прежде чем искать имя, мы задаем главный вопрос: о чем этот бренд? Какие чувства и образы он должен вызывать? Поэтому мы тщательно анализируем продукт, его аудиторию и среду, определяем смысловые направления для поиска идеального имени.",
        section2_p2: "Оно может быть построено на эмоции, метафоре, культурном коде, профессиональном языке или даже игре слов. Главное — чтобы оно работало, передавало суть и помогало бренду запомниться.",
        process_title: "Как мы создаем имя?",
        process_subtitle: "В нашем агентстве разработка нейминга — это четкий процесс, где важен каждый этап:",
        process_steps: [
            { icon: Search, title: "Исследование", description: "Изучаем рынок, аудиторию, конкурентов и смысловые направления." },
            { icon: Lightbulb, title: "Формирование концепций", description: "Определяем возможные векторы для поиска имени." },
            { icon: CheckCircle, title: "Генерация и тестирование идей", description: "Составляем список вариантов, проверяем их на звучание, смысл и потенциал." },
            { icon: ShieldCheck, title: "Проверка и финализация", description: "Анализируем возможность регистрации, проверяем домены и ассоциации и выбираем лучшие." }
        ],
        check_title: "Проверка имени — не менее важна, чем создание",
        check_subtitle: "Даже гениальная идея не сработает, если ее невозможно зарегистрировать или она имеет нежелательные ассоциации. Мы проверяем имена по нескольким ключевым параметрам:",
        check_points: [
            { title: "Юридическая чистота", description: "Анализируем возможность регистрации товарного знака." },
            { title: "Домены и цифровая среда", description: "Проверяем доступность имен в цифровой среде." },
            { title: "Смысл и ассоциации", description: "Проверяем читаемость, звучание, возможный ассоциативный ряд, культурное восприятие и соответствие категории бренда." }
        ],
        calculator_title: "Расходы на товарный знак",
        calculator_subtitle: "Нейминг (выбор имени) — творческий процесс, а патентование — юридический. С помощью патентного специалиста в нашей команде рассчитайте здесь примерные расходы, связанные с регистрацией товарного знака (госпошлины и плата за услуги).",
    }
}


const NamingPage: FC<{ params: { lang: string } }> = ({ params }) => {
  const { lang } = params;
  
  const translations = lang === 'ru' ? t.ru : t.uz;
  const creationSteps = translations.process_steps;
  const checkPoints = translations.check_points;

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
                                src="https://img3.teletype.in/files/ae/08/ae08ba83-e433-45a6-8518-9e9973256316.png"
                                width={800}
                                height={600}
                                data-ai-hint="strategy naming board"
                                alt="Brainstorming session for a brand name"
                                className="rounded-2xl object-cover aspect-square"/>
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
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.section2_title}</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                            <p>{translations.section2_p1}</p>
                            <p>{translations.section2_p2}</p>
                        </div>
                    </div>
                    <div>
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-0">
                            <Image 
                                src="https://img4.teletype.in/files/b0/93/b093f7f9-cc7f-49dc-b2d7-88bd2e2fe29b.png"
                                width={800}
                                height={600}
                                data-ai-hint="idea lightbulb"
                                alt="Lightbulb representing a new idea"
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
                    <h2 className="text-3xl sm:text-4xl font-bold">{translations.process_title}</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                       {translations.process_subtitle}
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
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.check_title}</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                        {translations.check_subtitle}
                    </p>
                </div>
                <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {checkPoints.map((point, index) => (
                        <Card key={index} className="bg-secondary/50 p-6 rounded-xl">
                            <h4 className="font-bold">{point.title}</h4>
                            <p className="text-gray-600 mt-1">{point.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24 bg-secondary">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.calculator_title}</h2>
                  <p className="mt-4 text-lg text-gray-700">
                     {translations.calculator_subtitle}
                  </p>
              </div>
              <Separator className="my-12" />
              <TrademarkCalculator lang={lang} />
          </div>
        </section>

        </main>
        <ServiceSections lang={lang} />
    </>
  );
};

export default NamingPage;
