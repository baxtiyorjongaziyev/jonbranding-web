'use client';

import { useState, useEffect, FC } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const OnlineBriefWelcomePage: FC = () => {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as Locale;
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    getDictionary(lang).then(dict => {
      setTranslations(dict.onlineBrief);
    });
  }, [lang]);

  if (!translations) {
    return (
      <div className="flex-grow bg-[#F2EFE6] py-16 sm:py-28 min-h-screen flex items-center justify-center">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="sr-only">
            {lang === 'uz' ? 'Onlayn Smart Brief' : lang === 'ru' ? 'Онлайн Smart Brief' : lang === 'en' ? 'Online Smart Brief' : '在线智能品牌简报'}
          </h1>
          <Skeleton className="h-[450px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  const { welcome } = translations;

  return (
    <div className="flex-grow bg-[#F2EFE6] py-16 sm:py-28 min-h-screen flex items-center justify-center">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="border border-[#e4dfd3] bg-[#FAF8F5]/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual illustration side */}
            <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#EFEEEC] p-8 rounded-2xl border border-[#e4dfd3] relative overflow-hidden min-h-[280px]">
              <div className="absolute top-4 left-4 flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-400/80"></span>
              </div>
              <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20 animate-pulse">
                <HelpCircle className="w-12 h-12 text-indigo-600" />
              </div>
              <h4 className="font-mono text-xs tracking-wider uppercase text-gray-500 text-center">JON.BRANDING</h4>
              <p className="text-sm font-semibold text-gray-700 mt-2 text-center">Smart Brief v2.0</p>
            </div>

            {/* Content side */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F17] leading-tight font-serif italic">
                {welcome.title}
              </h1>
              <p className="mt-4 text-base text-gray-700 leading-relaxed">
                {welcome.description}
              </p>

              <div className="mt-6 p-4 bg-[#F5F2EA] border border-[#e4dfd3] rounded-2xl flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-amber-900 text-sm">{welcome.tipTitle}</h5>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{welcome.tipDesc}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => router.push(`/${lang}/online-brief/wizard`)}
                  size="lg"
                  className="rounded-full h-14 px-8 text-base font-bold bg-[#0B0F17] text-white hover:bg-[#1a2333] transition-all flex items-center justify-center gap-2 group shadow-lg"
                >
                  {welcome.startButton}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full h-14 px-8 text-base font-bold border-[#cbd5e1] text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  <Link href={`/${lang}`}>{translations.buttons.backToHome}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnlineBriefWelcomePage;
