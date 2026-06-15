'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { Button } from '@/components/ui/button';
import { BrandSection } from '@/components/ui/design-system';
import { projects } from '@/lib/static-data';
import { trackEvent } from '@/lib/analytics';
import { renderHeadline } from '@/lib/headline';

interface SanityComparison {
  brand: string;
  oldImg: string;
  newImg: string;
  oldHint: string;
  newHint: string;
  order: number;
}

interface BeforeAfterProps {
  lang: string;
  dictionary: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    cta?: string;
    ctaButton?: string;
    caseLabel?: string;
    proofCards?: Array<{ value: string; label: string }>;
  };
  comparisons?: SanityComparison[];
}

const DEFAULT_COMPARISONS: SanityComparison[] = projects
  .filter((project) => project.oldImg && project.newImg)
  .map((project, index) => ({
    brand: project.brand,
    oldImg: project.oldImg,
    newImg: project.newImg,
    oldHint: project.oldHint || '',
    newHint: project.newHint || '',
    order: index + 1,
  }));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 150,
    },
  },
};

const BeforeAfter: React.FC<BeforeAfterProps> = ({ lang, dictionary, comparisons }) => {
  const translations = dictionary;
  const displayItems = comparisons && comparisons.length > 0 ? comparisons : DEFAULT_COMPARISONS;

  const handleCtaClick = () => {
    window.dispatchEvent(new CustomEvent('openContactModal', {
      detail: {
        section: 'before_after',
        ctaText: translations.cta || translations.ctaButton,
        source: 'homepage',
      },
    }));
  };

  if (!translations || !displayItems || displayItems.length === 0) return null;

  return (
    <BrandSection tone="dark" className="relative overflow-hidden bg-[#090b0f] py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.05),transparent_48%,rgba(132,213,180,0.08))]" />
      
      <motion.div 
        variants={containerVariants}
        initial="visible"
        animate="visible"
        className="container relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8"
      >
        {/* Top Section: Headline, Subtitle, CTA and Stats */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end mb-16">
          <motion.div variants={itemVariants} className="space-y-6">
            {translations.eyebrow && (
              <div className="inline-flex rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[10px] font-bold uppercase tracking-normal text-brand-lime">
                {translations.eyebrow}
              </div>
            )}
            
            <h2 className="max-w-2xl text-balance text-4xl font-extrabold leading-tight tracking-normal text-white sm:text-6xl">
              {renderHeadline(translations.title ?? '', "text-brand-lime")}
            </h2>
            
            {translations.subtitle && (
              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-white/65">
                {translations.subtitle}
              </p>
            )}

            <div className="pt-2">
              <Button
                onClick={handleCtaClick}
                size="lg"
                className="group h-14 rounded-full bg-white px-7 text-sm font-extrabold text-brand-ink shadow-[0_26px_80px_-34px_rgba(255,255,255,0.8)] transition-[background-color,transform] duration-300 hover:bg-brand-lime active:scale-[0.98]"
              >
                {translations.cta || translations.ctaButton}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            {/* Client Proof Cards */}
            {translations.proofCards?.length ? (
              <div className="grid grid-cols-2 gap-4">
                {translations.proofCards.map((card) => (
                  <div 
                    key={card.label} 
                    className="border-t border-white/12 p-5 transition-colors duration-300 hover:border-brand-lime/30"
                  >
                    <div className="font-headline text-3xl font-black tracking-normal text-white tabular-nums">{card.value}</div>
                    <div className="mt-2 text-[10px] font-bold uppercase tracking-normal text-white/60">{card.label}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </motion.div>
        </div>

        {/* Bottom Section: Swipeable track on mobile, 2x2 Grid on desktop */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 swipe-track md:grid md:grid-cols-2 md:gap-8 lg:gap-10 md:overflow-visible md:pb-0 md:snap-none md:px-0">
          {displayItems.map((item, idx) => (
            <motion.div 
              key={item.brand || idx}
              variants={itemVariants}
              className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.055] p-3 shadow-[0_50px_100px_-42px_rgba(0,0,0,0.9)] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-white/22 w-[85vw] shrink-0 snap-center md:w-auto md:shrink md:snap-align-none"
            >
              <div className="relative z-10">
                <ImageComparisonSlider
                  beforeImage={{ 
                    src: item.oldImg, 
                    alt: `${item.brand} old`, 
                    'data-ai-hint': item.oldHint || '', 
                    unoptimized: true 
                  }}
                  afterImage={{ 
                    src: item.newImg, 
                    alt: `${item.brand} new`, 
                    'data-ai-hint': item.newHint || '', 
                    unoptimized: true 
                  }}
                  lang={lang}
                />
                
                <div className="mt-2 flex items-center justify-between gap-4 px-3.5 py-4">
                  <div>
                    <p className="text-xl font-extrabold tracking-normal text-white">{item.brand}</p>
                    {translations.caseLabel && (
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-normal text-white/60">
                        {translations.caseLabel}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex shrink-0 items-center gap-2 rounded-full border border-brand-lime/20 bg-brand-lime/10 px-3.5 py-2 text-brand-lime">
                    <BadgeCheck className="h-4.5 w-4.5 shrink-0" />
                    {translations.caseLabel && <span className="text-[9px] font-bold uppercase tracking-normal">{translations.caseLabel}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </BrandSection>
  );
};

export default BeforeAfter;
