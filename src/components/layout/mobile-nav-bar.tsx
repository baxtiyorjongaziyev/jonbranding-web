'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Phone, Send, Sparkles } from 'lucide-react';
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
  const lastScrollY = useRef(0);

  // ⚡ High-Performance passive scroll visibility triggers
  useEffect(() => {
    let ticking = false;

    const update = () => {
      const latest = window.scrollY;
      const diff = latest - lastScrollY.current;
      const isAtBottom = window.innerHeight + latest >= document.documentElement.scrollHeight - 60;

      if (isAtBottom || latest < 80) {
        setIsVisible(true);
      } else if (diff > 8) {
        setIsVisible(false);
      } else if (diff < -8) {
        setIsVisible(true);
      }

      lastScrollY.current = latest;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const labels = {
    call: dictionary?.call || dictionary?.contact_by_phone || (lang === 'en' ? 'Call' : "Qo'ng'iroq"),
    telegram: dictionary?.telegram || dictionary?.contact_by_telegram || 'Telegram',
    consultation: dictionary?.consultation || dictionary?.free_consultation || 'Brand Audit',
    consultationShort: dictionary?.consultation_short || (lang === 'uz' ? 'Audit olish' : 'Audit'),
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
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] transition-transform duration-300 ease-in-out md:hidden",
        isVisible ? "translate-y-0" : "translate-y-28"
      )}
    >
      <nav
        aria-label="Mobile quick actions"
        className={cn(
          "mx-auto flex max-w-[420px] items-center justify-between gap-1.5 overflow-hidden rounded-[16px]",
          "border border-white/10 bg-[#070b13]/85 p-1.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl"
        )}
      >
        <a
          href="tel:+998336450097"
          aria-label={labels.call}
          onClick={() => trackContactClick('phone', 'mobile_nav_bar')}
          className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-[12px] px-2 py-2 text-slate-400 transition-[color,background-color,transform] duration-200 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.96]"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          <span className="mt-1 max-w-full truncate text-[10px] font-bold leading-none">{labels.call}</span>
        </a>

        <a
          href="https://t.me/jonbranding"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.telegram}
          onClick={() => trackContactClick('telegram', 'mobile_nav_bar')}
          className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-[12px] px-2 py-2 text-slate-400 transition-[color,background-color,transform] duration-200 hover:bg-white/5 hover:text-[#0088cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.96]"
        >
          <Send className="h-5 w-5" aria-hidden="true" />
          <span className="mt-1 max-w-full truncate text-[10px] font-bold leading-none">{labels.telegram}</span>
        </a>

        <button
          type="button"
          onClick={handleToggleOisha}
          aria-label={labels.ai}
          className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-[12px] px-2 py-2 text-slate-400 transition-[color,background-color,transform] duration-200 hover:bg-white/5 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.96]"
        >
          <Sparkles className="h-5 w-5 text-blue-400" aria-hidden="true" />
          <span className="mt-1 max-w-full truncate text-[10px] font-bold leading-none">{labels.ai}</span>
        </button>

        <button
          type="button"
          onClick={handleOpenConsultation}
          className={cn(
            'group relative flex min-w-[136px] flex-[1.85] items-center justify-center gap-2 overflow-hidden rounded-[12px]',
            'bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-3 text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)]',
            'transition-[background-color,transform,box-shadow] duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_4px_25px_rgba(37,99,235,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.98]'
          )}
        >
          <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="relative z-10 truncate text-[13px] font-black leading-none">{labels.consultationShort}</span>
          <span className="absolute inset-x-3 bottom-0 h-px bg-white/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      </nav>
    </div>
  );
}
