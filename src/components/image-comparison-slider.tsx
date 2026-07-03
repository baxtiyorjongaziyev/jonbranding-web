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

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      x.set(newX);
  }, [x]);

  const clipPath = useTransform(x, val => `inset(0 ${100 - (val * 100)}% 0 0)`);
  const handleX = useTransform(x, val => `${val * 100}%`);

  return (
    <motion.div
        ref={containerRef}
        className={cn("relative w-full aspect-[4/3] cursor-ew-resize group select-none overflow-hidden rounded-2xl border border-[var(--at-line)]", className)}
        onPan={handlePan}
        onPanStart={handlePan}
        onPanEnd={handlePan}
        onPointerDown={handlePointerDown}
        style={{ touchAction: 'pan-y' }}
    >
      <div className="absolute inset-0 bg-[var(--at-bg-2)]">
        <Image
            {...beforeImage}
            alt={beforeImage.alt ?? translations.before}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 bg-black/50 text-white/90 px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-[0.15em] backdrop-blur-md border border-white/10 z-0 font-[family-name:var(--font-mono)] uppercase">
            {translations.before}
        </div>
      </div>

      <motion.div
        className="absolute inset-0 z-10"
        style={{ clipPath }}
        initial={{ clipPath: 'inset(0 50% 0 0)'}}
      >
        <div className="absolute inset-0 bg-[var(--at-bg-2)]">
          <Image
              {...afterImage}
              alt={afterImage.alt ?? translations.after}
              fill
              className="object-cover pointer-events-none"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 text-white/90 px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-[0.15em] backdrop-blur-md border border-white/20 z-0 font-[family-name:var(--font-mono)] uppercase"
               style={{ background: 'var(--at-accent)' }}>
              {translations.after}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-y-0 w-[2px] z-30 pointer-events-none"
        style={{ left: handleX, background: 'var(--at-ink)' }}
        initial={{ left: '50%' }}
      >
        <div
            className="absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center left-1/2 -translate-x-1/2 active:scale-90 transition-transform cursor-grab active:cursor-grabbing shadow-[0_0_30px_rgba(0,0,0,0.2)] border-2"
            style={{ background: 'var(--at-paper)', borderColor: 'var(--at-line)', color: 'var(--at-ink)' }}
        >
            <div className="flex items-center gap-0.5">
                <ChevronLeft size={16} strokeWidth={2.5} />
                <ChevronRight size={16} strokeWidth={2.5} />
            </div>
        </div>
      </motion.div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
          <p className="font-[family-name:var(--font-mono)] text-[9px] text-white/80 font-medium tracking-wider uppercase">{lang === 'uz' ? 'Suring' : lang === 'ru' ? 'Сдвиньте' : 'Slide'}</p>
      </div>
    </motion.div>
  );
};

export default ImageComparisonSlider;
