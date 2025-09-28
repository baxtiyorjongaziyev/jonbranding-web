
'use client';

import { FC, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Search, ShieldCheck, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import TrademarkCalculator from '@/components/sections/trademark-calculator';
import { Separator } from '@/components/ui/separator';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { useParams } from 'next/navigation';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const NamingPage: FC = () => {
  const params = useParams();
  const lang = params.lang as string;
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    if (lang) {
      getDictionary(lang as Locale).then(dict => setTranslations(dict.namingPage));
    }
  }, [lang]);
  
  if (!translations) {
    return <main className="flex-grow pt-20"><Skeleton className="w-full h-screen" /></main>;
  }

  const creationSteps = [
      { icon: Search, ...translations.process_steps[0] },
      { icon: Lightbulb, ...translations.process_steps[1] },
      { icon: CheckCircle, ...translations.process_steps[2] },
      { icon: ShieldCheck, ...translations.process_steps[3] }
  ];
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
                    {checkPoints.map((point: any, index: number) => (
                        <Card key={index} className="bg-secondary/50 p-6 rounded-xl">
                            <h4 className="font-bold">{point.title}</h4>
                            <p className="text-gray-600 mt-1">{point.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <section id="patent-calculator" className="py-16 sm:py-24 bg-secondary">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.calculator_title}</h2>
                  <p className="mt-4 text-lg text-gray-700">
                     {translations.calculator_subtitle}
                  </p>
              </div>
              <Separator className="my-12" />
              <TrademarkCalculator translations={translations.trademarkCalculator} />
          </div>
        </section>

        </main>
        <ServiceSections lang={lang} />
    </>
  );
};

export default NamingPage;
