'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { MessageSquare, Phone, Send, Sparkles } from 'lucide-react';
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

const NAV_SPRING = { type: 'spring', stiffness: 420, damping: 36, mass: 0.8 };

const iconBtn =
  'press-effect flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-[14px] py-2.5 text-white/40 transition-colors duration-150 active:bg-white/[0.06] hover:bg-white/[0.04] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';

export default function MobileNavBar({ lang, dictionary }: MobileNavBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;
    const atBottom = window.innerHeight + latest >= document.documentElement.scrollHeight - 60;

    if (atBottom || latest < 80) setIsVisible(true);
    else if (diff > 8) setIsVisible(false);
    else if (diff < -8) setIsVisible(true);
  });

  const labels = {
    call: dictionary?.call || dictionary?.contact_by_phone || (lang === 'en' ? 'Call' : "Qo'ng'iroq"),
    telegram: dictionary?.telegram || dictionary?.contact_by_telegram || 'Telegram',
    consultation: dictionary?.consultation || dictionary?.free_consultation || 'Brand Audit',
    consultationShort: dictionary?.consultation_short || (lang === 'uz' ? 'Audit olish' : 'Audit'),
    ai: dictionary?.ai || 'AI',
  };

  const openConsultation = () => {
    window.dispatchEvent(new CustomEvent('openContactModal', {
      detail: { section: 'mobile_quick_actions', ctaText: labels.consultation, source: 'mobile_nav_bar' },
    }));
  };

  const toggleOisha = () => {
    trackEvent({ action: 'assistant_opened', category: 'Engagement', label: 'mobile_nav_bar', section: 'mobile_quick_actions' });
    window.dispatchEvent(new CustomEvent('toggleOisha'));
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 110 }}
      transition={NAV_SPRING}
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.625rem)] md:hidden"
    >
      <nav
        aria-label="Mobile quick actions"
        className="mx-auto flex max-w-[440px] items-stretch gap-1.5 overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#060a12]/90 p-1.5 shadow-[0_-4px_30px_rgba(0,0,0,0.5),0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
      >
        <a
          href="tel:+998336450097"
          aria-label={labels.call}
          onClick={() => trackContactClick('phone', 'mobile_nav_bar')}
          className={iconBtn}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-green-500/15">
            <Phone className="h-[17px] w-[17px] text-green-400" aria-hidden="true" />
          </div>
          <span className="max-w-full truncate text-[10px] font-bold leading-none text-white/50">{labels.call}</span>
        </a>

        <a
          href="https://t.me/jonbranding"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.telegram}
          onClick={() => trackContactClick('telegram', 'mobile_nav_bar')}
          className={iconBtn}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-sky-500/15">
            <Send className="h-[17px] w-[17px] text-sky-400" aria-hidden="true" />
          </div>
          <span className="max-w-full truncate text-[10px] font-bold leading-none text-white/50">{labels.telegram}</span>
        </a>

        <button
          type="button"
          onClick={toggleOisha}
          aria-label={labels.ai}
          className={iconBtn}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-violet-500/15">
            <Sparkles className="h-[17px] w-[17px] text-violet-400" aria-hidden="true" />
          </div>
          <span className="max-w-full truncate text-[10px] font-bold leading-none text-white/50">{labels.ai}</span>
        </button>

        <button
          type="button"
          onClick={openConsultation}
          className="press-effect group relative flex min-w-[130px] flex-[1.8] items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-gradient-to-br from-blue-500 to-indigo-600 px-3 py-2 text-white shadow-[0_4px_24px_rgba(79,70,229,0.4)] transition-shadow duration-200 hover:shadow-[0_4px_28px_rgba(79,70,229,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <MessageSquare className="h-[15px] w-[15px] shrink-0" aria-hidden="true" />
          <span className="truncate text-[13px] font-black leading-none">{labels.consultationShort}</span>
          <span className="pointer-events-none absolute inset-0 rounded-[14px] bg-white/0 transition-colors duration-150 group-active:bg-white/[0.07]" />
        </button>
      </nav>
    </motion.div>
  );
}
