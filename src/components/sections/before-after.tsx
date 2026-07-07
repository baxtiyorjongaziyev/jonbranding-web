'use client';

import { ArrowRight } from 'lucide-react';
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
    <section className="py-[100px] md:py-[140px] relative z-[2] bg-neutral-950">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="max-w-[720px] mb-16 md:mb-20">
          {translations.eyebrow && (
            <span className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-neutral-400 mb-5 font-medium">
              <span className="w-1 h-1 rounded-full bg-neutral-400 inline-block" />
              {translations.eyebrow}
            </span>
          )}
          <h2
            className="font-bold text-white tracking-tight leading-[0.95] mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 64px)', letterSpacing: '-0.04em' }}
          >
            {renderHeadline(translations.title ?? '', "text-[var(--at-accent)]")}
          </h2>
          {translations.subtitle && (
            <p className="text-neutral-400 text-sm leading-[1.7] max-w-[520px]">{translations.subtitle}</p>
          )}
        </div>

        {translations.proofCards?.length ? (
          <div className="flex items-center gap-8 md:gap-12 mb-16 md:mb-20 pb-8 md:pb-10 border-b border-neutral-900">
            {translations.proofCards.map((card, i) => (
              <div key={card.label} className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">{card.value}</span>
                <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-neutral-500 max-w-[80px] leading-[1.4]">{card.label}</span>
                {i < (translations.proofCards?.length ?? 0) - 1 && (
                  <span className="hidden md:block w-px h-8 bg-neutral-800 ml-2" />
                )}
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {displayItems.map((item, idx) => {
            const isFeatured = idx === 0 && displayItems.length > 2;
            return (
              <motion.div
                key={item.brand || idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  isFeatured ? "md:col-span-2 md:grid md:grid-cols-2 md:gap-8" : "",
                  "group"
                )}
              >
                <div className={cn(isFeatured ? "" : "")}>
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
                  <div className="flex items-center justify-between mt-3 px-1">
                    <span className="text-sm font-semibold text-neutral-300">{item.brand}</span>
                    {translations.caseLabel && (
                      <span className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-neutral-600">{translations.caseLabel}</span>
                    )}
                  </div>
                </div>
                {isFeatured && (
                  <div className="hidden md:flex flex-col justify-center">
                    <Button
                      onClick={handleCtaClick}
                      size="lg"
                      className="group h-12 rounded-full bg-white px-7 text-sm font-bold text-black hover:text-white transition-all duration-300 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 active:scale-[0.98] w-fit"
                    >
                      {translations.cta || translations.ctaButton}
                      <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 md:hidden">
          <Button
            onClick={handleCtaClick}
            size="lg"
            className="group h-12 rounded-full bg-white px-7 text-sm font-bold text-black hover:text-white transition-all duration-300 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 active:scale-[0.98] w-full"
          >
            {translations.cta || translations.ctaButton}
            <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
