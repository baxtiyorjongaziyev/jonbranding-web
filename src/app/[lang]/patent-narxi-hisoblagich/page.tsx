'use client';

import { FC, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, Clock, Users } from 'lucide-react';
import TrademarkCalculator from '@/components/sections/trademark-calculator';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Skeleton } from '@/components/ui/skeleton';

const PatentLandingPage: FC = () => {
  const params = useParams();
  const lang = params.lang as string;
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    if (lang) {
      getDictionary(lang as Locale).then((dict) => setTranslations(dict.patentCalculatorPage));
    }
  }, [lang]);

  if (!translations) {
    return (
      <div className="min-h-screen pt-16">
        <Skeleton className="w-full h-screen" />
      </div>
    );
  }

  const landing = translations.landing || {};

  return (
    <div className="min-h-screen pt-16 pb-24 bg-secondary/40">
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark-blue">
            {landing.title || translations.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-gray-700">
            {landing.subtitle || translations.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {landing.trustSpeed || '30 soniyada natija'}
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {landing.trustAccuracy || "Davlat boji bo'yicha aniq hisob"}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              {landing.trustExperts || 'Patent mutaxassislari yordamida'}
            </span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <TrademarkCalculator translations={translations.trademarkCalculator} />
      </section>
    </div>
  );
};

export default PatentLandingPage;
