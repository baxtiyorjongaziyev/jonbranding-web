'use client';
import { useRef, useCallback } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

export default function ScrollDepthTracker() {
  const reached = useRef(new Set<number>());
  const { scrollYProgress } = useScroll();

  const handleScroll = useCallback((latest: number) => {
    const thresholds = [25, 50, 75, 90];
    const getGtag = () => (window as { gtag?: (...a: unknown[]) => void }).gtag;
    const pct = Math.round(latest * 100);

    for (const t of thresholds) {
      if (pct >= t && !reached.current.has(t)) {
        reached.current.add(t);
        getGtag()?.('event', 'scroll_depth', { percent: t, event_category: 'engagement', non_interaction: true });
      }
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", handleScroll);

  return null;
}
