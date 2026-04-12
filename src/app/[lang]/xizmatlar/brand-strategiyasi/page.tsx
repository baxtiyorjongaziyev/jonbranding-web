import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import WhyUs from '@/components/sections/why-us';
import ServiceProcessHorizontal from '@/components/sections/service-process-horizontal';
import ServiceSections from '@/components/sections/service-sections';
import { Search, Target, FileText, Pencil, Send } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  params: { lang: Locale };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  const metadata = dictionary.brandStrategyPage?.metadata;

  return {
    title: metadata?.title || "Brend Strategiyasi | Jon.Branding",
    description: metadata?.description || "Biznesingiz poydevori uchun professional brend strategiyasi.",
    keywords: metadata?.keywords || "brend strategiya, pozitsiyalash, bozor tahlili, branding",
  };
}

const BrandStrategyPage = async (props: Props) => {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  const translations = dictionary.brandStrategyPage;

  if (!translations) {
    return <main className="flex-grow pt-20 text-center">Tarjima ma'lumotlari topilmadi.</main>;
  }

  const iconNames = ['Search', 'Target', 'FileText', 'Pencil', 'Send'];
  const processSteps = (translations.process_steps || []).map((step: any, index: number) => ({
    ...step,
    iconName: iconNames[index] || 'Search'
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
                    src="/images/cms/brand-strategy-chart.png"
                    alt="Business growth strategy chart"
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
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
                  src="/images/cms/brand-strategy-team.png"
                  alt="Startup team brainstorming brand strategy"
                  width={800}
                  height={600}
                  data-ai-hint="startup team meeting"
                  className="w-full h-auto object-cover aspect-square"
                />
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
      
      <WhyUs lang={lang} dictionary={dictionary.whyUs} />
      <ServiceSections lang={lang} dictionary={dictionary.serviceSections} />
    </main>
  );
};

export default BrandStrategyPage;
