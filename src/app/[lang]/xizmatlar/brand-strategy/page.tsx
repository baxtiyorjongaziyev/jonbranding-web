
'use client';

import { FC, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Search, Target, Pencil, Send } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { useParams } from 'next/navigation';
import WhyUs from '@/components/sections/why-us';
import ServiceProcessHorizontal from '@/components/sections/service-process-horizontal';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const BrandStrategyPage: FC = () => {
  const params = useParams();
  const lang = params.lang as string;
  const [translations, setTranslations] = useState<any>(null);
  const [fullDictionary, setFullDictionary] = useState<any>(null);

  useEffect(() => {
    if (lang) {
      getDictionary(lang as Locale).then(dict => {
        setFullDictionary(dict);
        setTranslations(dict.brandStrategyPage);
      });
    }
  }, [lang]);

  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };
  
  if (!translations) {
    return <main className="flex-grow pt-20"><Skeleton className="w-full h-screen" /></main>;
  }

  const processSteps = [
    { iconName: 'Search', ...translations.process_steps[0] },
    { iconName: 'Target', ...translations.process_steps[1] },
    { iconName: 'FileText', ...translations.process_steps[2] },
    { iconName: 'Pencil', ...translations.process_steps[3] },
    { iconName: 'Send', ...translations.process_steps[4] }
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
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.section2_title}</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                            <p>{translations.section2_p1}</p>
                            <p><span className="font-bold text-dark-blue">{translations.section2_p2_bold}</span> {translations.section2_p2_text}</p>
                            <p><span className="font-bold text-dark-blue">{translations.section2_p3_bold}</span> {translations.section2_p3_text}</p>
                            <p className="font-bold text-dark-blue">{translations.section2_p4}</p>
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

        <ServiceProcessHorizontal
            title={translations.process_title}
            subtitle={translations.process_subtitle}
            steps={processSteps}
        />
        <WhyUs onCtaClick={handleOpenModal} lang={lang} dictionary={fullDictionary?.whyUs} />
        <ServiceSections lang={lang} dictionary={fullDictionary?.serviceSections} />
        </main>
    </>
  );
};

export default BrandStrategyPage;
