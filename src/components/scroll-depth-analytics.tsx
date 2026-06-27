'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

interface ScrollDepthAnalyticsProps {
  thresholds?: number[];
}

export default function ScrollDepthAnalytics({
  thresholds = [25, 50, 75, 90],
}: ScrollDepthAnalyticsProps) {
  const firedRef = useRef<Set<number>>(new Set());

  // ⚡ Bolt: Optimize layout thrashing by using framer-motion's scrollYProgress
  // which hooks into requestAnimationFrame and avoids synchronous document.documentElement.scrollHeight reads
  const { scrollYProgress } = useScroll();

  const handleScroll = useCallback(
    (latestProgress: number) => {
      if (typeof window === 'undefined') return;

      // Convert 0-1 progress to 0-100 percentage
      const percent = Math.round(latestProgress * 100);

      for (const threshold of thresholds) {
        if (percent >= threshold && !firedRef.current.has(threshold)) {
          firedRef.current.add(threshold);
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'scroll_depth', {
              percent,
              page_path: window.location.pathname,
            });
          }
        }
      }
    },
    [thresholds]
  );

  useMotionValueEvent(scrollYProgress, 'change', handleScroll);

  useEffect(() => {
    // ⚡ Bolt: Check initial state to prevent missing events if loaded already scrolled down
    handleScroll(scrollYProgress.get());
  }, [handleScroll, scrollYProgress]);

  return null;
}
