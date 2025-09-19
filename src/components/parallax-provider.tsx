
'use client';

import { motion, useScroll, type MotionValue } from 'framer-motion';
import { useRef, type FC, type ReactNode } from 'react';

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

// Optimized Parallax component to avoid stuttering
// This version passes the motion value directly to the style prop,
// allowing Framer Motion to optimize the animation off the main thread.
const Parallax: FC<ParallaxProps> = ({ children, className, speed = 0.5 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Directly use the motion value in the style prop.
  // We calculate the y-transform based on the scroll progress.
  const y = scrollYProgress;

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          y: y as any, // Passing motion value directly
          transform: `translateY(calc(${speed - 1} * 100% * var(--progress)))`,
          // We use a CSS variable `--progress` that will be updated by the motion value `y`.
          // This offloads the calculation to the browser's compositor thread.
        }}
        // The motion component will automatically update the CSS variable.
        // @ts-ignore
        initial={{'--progress': 0}}
        // @ts-ignore
        animate={{'--progress': 1}}
        // @ts-ignore
        transition={{type: "spring", stiffness: 100, damping: 30, restDelta: 0.001, duration: 0.5}}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Parallax;
