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
    <section className="py-[100px] md:py-[140px] relative z-[2]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-14 md:mb-20">
          <h2
            className="font-bold text-[var(--at-ink)]"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 0.95, letterSpacing: '-0.035em' }}
          >
            {translations.eyebrow && (
              <span className="block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--at-muted)] mb-5 font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-accent)] inline-block mr-2 align-middle" />
                {translations.eyebrow}
              </span>
            )}
            {renderHeadline(translations.title ?? '', "text-[var(--at-accent)]")}
          </h2>
          <div className="flex flex-col justify-end">
            {translations.subtitle && (
              <p className="text-[var(--at-ink-2)] text-sm leading-[1.55] mb-8">{translations.subtitle}</p>
            )}
            <div className="flex flex-wrap gap-6">
              <Button
                onClick={handleCtaClick}
                size="lg"
                className="group h-14 rounded-full bg-white px-7 text-sm font-extrabold text-brand-ink shadow-[0_26px_80px_-34px_rgba(255,255,255,0.8)] transition-[background-color,transform] duration-300 hover:bg-brand-lime active:scale-[0.98]"
              >
                {translations.cta || translations.ctaButton}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

        {translations.proofCards?.length ? (
          <div className="flex flex-wrap gap-3 mb-12">
            {translations.proofCards.map((card) => (
              <div
                key={card.label}
                className="group relative overflow-hidden rounded-2xl border border-[var(--at-line)] bg-[var(--at-paper)] px-5 py-4 transition-all duration-300 hover:border-[var(--at-accent)]/30"
              >
                <div className="font-semibold text-[var(--at-ink)] text-lg tracking-tight">{card.value}</div>
                <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] text-[var(--at-muted)] mt-0.5">{card.label}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid md:grid-cols-2 gap-5 md:gap-8">
          {displayItems.map((item, idx) => (
            <motion.div
              key={item.brand || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-[var(--at-line)] bg-[var(--at-paper)] p-3 transition-all duration-500 hover:border-[var(--at-accent)]/20 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--at-bg)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
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
                <div className="flex items-center justify-between gap-4 px-3.5 py-4">
                  <div>
                    <p className="text-lg font-semibold text-[var(--at-ink)] tracking-tight">{item.brand}</p>
                    {translations.caseLabel && (
                      <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.06em] text-[var(--at-muted)] mt-0.5">
                        {translations.caseLabel}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--at-accent)]/15 bg-[var(--at-accent-soft)] px-3 py-1.5 text-[var(--at-accent)]">
                    <Sparkles className="h-3 w-3 shrink-0" />
                    {translations.caseLabel && <span className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.06em]">{translations.caseLabel}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
