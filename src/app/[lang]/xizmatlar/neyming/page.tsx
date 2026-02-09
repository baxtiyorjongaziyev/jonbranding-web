
'use client';

import { FC, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Search, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const NamingPage: FC = () => {
  const params = useParams();
  const lang = params.lang as string;
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    if (lang) {
      getDictionary(lang as Locale).then(dict => {
          if (dict && dict.namingPage) {
              setTranslations(dict.namingPage);
          }
      });
    }
  }, [lang]);
  
  if (!translations || !translations.process_steps) {
    return <main className="flex-grow pt-20"><Skeleton className="w-full h-screen" /></main>;
  }

  const creationSteps = [
      { icon: Search, ...(translations.process_steps[0] || { title: '', description: '' }) },
      { icon: Lightbulb, ...(translations.process_steps[1] || { title: '', description: '' }) },
      { icon: CheckCircle, ...(translations.process_steps[2] || { title: '', description: '' }) },
      { icon: ShieldCheck, ...(translations.process_steps[3] || { title: '', description: '' }) }
  ];
  const checkPoints = translations.check_points || [];

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
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Neyming — bu faqat chiroyli jarang emas</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                            <p>Yaxshi nom brendning mohiyatini yetkazadi, mijozlar ongida mustahkam o'rnashib oladi va biznesingizning bozordagi o'rnini belgilaydi.</p>
                            <p>Biz neymingni shunchaki ijodiy jarayon deb emas, balki brend strategiyasining ajralmas qismi deb bilamiz.</p>
                        </div>
                    </div>
                    <div className="lg:order-last">
                        <Card className="shadow-xl rounded-2xl overflow-hidden">
                            <Image 
                                src="https://img3.teletype.in/files/ae/08/ae08ba83-e433-45a6-8518-9e9973256316.png"
                                width={800}
                                height={600}
                                alt="Brainstorming session"
                                className="w-full h-auto object-cover aspect-square"/>
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
                    {checkPoints.map((point: any, index: number) => (
                        <Card key={index} className="bg-secondary/50 p-6 rounded-xl">
                            <h4 className="font-bold">{point.title}</h4>
                            <p className="text-gray-600 mt-1">{point.description}</p>
                        </Card>
                    ))}
                </div>
                 <div className="mt-12 text-center">
                    <Button asChild size="lg">
                        <Link href={`/${lang}/xizmatlar/patent-kalkulyatori`}>
                            {translations.calculator_cta_button}
                            <ArrowRight className="ml-2 h-5 w-5"/>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

        <ServiceSections lang={lang} />
        </main>
    </>
  );
};

export default NamingPage;
