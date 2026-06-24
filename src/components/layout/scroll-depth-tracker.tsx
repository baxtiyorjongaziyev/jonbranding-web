'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

export default function ScrollDepthTracker() {
  const reached = useRef(new Set<number>());
  // Optimization: Replaced native scroll listener with Framer Motion's useScroll
  // This prevents synchronous layout thrashing by handling scroll logic in a requestAnimationFrame loop
  const { scrollYProgress } = useScroll();

  const handleScroll = useCallback((latest: number) => {
    // Ensure SSR compatibility
    if (typeof window === 'undefined') return;

    const thresholds = [25, 50, 75, 90];
    const getGtag = () => (window as { gtag?: (...a: unknown[]) => void }).gtag;
    const pct = Math.round(latest * 100);

    for (const t of thresholds) {
      if (pct >= t && !reached.current.has(t)) {
        reached.current.add(t);
        getGtag()?.('event', 'scroll_depth', {
          percent: t,
          event_category: 'engagement',
          non_interaction: true,
        });
      }
    }
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', handleScroll);

  useEffect(() => {
    // Initial check on mount to track immediate visibility without waiting for scroll
    handleScroll(scrollYProgress.get());
  }, [handleScroll, scrollYProgress]);

  return null;
}
