'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function LiveClock({ lang }: { lang: string }) {
  const [timeStr, setTimeStr] = useState('');
  const clockRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(clockRef);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const locale = lang === 'ru' ? 'ru-RU' : lang === 'zh' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'uz-UZ';
      
      const day = d.toLocaleDateString(locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      
      let h = d.getHours();
      const m = d.getMinutes();
      const ap = h >= 12 ? 'pm' : 'am';
      h = h % 12 || 12;
      
      const paddedMinutes = String(m).padStart(2, '0');
      setTimeStr(`${day}, ${h}:${paddedMinutes} ${ap}`);
    };

    if (!isInView && timeStr) return; // if it's already rendered once, don't update if not in view

    tick();

    if (!isInView) return;

    const interval = setInterval(tick, 20000);
    return () => clearInterval(interval);
  }, [lang, isInView, timeStr]);

  return (
    <div ref={clockRef} className="fixed left-6 bottom-6 z-40 hidden md:flex">
      {!timeStr ? (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-brand-line/50 dark:border-white/10 bg-brand-paper/85 dark:bg-[#070b13]/85 backdrop-blur-md shadow-lg text-[13px] font-bold text-brand-ink dark:text-white opacity-0">
          <span className="relative flex h-2 w-2"></span>
          <span className="opacity-0">Loading...</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-brand-line/50 dark:border-white/10 bg-brand-paper/85 dark:bg-[#070b13]/85 backdrop-blur-md shadow-lg text-[13px] font-bold text-brand-ink dark:text-white"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span>{timeStr}</span>
        </motion.div>
      )}
    </div>
  );
}
