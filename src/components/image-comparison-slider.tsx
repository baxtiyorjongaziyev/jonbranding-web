'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import Image, { type ImageProps } from 'next/image';
import { useRef, useCallback, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageComparisonSliderProps {
  beforeImage: Omit<ImageProps, 'fill' | 'className'> & { [key: string]: any };
  afterImage: Omit<ImageProps, 'fill' | 'className'> & { [key: string]: any };
  className?: string;
  lang: string;
}

const ImageComparisonSlider = ({ beforeImage, afterImage, className, lang }: ImageComparisonSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5); // Represents position from 0 to 1
  const [translations, setTranslations] = useState<{ before: string, after: string } | null>(null);

  useEffect(() => {
    // A simplified way to get specific translations for this component
    if (lang === 'uz') {
      setTranslations({ before: "Avval", after: "Hozir" });
    } else if (lang === 'ru') {
      setTranslations({ before: "До", after: "После" });
    } else {
      setTranslations({ before: "Before", after: "After" });
    }
  }, [lang]);

  const handlePan = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(1, (info.point.x - rect.left) / rect.width));
      x.set(newX);
  }, [x]);
  
  const clipPath = useTransform(x, val => `inset(0 ${100 - (val * 100)}% 0 0)`);
  const handleX = useTransform(x, val => `${val * 100}%`);

  if (!translations) {
    return <div className={cn("relative w-full aspect-square cursor-ew-resize group", className)}></div>
  }

  return (
    <motion.div 
        ref={containerRef} 
        className={cn("relative w-full aspect-square cursor-ew-resize group select-none", className)}
        onPan={handlePan}
        onPanStart={handlePan}
        onPanEnd={handlePan}
        style={{ touchAction: 'pan-y' }} // Allow vertical scroll on touch devices
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        <Image 
            {...beforeImage}
            fill 
            className="object-cover pointer-events-none"
            priority
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">{translations.before}</div>
      </div>

      {/* After Image (clipped) */}
      <motion.div
        className="absolute inset-0"
        style={{ clipPath }}
        initial={{ clipPath: 'inset(0 50% 0 0)'}}
      >
        <Image 
            {...afterImage}
            fill
            className="object-cover pointer-events-none"
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
