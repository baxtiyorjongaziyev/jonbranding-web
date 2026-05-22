'use client';

import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

const DeferredSection: FC<{ fallback: ReactNode; children: ReactNode }> = ({ fallback, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) return;

    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isReady]);

  return <div ref={ref}>{isReady ? children : fallback}</div>;
};

export default DeferredSection;
