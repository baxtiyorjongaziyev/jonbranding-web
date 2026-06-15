'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Layers, Image, ArrowRight } from 'lucide-react';
import { FC } from 'react';

type PricingClientProps = {
  lang: string;
  dictionary: any;
};

const PricingClient: FC<PricingClientProps> = ({ lang, dictionary }) => {
  const t = dictionary?.pricingPage || {
    title: "Xizmatlar va narxlar",
    subtitle: "Kompaniyangiz va mahsulotlaringiz uchun premium brending yechimlari. Narxlar shaffof va sizning maqsadlaringizga moslashtirilgan.",
    brandServices: {
      title: "Asosiy Brending Xizmatlari",
      desc: "Neyming, Logotip dizayni, Firma uslubi, Brendbuk, Qadoq dizayni va POSM materiallari. Paketlarni o'zingiz yig'ing.",
      cta: "Tariflar va Paket Builderni Ochish"
    },
    marketplaceServices: {
      title: "Sotuvchi Kartochkalari Dizayni",
      desc: "Uzum, Wildberries, Ozon va Yandex Market uchun yuqori konversiyali mahsulot rasmlari dizayni. Chegirmalar va qo'shimcha xizmatlar.",
      cta: "Kartochka Narxlari va Kalkulyator"
    }
  };

  const getLocalizedPath = (path: string) => {
    if (lang === 'uz') return path;
    return `/${lang}${path === '/' ? '' : path}`;
  };

  return (
    <div className="relative min-h-screen bg-[#05070f] text-white overflow-hidden py-24 sm:py-32 flex flex-col justify-center items-center">
      {/* Background glow effects */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] pointer-events-none overflow-hidden select-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, rgba(99, 102, 241, 0.15) 0%, rgba(10, 10, 16, 0) 70%)',
          filter: 'blur(120px)',
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] pointer-events-none overflow-hidden select-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 70%, rgba(245, 158, 11, 0.1) 0%, rgba(10, 10, 16, 0) 70%)',
          filter: 'blur(120px)',
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-[0.2em] mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            Pricing machine
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase mb-6"
          >
            {t.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed font-medium"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Pricing options Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Core Branding Services */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="group relative flex flex-col justify-between p-8 sm:p-10 bg-[#0c0f18]/60 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 rounded-3xl transition-all duration-300 shadow-2xl overflow-hidden"
          >
            {/* Hover spotlight background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-indigo-500/0 to-indigo-500/[0.03] group-hover:to-indigo-500/[0.08] transition-all duration-300 pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <Layers className="w-6 h-6" />
              </div>
              
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                {t.brandServices?.title}
              </h2>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
                {t.brandServices?.desc}
              </p>
            </div>

            <div>
              <Link 
                href={getLocalizedPath('/xizmatlar#package-builder')}
                className="inline-flex items-center justify-center w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-indigo-600/20 gap-2 active:scale-[0.98] text-sm uppercase tracking-wider"
              >
                {t.brandServices?.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Marketplace Cover Design */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="group relative flex flex-col justify-between p-8 sm:p-10 bg-[#0c0f18]/60 backdrop-blur-xl border border-white/5 hover:border-amber-500/30 rounded-3xl transition-all duration-300 shadow-2xl overflow-hidden"
          >
            {/* Hover spotlight background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-amber-500/0 to-amber-500/[0.03] group-hover:to-amber-500/[0.08] transition-all duration-300 pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                <Image className="w-6 h-6" />
              </div>
              
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                {t.marketplaceServices?.title}
              </h2>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
                {t.marketplaceServices?.desc}
              </p>
            </div>

            <div>
              <Link 
                href={getLocalizedPath('/pricing/sotuvchi-kartochka')}
                className="inline-flex items-center justify-center w-full px-6 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full transition-all duration-300 shadow-lg shadow-amber-500/20 gap-2 active:scale-[0.98] text-sm uppercase tracking-wider"
              >
                {t.marketplaceServices?.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PricingClient;
