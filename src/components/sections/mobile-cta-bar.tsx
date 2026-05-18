'use client';

import { useEffect, useState, type FC } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScroll, useMotionValueEvent } from 'framer-motion';

const MobileCtaBar: FC<{ onOpenModal: () => void; lang: string; dictionary: any }> = ({ onOpenModal, dictionary }) => {
  const t = dictionary;
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  // ⚡ Bolt Performance Optimization:
  // What: Replaced native window.addEventListener('scroll') with Framer Motion's useMotionValueEvent.
  // Why: Native scroll listeners combined with state updates cause excessive React re-renders and block the main thread.
  // Impact: useMotionValueEvent uses optimized requestAnimationFrame, reducing main thread blocking.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsVisible(latest > 520);
  });

  useEffect(() => {
    // Check initial state
    if (typeof window !== 'undefined') {
      setIsVisible(window.scrollY > 520);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/94 px-4 py-3 shadow-[0_-18px_55px_-30px_rgba(15,23,42,0.65)] backdrop-blur-xl md:hidden" suppressHydrationWarning>
      <div className="mx-auto w-full max-w-[340px]">
        <Button onClick={onOpenModal} className="h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-black text-white shadow-none hover:bg-blue-700">
          <MessageCircle className="h-4 w-4" />
          {t?.cta || t?.get_offer}
        </Button>
        {t?.hint && <p className="mt-1 text-center text-[11px] font-semibold leading-4 text-slate-500">{t.hint}</p>}
      </div>
    </div>
  );
};

export default MobileCtaBar;
