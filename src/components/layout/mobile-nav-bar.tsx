'use client';

import { useState } from 'react';
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, Send, Sparkles, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackContactClick, trackEvent } from '@/lib/analytics';

interface MobileNavBarProps {
  lang: string;
  dictionary?: {
    call?: string;
    telegram?: string;
    consultation?: string;
    contact_by_phone?: string;
    contact_by_telegram?: string;
    free_consultation?: string;
    ai?: string;
    consultation_short?: string;
  };
}

export default function MobileNavBar({ lang, dictionary }: MobileNavBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const diff = latest - previous;
    const isAtBottom = window.innerHeight + latest >= document.documentElement.scrollHeight - 60;

    setScrolled(latest > 60);

    if (isAtBottom || latest < 80) {
      setIsVisible(true);
    } else if (diff > 8) {
      setIsVisible(false);
    } else if (diff < -8) {
      setIsVisible(true);
    }
  });

  const labels = {
    call: dictionary?.call || dictionary?.contact_by_phone || (lang === 'en' ? 'Call' : "Qo'ng'iroq"),
    telegram: dictionary?.telegram || dictionary?.contact_by_telegram || 'Telegram',
    consultation: dictionary?.consultation || dictionary?.free_consultation || 'Brand Audit',
    consultationShort: dictionary?.consultation_short || (lang === 'uz' ? 'Audit' : 'Audit'),
    ai: dictionary?.ai || 'AI',
  };

  const handleOpenConsultation = () => {
    window.dispatchEvent(new CustomEvent('openContactModal', {
      detail: {
        section: 'mobile_quick_actions',
        ctaText: labels.consultation,
        source: 'mobile_nav_bar',
      },
    }));
  };

  const handleToggleOisha = () => {
    trackEvent({
      action: 'assistant_opened',
      category: 'Engagement',
      label: 'mobile_nav_bar',
      section: 'mobile_quick_actions',
    });
    window.dispatchEvent(new CustomEvent('toggleOisha'));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] md:hidden"
        >
          <nav
            aria-label="Mobile quick actions"
            className={cn(
              'mx-auto flex max-w-[460px] items-stretch overflow-hidden rounded-[18px]',
              'border shadow-[0_-4px_30px_-8px_rgba(0,0,0,0.4),0_25px_60px_-15px_rgba(0,0,0,0.85)]',
              scrolled
                ? 'border-white/10 bg-[#060a12]/92 backdrop-blur-2xl'
                : 'border-white/8 bg-[#070b14]/88 backdrop-blur-xl'
            )}
          >
            {/* Phone */}
            <a
              href="tel:+998336450097"
              aria-label={labels.call}
              onClick={() => trackContactClick('phone', 'mobile_nav_bar')}
              className="mobile-press flex flex-1 flex-col items-center justify-center gap-1 py-3 text-slate-400 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:bg-white/5"
            >
              <div className="flex h-6 w-6 items-center justify-center">
                <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-bold leading-none tracking-wide">{labels.call}</span>
            </a>

            {/* Vertical separator */}
            <div className="my-3 w-px bg-white/8" />

            {/* Telegram */}
            <a
              href="https://t.me/jonbranding"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels.telegram}
              onClick={() => trackContactClick('telegram', 'mobile_nav_bar')}
              className="mobile-press flex flex-1 flex-col items-center justify-center gap-1 py-3 text-slate-400 transition-colors duration-150 hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:bg-white/5"
            >
              <div className="flex h-6 w-6 items-center justify-center">
                <Send className="h-[18px] w-[18px]" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-bold leading-none tracking-wide">{labels.telegram}</span>
            </a>

            {/* Vertical separator */}
            <div className="my-3 w-px bg-white/8" />

            {/* AI button */}
            <button
              type="button"
              onClick={handleToggleOisha}
              aria-label={labels.ai}
              className="mobile-press flex flex-1 flex-col items-center justify-center gap-1 py-3 text-slate-400 transition-colors duration-150 hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:bg-white/5"
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <Sparkles className="h-[18px] w-[18px] text-indigo-400" aria-hidden="true" />
                {/* Live indicator dot */}
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-indigo-400 ring-1 ring-[#070b14]" />
              </div>
              <span className="text-[10px] font-bold leading-none tracking-wide">{labels.ai}</span>
            </button>

            {/* Vertical separator */}
            <div className="my-2 w-px bg-white/8" />

            {/* Primary CTA */}
            <button
              type="button"
              onClick={handleOpenConsultation}
              className={cn(
                'group relative flex flex-[1.9] flex-col items-center justify-center gap-1 overflow-hidden',
                'rounded-[14px] m-1 px-3 py-2.5',
                'bg-gradient-to-br from-primary via-[#3a5cff] to-indigo-600',
                'shadow-[0_4px_20px_rgba(27,77,255,0.4)]',
                'text-white transition-all duration-300',
                'hover:shadow-[0_4px_28px_rgba(27,77,255,0.55)] active:scale-[0.97]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
              )}
            >
              {/* Shimmer */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/12 to-transparent transition-transform duration-600 group-hover:translate-x-full" />
              <MessageSquare className="relative h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="relative text-[10px] font-black leading-none tracking-wide">{labels.consultationShort}</span>
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
