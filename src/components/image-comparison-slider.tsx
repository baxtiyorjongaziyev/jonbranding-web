'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import Image, { type ImageProps } from 'next/image';
import { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageComparisonSliderProps {
  beforeImage: Omit<ImageProps, 'fill' | 'className'> & { [key: string]: any };
  afterImage: Omit<ImageProps, 'fill' | 'className'> & { [key: string]: any };
  className?: string;
  lang: string;
}

const translationMap: Record<string, { before: string; after: string }> = {
  uz: { before: "AVVAL", after: "HOZIR" },
  ru: { before: "ДО", after: "ПОСЛЕ" },
  zh: { before: "之前", after: "之后" },
};

const ImageComparisonSlider = ({ beforeImage, afterImage, className, lang }: ImageComparisonSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const translations = translationMap[lang] || { before: "BEFORE", after: "AFTER" };

  const handlePan = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(1, (info.point.x - rect.left) / rect.width));
      x.set(newX);
  }, [x]);
  
  const clipPath = useTransform(x, val => `inset(0 ${100 - (val * 100)}% 0 0)`);
  const handleX = useTransform(x, val => `${val * 100}%`);

  return (
    <motion.div 
        ref={containerRef} 
        className={cn("relative w-full aspect-[4/3] cursor-ew-resize group select-none overflow-hidden rounded-xl border border-white/10", className)}
        onPan={handlePan}
        onPanStart={handlePan}
        onPanEnd={handlePan}
        style={{ touchAction: 'pan-y' }}
    >
      {/* Before Image */}
      <div className="absolute inset-0 bg-neutral-900">
        <Image 
            {...beforeImage}
            fill 
            className="object-cover pointer-events-none transition-transform duration-700 group-hover:scale-[1.02]"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] backdrop-blur-md border border-white/10 z-0">
            {translations.before}
        </div>
      </div>

      {/* After Image (clipped) */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ clipPath }}
        initial={{ clipPath: 'inset(0 50% 0 0)'}}
      >
        <div className="absolute inset-0 bg-neutral-900">
          <Image 
              {...afterImage}
              fill
              className="object-cover pointer-events-none transition-transform duration-700 group-hover:scale-[1.02]"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 bg-primary/90 text-white px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] backdrop-blur-md border border-white/20">
              {translations.after}
          </div>
        </div>
      </motion.div>

      {/* Slider Handle */}
      <motion.div
        className="absolute inset-y-0 w-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] z-30 pointer-events-none"
        style={{ left: handleX }}
        initial={{ left: '50%' }}
      >
        <div 
            className="absolute top-1/2 -translate-y-1/2 h-12 w-12 bg-white rounded-full flex items-center justify-center text-primary shadow-[0_0_40px_rgba(0,0,0,0.3)] left-1/2 -translate-x-1/2 border-4 border-white active:scale-90 transition-transform cursor-grab active:cursor-grabbing"
        >
            <div className="flex items-center gap-0.5">
                <ChevronLeft size={18} strokeWidth={3} />
                <ChevronRight size={18} strokeWidth={3} />
            </div>
        </div>
      </motion.div>

      {/* Hint for interaction */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
          <p className="text-[10px] text-white/80 font-medium tracking-wider uppercase">{lang === 'uz' ? 'Suring' : lang === 'ru' ? 'Сдвиньте' : 'Slide'}</p>
      </div>
    </motion.div>
  );
};

export default ImageComparisonSlider;
