'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, ListChecks, Star } from 'lucide-react';
import CtaBlock from './cta-block';
import TiltCard from '@/components/ui/tilt-card';
import { FC, useEffect, useState } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';


interface WhyUsProps {
  onCtaClick?: () => void;
  lang: string;
  dictionary: any;
}


const WhyUs: FC<WhyUsProps> = ({ onCtaClick, lang, dictionary }) => {
  const translations = dictionary;
  
  if (!translations) {
    return null;
  }

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const event = new CustomEvent('openContactModal');
      window.dispatchEvent(event);
    }
  };
  
  const values = [
      { icon: Target, ...translations.values[0] },
      { icon: ListChecks, ...translations.values[1] },
      { icon: Star, ...translations.values[2] }
  ];
  
  return (
    <>
    <section className="snap-section py-0 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            {translations.subtitle}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
             <TiltCard key={index} strength={10}>
                <Card className="bg-secondary/50 shadow-lg hover:shadow-xl transition-shadow rounded-2xl h-full">
                  <CardHeader className="items-center text-center">
                    <div className="bg-primary/10 p-4 rounded-full">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="!mt-4 text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
    <CtaBlock 
        title={translations.ctaTitle}
        description={translations.ctaDesc}
        buttonText={translations.ctaButton}
        onCtaClick={handleCta}
      />
    </>
  );
};

export default WhyUs;
