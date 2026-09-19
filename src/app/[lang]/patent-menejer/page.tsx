'use client';

import { FC, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, Zap, LockOpen, Sparkles, Percent, Timer } from 'lucide-react';
import TrademarkCalculator from '@/components/sections/trademark-calculator';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const PatentManagerPage: FC = () => {
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

  return (
    <div className="min-h-screen pt-16 pb-24 bg-slate-50/80">
      <section className="py-10 sm:py-14 border-b bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-emerald-600/40 text-emerald-700 bg-emerald-50 gap-1.5 py-1 px-3">
                <LockOpen className="h-3.5 w-3.5" />
                Doimiy Ochiq Versiya (Menejer Rejimi)
              </Badge>
              <Badge variant="outline" className="border-blue-600/40 text-blue-700 bg-blue-50 gap-1.5 py-1 px-3">
                <Zap className="h-3.5 w-3.5" />
                Real-vaqt hisob-kitob
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              patent.jonbranding.uz
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground">
            Sotuv Menejeri — Patent Kalkulyatori
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-3xl">
            Mijoz bilan qo'ng'iroq yoki yozishmada darhol aniq narx, davlat bojlari va kaskad chegirmalarni hisoblash uchun mo'ljallangan. Barcha narxlar va tafsilotlar formani to'ldirmasdan ham doimiy ochiq.
          </p>

          {/* Sotuv Qoidasi (Kaskad + Arboun eslatmasi) */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="p-3 bg-blue-50/60 border-blue-200 text-xs">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-blue-600" />
                1. Istisno Chegirmasi (10%)
              </div>
              <p className="text-blue-800 mt-1">Barcha mijozlarga avtomatik taklif etiladi.</p>
            </Card>

            <Card className="p-3 bg-indigo-50/60 border-indigo-200 text-xs">
              <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                2. Salom Chegirmasi (10%)
              </div>
              <p className="text-indigo-800 mt-1">100% oldindan to'lov bo'lsa qoldiqdan yana 10%.</p>
            </Card>

            <Card className="p-3 bg-purple-50/60 border-purple-200 text-xs">
              <div className="font-bold text-purple-900 flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-purple-600" />
                3. Promokod (10%)
              </div>
              <p className="text-purple-800 mt-1">Hamkorlik promokodi bo'lsa oxirgi qoldiqdan 10%.</p>
            </Card>

            <Card className="p-3 bg-amber-50/60 border-amber-200 text-xs">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5 text-amber-600" />
                4. Arboun ($50)
              </div>
              <p className="text-amber-800 mt-1">24 soatdan oshsa, $50 bilan narxni 3 kunga muzlatish.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-8">
        <TrademarkCalculator translations={translations.trademarkCalculator} alwaysUnlocked={true} />
      </section>
    </div>
  );
};

export default PatentManagerPage;
