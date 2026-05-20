'use client';

import { MessageSquare, Phone, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavBarProps {
  lang: string;
  dictionary?: {
    call?: string;
    telegram?: string;
    consultation?: string;
    contact_by_phone?: string;
    contact_by_telegram?: string;
    free_consultation?: string;
  };
}

export default function MobileNavBar({ lang, dictionary }: MobileNavBarProps) {
  const labels = {
    call: dictionary?.call || dictionary?.contact_by_phone || (lang === 'en' ? 'Call' : "Qo'ng'iroq"),
    telegram: dictionary?.telegram || dictionary?.contact_by_telegram || 'Telegram',
    consultation: dictionary?.consultation || dictionary?.free_consultation || 'Brand Audit',
    consultationShort: lang === 'uz' ? 'Audit olish' : 'Audit',
    ai: 'AI',
  };

  const handleOpenConsultation = () => {
    window.dispatchEvent(new CustomEvent('openContactModal'));
  };

  const handleToggleOisha = () => {
    window.dispatchEvent(new CustomEvent('toggleOisha'));
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
      <nav
        aria-label="Mobile quick actions"
        className="mx-auto flex max-w-[420px] items-center justify-between gap-1.5 overflow-hidden rounded-[8px] border border-brand-line/70 bg-white/[0.94] p-1.5 shadow-[0_20px_70px_-30px_rgba(15,23,42,0.65)] backdrop-blur-xl"
      >
            <a
              href="tel:+998336450097"
              aria-label={labels.call}
              className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-[8px] px-2 py-2 text-slate-600 transition-[color,background-color,transform] duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.96]"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span className="mt-1 max-w-full truncate text-[10px] font-bold leading-none">{labels.call}</span>
            </a>

            <a
              href="https://t.me/jonbranding"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels.telegram}
              className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-[8px] px-2 py-2 text-slate-600 transition-[color,background-color,transform] duration-200 hover:bg-sky-50 hover:text-[#0088cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.96]"
            >
              <Send className="h-5 w-5" aria-hidden="true" />
              <span className="mt-1 max-w-full truncate text-[10px] font-bold leading-none">{labels.telegram}</span>
            </a>

            <button
              type="button"
              onClick={handleToggleOisha}
              aria-label="AI assistant"
              className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-[8px] px-2 py-2 text-slate-600 transition-[color,background-color,transform] duration-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.96]"
            >
              <Sparkles className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <span className="mt-1 max-w-full truncate text-[10px] font-bold leading-none">{labels.ai}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenConsultation}
              aria-label={labels.consultation}
              className={cn(
                'group relative flex min-w-[136px] flex-[1.85] items-center justify-center gap-2 overflow-hidden rounded-[8px] bg-slate-950 px-3 py-3 text-white shadow-[0_14px_34px_-18px_rgba(15,23,42,0.9)]',
                'transition-[background-color,transform,box-shadow] duration-300 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.98]',
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
