'use client';

import { ArrowRight, BarChart3, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
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

const proofIcons = [BarChart3, Target, TrendingUp];

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

  const gridSpans = [7, 5, 5, 7];

  return (
    <section className="py-[100px] md:py-[140px] relative z-[2] overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-[600px] h-[600px] rounded-full bg-[var(--at-accent)]/4 blur-[160px]" />
        <div className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] rounded-full bg-violet-500/4 blur-[140px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[var(--at-accent)]/2 blur-[200px]" />
      </div>

      <div className="max-w-[1320px] mx-auto px-5 md:px-8 relative z-10">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-20 items-end">
          <div className="md:col-span-7">
            {translations.eyebrow && (
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--at-accent)] mb-5 font-bold bg-[var(--at-accent)]/8 px-3 py-1.5 rounded-full border border-[var(--at-accent)]/8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-accent)] inline-block" />
                {translations.eyebrow}
              </motion.span>
            )}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-bold text-white tracking-tight leading-[0.95]"
              style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', letterSpacing: '-0.04em' }}
            >
              {renderHeadline(translations.title ?? '', "bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent")}
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 flex flex-col justify-end"
          >
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
          </motion.div>
        </div>

        {translations.proofCards?.length ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 mb-14 md:mb-16"
          >
            {translations.proofCards.map((card, i) => {
              const Icon = proofIcons[i] || BarChart3;
              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-neutral-800/60 bg-neutral-900/30 backdrop-blur-sm px-5 py-4 transition-all duration-300 hover:border-[var(--at-accent)]/20 hover:bg-neutral-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[var(--at-accent)]/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-[var(--at-accent)]" />
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-xl tracking-tight leading-none mb-1">{card.value}</div>
                      <div className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-neutral-500 font-semibold">{card.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : null}

        <div className="grid md:grid-cols-12 gap-3 md:gap-5 items-start">
          {displayItems.slice(0, 4).map((item, idx) => (
            <motion.div
              key={item.brand || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.35 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800/50 transition-all duration-500",
                idx === 0 && "md:col-span-7",
                idx === 1 && "md:col-span-5",
                idx === 2 && "md:col-span-5",
                idx === 3 && "md:col-span-7"
              )}
            >
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
                hideLabels
              />
              <div className={cn(
                "absolute bottom-3 z-20",
                idx % 2 === 0 ? "left-3" : "right-3"
              )}>
                <span className="text-[11px] font-bold text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
                  {item.brand}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
