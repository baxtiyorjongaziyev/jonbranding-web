'use client';
import { useEffect, useRef } from 'react';

export default function ScrollDepthTracker() {
  const reached = useRef(new Set<number>());

  useEffect(() => {
    const thresholds = [25, 50, 75, 90];
    const getGtag = () => (window as { gtag?: (...a: unknown[]) => void }).gtag;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((doc.scrollTop / scrollable) * 100);
      for (const t of thresholds) {
        if (pct >= t && !reached.current.has(t)) {
          reached.current.add(t);
          getGtag()?.('event', 'scroll_depth', { percent: t, event_category: 'engagement', non_interaction: true });
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
