
'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type FC, type ReactNode } from 'react';

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

const Parallax: FC<ParallaxProps> = ({ children, className, speed = 0.5 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, (1 - speed) * 100]);
  const yPercentage = useTransform(y, value => `${value}%`);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: yPercentage }}>{children}</motion.div>
    </div>
  );
};

export default Parallax;
