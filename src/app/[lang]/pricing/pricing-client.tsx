'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';
import { FC } from 'react';

type PricingClientProps = {
  lang: string;
  dictionary: any;
};

const PricingClient: FC<PricingClientProps> = ({ lang, dictionary }) => {
  const t = dictionary?.pricingPage || {
    title: 'Xizmatlar va narxlar',
    subtitle:
      'Brendingizni qimmatroq, tartibliroq va sotishga tayyorroq ko‘rsatadigan yechimlar. Narxlar shaffof, paketlar esa natijaga qarab tuzilgan.',
    brandServices: {
      title: 'Brend tizimi paketlari',
      desc: "Neyming, logo, firma uslubi, brandbook, qadoq va POSM. Har bir paket biznesingizni bir xil va premium ko‘rsatish uchun yig‘ilgan.",
      cta: 'Paketlarni ko‘rish',
    },
  };

  const getLocalizedPath = (path: string) => {
    if (lang === 'uz') return path;
    return `/${lang}${path === '/' ? '' : path}`;
  };

  return (
    <div className="atelier-theme jon-home relative min-h-screen bg-white text-[#0A0B0E] overflow-hidden py-24 sm:py-32 flex flex-col justify-center items-center">
      {/* Background subtle ambient glows */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] pointer-events-none overflow-hidden select-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, rgba(37, 84, 255, 0.06) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] pointer-events-none overflow-hidden select-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 70%, rgba(37, 84, 255, 0.04) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-[#2554FF] border border-blue-500/20 uppercase tracking-[0.16em] mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#2554FF] animate-pulse"></span>
            Shaffof narxlar
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#0A0B0E] mb-6"
            style={{ lineHeight: 1.05 }}
          >
            {t.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Pricing card */}
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="group relative flex flex-col justify-between p-8 sm:p-10 bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#2554FF]/40 rounded-3xl transition-all duration-300 shadow-xl overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-500/20 flex items-center justify-center text-[#2554FF] mb-6">
                <Layers className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold text-[#0A0B0E] tracking-tight mb-4">
                {t.brandServices?.title}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
                {t.brandServices?.desc}
              </p>
            </div>

            <div>
              <Link
                href={getLocalizedPath('/narxlar')}
                className="inline-flex items-center justify-center w-full px-6 py-4 bg-[#2554FF] hover:bg-[#1D4ED8] text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-[#2554FF]/25 gap-2 active:scale-[0.98] text-sm uppercase tracking-wider"
              >
                {t.brandServices?.cta}
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
