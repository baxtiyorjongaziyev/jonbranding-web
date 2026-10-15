'use client';

import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ReactLenis, useLenis } from 'lenis/react';
import { type ReactNode } from 'react';

export { useLenis };

export function LenisProvider({ children }: { children: ReactNode }) {
  // "Reduce motion" yoqilgan foydalanuvchilarga smooth scroll ham, framer animatsiyalari ham berilmaydi.
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={{
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: !reduceMotion,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
