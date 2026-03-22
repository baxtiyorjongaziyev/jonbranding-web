
'use client';

import { FC, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Palette, PenTool, ClipboardCheck, Zap, Gem, Award } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { useParams } from 'next/navigation';
import CtaBlock from '@/components/sections/cta-block';
import ServiceProcessHorizontal from '@/components/sections/service-process-horizontal';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const LogoDesignPage: FC = () => {
  const params = useParams();
  const lang = params.lang as string;
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    if (lang) {
      getDictionary(lang as Locale).then(dict => setTranslations(dict.logoDesignPage));
    }
  }, [lang]);

  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };
  
  if (!translations) {
    return <main className="flex-grow pt-20"><Skeleton className="w-full h-screen" /></main>;
  }

  const values = [
      { icon: Zap, ...translations.values[0] },
      { icon: Gem, ...translations.values[1] },
      { icon: Award, ...translations.values[2] },
  ];

  const processSteps = [
      { iconName: 'Layers', ...translations.process_steps[0] },
      { iconName: 'Palette', ...translations.process_steps[1] },
      { iconName: 'PenTool', ...translations.process_steps[2] },
      { iconName: 'ClipboardCheck', ...translations.process_steps[3] }
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
                        </div>
                    </div>
                    <div className="lg:order-last">
                        <Card className="shadow-xl rounded-2xl overflow-hidden border-none">
                            <CardContent className="p-0">
                                <Image 
                                    src="https://img1.teletype.in/files/c1/27/c1276cf1-3338-47ab-a744-193da4049b4d.png"
                                    alt="Professional logotip dizayni jarayoni"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                    data-ai-hint="logo design process"
                                    priority
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold">{translations.values_title}</h2>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <Card key={index} className="text-center p-8 shadow-lg rounded-2xl bg-secondary/50 transform hover:-translate-y-2 transition-transform duration-300 border-none">
                           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                                <value.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-blue">{value.title}</h3>
                            <p className="mt-2 text-gray-600">{value.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <ServiceProcessHorizontal
            title={translations.process_title}
            subtitle={translations.process_subtitle}
            steps={processSteps}
        />

        <CtaBlock 
            title={translations.cta_title}
            description={translations.cta_description}
            buttonText={translations.cta_button}
            onCtaClick={handleOpenModal}
        />
        <ServiceSections lang={lang} />
        </main>
    </>
  );
};

export default LogoDesignPage;
