'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertCircle, ArrowRight, Zap, Droplets, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [aov, setAov] = useState(50);

  const t = dictionary;

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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-blue/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 text-sm font-bold mb-4 uppercase tracking-wider"
            >
              <ShieldAlert className="w-4 h-4" />
              SOTUV ANALIZI
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6">
              {t.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Inputs & Analogy (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              <div className="liquid-glass liquid-glass-hover p-8 rounded-[2.5rem]">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        {t.labels.traffic}
                      </label>
                      <span className="text-2xl font-black text-primary animate-text-glow">
                        {traffic.toLocaleString()} ta odam
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

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        {t.labels.conversion}
                      </label>
                      <span className="text-2xl font-black text-primary animate-text-glow">
                        {conversion}% (ishonch)
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

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        {t.labels.aov}
                      </label>
                      <span className="text-2xl font-black text-primary animate-text-glow">
                        {formatCurrency(aov)}
                      </span>
                    </div>
                    <Slider
                      value={[aov]}
                      onValueChange={(v) => setAov(v[0])}
                      min={5}
                      max={1000}
                      step={5}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* The Analogy Section */}
              <div className="liquid-glass p-8 rounded-[2.5rem]">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                   <Droplets className="text-blue-500 w-8 h-8" />
                   {t.analogy.title}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="font-bold text-blue-700 mb-2">{t.analogy.bucket}</div>
                    <p className="text-sm text-blue-600/80">Sizning brendingiz, logoyingiz va saytingiz — bu mijozlarni tutib qoluvchi idish.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100">
                    <div className="font-bold text-sky-700 mb-2">{t.analogy.water}</div>
                    <p className="text-sm text-sky-600/80">Reklamadan kelayotgan har bir odam — bu chelagingizga quyilayotgan suvdek gap.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-red-50 border border-red-100">
                    <div className="font-bold text-red-700 mb-2">{t.analogy.leak}</div>
                    <p className="text-sm text-red-600/80">Yomon dizayn va ishonchsiz ko'rinish — bu chelakdagi teshiklar. Pul oqib ketyapti!</p>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-primary/5 border-l-4 border-primary">
                  <p 
                    className="text-lg font-medium text-foreground italic"
                    dangerouslySetInnerHTML={{ __html: `"${t.analogy.description}"` }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Results (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
              <Card className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-blue-800 text-white border-none shadow-2xl relative overflow-hidden group">
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
              </Card>

              <Button
                onClick={onCtaClick}
                size="lg"
                className="w-full h-24 rounded-[2rem] text-xl font-black shadow-ocean bg-foreground hover:bg-black group transition-all duration-300 animate-breathing"
              >
                <div className="flex flex-col items-center">
                   <span>{t.cta}</span>
                   <span className="text-[10px] opacity-60 font-normal uppercase mt-1">Audit o'tkazish va teshiklarni yamash</span>
                </div>
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>

              <div className="text-center px-4">
                <p className="text-sm text-muted-foreground">
                  {t.results.roiNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpportunityCostCalculator;
