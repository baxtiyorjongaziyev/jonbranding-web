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
        className={cn("relative w-full aspect-[4/3] cursor-ew-resize group select-none overflow-hidden rounded-3xl border border-[var(--at-line)] bg-neutral-950 shadow-2xl transition-all duration-500 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]", className)}
        onPan={handlePan}
        onPanStart={handlePan}
        onPanEnd={handlePan}
        onPointerDown={handlePointerDown}
        style={{ touchAction: 'pan-y' }}
    >
      {/* Before Image and Floating frosted badge */}
      <div className="absolute inset-0 bg-neutral-900">
        <Image
            {...beforeImage}
            alt={beforeImage.alt ?? translations.before}
            fill
            className="object-cover pointer-events-none filter brightness-95 transition-all duration-700 group-hover:scale-[1.01]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4 bg-black/40 text-white/95 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.2em] backdrop-blur-xl border border-white/10 z-20 font-[family-name:var(--font-mono)] transition-transform duration-300 group-hover:translate-y-[-2px]">
            {translations.before}
        </div>
      </div>

      {/* After Image with Clip Path */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ clipPath }}
        initial={{ clipPath: 'inset(0 50% 0 0)'}}
      >
        <div className="absolute inset-0 bg-neutral-900">
          <Image
              {...afterImage}
              alt={afterImage.alt ?? translations.after}
              fill
              className="object-cover pointer-events-none filter brightness-[1.02] transition-all duration-700 group-hover:scale-[1.01]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 text-white px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.2em] backdrop-blur-xl border border-[var(--at-accent)]/30 z-20 font-[family-name:var(--font-mono)] transition-transform duration-300 group-hover:translate-y-[-2px]"
               style={{ background: 'linear-gradient(135deg, var(--at-accent) 0%, rgba(132, 204, 22, 0.8) 100%)', boxShadow: '0 8px 24px -6px var(--at-accent)' }}>
              {translations.after}
          </div>
        </div>
      </motion.div>

      {/* Glowing Neon Laser Separator */}
      <motion.div
        className="absolute inset-y-0 w-[1.5px] z-30 pointer-events-none transition-all duration-300 group-hover:w-[2px]"
        style={{ 
          left: handleX, 
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, var(--at-accent) 40%, var(--at-accent) 60%, rgba(255,255,255,0.1) 100%)',
          boxShadow: '0 0 15px var(--at-accent), 0 0 30px var(--at-accent)' 
        }}
        initial={{ left: '50%' }}
      >
        {/* Glassmorphic Interactive Floating Handle */}
        <div
            className="absolute top-1/2 -translate-y-1/2 h-12 w-12 rounded-full flex items-center justify-center left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing shadow-[0_12px_40px_rgba(0,0,0,0.5)] border transition-all duration-300 hover:scale-110 active:scale-95 group-hover:border-[var(--at-accent)]/50"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderColor: 'rgba(255, 255, 255, 0.15)', 
              backdropFilter: 'blur(20px)',
              color: 'white' 
            }}
        >
            <div className="flex items-center gap-0.5 relative z-10">
                <ChevronLeft size={14} className="opacity-70 group-hover:translate-x-[-2px] transition-transform duration-300" strokeWidth={3} />
                {/* Glowing center indicator dot */}
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--at-accent)] animate-pulse shadow-[0_0_8px_var(--at-accent)]" />
                <ChevronRight size={14} className="opacity-70 group-hover:translate-x-[2px] transition-transform duration-300" strokeWidth={3} />
            </div>
            {/* Outer animated glow ring */}
            <div className="absolute inset-0 rounded-full bg-[var(--at-accent)]/10 animate-ping opacity-30 pointer-events-none" />
        </div>
      </motion.div>

      {/* Floating Surish Hint Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 pointer-events-none z-20 bg-black/55 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
          <p className="font-[family-name:var(--font-mono)] text-[8px] text-white/90 font-bold tracking-[0.2em] uppercase">{lang === 'uz' ? 'Suring' : lang === 'ru' ? 'Сдвиньте' : 'Slide'}</p>
      </div>
    </motion.div>
  );
};

export default ImageComparisonSlider;
