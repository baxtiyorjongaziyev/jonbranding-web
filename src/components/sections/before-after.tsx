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
  onCtaClick: () => void;
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

const BeforeAfter: React.FC<BeforeAfterProps> = ({ onCtaClick, lang, dictionary, comparisons }) => {
  const translations = dictionary;
  const displayItems = comparisons && comparisons.length > 0 ? comparisons : DEFAULT_COMPARISONS;
  
  // Dynamic brand selection state
  const [activeBrand, setActiveBrand] = useState<string>('');

  useEffect(() => {
    if (displayItems && displayItems.length > 0) {
      // Prioritize Den Aroma or Savod on startup, otherwise show the first item
      const preferred = displayItems.find(x => x.brand.toLowerCase().includes('den aroma') || x.brand.toLowerCase().includes('denaroma')) 
                     || displayItems[0];
      setActiveBrand(preferred.brand);
    }
  }, [displayItems]);

  const activeItem = displayItems.find((item) => item.brand === activeBrand) || displayItems[0];

  const handleBrandSelect = (brand: string) => {
    setActiveBrand(brand);
    trackEvent({
      action: 'proof_tab_changed',
      category: 'Proof',
      label: brand,
      section: 'before_after',
    });
  };

  if (!translations || !activeItem) return null;

  return (
    <BrandSection tone="dark" className="relative bg-[#070b12] py-20 text-white sm:py-28 overflow-hidden">
      {/* Dynamic ambient backdrop light */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(37,99,235,0.15),transparent_50%,rgba(58,225,255,0.09))]" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="container relative z-10 mx-auto px-4"
      >
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          
          {/* Left Column: Context, proof and active brand tabs */}
          <motion.div variants={itemVariants} className="space-y-6">
            {translations.eyebrow && (
              <div className="inline-flex rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-brand-cyan">
                {translations.eyebrow}
              </div>
            )}
            
            <h2 className="max-w-xl text-balance text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.1]">
              {translations.title}
            </h2>
            
            {translations.subtitle && (
              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-white/65">
                {translations.subtitle}
              </p>
            )}

            {/* Clickable Brand Tabs - Sleek premium pills */}
            <div className="flex flex-wrap gap-2 py-2">
              {displayItems.map((item) => (
                <button
                  key={item.brand}
                  type="button"
                  onClick={() => handleBrandSelect(item.brand)}
                  className={cn(
                    "px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 border flex items-center gap-2 active:scale-[0.98]",
                    activeBrand === item.brand
                      ? "bg-white text-slate-950 border-white shadow-xl shadow-white/5 scale-[1.03]"
                      : "bg-white/[0.04] text-white/60 border-white/10 hover:bg-white/[0.08] hover:text-white"
                  )}
                >
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    activeBrand === item.brand ? "bg-blue-600 animate-pulse" : "bg-white/30"
                  )} />
                  {item.brand}
                </button>
              ))}
            </div>

            {/* Client Proof Cards */}
            {translations.proofCards?.length ? (
              <div className="grid max-w-xl grid-cols-2 gap-3 pt-2">
                {translations.proofCards.map((card) => (
                  <div 
                    key={card.label} 
                    className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 transition-all duration-300 hover:border-white/15"
                  >
                    <div className="text-2xl font-black tracking-tight text-white">{card.value}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">{card.label}</div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="pt-2">
              <Button
                onClick={onCtaClick}
                size="lg"
                className="h-14 rounded-2xl bg-white px-8 text-sm font-black text-brand-ink transition-transform hover:bg-brand-lime active:scale-[0.98] duration-150 shadow-lg shadow-white/5"
              >
                {translations.cta || translations.ctaButton}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Unified image comparison viewer */}
          <motion.div variants={itemVariants} className="relative">
            {/* Ambient background glow sphere */}
            <div className="absolute -inset-6 bg-blue-500/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
            
            <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[#0a0f1d]/80 backdrop-blur-md p-3 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-white/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBrand}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <ImageComparisonSlider
                    beforeImage={{ 
                      src: activeItem.oldImg, 
                      alt: `${activeItem.brand} old`, 
                      'data-ai-hint': activeItem.oldHint || '', 
                      unoptimized: true 
                    }}
                    afterImage={{ 
                      src: activeItem.newImg, 
                      alt: `${activeItem.brand} new`, 
                      'data-ai-hint': activeItem.newHint || '', 
                      unoptimized: true 
                    }}
                    lang={lang}
                  />
                  
                  <div className="flex items-center justify-between px-3.5 py-4 mt-2">
                    <div>
                      <p className="text-xl font-extrabold text-white tracking-tight">{activeItem.brand}</p>
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
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </BrandSection>
  );
};

export default BeforeAfter;
