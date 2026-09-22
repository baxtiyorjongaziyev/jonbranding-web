'use client';

import { motion, useMotionValue, useTransform, PanInfo, animate } from 'framer-motion';
import Image, { type ImageProps } from 'next/image';
import { useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Sparkles, History } from 'lucide-react';

interface ImageComparisonSliderProps {
  beforeImage: Omit<ImageProps, 'fill' | 'className'> & { [key: string]: any };
  afterImage: Omit<ImageProps, 'fill' | 'className'> & { [key: string]: any };
  className?: string;
  lang: string;
  hideLabels?: boolean;
  sliderPosition?: number; // 0 to 1
  onPositionChange?: (position: number) => void;
  beforeLabel?: string;
  afterLabel?: string;
}

const translationMap: Record<string, { before: string; after: string }> = {
  uz: { before: 'AVVAL', after: 'KEYIN' },
  ru: { before: 'ДО', after: 'ПОСЛЕ' },
  zh: { before: '之前', after: '之后' },
  en: { before: 'BEFORE', after: 'AFTER' },
};

const ImageComparisonSlider = ({
  beforeImage,
  afterImage,
  className,
  lang,
  hideLabels,
  sliderPosition,
  onPositionChange,
  beforeLabel,
  afterLabel,
}: ImageComparisonSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(sliderPosition !== undefined ? sliderPosition : 0.5);
  const translations = translationMap[lang] || translationMap.en;

  // Sync external controlled sliderPosition changes smoothly
  useEffect(() => {
    if (sliderPosition !== undefined) {
      animate(x, sliderPosition, { duration: 0.35, ease: [0.16, 1, 0.3, 1] });
    }
  }, [sliderPosition, x]);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = (clientX - rect.left) / rect.width;
      const clampedX = Math.max(0.02, Math.min(0.98, rawX));
      x.set(clampedX);
      if (onPositionChange) {
        onPositionChange(clampedX);
      }
    },
    [x, onPositionChange]
  );

  const handlePan = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      updatePosition(info.point.x);
    },
    [updatePosition]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      updatePosition(event.clientX);
    },
    [updatePosition]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentVal = x.get();
      let step = 0.05;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const newVal = Math.max(0.02, currentVal - step);
        x.set(newVal);
        onPositionChange?.(newVal);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const newVal = Math.min(0.98, currentVal + step);
        x.set(newVal);
        onPositionChange?.(newVal);
      } else if (event.key === 'Home') {
        event.preventDefault();
        x.set(0.05);
        onPositionChange?.(0.05);
      } else if (event.key === 'End') {
        event.preventDefault();
        x.set(0.95);
        onPositionChange?.(0.95);
      }
    },
    [x, onPositionChange]
  );

  // Geometry:
  // Base layer = beforeImage (AVVAL / BEFORE) on the LEFT.
  // Overlay layer = afterImage (KEYIN / AFTER) on the RIGHT, clipped on the LEFT: inset(0 0 0 (val * 100)%).
  // Divider = at (val * 100)%.
  const overlayClipPath = useTransform(x, (val: number) => `inset(0 0 0 ${val * 100}%)`);
  const handleX = useTransform(x, (val: number) => `${val * 100}%`);

  const displayBefore = beforeLabel || translations.before;
  const displayAfter = afterLabel || translations.after;

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="Before and after image comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(x.get() * 100)}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative w-full aspect-[4/3] cursor-ew-resize group select-none overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-950 shadow-2xl border border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80',
        className
      )}
      onPointerDown={handlePointerDown}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 1. Base Layer (AVVAL / BEFORE) - Visible on left of slider */}
      <div className="absolute inset-0 bg-neutral-900">
        <Image
          {...beforeImage}
          alt={beforeImage.alt ?? displayBefore}
          fill
          priority
          className="object-cover pointer-events-none filter contrast-[0.95]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* 2. Overlay Layer (KEYIN / AFTER) - Clipped from left, visible on right of slider */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ clipPath: overlayClipPath }}
        initial={{ clipPath: 'inset(0 0 0 50%)' }}
      >
        <div className="absolute inset-0 bg-neutral-900">
          <Image
            {...afterImage}
            alt={afterImage.alt ?? displayAfter}
            fill
            priority
            className="object-cover pointer-events-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        </div>
      </motion.div>

      {/* 3. Floating Badges (Outside clipped container so always visible) */}
      {!hideLabels && (
        <>
          {/* AVVAL (Before) Badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.14em] text-neutral-300 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
              <History className="w-3 h-3 text-rose-400" />
              <span>{displayBefore}</span>
            </span>
          </div>

          {/* KEYIN (After) Badge */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-300 bg-blue-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>{displayAfter}</span>
            </span>
          </div>
        </>
      )}

      {/* 4. Sliding Laser Divider & Glowing Handle */}
      <motion.div
        className="absolute inset-y-0 w-0 z-30 pointer-events-none"
        style={{ left: handleX }}
        initial={{ left: '50%' }}
      >
        {/* Glowing laser line */}
        <div className="absolute inset-y-0 -left-[1.5px] w-[3px] bg-gradient-to-b from-blue-400 via-white to-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)]" />

        {/* Tactile Handle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full flex items-center justify-center bg-neutral-950/90 backdrop-blur-xl border-2 border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.7)] group-hover:scale-110 group-active:scale-95 transition-transform duration-200 cursor-grab active:cursor-grabbing"
          onPan={handlePan}
          onPanStart={handlePan}
          onPanEnd={handlePan}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Subtle pulsating ring */}
          <span className="absolute inset-0 rounded-full border border-blue-400/40 animate-ping opacity-30 pointer-events-none" />

          <div className="flex items-center gap-0.5 text-white">
            <ChevronLeft size={14} className="text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" strokeWidth={3} />
            <div className="w-0.5 h-3 bg-white/40 rounded-full" />
            <ChevronRight size={14} className="text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" strokeWidth={3} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ImageComparisonSlider;

