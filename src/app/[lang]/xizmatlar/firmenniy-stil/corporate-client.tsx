'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import ServiceProcessHorizontal from '@/components/sections/service-process-horizontal';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const PickTwoSelector = dynamic(() => import('@/components/sections/pick-two-selector'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

interface CorporateClientProps {
  lang: string;
  translations: any;
}

const CorporateClient: FC<CorporateClientProps> = ({ lang, translations }) => {
  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };
  
  if (!translations) {
    return <main className="flex-grow pt-20"><Skeleton className="w-full h-screen" /></main>;
  }

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
                                    src="/images/cms/corporate-identity.jpeg"
                                    alt="Brendning yaxlit vizual aydentikasi"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                    data-ai-hint="brandbook design"
                                    priority
                                />
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
                        <Card className="shadow-xl rounded-2xl overflow-hidden border-none">
                            <CardContent className="p-0">
                                <Image 
                                    src="/images/cms/corporate-process.png"
                                    alt="Firma uslubi va korporativ aydentika tizimi"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                    data-ai-hint="corporate identity"
                                />
                            </CardContent>
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

        <ServiceSections lang={lang} />
        </main>
    </>
  );
};

export default CorporateClient;
