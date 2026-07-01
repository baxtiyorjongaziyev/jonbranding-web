'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import type { Locale } from '@/lib/dictionaries';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

const bannerTranslations = {
  uz: uz.telegramBanner,
  ru: ru.telegramBanner,
  en: en.telegramBanner,
  zh: zh.telegramBanner,
} as const;

export default function TelegramBanner({ lang }: { lang: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const copy = bannerTranslations[safeLang];

  useEffect(() => {
    const hasSeenBanner = sessionStorage.getItem('telegram_banner_seen');
    if (!hasSeenBanner) {
      const timer = window.setTimeout(() => {
        setIsVisible(true);
      }, 15000);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const closeBanner = () => {
    setIsVisible(false);
    sessionStorage.setItem('telegram_banner_seen', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="telegram-banner"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="sticky top-0 left-0 right-0 z-[60] overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md"
        >
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="shrink-0 rounded-full bg-white/20 p-2">
                <Send className="h-4 w-4 text-white" />
              </div>
              <p className="truncate text-sm font-medium">{copy.text}</p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <a
                href="https://t.me/JonBranding"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeBanner}
                className="whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
              >
                {copy.buttonText}
              </a>
              <button
                type="button"
                onClick={closeBanner}
                className="rounded-full p-1 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
                aria-label={copy.closeAriaLabel}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
