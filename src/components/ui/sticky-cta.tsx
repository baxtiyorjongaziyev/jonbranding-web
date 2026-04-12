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

    window.addEventListener('scroll', handleScroll);
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
          // On mobile: bottom-20 so it sits ABOVE the sticky pricing bar (which is ~56px tall)
          // On desktop (md+): bottom-6 since there's no sticky pricing bar
          className="fixed bottom-20 right-4 z-50 flex items-center md:bottom-6 md:right-6"
        >
          <Button
            onClick={handleOpenModal}
            size="lg"
            className="rounded-full shadow-2xl h-14 w-14 p-0 bg-primary hover:bg-primary/90 hover:scale-105 transition-all text-dark-blue flex items-center justify-center animate-pulse"
            aria-label={ariaLabel}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
