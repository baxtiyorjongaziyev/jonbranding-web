'use client';

import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Hero from '@/components/sections/hero';
import BentoResultsStats from '@/components/sections/bento-results-stats';
import TargetAudience from '@/components/sections/target-audience';
import WhyUs from '@/components/sections/why-us';
import BrandClarity from '@/components/sections/brand-clarity';
import AuditOffer from '@/components/sections/audit-offer';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';
import { cn } from '@/lib/utils';

const BeforeAfter = dynamic(() => import('@/components/sections/before-after'), {
  loading: () => <Skeleton className="h-96 w-full rounded-3xl" />,
});
const Testimonials = dynamic(() => import('@/components/sections/testimonials'), {
  loading: () => <Skeleton className="h-64 w-full rounded-2xl" />,
});
const Gallery = dynamic(() => import('@/components/sections/gallery'), {
  loading: () => <Skeleton className="h-screen w-full" />,
});
const FeaturedCaseStudy = dynamic(() => import('@/components/sections/featured-case-study'), {
  loading: () => <Skeleton className="h-[500px] w-full rounded-3xl" />,
});
const Founder = dynamic(() => import('@/components/sections/founder'), {
  loading: () => <Skeleton className="h-96 w-full" />,
});
const Faq = dynamic(() => import('@/components/sections/faq'), {
  loading: () => <Skeleton className="h-64 w-full" />,
});
const MobileCtaBar = dynamic(() => import('@/components/sections/mobile-cta-bar'), { ssr: false });
const Process = dynamic(() => import('@/components/sections/process'), { ssr: false });
const OpportunityCostCalculator = dynamic(() => import('@/components/sections/opportunity-cost-calculator'), {
  loading: () => <Skeleton className="h-96 w-full" />,
});
const CtaBlock = dynamic(() => import('@/components/sections/cta-block'), {
  loading: () => <Skeleton className="h-48 w-full rounded-2xl" />,
});
const Guarantee = dynamic(() => import('@/components/sections/guarantee'), {
  loading: () => <Skeleton className="h-64 w-full" />,
});

const fadeInVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
    },
  },
};

const HomeComponent: FC<{ lang: string; dictionary: any }> = ({ lang, dictionary }) => {
  const [mounted, setMounted] = useState(false);
  const { tg } = useTelegram();

  const handleOpenModal = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openContactModal'));
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    if (tg?.BackButton) {
      tg.BackButton.show();
    }
  }, [tg]);

  const renderHeadline = (headline: string, className?: string) => {
    if (!headline) return '';

    const segments = headline.split(/(\*\*.*?\*\*|\|.*?\|)/g);

    return (
      <span className={cn('inline', className)}>
        {segments.map((segment, i) => {
          if (!segment) return null;

          const isDoubleStar = segment.startsWith('**') && segment.endsWith('**');
          const isPipe = segment.startsWith('|') && segment.endsWith('|');

          if (isDoubleStar || isPipe) {
            const text = isDoubleStar ? segment.slice(2, -2) : segment.slice(1, -1);
            return (
              <span key={i} className="text-blue-700">
                {text}
              </span>
            );
          }

          return <span key={i}>{segment}</span>;
        })}
      </span>
    );
  };

  if (!dictionary?.hero) {
    return (
      <div className="py-20 text-center">
        <Skeleton className="h-screen w-full" />
      </div>
    );
  }

  return (
    <div className="relative pb-24 md:pb-0">
      <main>
        <Hero onOpenContact={handleOpenModal} lang={lang} dictionary={dictionary.hero} renderHeadline={renderHeadline} />

        <BentoResultsStats dictionary={dictionary} />

        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }}>
          <BrandClarity lang={lang} onCtaClick={handleOpenModal} />
        </motion.div>

        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }}>
          <TargetAudience lang={lang} dictionary={dictionary.targetAudience} />
        </motion.div>

        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }}>
          <WhyUs onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.whyUs} />
        </motion.div>

        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }}>
          <AuditOffer lang={lang} onCtaClick={handleOpenModal} />
        </motion.div>

        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <OpportunityCostCalculator onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.opportunityCalculator} />
        </motion.div>

        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <BeforeAfter onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.beforeAfter} />
        </motion.div>

        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <Testimonials lang={lang} dictionary={dictionary.testimonials} />
        </motion.div>

        <Gallery lang={lang} dictionary={dictionary.gallery} />

        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <FeaturedCaseStudy lang={lang} dictionary={dictionary.featuredCaseStudy || {}} />
        </motion.div>

        {mounted && (
          <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
            <Guarantee dictionary={dictionary.guaranteeBlock} />
          </motion.div>
        )}

        {mounted ? (
          <>
            <CtaBlock
              title={dictionary.home?.cta1_title}
              description={dictionary.home?.cta1_desc}
              buttonText={dictionary.home?.cta1_button}
              onCtaClick={handleOpenModal}
            />
            <Founder lang={lang} dictionary={dictionary.founder} />
            <Process onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.process} />
            <Faq lang={lang} dictionary={dictionary.faq} />
          </>
        ) : (
          <div className="container mx-auto space-y-20 py-20">
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        )}
      </main>
      {mounted && <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />}
    </div>
  );
};

export default HomeComponent;
