'use client';
import type { FC } from 'react';
import dynamic from 'next/dynamic';
import { useMemo, useCallback } from 'react';

import { MotionConfig } from 'framer-motion';

// ── Above-the-fold: SSR, no lazy-load ────────────────────────────────────────
import AtHero from '@/components/sections/at-hero';
import AtMarquee from '@/components/sections/at-marquee';
import AtManifesto from '@/components/sections/at-manifesto';
import AtServices from '@/components/sections/at-services';
import SeoAnswerHub from '@/components/sections/seo-answer-hub';

// ── Skeleton placeholder ──────────────────────────────────────────────────────
import SectionSkeleton from '@/components/ui/section-skeleton';

// ── Below-the-fold: lazy-loaded to reduce initial JS bundle ──────────────────
const ATGallery = dynamic(
  () => import('@/components/atelier/atelier-sections').then((m) => m.ATGallery),
  { loading: () => <SectionSkeleton minHeight="min-h-[500px]" /> }
);

const BeforeAfter = dynamic(
  () => import('@/components/sections/before-after'),
  { loading: () => <SectionSkeleton minHeight="min-h-[500px]" /> }
);

const ATQuotes = dynamic(
  () => import('@/components/atelier/atelier-sections').then((m) => m.ATQuotes),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" /> }
);

const ProcessVideo = dynamic(
  () => import('@/components/sections/process-video'),
  { loading: () => <SectionSkeleton minHeight="min-h-[560px]" /> }
);

const AtProcess = dynamic(
  () => import('@/components/sections/at-process'),
  { loading: () => <SectionSkeleton minHeight="min-h-[600px]" /> }
);

const Founder = dynamic(
  () => import('@/components/sections/founder'),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" /> }
);

const AtPricing = dynamic(
  () => import('@/components/sections/at-pricing'),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" /> }
);

const AtFaq = dynamic(
  () => import('@/components/sections/at-faq'),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" /> }
);

const AtFinalCta = dynamic(
  () => import('@/components/sections/at-final-cta'),
  { loading: () => <SectionSkeleton minHeight="min-h-[200px]" /> }
);

// ── Non-visual / utility: lazy but still ssr:false ───────────────────────────
const AtStickyCta = dynamic(() => import('@/components/sections/at-sticky-cta'), { ssr: false });
const ExitIntentPopup = dynamic(() => import('@/components/exit-intent-popup'), { ssr: false });
const ScrollDepthAnalytics = dynamic(() => import('@/components/scroll-depth-analytics'), { ssr: false });

// ─────────────────────────────────────────────────────────────────────────────

const HomeComponent: FC<{
  lang: string;
  dictionary: any;
  comparisons?: any[];
  testimonials?: any[];
  portfolioProjects?: any[];
}> = ({ lang, dictionary, comparisons = [], testimonials = [], portfolioProjects = [] }) => {
  // Ariza formasini Oisha callback vidjeti ochadi (tugmalardagi
  // `data-oisha-callback`). Bu yerda faqat CTA analitikasi yuboriladi.
  const open = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('openContactModal', { detail: { section: 'homepage', source: 'homepage' } })
    );
  }, []);

  const heroImages = useMemo(
    () =>
      portfolioProjects
        .filter((p: any) => p.coverImage)
        .map((p: any) => ({
          src: p.coverImage,
          name: p.title?.split(' ')[0] || p.client,
          year: '2026',
        })),
    [portfolioProjects]
  );


  return (
    <MotionConfig reducedMotion="user">
      <div
        className="min-h-screen"
        style={{
          background: 'var(--at-bg)',
          color: 'var(--at-ink)',
          fontFamily: 'var(--font-hanken, "Hanken Grotesk", sans-serif)',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
      {/* ── Above-the-fold (SSR) ─── */}
      <AtHero onOpen={open} lang={lang} portfolioImages={heroImages} dictionary={dictionary.atelier} />
      <AtMarquee lang={lang} />
      <AtManifesto lang={lang} />
      <AtServices onOpen={open} lang={lang} dictionary={dictionary.atelier} />

      {/* ── Below-the-fold (lazy) ── */}
      <div className="atelier-theme atelier-home" style={{ background: 'var(--at-bg)', color: 'var(--at-ink)' }}>
        <ATGallery dictionary={dictionary.atelier || dictionary} onOpen={open} lang={lang} projects={portfolioProjects} />
        <BeforeAfter lang={lang} dictionary={dictionary.beforeAfter || dictionary} comparisons={comparisons} />
        <ATQuotes dictionary={dictionary.atelier || dictionary} testimonials={testimonials} lang={lang} />
      </div>

      <ProcessVideo dictionary={dictionary.processVideo} />
      <AtProcess lang={lang} onOpen={open} />
      <Founder lang={lang} dictionary={dictionary.founder} />
      <SeoAnswerHub lang={lang} {...dictionary.answerHub} />
      <AtPricing onOpen={open} lang={lang} />
      <AtFaq lang={lang} onOpen={open} />
      <AtFinalCta onOpen={open} lang={lang} />

      {/* ── Utility / overlays ──── */}
      <AtStickyCta onOpen={open} lang={lang} />
      <ExitIntentPopup onOpen={open} lang={lang} />
      <ScrollDepthAnalytics />
      </div>
    </MotionConfig>
  );
};

export default HomeComponent;
