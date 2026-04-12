'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Palette, Box } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import ServiceProcessHorizontal from '@/components/sections/service-process-horizontal';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

interface PackagingClientProps {
  lang: string;
  translations: any;
}

const PackagingClient: FC<PackagingClientProps> = ({ lang, translations }) => {
  if (!translations) {
    return <main className="flex-grow pt-20"><Skeleton className="w-full h-screen" /></main>;
  }

  const processSteps = [
      { iconName: 'Search', ...translations.process_steps[0] },
      { iconName: 'Palette', ...translations.process_steps[1] },
      { iconName: 'Box', ...translations.process_steps[2] }
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
                                src="/images/cms/packaging-shelf.png"
                                width={800}
                                height={600}
                                data-ai-hint="product packaging shelf"
                                alt="Mahsulot qadoq dizayni va javondagi ko'rinishi"
                                className="w-full h-auto object-cover"
                                priority
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
        <ServiceSections lang={lang} />
        </main>
    </>
  );
};

export default PackagingClient;
