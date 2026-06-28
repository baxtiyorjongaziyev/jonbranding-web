'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

export default function TelegramBanner({ lang }: { lang: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenBanner = sessionStorage.getItem('telegram_banner_seen');
    if (!hasSeenBanner) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeBanner = () => {
    setIsVisible(false);
    sessionStorage.setItem('telegram_banner_seen', 'true');
  };

  const text =
    lang === 'ru'
      ? 'Присоединяйтесь к нашему Telegram-каналу для получения экспертных советов по брендингу!'
      : lang === 'en'
        ? 'Join our Telegram channel for expert branding insights!'
        : 'Brending boʿyicha foydali maslahatlar uchun Telegram kanalimizga qoʿshiling!';

  const buttonText = lang === 'ru' ? 'Присоединиться' : lang === 'en' ? 'Join Now' : 'Qoʿshilish';
  const closeAriaLabel =
    lang === 'ru' ? 'Закрыть баннер' : lang === 'en' ? 'Close banner' : 'Bannerni yopish';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="telegram-banner"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="sticky top-0 left-0 right-0 z-[60] bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md overflow-hidden"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="bg-white/20 p-2 rounded-full shrink-0">
                <Send className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-medium truncate">{text}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://t.me/JonBranding"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeBanner}
                className="whitespace-nowrap px-4 py-1.5 bg-white text-blue-700 text-xs font-bold rounded-full hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
              >
                {buttonText}
              </a>
              <button
                onClick={closeBanner}
                className="p-1 hover:bg-white/20 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
                aria-label={closeAriaLabel}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
