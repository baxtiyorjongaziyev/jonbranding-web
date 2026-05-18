'use client';

import { ArrowRight, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { Button } from '@/components/ui/button';
import { BrandSection } from '@/components/ui/design-system';
import { projects } from '@/lib/static-data';

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
      staggerChildren: 0.12,
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
  const featuredItem = displayItems.find((item) => typeof item.oldImg === 'string' && typeof item.newImg === 'string');
  const sideItems = displayItems.filter((item) => item !== featuredItem).slice(0, 2);

  if (!translations || !featuredItem) return null;

  return (
    <BrandSection tone="dark" className="relative bg-[#070b12] py-20 text-white sm:py-28 overflow-hidden">
      {/* 1. Seamless transitions: Light -> Dark top fade & Dark -> Light bottom fade */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#fbfaf7] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f7f4ee] to-transparent pointer-events-none z-10" />
      
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(37,99,235,0.18),transparent_42%,rgba(58,225,255,0.12))]" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="container relative z-10 mx-auto px-4"
      >
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <motion.div variants={itemVariants}>
            {translations.eyebrow && (
              <div className="mb-4 inline-flex rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-brand-cyan">
                {translations.eyebrow}
              </div>
            )}
            <h2 className="max-w-xl text-balance text-4xl font-black tracking-tight text-white sm:text-6xl">{translations.title}</h2>
            {translations.subtitle && <p className="mt-5 max-w-xl text-lg leading-8 text-white/68">{translations.subtitle}</p>}
            
            {translations.proofCards?.length ? (
              <div className="mt-6 grid max-w-xl grid-cols-2 gap-3">
                {translations.proofCards.map((card) => (
                  <div key={card.label} className="rounded-[8px] border border-white/10 bg-white/[0.055] p-4 transition-[border-color,transform] duration-300 hover:border-white/20">
                    <div className="text-2xl font-black tracking-tight text-white">{card.value}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/48">{card.label}</div>
                  </div>
                ))}
              </div>
            ) : null}
            <Button
              onClick={onCtaClick}
              size="lg"
              className="mt-8 h-14 rounded-[8px] bg-white px-7 text-base font-black text-brand-ink transition-transform hover:bg-brand-lime active:scale-[0.98] duration-150"
            >
              {translations.cta || translations.ctaButton}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div 
              variants={itemVariants} 
              className="overflow-hidden rounded-[8px] border border-white/12 bg-white/[0.06] p-2 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.8)] transition-[border-color,transform] duration-300 hover:border-white/20"
            >
              <ImageComparisonSlider
                beforeImage={{ src: featuredItem.oldImg, alt: `${featuredItem.brand} old`, 'data-ai-hint': featuredItem.oldHint || '', unoptimized: true }}
                afterImage={{ src: featuredItem.newImg, alt: `${featuredItem.brand} new`, 'data-ai-hint': featuredItem.newHint || '', unoptimized: true }}
                lang={lang}
              />
              <div className="flex items-center justify-between px-3 py-4">
                <div>
                  <p className="text-lg font-black text-white">{featuredItem.brand}</p>
                  {translations.caseLabel && <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/45">{translations.caseLabel}</p>}
                </div>
                <BadgeCheck className="h-6 w-6 text-brand-lime animate-pulse" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4">
              {sideItems.map((item) => (
                <div key={item.brand} className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.055] p-2 transition-[border-color,transform] duration-300 hover:border-white/20">
                  <ImageComparisonSlider
                    beforeImage={{ src: item.oldImg, alt: `${item.brand} old`, 'data-ai-hint': item.oldHint || '', unoptimized: true }}
                    afterImage={{ src: item.newImg, alt: `${item.brand} new`, 'data-ai-hint': item.newHint || '', unoptimized: true }}
                    lang={lang}
                  />
                  <p className="px-2 py-3 text-sm font-black text-white">{item.brand}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </BrandSection>
  );
};

export default BeforeAfter;
