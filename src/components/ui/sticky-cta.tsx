'use client';

import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StickyCTA({ ariaLabel = 'Contact us' }: { ariaLabel?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 400);
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
    <div
      className={`fixed bottom-6 right-6 z-50 hidden items-center transition-[opacity,transform] duration-300 md:flex ${
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
      }`}
    >
      <Button
        onClick={handleOpenModal}
        size="lg"
        className="group h-14 w-full justify-between rounded-full border border-white/10 bg-[#0c0c12] py-2 pl-5 pr-2 text-white shadow-[0_24px_80px_-34px_rgba(12,12,18,0.9)] transition-[background-color,transform,box-shadow] duration-300 hover:bg-[#171822] active:scale-[0.98] md:h-14 md:w-14 md:justify-center md:p-0 md:hover:scale-105"
        aria-label={ariaLabel}
      >
        <span className="flex items-center gap-3 md:hidden">
          <MessageCircle className="h-5 w-5 text-white/75" aria-hidden="true" />
          <span className="text-sm font-black">{ariaLabel}</span>
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0c0c12] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:hidden">
          <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
        </span>
        <MessageCircle className="hidden h-6 w-6 md:block" aria-hidden="true" />
      </Button>
    </div>
  );
}
