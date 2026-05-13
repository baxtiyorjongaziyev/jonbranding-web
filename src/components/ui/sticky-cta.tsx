'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/dictionaries';

export default function StickyCTA({ lang }: { lang?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [ariaLabel, setAriaLabel] = useState("Contact us");

  useEffect(() => {
    if (lang) {
      getDictionary(lang as any).then(dict => {
        if (dict?.common?.contactUs) {
          setAriaLabel(dict.common.contactUs);
        }
      });
    }
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA only after scrolling down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 right-4 z-50 hidden items-center gap-3 md:bottom-6 md:right-6 md:flex"
        >
          <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-2 text-sm font-bold text-slate-700 shadow-lg backdrop-blur">
            Bepul Brend Tahlil
          </div>
          <Button
            onClick={handleOpenModal}
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-700 p-0 shadow-2xl transition-all hover:scale-105 hover:bg-blue-800 animate-pulse-glow flex items-center justify-center text-white"
            aria-label={ariaLabel}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
