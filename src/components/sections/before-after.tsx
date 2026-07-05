'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, BadgeCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/static-data';
import { trackEvent } from '@/lib/analytics';
import { renderHeadline } from '@/lib/headline';
import { cn } from '@/lib/utils';

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
    <section className="py-[120px] md:py-[180px] relative z-[2] overflow-hidden bg-neutral-950">
      {/* Decorative premium dark ambient glows */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--at-accent)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--at-accent)]/3 blur-[150px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-5 md:px-8 relative z-10">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-20 md:mb-28 items-end">
          <div className="md:col-span-7">
            {translations.eyebrow && (
              <span className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--at-accent)] mb-6 font-bold bg-[var(--at-accent)]/10 px-3 py-1.5 rounded-full border border-[var(--at-accent)]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-accent)] inline-block animate-pulse" />
                {translations.eyebrow}
              </span>
            )}
            <h2
              className="font-bold text-white tracking-tight leading-[0.95]"
              style={{ fontSize: 'clamp(38px, 6vw, 76px)', letterSpacing: '-0.04em' }}
            >
              {renderHeadline(translations.title ?? '', "bg-gradient-to-r from-[var(--at-accent)] to-lime-400 bg-clip-text text-transparent")}
            </h2>
          </div>
          <div className="md:col-span-5 flex flex-col justify-end">
            {translations.subtitle && (
              <p className="text-neutral-400 text-sm leading-[1.6] mb-8 font-medium max-w-[440px]">{translations.subtitle}</p>
            )}
            <div className="flex flex-wrap gap-6">
              <Button
                onClick={handleCtaClick}
                size="lg"
                className="group h-14 rounded-full bg-white px-8 text-sm font-extrabold text-black hover:text-white transition-all duration-300 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 shadow-[0_20px_50px_rgba(255,255,255,0.05)] active:scale-[0.98]"
              >
                {translations.cta || translations.ctaButton}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Button>
            </div>
          </div>
        </div>

        {translations.proofCards?.length ? (
          <div className="flex flex-wrap gap-4 mb-20">
            {translations.proofCards.map((card) => (
              <div
                key={card.label}
                className="group relative overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md px-6 py-5 transition-all duration-300 hover:border-[var(--at-accent)]/30 hover:bg-neutral-900/60"
              >
                <div className="font-extrabold text-white text-2xl tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">{card.value}</div>
                <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.1em] text-neutral-500 mt-1 font-bold tracking-widest">{card.label}</div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Bento Parallax Offsetting Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {displayItems.map((item, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <motion.div
                key={item.brand || idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className={cn(
                  "group relative overflow-hidden rounded-[32px] border border-neutral-900 bg-neutral-950 p-4 transition-all duration-700 hover:border-neutral-800",
                  // Apply slight vertical offset to create asymmetric premium gallery layout (Bento Parallax)
                  isEven ? "md:translate-y-16" : "md:translate-y-0"
                )}
              >
                {/* Radial Glow on Hover */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,204,22,0.06)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[32px]" />
                
                <div className="relative z-10">
                  <ImageComparisonSlider
                    beforeImage={{
                      src: item.oldImg,
                      alt: `${item.brand} old`,
                      'data-ai-hint': item.oldHint || ''
                    }}
                    afterImage={{
                      src: item.newImg,
                      alt: `${item.brand} new`,
                      'data-ai-hint': item.newHint || ''
                    }}
                    lang={lang}
                  />
                  
                  {/* Rich Glassmorphic Details Bar */}
                  <div className="flex items-center justify-between gap-4 mt-4 px-4 py-3 bg-neutral-900/30 backdrop-blur-md border border-neutral-900/60 rounded-2xl">
                    <div>
                      <p className="text-base font-extrabold text-white tracking-tight">{item.brand}</p>
                      {translations.caseLabel && (
                        <p className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.1em] text-neutral-500 mt-0.5 font-bold">
                          {translations.caseLabel}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--at-accent)]/20 bg-[var(--at-accent)]/10 px-3.5 py-2 text-[var(--at-accent)] transition-all duration-300 group-hover:bg-[var(--at-accent)]/20 group-hover:border-[var(--at-accent)]/30">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      {translations.caseLabel && (
                        <span className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.12em] font-bold">
                          {translations.caseLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
