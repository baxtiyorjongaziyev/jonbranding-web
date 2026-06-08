'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight, Droplets, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { BrandCard, BrandSection, SectionIntro } from '@/components/ui/design-system';
import DOMPurify from 'isomorphic-dompurify';

interface OpportunityCostCalculatorProps {
  onCtaClick?: () => void;
  lang: string;
  dictionary: any;
}

const OpportunityCostCalculator: React.FC<OpportunityCostCalculatorProps> = ({
  onCtaClick,
  dictionary,
}) => {
  const [traffic, setTraffic] = useState(5000);
  const [conversion, setConversion] = useState(1);
  const [aov, setAov] = useState(500_000);

  const t = dictionary;
  const trafficUnit = t?.labels?.traffic_unit ?? 'ta odam';
  const conversionUnit = t?.labels?.conversion_unit ?? '(ishonch)';

  const currentRevenue = useMemo(() => {
    return (traffic * (conversion / 100) * aov);
  }, [traffic, conversion, aov]);

  const potentialConversion = useMemo(() => {
    // Professional branding typically sees a 2x-3x trust multiplier for weak brands
    return conversion * 2;
  }, [conversion]);

  const potentialRevenue = useMemo(() => {
    return (traffic * (potentialConversion / 100) * aov);
  }, [traffic, potentialConversion, aov]);

  const lossValue = useMemo(() => {
    return potentialRevenue - currentRevenue;
  }, [potentialRevenue, currentRevenue]);

  const formatNumberWithSpaces = (val: number) => {
    return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // non-breaking space
  };

  const formatCurrency = (val: number) => {
    return formatNumberWithSpaces(val) + " so'm";
  };

  return (
    <BrandSection tone="light" className="overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <SectionIntro
            eyebrow={<span className="inline-flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Sotuv analizi</span>}
            title={t.title}
            description={t.subtitle}
          />

          <div className="mt-8 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left: Inputs & Analogy (8 cols) */}
            <div className="lg:col-span-8 space-y-5 sm:space-y-8">
              <BrandCard className="p-5 sm:p-8">
                <div className="space-y-10">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-slate sm:text-sm">
                        {t.labels.traffic}
                      </label>
                      <span className="text-xl font-black text-brand-blue sm:text-2xl">
                        {formatNumberWithSpaces(traffic)} {trafficUnit}
                      </span>
                    </div>
                    <Slider
                      value={[traffic]}
                      onValueChange={(v) => setTraffic(v[0])}
                      max={50000}
                      step={500}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-slate sm:text-sm">
                        {t.labels.conversion}
                      </label>
                      <span className="text-xl font-black text-brand-blue sm:text-2xl">
                        {conversion}% {conversionUnit}
                      </span>
                    </div>
                    <Slider
                      value={[conversion]}
                      onValueChange={(v) => setConversion(v[0])}
                      min={0.1}
                      max={10}
                      step={0.1}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-slate sm:text-sm">
                        {t.labels.aov}
                      </label>
                      <span className="text-xl font-black text-brand-blue sm:text-2xl">
                        {formatCurrency(aov)}
                      </span>
                    </div>
                    <Slider
                      value={[aov]}
                      onValueChange={(v) => setAov(v[0])}
                      min={50_000}
                      max={10_000_000}
                      step={50_000}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </BrandCard>

              {/* The Analogy Section */}
              <BrandCard className="p-5 sm:p-8">
                <h3 className="text-xl font-black mb-4 sm:text-2xl sm:mb-6 flex items-center gap-3 text-brand-ink">
                   <Droplets className="text-brand-blue w-8 h-8" />
                   {t.analogy.title}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-brand-blue/5 border border-brand-blue/10">
                    <div className="font-bold text-blue-700 mb-2">{t.analogy.bucket}</div>
                    <p className="text-sm text-blue-600/80">Sizning brendingiz, logoyingiz va saytingiz — bu mijozlarni tutib qoluvchi idish.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20">
                    <div className="font-bold text-sky-700 mb-2">{t.analogy.water}</div>
                    <p className="text-sm text-sky-600/80">Reklamadan kelayotgan har bir odam — bu chelagingizga quyilayotgan suvdek gap.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-red-50 border border-red-100">
                    <div className="font-bold text-red-700 mb-2">{t.analogy.leak}</div>
                    <p className="text-sm text-red-600/80">Ishonchsiz ko'rinish reklama natijasini pasaytiradi va mijoz qarorini sekinlashtiradi.</p>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-brand-blue/5 border-l-4 border-brand-blue">
                  <p 
                    className="text-lg font-medium text-brand-ink italic"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`"${t.analogy.description}"`) }}
                  />
                </div>
              </BrandCard>
            </div>

            {/* Right: Results (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
              <div className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-brand-ink text-white border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(58,225,255,0.22),transparent_32rem)]" />
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                  <TrendingUp className="w-40 h-40" />
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2 block">
                      {t.results.potential}
                    </span>
                    <div className="text-4xl font-black tracking-tighter">
                      {formatCurrency(potentialRevenue)}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-green-300 text-sm font-bold">
                       <CheckCircle2 className="w-4 h-4" /> 
                       Ishonch orqali kutilayotgan o'sish
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-white/20">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-300 mb-2 block">
                      {t.results.loss}
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={lossValue}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl font-black text-white tracking-tighter"
                      >
                        {formatCurrency(lossValue)}
                      </motion.div>
                    </AnimatePresence>
                    <p className="mt-2 text-sm opacity-80 font-medium">
                      {t.results.lossNote}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={onCtaClick || (() => {
                  window.dispatchEvent(
                    new CustomEvent('openContactModal', {
                      detail: {
                        section: 'opportunity_calculator',
                        ctaText: t.cta || "Bepul auditga yozilish",
                        source: 'homepage',
                      },
                    })
                  );
                })}
                size="lg"
                className="w-full h-24 rounded-[2rem] text-xl font-black shadow-none bg-brand-ink hover:bg-brand-blue group transition-all duration-300"
              >
                <div className="flex flex-col items-center">
                   <span>{t.cta}</span>
                   <span className="text-[10px] opacity-60 font-normal uppercase mt-1">Audit o'tkazish va ustuvor muammolarni aniqlash</span>
                </div>
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>

              <div className="text-center px-4">
                <p className="text-sm text-brand-slate">
                  {t.results.roiNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrandSection>
  );
};

export default OpportunityCostCalculator;
