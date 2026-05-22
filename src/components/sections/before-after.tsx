'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { Button } from '@/components/ui/button';
import { BrandSection } from '@/components/ui/design-system';
import { projects } from '@/lib/static-data';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

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
    <BrandSection tone="dark" className="relative bg-[#070b12] py-20 text-white sm:py-28 overflow-hidden">
      {/* Dynamic ambient backdrop light */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(37,99,235,0.15),transparent_50%,rgba(58,225,255,0.09))]" />
      
      <motion.div 
        variants={containerVariants}
        initial="visible"
        animate="visible"
        className="container relative z-10 mx-auto px-4"
      >
        {/* Top Section: Headline, Subtitle, CTA and Stats */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end mb-16">
          <motion.div variants={itemVariants} className="space-y-6">
            {translations.eyebrow && (
              <div className="inline-flex rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-brand-cyan">
                {translations.eyebrow}
              </div>
            )}
            
            <h2 className="max-w-2xl text-balance text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.1]">
              {translations.title}
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
                className="h-14 rounded-full bg-white px-8 text-sm font-black text-brand-ink transition-transform hover:bg-brand-lime active:scale-[0.98] duration-150 shadow-lg shadow-white/5"
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
                    className="rounded-2xl border border-white/8 bg-white/[0.04] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/15"
                  >
                    <div className="text-3xl font-black tracking-tight text-white">{card.value}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">{card.label}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </motion.div>
        </div>

        {/* Bottom Section: 2x2 Grid for all 4 dynamic comparison sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {displayItems.map((item, idx) => (
            <motion.div 
              key={item.brand || idx}
              variants={itemVariants}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/12 bg-[#0a0f1d]/80 backdrop-blur-md p-3.5 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-white/20"
            >
              {/* Subtle ambient light for each card */}
              <div className="absolute -inset-6 bg-blue-500/5 rounded-full blur-3xl opacity-35 pointer-events-none" />
              
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
                
                <div className="flex items-center justify-between px-3.5 py-4 mt-2">
                  <div>
                    <p className="text-xl font-extrabold text-white tracking-tight">{item.brand}</p>
                    {translations.caseLabel && (
                      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
                        {translations.caseLabel}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 rounded-full bg-brand-lime/10 px-3.5 py-2 border border-brand-lime/20 text-brand-lime">
                    <BadgeCheck className="h-4.5 w-4.5 shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-wider">Premium transform</span>
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
