
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, X, Minus, Info } from 'lucide-react';
import CtaBlock from './cta-block';
import { comparisonData } from '@/lib/pricing';
import { Logo } from '../icons/logo';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useEffect, useState, useCallback } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const competitors = [
    { id: 'jon', name: 'Jon.Branding', isPrimary: true },
    { id: 'mano', name: 'Ma\'no Branding' },
    { id: 'abba', name: 'Abba Marketing' },
    { id: 'mountain', name: 'Mountain' },
];

const renderCompetitorValue = (value: string | boolean | null) => {
    if (typeof value === 'boolean') {
        return value ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />;
    }
    if (value === null) {
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
    return <span className="font-semibold text-gray-800 text-sm">{value}</span>;
}


interface ComparisonProps {
  onCtaClick: () => void;
  lang: string;
}

const Comparison: React.FC<ComparisonProps> = ({ onCtaClick, lang }) => {
    const [translations, setTranslations] = useState<any>(null);

    useEffect(() => {
        getDictionary(lang as Locale).then(dict => setTranslations(dict.servicesPage.comparison));
    }, [lang]);

  if (!translations) {
      return null;
  }
  const cData = comparisonData(lang as 'uz' | 'ru' | 'en');

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
            <p className="mt-4 text-lg text-gray-700">
                {translations.description}
            </p>
        </div>
        
        {/* Desktop View */}
        <div className="mt-12 max-w-6xl mx-auto hidden md:block">
          <Card className="rounded-2xl shadow-xl border-2 border-primary/20 overflow-hidden">
            <div className="grid grid-cols-5 bg-secondary/50">
              <div className="col-span-1 p-4 font-bold text-sm sm:text-lg text-dark-blue border-r border-gray-200 flex items-center">{translations.features}</div>
              {competitors.map(c => (
                 <div key={c.id} className={cn("col-span-1 p-4 text-center font-bold text-sm sm:text-lg", c.isPrimary ? 'text-primary' : 'text-dark-blue')}>
                   {c.id === 'jon' ? <Logo /> : c.name}
                 </div>
              ))}
            </div>
            
            <div className="divide-y divide-gray-200">
              {cData.map((item, index) => (
                <div key={index} className="grid grid-cols-5 items-center">
                  <div className="col-span-1 p-4 font-medium text-gray-800 border-r border-gray-200 text-sm sm:text-base">{item.feature}</div>
                  {competitors.map(c => (
                      <div key={c.id} className={cn(
                        "col-span-1 p-4 text-center flex justify-center items-center h-full",
                        c.isPrimary && "bg-primary/5 font-bold text-primary"
                      )}>
                       {renderCompetitorValue(item.competitors[c.id as keyof typeof item.competitors])}
                      </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Mobile View */}
        <div className="mt-12 max-w-3xl mx-auto md:hidden">
            <Accordion type="single" collapsible defaultValue='item-0' className="w-full space-y-4">
                {competitors.map((competitor, index) => (
                     <AccordionItem key={competitor.id} value={`item-${index}`} className="border rounded-2xl shadow-sm bg-secondary/70 px-6 hover:bg-secondary transition-colors duration-300 data-[state=open]:bg-white data-[state=open]:shadow-lg">
                        <AccordionTrigger className={cn("text-left font-bold text-dark-blue hover:no-underline text-xl", competitor.isPrimary && "text-primary")}>
                            {competitor.id === 'jon' ? <Logo /> : competitor.name}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 text-base">
                           <div className="space-y-4">
                            {cData.map(item => (
                                <div key={item.feature} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                    <span className="font-medium text-gray-700">{item.feature}</span>
                                    {renderCompetitorValue(item.competitors[competitor.id as keyof typeof item.competitors])}
                                </div>
                            ))}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>

        <div className="mt-10 max-w-3xl mx-auto">
            <Card className="bg-sky-blue/30 border-primary/20 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full mt-1">
                        <Info className="h-6 w-6" />
                    </div>
                    <div>
                         <h4 className="font-bold text-dark-blue">{translations.whyPremiumTitle}</h4>
                         <p className="text-base text-dark-blue/80 mt-1">
                             {translations.whyPremiumDesc}
                         </p>
                    </div>
                </div>
            </Card>
        </div>
      </div>
      
       <section className="bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-gradient-to-br from-dark-blue to-primary p-8 sm:p-12 text-center text-white shadow-xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">{translations.ctaTitle}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-200">
                {translations.ctaDesc}
              </p>
              <div className="mt-8">
                <Button
                  onClick={onCtaClick}
                  size="lg"
                  variant="default"
                  className="text-white shadow-lg text-base sm:text-lg h-auto py-3 px-6 whitespace-normal w-full sm:w-auto"
                >
                  {translations.ctaButton}
                  <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                </Button>
              </div>
            </div>
          </div>
        </section>
    </section>
  );
};

export default Comparison;
