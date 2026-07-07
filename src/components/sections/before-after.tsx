'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/static-data';
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
    <section className="py-[120px] md:py-[160px] relative z-[2] overflow-hidden bg-neutral-950">
      <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--at-accent)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--at-accent)]/3 blur-[150px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-5 md:px-8 relative z-10">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-20 md:mb-24 items-end">
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
                className="group h-14 rounded-full bg-white px-8 text-sm font-extrabold text-black hover:text-white transition-all duration-300 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 active:scale-[0.98]"
              >
                {translations.cta || translations.ctaButton}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Button>
            </div>
          </div>
        </div>

        {translations.proofCards?.length ? (
          <div className="flex flex-wrap gap-4 mb-16 md:mb-20">
            {translations.proofCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md px-6 py-5 transition-all duration-300 hover:border-[var(--at-accent)]/30 hover:bg-neutral-900/60"
              >
                <div className="font-extrabold text-white text-2xl tracking-tight">{card.value}</div>
                <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.1em] text-neutral-500 mt-1 font-bold">{card.label}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          {displayItems.map((item, idx) => (
            <motion.div
              key={item.brand || idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-900 transition-all duration-500 group-hover:border-neutral-800">
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
                <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-neutral-900">
                  <span className="text-sm font-bold text-white tracking-tight">{item.brand}</span>
                  {translations.caseLabel && (
                    <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-[var(--at-accent)]">
                      <Sparkles className="h-3 w-3" />
                      {translations.caseLabel}
                    </span>
                  )}
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
