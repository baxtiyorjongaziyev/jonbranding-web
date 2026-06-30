'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

interface ScrollDepthAnalyticsProps {
  thresholds?: number[];
}

export default function ScrollDepthAnalytics({ thresholds = [25, 50, 75, 90] }: ScrollDepthAnalyticsProps) {
  const firedRef = useRef<Set<number>>(new Set());

  // ⚡ Bolt Optimization: Replacing native scroll listeners and DOM layout reads with Framer Motion's useScroll
  // to avoid synchronous layout thrashing and main-thread blocking on scroll events.
  const { scrollYProgress } = useScroll();

  const handleScroll = useCallback((latest: number) => {
    const percent = Math.round(latest * 100);

    for (const threshold of thresholds) {
      if (percent >= threshold && !firedRef.current.has(threshold)) {
        firedRef.current.add(threshold);
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('event', 'scroll_depth', {
            percent,
            page_path: window.location.pathname,
          });
        }
      }
    }
  }, [thresholds]);

  useMotionValueEvent(scrollYProgress, 'change', handleScroll);

  useEffect(() => {
    // Initial state check on mount in case the user starts already scrolled down
    handleScroll(scrollYProgress.get());
  }, [handleScroll, scrollYProgress]);

  return null;
}
