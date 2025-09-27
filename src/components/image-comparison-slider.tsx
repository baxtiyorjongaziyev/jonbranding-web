
'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import Image, { type ImageProps } from 'next/image';
import { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageComparisonSliderProps {
  beforeImage: Omit<ImageProps, 'fill' | 'className'>;
  afterImage: Omit<ImageProps, 'fill' | 'className'>;
  className?: string;
  lang: string;
}

const ImageComparisonSlider = ({ beforeImage, afterImage, className, lang }: ImageComparisonSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5); // Represents position from 0 to 1

  const handlePan = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(1, (info.point.x - rect.left) / rect.width));
      x.set(newX);
  }, [x]);
  
  const afterWidth = useTransform(x, val => `${val * 100}%`);
  const handleX = useTransform(x, val => `${val * 100}%`);

  const t = {
    uz: {
      before: "Avval",
      after: "Hozir"
    },
    ru: {
      before: "До",
      after: "После"
    }
  }

  const translations = lang === 'ru' ? t.ru : t.uz;

  return (
    <motion.div 
        ref={containerRef} 
        className={cn("relative w-full aspect-square cursor-ew-resize group", className)}
        onPan={handlePan}
        onPanStart={handlePan}
        onPanEnd={handlePan}
        style={{ touchAction: 'pan-y' }} // Allow vertical scroll on touch devices
    >
      {/* Before Image */}
      <div className="absolute inset-0 select-none">
        <Image 
            {...beforeImage}
            fill 
            className="object-cover pointer-events-none"
            priority
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">{translations.before}</div>
      </div>

      {/* After Image */}
      <motion.div
        className="absolute inset-0 select-none overflow-hidden"
        style={{ width: afterWidth }}
        initial={{ width: "50%" }}
      >
        <Image 
            {...afterImage}
            alt={afterImage.alt}
            fill
            className="absolute inset-0 object-cover h-full pointer-events-none"
             style={{ 
                width: containerRef.current?.getBoundingClientRect().width,
            }}
            priority
        />
        <div className="absolute top-2 right-2 bg-primary/80 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">{translations.after}</div>
      </motion.div>

      {/* Slider Handle */}
      <motion.div
        className="absolute inset-y-0 w-1 bg-white/80 backdrop-blur-sm z-10 pointer-events-none"
        style={{ left: handleX }}
        initial={{ left: '50%' }}
      >
        <div 
            className="absolute top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 shadow-xl left-1/2 -translate-x-1/2"
        >
            <ChevronLeft size={20} />
            <ChevronRight size={20} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageComparisonSlider;
