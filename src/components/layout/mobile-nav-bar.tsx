'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileNavBarProps {
  lang: string;
  dictionary?: {
    call?: string;
    telegram?: string;
    consultation?: string;
  };
}

export default function MobileNavBar({ lang, dictionary }: MobileNavBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Fallback values in case dictionary parts are missing
  const labels = {
    call: dictionary?.call || (lang === 'ru' ? 'Звонок' : lang === 'en' ? 'Call' : lang === 'zh' ? '拨打' : 'Qo\'ng\'iroq'),
    telegram: dictionary?.telegram || 'Telegram',
    consultation: dictionary?.consultation || (lang === 'ru' ? 'Консультация' : lang === 'en' ? 'Consultation' : lang === 'zh' ? '咨询' : 'Konsultatsiya'),
    ai: lang === 'ru' ? 'ИИ Помощник' : lang === 'en' ? 'AI Assistant' : lang === 'zh' ? 'AI助手' : 'AI Yordamchi'
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenConsultation = () => {
    const event = new CustomEvent('openContactModal');
    window.dispatchEvent(event);
  };

  const handleToggleOisha = () => {
    const event = new CustomEvent('toggleOisha');
    window.dispatchEvent(event);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: 100, opacity: 0 }}
           transition={{ type: 'spring', damping: 25, stiffness: 200 }}
           className="fixed bottom-6 left-0 right-0 z-50 px-4 md:hidden"
        >
          <div className="mx-auto max-w-md bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-3xl p-2 flex items-center justify-between gap-2 overflow-hidden">
            
            {/* Call Action */}
            <a 
              href="tel:+998336450097" 
              className="flex-1 flex flex-col items-center justify-center py-2 text-foreground/70 hover:text-primary transition-colors active:scale-95 duration-200"
            >
              <Phone className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">{labels.call}</span>
            </a>

            {/* Telegram Action */}
            <a 
              href="https://t.me/jonbranding" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center justify-center py-2 text-foreground/70 hover:text-[#0088cc] transition-colors active:scale-95 duration-200"
            >
              <Send className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">{labels.telegram}</span>
            </a>

            {/* AI Assistant Action */}
            <button 
              onClick={handleToggleOisha}
              className="flex-1 flex flex-col items-center justify-center py-2 text-foreground/70 hover:text-blue-600 transition-colors active:scale-95 duration-200"
            >
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] mt-1 font-medium">{labels.ai}</span>
            </button>

            {/* Primary Consultation Button */}
            <button 
              onClick={handleOpenConsultation}
              className="flex-[2] bg-primary text-primary-foreground rounded-2xl py-3 px-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 active:scale-[0.98] transition-all relative overflow-hidden group"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm border-none whitespace-nowrap">{labels.consultation}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
