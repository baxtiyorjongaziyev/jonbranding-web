'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setIsVisible(window.scrollY > 400);
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
    <div
      className={`fixed bottom-20 right-4 z-50 hidden items-center transition-[opacity,transform] duration-300 md:bottom-6 md:right-6 md:flex ${
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
      }`}
    >
      <Button
        onClick={handleOpenModal}
        size="lg"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary p-0 text-white shadow-2xl transition-[background-color,transform] hover:scale-105 hover:bg-primary/90"
        aria-label={ariaLabel}
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </Button>
    </div>
  );
}
