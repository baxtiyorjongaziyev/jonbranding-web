
'use client';

import { Card, CardContent } from '@/components/ui/card';
import CtaBlock from './cta-block';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { projects } from '@/lib/static-data';
import { useEffect, useState } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';

const comparisons = projects.filter(p => p.oldImg && p.newImg);

interface BeforeAfterProps {
  onCtaClick: () => void;
  lang: string;
  dictionary: any;
}

const BeforeAfter: React.FC<BeforeAfterProps> = ({ onCtaClick, lang, dictionary }) => {
  const translations = dictionary;
  
  if (!translations) {
    return null;
  }
  
  return (
    <section className="snap-section py-0 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
          <p className="mt-2 max-w-2xl mx-auto text-base text-gray-700">
            {translations.subtitle}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisons.map((item, index) => (
            <Card key={index} className="overflow-hidden shadow-lg rounded-2xl transform hover:-translate-y-2 transition-transform duration-300">
              <CardContent className="p-0">
                <ImageComparisonSlider 
                  beforeImage={{src: item.oldImg, alt: `${item.brand} old branding`, 'data-ai-hint': item.oldHint}}
                  afterImage={{src: item.newImg, alt: `${item.brand} new branding`, 'data-ai-hint': item.newHint}}
                  lang={lang}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
