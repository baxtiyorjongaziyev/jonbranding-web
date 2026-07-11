'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, BadgeCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { Button } from '@/components/ui/button';
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

const BeforeAfter: React.FC<BeforeAfterProps> = ({ lang, dictionary, comparisons }) => {
  const translations = dictionary;
  // Sanity'dan rasmsiz (oldImg/newImg null) yozuvlar kelishi mumkin — ularni
  // ko'rsatmaymiz, aks holda bo'sh karta chiqadi. Bitta ekranga sig'ishi
  // uchun eng ko'pi 4 ta keys.
  const source = comparisons && comparisons.length > 0 ? comparisons : DEFAULT_COMPARISONS;
  const displayItems = source.filter((item) => item.oldImg && item.newImg).slice(0, 4);

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
    <section className="py-16 md:py-20 relative z-[2] overflow-hidden bg-neutral-950">
      {/* Decorative premium dark ambient glows */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--at-accent)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--at-accent)]/3 blur-[150px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-5 md:px-8 relative z-10">
        <div className="grid md:grid-cols-12 gap-6 md:gap-10 mb-8 md:mb-12 items-end">
          <div className="md:col-span-7">
            {translations.eyebrow && (
              <span className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--at-accent)] mb-4 font-bold bg-[var(--at-accent)]/10 px-3 py-1.5 rounded-full border border-[var(--at-accent)]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-accent)] inline-block animate-pulse" />
                {translations.eyebrow}
              </span>
            )}
            <h2
              className="font-bold text-white tracking-tight leading-[0.95]"
              style={{ fontSize: 'clamp(30px, 4vw, 52px)', letterSpacing: '-0.04em' }}
            >
              {renderHeadline(translations.title ?? '', "bg-gradient-to-r from-[var(--at-accent)] to-lime-400 bg-clip-text text-transparent")}
            </h2>
          </div>
          <div className="md:col-span-5 flex flex-col justify-end">
            {translations.subtitle && (
              <p className="text-neutral-400 text-sm leading-[1.6] mb-5 font-medium max-w-[440px]">{translations.subtitle}</p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleCtaClick}
                size="lg"
                className="group h-12 rounded-full bg-white px-7 text-sm font-extrabold text-black hover:text-white transition-all duration-300 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 shadow-[0_20px_50px_rgba(255,255,255,0.05)] active:scale-[0.98]"
              >
                {translations.cta || translations.ctaButton}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Button>
              {translations.proofCards?.map((card) => (
                <div
                  key={card.label}
                  className="rounded-full border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md px-4 py-2"
                >
                  <span className="font-extrabold text-white text-sm tracking-tight">{card.value}</span>
                  <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.08em] text-neutral-500 ml-2 font-bold">{card.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 keys bitta qatorda (lg) — butun bo'lim bitta ekranga sig'adi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 items-stretch">
          {displayItems.map((item, idx) => {
            return (
              <motion.div
                key={item.brand || idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-900 bg-neutral-950 p-2.5 transition-colors duration-500 hover:border-neutral-800"
              >
                {/* Radial Glow on Hover */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,204,22,0.06)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />

                <div className="relative z-10 flex flex-col h-full">
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

                  {/* Compact details bar */}
                  <div className="flex items-center justify-between gap-3 mt-2.5 px-3 py-2.5 bg-neutral-900/30 backdrop-blur-md border border-neutral-900/60 rounded-2xl">
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-white tracking-tight truncate">{item.brand}</p>
                      {translations.caseLabel && (
                        <p className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.1em] text-neutral-500 mt-0.5 font-bold truncate">
                          {translations.caseLabel}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center justify-center h-8 w-8 rounded-full border border-[var(--at-accent)]/20 bg-[var(--at-accent)]/10 text-[var(--at-accent)] transition-all duration-300 group-hover:bg-[var(--at-accent)]/20 group-hover:border-[var(--at-accent)]/30">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
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
