'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

export default function TelegramBanner({ lang }: { lang: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show the banner occasionally to avoid annoyance
    const hasSeenBanner = sessionStorage.getItem('telegram_banner_seen');
    if (!hasSeenBanner) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 15000); // show after 15 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const closeBanner = () => {
    setIsVisible(false);
    sessionStorage.setItem('telegram_banner_seen', 'true');
  };

  const text = lang === 'ru'
    ? 'Присоединяйтесь к нашему Telegram-каналу для получения экспертных советов по брендингу!'
    : (lang === 'en'
      ? 'Join our Telegram channel for expert branding insights!'
      : 'Brending boʻyicha foydali maslahatlar uchun Telegram kanalimizga qoʻshiling!');

  const buttonText = lang === 'ru' ? 'Присоединиться' : (lang === 'en' ? 'Join Now' : 'Qoʻshilish');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
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
              <p className="text-sm font-medium truncate">
                {text}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://t.me/JonBranding"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeBanner}
                className="whitespace-nowrap px-4 py-1.5 bg-white text-blue-700 text-xs font-bold rounded-full hover:bg-blue-50 transition-colors"
              >
                {buttonText}
              </a>
              <button
                onClick={closeBanner}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close banner"
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
