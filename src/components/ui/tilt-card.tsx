'use client';

import React, { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  strength?: number; // How much the card should tilt. Default: 10
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  strength = 10,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateXValue = strength * ((y - height / 2) / (height / 2));
    const rotateYValue = -strength * ((x - width / 2) / (width / 2));

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
      className={cn('relative', className)}
    >
        <div style={{
            transform: 'translateZ(20px)', // To lift the content slightly
            transformStyle: 'preserve-3d',
        }}>
            {children}
        </div>
    </motion.div>
  );
};

export default TiltCard;
