'use client';

import { useEffect, useState } from 'react';

/** Android keyboards can shrink only the visible viewport, not the layout. */
export function useVisualViewport(enabled: boolean) {
  const [viewport, setViewport] = useState<{ height: number; bottom: number } | null>(null);
  useEffect(() => {
    if (!enabled || !window.visualViewport) return;
    const visible = window.visualViewport;
    const measure = () => setViewport({
      height: visible.height,
      bottom: Math.max(0, window.innerHeight - visible.height - visible.offsetTop),
    });
    measure();
    visible.addEventListener('resize', measure);
    visible.addEventListener('scroll', measure);
    window.addEventListener('resize', measure);
    return () => {
      visible.removeEventListener('resize', measure);
      visible.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [enabled]);
  return enabled ? viewport : null;
}
