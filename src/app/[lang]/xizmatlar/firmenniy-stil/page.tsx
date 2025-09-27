
'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Palette, PenTool, ClipboardCheck } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const PickTwoSelector = dynamic(() => import('@/components/sections/pick-two-selector'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});


const t = {
    uz: {
        title: "Firma Uslubini Ishlab Chiqish",
        subtitle: "Brendning asosiy elementlaridan biri — uning vizual tarkibiy qismidir. Aynan u g'oyalarni, ma'nolarni va qadriyatlarni ko'rish, his qilish va eslab qolish mumkin bo'lgan obrazlarga aylantiradi.",
        section1_title: "Brendni idrok etish rasmdan boshlanadi",
        section1_p1: "Zamonaviy dunyoda vizual ma'lumotlar matn yoki so'zlarga qaraganda tezroq qabul qilinadi va o'zlashtiriladi. Biz bir zumlik taassurotlar davrida yashayapmiz: odamlarga brend haqida tasavvur hosil qilish uchun bir soniya kifoya qiladi va bu ko'pincha uning vizual obrazi orqali sodir bo'ladi.",
        section1_p2: "G'oyaning auditoriya ongida mustahkamlanishi uchun u haqida shunchaki aytib berishning o'zi kamlik qiladi — uni vizual elementlar bilan kuchaytirish muhimdir. Savodli ishlab chiqilgan firma uslubi brend qadriyatlarini ortiqcha tushuntirishlarsiz namoyon etishga, kerakli hissiyot va assotsiatsiyalarni bir zumda uyg'otishga imkon beradi.",
        section2_title: "Firma uslubi — bu tizim",
        section2_p1: "Bu shunchaki go'zallik haqida emas, balki samaradorlik, ma'no va nazorat haqida. Brend o'zining vizual obrazini rivojlantirishda ko'p qirrali va izchil bo'lib qolishi uchun grafik elementlar to'plamini yaratish kerak.",
        section2_p2: "Bunday to'plam har doim biznesning vazifalari va imkoniyatlariga qarab individual ravishda tanlanadi. Minimal to'plamga logotip, ranglar, shriftlar, fotosurat uslubi, reklama tashuvchilarining uslubi va yaxlit obrazni yaratadigan boshqa elementlar kiradi.",
        section2_p3: "Vizual uslub aniq va izchil qurilganda, u brend obrazini boshqarish va muloqot qilish uchun kuchli vositaga aylanadi. Uning barcha elementlari bir-biriga mos kelganda, brend professional, ishonchli va taniladigan sifatida qabul qilinadi.",
        process_title: "Firma uslubini qanday yaratamiz?",
        process_subtitle: "Biz firma uslubini ishlab chiqishga tizimli yondashamiz, toki har bir detal brendning tanilishi va uning strategiyasi uchun ishlasin.",
        process_steps: [
            { icon: Layers, title: "Tadqiqot va konsepsiya", description: "Auditoriya, bozor, raqobatchilar va brendning o'rnini tahlil qilamiz. Vizual uslubda aks ettirilishi kerak bo'lgan asosiy ma'no va g'oyalarni aniqlaymiz." },
            { icon: Palette, title: "Vizual kodni ishlab chiqish", description: "Brendning yaxlit obrazini shakllantiradigan logotip, firma ranglari, tipografika, grafika, ikonografiya, maket tamoyillarini yaratamiz." },
            { icon: PenTool, title: "Firma uslubi tizimi", description: "Barcha formatlarda — qadoqdan tortib raqamli muhitgacha — vizual obrazning izchilligini saqlashga yordam beradigan moslashuvchan elementlarni ishlab chiqamiz." },
            { icon: ClipboardCheck, title: "Yakunlash va gaydlayn", description: "Brend har qanday tashuvchida yagona obrazni saqlab qolishi uchun uslubdan foydalanish qoidalari yozilgan gaydlaynni yaratamiz." }
        ],
        cta_title: "Firma uslubi — o'sish vositasi",
        cta_description: "Kuchli aydentikaga ega brendlar tezroq taniladi, uzoq vaqt esda qoladi va ko'proq ishonch uyg'otadi. Biz shunchaki vizual uslub emas, balki brendning o'sishiga, izchil va boshqariladigan bo'lishiga yordam beradigan vosita yaratamiz.",
    },
    ru: {
        title: "Разработка фирменного стиля",
        subtitle: "Один из ключевых элементов бренда — его визуальная составляющая. Именно она превращает идеи, смыслы и ценности в образы, которые можно увидеть, почувствовать и запомнить.",
        section1_title: "Восприятие бренда начинается с картинки",
        section1_p1: "В современном мире визуальная информация воспринимается и усваивается быстрее, чем текст или слова. Мы живем в эпоху мгновенных впечатлений: людям достаточно секунды, чтобы составить представление о бренде, и это часто происходит через его визуальный образ.",
        section1_p2: "Чтобы идея закрепилась в сознании аудитории, недостаточно просто рассказать о ней — важно подкрепить ее визуальными элементами. Грамотно разработанный фирменный стиль позволяет без лишних объяснений демонстрировать ценности бренда, мгновенно вызывать нужные эмоции и ассоциации.",
        section2_title: "Фирменный стиль — это система",
        section2_p1: "Это не просто о красоте, а об эффективности, смысле и контроле. Чтобы бренд оставался многогранным и последовательным в развитии своего визуального образа, необходимо создать набор графических элементов.",
        section2_p2: "Такой набор всегда подбирается индивидуально, в зависимости от задач и возможностей бизнеса. В минимальный набор входят логотип, цвета, шрифты, фотостиль, стиль рекламных носителей и другие элементы, создающие целостный образ.",
        section2_p3: "Когда визуальный стиль построен четко и последовательно, он становится мощным инструментом для управления образом бренда и коммуникации. Когда все его элементы согласованы, бренд воспринимается как профессиональный, надежный и узнаваемый.",
        process_title: "Как мы создаем фирменный стиль?",
        process_subtitle: "Мы подходим к разработке фирменного стиля системно, чтобы каждая деталь работала на узнаваемость бренда и его стратегию.",
        process_steps: [
            { icon: Layers, title: "Исследование и концепция", description: "Анализируем аудиторию, рынок, конкурентов и место бренда. Определяем ключевые смыслы и идеи, которые должны быть отражены в визуальном стиле." },
            { icon: Palette, title: "Разработка визуального кода", description: "Создаем логотип, фирменные цвета, типографику, графику, иконографию, принципы верстки, которые формируют целостный образ бренда." },
            { icon: PenTool, title: "Система фирменного стиля", description: "Разрабатываем гибкие элементы, которые помогают сохранять последовательность визуального образа на всех форматах — от упаковки до цифровой среды." },
            { icon: ClipboardCheck, title: "Завершение и гайдлайн", description: "Создаем гайдлайн с правилами использования стиля, чтобы бренд сохранял единый образ на любом носителе." }
        ],
        cta_title: "Фирменный стиль — инструмент роста",
        cta_description: "Бренды с сильной айдентикой быстрее узнаются, дольше запоминаются и вызывают больше доверия. Мы создаем не просто визуальный стиль, а инструмент, который помогает бренду расти, быть последовательным и управляемым.",
    }
}


const FirmenniyStilPage: FC<{ lang: string }> = ({ lang }) => {

  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };
  
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
        
        <PickTwoSelector onCtaClick={handleOpenModal} lang={lang} />

        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="lg:order-last">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.section2_title}</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                            <p>{translations.section2_p1}</p>
                            <p>{translations.section2_p2}</p>
                            <p className="font-bold text-dark-blue">{translations.section2_p3}</p>
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
                    <h2 className="text-3xl sm:text-4xl font-bold">{translations.process_title}</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                        {translations.process_subtitle}
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

export default FirmenniyStilPage;
