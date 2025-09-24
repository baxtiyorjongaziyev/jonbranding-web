
'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image, { type ImageProps } from 'next/image';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageComparisonSliderProps {
  beforeImage: Omit<ImageProps, 'fill' | 'className'>;
  afterImage: Omit<ImageProps, 'fill' | 'className'>;
  className?: string;
}

const ImageComparisonSlider = ({ beforeImage, afterImage, className }: ImageComparisonSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);

  const afterWidth = useTransform(x, (latest) => `${latest * 100}%`);
  const handleX = useTransform(x, (latest) => `${latest * 100}%`);
  const handleRotation = useTransform(x, [0, 1], [-20, 20]);
  
  return (
    <div ref={containerRef} className={cn("relative w-full aspect-square cursor-e-resize group", className)}>
      {/* Before Image */}
      <div className="absolute inset-0 select-none">
        <Image 
            {...beforeImage}
            fill 
            className="object-cover pointer-events-none"
        />
        <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">Avval</div>
      </div>

      {/* After Image */}
      <motion.div
        className="absolute inset-0 select-none overflow-hidden"
        style={{ width: afterWidth }}
        initial={{ width: "50%" }}
      >
        <Image 
            {...afterImage}
            fill
            className="absolute inset-0 object-cover h-full w-[200%] max-w-none pointer-events-none"
            style={{ left: '-100%', transform: "translateX(50%)"}}
        />
        <div className="absolute top-2 right-2 bg-primary/80 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">Hozir</div>
      </motion.div>

      {/* Slider Handle */}
      <motion.div
        className="absolute inset-y-0 w-1.5 bg-white/70 backdrop-blur-sm cursor-ew-resize z-10"
        style={{ left: handleX, x: "-50%" }}
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.1}
        onDrag={() => {
            if(containerRef.current) {
                 const newX = (containerRef.current.getBoundingClientRect().left - event.clientX) / containerRef.current.getBoundingClientRect().width * -1
                 x.set(newX);
            }
        }}
        initial={{ left: '50%' }}
      >
        <motion.div 
            className="absolute top-1/2 -translate-y-1/2 h-10 w-10 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 shadow-xl"
            style={{ left: "50%", x: "-50%", rotate: handleRotation }}
        >
            <ChevronLeft size={20} />
            <ChevronRight size={20} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ImageComparisonSlider;
