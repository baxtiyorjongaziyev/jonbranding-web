'use client';

import { FC, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Search, Target, Pencil, Send } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary, Locale } from '@/lib/dictionaries';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const WhyUs = dynamic(() => import('@/components/sections/why-us'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const BrandStrategyPage: FC<{ params: { lang: string } }> = ({ params }) => {
  const { lang } = params;
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    getDictionary(lang as Locale).then(dict => setTranslations(dict.brandStrategyPage));
  }, [lang]);

  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };
  
  if (!translations) {
    return <main className="flex-grow pt-20"><Skeleton className="w-full h-screen" /></main>;
  }

  const processSteps = [
    { icon: Search, ...translations.process_steps[0] },
    { icon: Target, ...translations.process_steps[1] },
    { icon: FileText, ...translations.process_steps[2] },
    { icon: Pencil, ...translations.process_steps[3] },
    { icon: Send, ...translations.process_steps[4] }
  ];

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
                        <p className="font-bold text-dark-blue">{translations.section1_p3}</p>
                        </div>
                    </div>
                    <div className="lg:order-last">
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-0">
                            <Image 
                                src="https://img2.teletype.in/files/d3/40/d3406311-28bc-4c55-bf19-19aa3f17e306.png"
                                alt="Business growth strategy chart"
                                width={800}
                                height={600}
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
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.section2_title || "Brend-strategiya har qanday biznesga kerak"}</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                            <p>{"Brend strategiyasi ham yangi, ham uzoq vaqtdan beri mavjud bo'lgan kompaniyalarga kerak."}</p>
                            <p><span className="font-bold text-dark-blue">{"Startaplarga"}</span> {"u boshidanoq o'z missiyasi, qadriyatlari va o'ziga xosligini aniqlashga, bozorda kerakli o'rinni egallashga va mijozlarni jalb qilishga yordam beradi."}</p>
                            <p><span className="font-bold text-dark-blue">{"Yirik kompaniyalar uchun"}</span> {"strategiya — bu o'sish va obro'ni boshqarish vositasidir. Bunday holda u dolzarblikni saqlashga, o'zgarishlarga moslashishga va auditoriya bilan mustahkam munosabatlar o'rnatishga yordam beradi."}</p>
                            <p className="font-bold text-dark-blue">{"Biznes hajmidan qat'i nazar, brend-strategiya asosiy savolga javob beradi: mijoz nima uchun aynan sizni tanlashi kerak?"}</p>
                        </div>
                    </div>
                    <div>
                        <Card className="shadow-xl rounded-2xl overflow-hidden">
                           <Image 
                                src="https://img4.teletype.in/files/bd/d7/bdd7f837-5be9-47eb-9a9e-43dafefe5a17.png"
                                alt="Startup team brainstorming brand strategy"
                                width={800}
                                height={600}
                                data-ai-hint="startup team meeting"
                                className="object-cover aspect-square"/>
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
                <div className="mt-16 flex flex-wrap justify-center gap-8">
                    {processSteps.map((step, index) => (
                    <Card key={index} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] text-center shadow-lg rounded-2xl bg-white transform hover:-translate-y-2 transition-transform duration-300">
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
        <WhyUs onCtaClick={handleOpenModal} lang={lang} />
        </main>
        <ServiceSections lang={lang} />
    </>
  );
};

export default BrandStrategyPage;
