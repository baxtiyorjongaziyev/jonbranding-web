'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function SideBadge({ lang }: { lang: string }) {
  const badgeText = 
    lang === 'ru' ? 'БРЕНД АГЕНТСТВО' :
    lang === 'zh' ? '品牌策划机构' :
    lang === 'en' ? 'BRAND AGENCY' :
    'BREND AGENTLIGI';

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1, ease: [0.23, 1, 0.32, 1] }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center bg-[#070b13] border-y border-l border-white/10 text-white rounded-l-2xl py-5 px-3.5 shadow-2xl hover:bg-black transition-all duration-300 group"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="text-[#D4AF37] hover:scale-110 transition-transform mb-3.5 cursor-pointer"
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>
      
      <div 
        className="font-extrabold text-[10px] tracking-[0.25em] uppercase text-gray-400 group-hover:text-white transition-colors"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        {badgeText}
      </div>
      
      <div className="mt-3.5 flex flex-col items-center gap-1">
        <span className="text-[14px] font-black text-white leading-none">J</span>
        <span className="text-[14px] font-black text-white leading-none">B</span>
      </div>
    </motion.div>
  );
}
