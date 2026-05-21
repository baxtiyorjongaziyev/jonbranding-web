'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
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

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show CTA only after scrolling down 400px
    if (latest > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  });

  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal', {
      detail: {
        section: 'floating_sticky_cta',
        ctaText: ariaLabel,
        source: 'sticky_cta',
      },
    });
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
          className="fixed bottom-20 right-4 z-50 hidden items-center md:bottom-6 md:right-6 md:flex"
        >
          <Button
            onClick={handleOpenModal}
            size="lg"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary p-0 text-white shadow-2xl transition-[background-color,transform] hover:scale-105 hover:bg-primary/90"
            aria-label={ariaLabel}
          >
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
