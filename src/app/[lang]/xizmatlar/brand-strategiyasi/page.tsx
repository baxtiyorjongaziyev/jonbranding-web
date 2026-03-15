'use server';

import { getDictionary, Locale } from '@/lib/dictionaries';
import WhyUs from '@/components/sections/why-us';
import ServiceSections from '@/components/sections/service-sections';
import { Search, Target, FileText, Pencil, Send } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface BrandStrategyPageProps {
  params: Promise<{ lang: string }>;
}

const BrandStrategyPage = async (props: BrandStrategyPageProps) => {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const translations = dictionary.brandStrategyPage;

  if (!translations) {
    return <main className="flex-grow pt-20 text-center">Tarjima ma'lumotlari topilmadi.</main>;
  }

  const icons = [Search, Target, FileText, Pencil, Send];
  const processSteps = (translations.process_steps || []).map((step: any, index: number) => ({
    ...step,
    icon: icons[index] || Search
  }));

  return (
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
              <Card className="shadow-xl rounded-2xl overflow-hidden border-none">
                <CardContent className="p-0">
                  <Image 
                    src="https://img2.teletype.in/files/d3/40/d3406311-28bc-4c55-bf19-19aa3f17e306.png"
                    alt="Business growth strategy chart"
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"/>
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
              <Card className="shadow-xl rounded-2xl overflow-hidden border-none">
                <Image 
                  src="https://img4.teletype.in/files/bd/d7/bdd7f837-5be9-47eb-9a9e-43dafefe5a17.png"
                  alt="Startup team brainstorming brand strategy"
                  width={800}
                  height={600}
                  data-ai-hint="startup team meeting"
                  className="w-full h-auto object-cover aspect-square"/>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.process_title}</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
              {translations.process_subtitle}
            </p>
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            {processSteps.map((step: any, index: number) => (
              <Card key={index} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] text-center shadow-lg rounded-2xl bg-white transform hover:-translate-y-2 transition-transform duration-300 border-none">
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
      
      <WhyUs lang={lang} />
      <ServiceSections lang={lang} />
    </main>
  );
};

export default BrandStrategyPage;
