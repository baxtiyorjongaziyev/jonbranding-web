'use client';

import { FC, useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import TrademarkCalculator from '@/components/sections/trademark-calculator';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const PatentCalculatorPage: FC = () => {
  const params = useParams();
  const lang = params.lang as string;
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    if (lang) {
      getDictionary(lang as Locale).then(dict => setTranslations(dict.patentCalculatorPage));
    }
  }, [lang]);

  if (!translations) {
    return <main className="flex-grow pt-20"><Skeleton className="w-full h-screen" /></main>;
  }

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

      <section id="patent-calculator" className="py-16 sm:py-24 bg-secondary">
        <div className="container mx-auto px-4">
            <Separator className="my-12" />
            <TrademarkCalculator translations={translations.trademarkCalculator} />
        </div>
      </section>
    </main>
  );
};

export default PatentCalculatorPage;
