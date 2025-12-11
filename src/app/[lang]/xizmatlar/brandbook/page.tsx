
'use client';

import { FC, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Layers, Palette, PenTool, ClipboardCheck, Zap, Gem, Award } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { useParams } from 'next/navigation';
import CtaBlock from '@/components/sections/cta-block';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const BrandbookPage: FC = () => {
  const params = useParams();
  const lang = params.lang as string;
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    if (lang) {
      getDictionary(lang as Locale).then(dict => setTranslations(dict.brandbookPage));
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
      { icon: Layers, ...translations.process_steps[0] },
      { icon: Palette, ...translations.process_steps[1] },
      { icon: PenTool, ...translations.process_steps[2] },
      { icon: ClipboardCheck, ...translations.process_steps[3] }
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
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-0">
                            <Image 
                                src="https://images.unsplash.com/photo-1581080247486-57989c1f14ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxsb2dvJTIwZ3VpZGVsaW5lc3xlbnwwfHx8fDE3NjU0NTA2NTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                width={800}
                                height={600}
                                data-ai-hint="brandbook guide document"
                                alt="Brandbook guide document"
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
                    <h2 className="text-3xl sm:text-4xl font-bold">{translations.values_title}</h2>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <Card key={index} className="text-center p-8 shadow-lg rounded-2xl bg-secondary/50 transform hover:-translate-y-2 transition-transform duration-300">
                           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                                <value.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-blue">{value.title}</h3>
                            <p className="mt-2 text-gray-600">{value.description}</p>
                        </Card>
                    ))}
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

export default BrandbookPage;
