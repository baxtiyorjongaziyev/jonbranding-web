
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Minus, Info } from 'lucide-react';
import { comparisonData } from '@/lib/pricing';
import { Logo } from '../icons/logo';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useEffect, useState } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import CtaBlock from './cta-block';

const competitors = [
    { id: 'jon', name: 'Jon.Branding', isPrimary: true },
    { id: 'mano', name: 'Ma\'no Branding' },
    { id: 'abba', name: 'Abba Marketing' },
    { id: 'mountain', name: 'Mountain' },
];

const renderCompetitorValue = (value: string | boolean | null) => {
    if (typeof value === 'boolean') {
        return value ? <Check className="w-6 h-6 text-emerald-500" /> : <X className="w-6 h-6 text-rose-400" />;
    }
    if (value === null) {
        return <Minus className="w-6 h-6 text-slate-300" />;
    }
    return <span className="font-bold text-slate-900 text-base">{value}</span>;
}

interface ComparisonProps {
  onCtaClick: () => void;
  lang: string;
  dictionary: any;
}

const Comparison: React.FC<ComparisonProps> = ({ onCtaClick, lang, dictionary }) => {
    const translations = dictionary;

  if (!translations) {
      return null;
  }
  const cData = comparisonData(lang as 'uz' | 'ru' | 'en' | 'zh');

  return (
    <section className="py-16 sm:py-24 bg-white" suppressHydrationWarning>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-dark-blue tracking-tight">{translations.title}</h2>
            <p className="mt-4 text-lg text-slate-600 font-medium">
                {translations.description}
            </p>
        </div>
        
        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden bg-white">
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] bg-slate-50/50 border-b border-slate-100">
              <div className="p-6 font-black text-lg text-dark-blue flex items-center">{translations.features}</div>
              {competitors.map(c => (
                 <div key={c.id} className={cn(
                    "p-6 text-center font-black text-lg flex items-center justify-center",
                    c.isPrimary ? "text-primary bg-blue-50/30" : "text-dark-blue"
                 )}>
                   {c.id === 'jon' ? (
                     <div className="flex flex-col items-center">
                        <Logo className="scale-110" />
                     </div>
                   ) : c.name}
                 </div>
              ))}
            </div>
            
            <div className="divide-y divide-slate-50">
              {cData.map((item, index) => (
                <div key={index} className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] items-stretch min-h-[80px]">
                  <div className="p-6 font-bold text-slate-700 flex items-center bg-white">{item.feature}</div>
                  {competitors.map(c => (
                      <div key={c.id} className={cn(
                        "p-6 text-center flex justify-center items-center h-full",
                        c.isPrimary && "bg-blue-50/30 font-black text-primary"
                      )}>
                       {renderCompetitorValue(item.competitors[c.id as keyof typeof item.competitors])}
                      </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="mt-8 lg:hidden">
            <Accordion type="single" collapsible defaultValue='item-0' className="space-y-4">
                {competitors.map((competitor, index) => (
                     <AccordionItem key={competitor.id} value={`item-${index}`} className="border rounded-[1.5rem] shadow-sm bg-slate-50/50 px-6 hover:bg-white transition-all duration-300 data-[state=open]:bg-white data-[state=open]:shadow-xl border-slate-100">
                        <AccordionTrigger className={cn("text-left font-black text-dark-blue hover:no-underline text-lg py-6", competitor.isPrimary && "text-primary")}>
                            {competitor.id === 'jon' ? <Logo /> : competitor.name}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-6">
                           <div className="space-y-4">
                            {cData.map(item => (
                                <div key={item.feature} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0">
                                    <span className="font-bold text-slate-600 text-sm mr-4">{item.feature}</span>
                                    {renderCompetitorValue(item.competitors[competitor.id as keyof typeof item.competitors])}
                                </div>
                            ))}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
            <Card className="bg-blue-50/50 border-blue-100 rounded-[1.5rem] p-6 shadow-sm">
                <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-2xl mt-1">
                        <Info className="h-6 w-6" />
                    </div>
                    <div>
                         <h4 className="font-black text-dark-blue text-lg mb-1">{translations.whyPremiumTitle}</h4>
                         <p className="text-base text-slate-600 font-medium">
                             {translations.whyPremiumDesc}
                         </p>
                    </div>
                </div>
            </Card>
        </div>
      </div>
      
      <CtaBlock 
        title={translations.ctaTitle}
        description={translations.ctaDesc}
        buttonText={translations.ctaButton}
        onCtaClick={onCtaClick}
      />
    </section>
  );
};

export default Comparison;
