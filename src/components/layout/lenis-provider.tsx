'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { type ReactNode } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';

export { useLenis };

export function LenisProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !reducedMotion,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
    </MotionConfig>
  );
}
