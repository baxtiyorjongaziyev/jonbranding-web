'use client';

import { useEffect, useRef } from 'react';

interface ScrollDepthAnalyticsProps {
  thresholds?: number[];
}

export default function ScrollDepthAnalytics({ thresholds = [25, 50, 75, 90] }: ScrollDepthAnalyticsProps) {
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const percent = Math.round((window.scrollY / scrollHeight) * 100);

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
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thresholds]);

  return null;
}
