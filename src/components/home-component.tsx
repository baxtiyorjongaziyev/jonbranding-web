'use client';
import type { FC } from 'react';
import dynamic from 'next/dynamic';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

// ── Above-the-fold: SSR, no lazy-load ────────────────────────────────────────
import AtHero from '@/components/sections/at-hero';
import AtMarquee from '@/components/sections/at-marquee';
import AtManifesto from '@/components/sections/at-manifesto';
import AtServices from '@/components/sections/at-services';

// ── Skeleton placeholder ──────────────────────────────────────────────────────
import SectionSkeleton from '@/components/ui/section-skeleton';

// ── Below-the-fold: lazy-loaded to reduce initial JS bundle ──────────────────
const ATGallery = dynamic(
  () => import('@/components/atelier/atelier-sections').then((m) => m.ATGallery),
  { loading: () => <SectionSkeleton minHeight="min-h-[500px]" />, ssr: false }
);

const BeforeAfter = dynamic(
  () => import('@/components/sections/before-after'),
  { loading: () => <SectionSkeleton minHeight="min-h-[500px]" />, ssr: false }
);

const ATQuotes = dynamic(
  () => import('@/components/atelier/atelier-sections').then((m) => m.ATQuotes),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" />, ssr: false }
);

const ProcessVideo = dynamic(
  () => import('@/components/sections/process-video'),
  { loading: () => <SectionSkeleton minHeight="min-h-[560px]" />, ssr: false }
);

const AtProcess = dynamic(
  () => import('@/components/sections/at-process'),
  { loading: () => <SectionSkeleton minHeight="min-h-[600px]" />, ssr: false }
);

const Founder = dynamic(
  () => import('@/components/sections/founder'),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" />, ssr: false }
);

const AtPricing = dynamic(
  () => import('@/components/sections/at-pricing'),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" />, ssr: false }
);

const AtFaq = dynamic(
  () => import('@/components/sections/at-faq'),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" />, ssr: false }
);

const AtFinalCta = dynamic(
  () => import('@/components/sections/at-final-cta'),
  { loading: () => <SectionSkeleton minHeight="min-h-[200px]" />, ssr: false }
);

// ── Non-visual / utility: lazy but still ssr:false ───────────────────────────
const AtModal = dynamic(() => import('@/components/sections/at-modal'), { ssr: false });
const AtStickyCta = dynamic(() => import('@/components/sections/at-sticky-cta'), { ssr: false });
const ExitIntentPopup = dynamic(() => import('@/components/exit-intent-popup'), { ssr: false });
const ScrollDepthAnalytics = dynamic(() => import('@/components/scroll-depth-analytics'), { ssr: false });

// ─────────────────────────────────────────────────────────────────────────────

const HomeComponent: FC<{
  lang: string;
  dictionary: any;
  comparisons?: any[];
  brands?: any[];
  testimonials?: any[];
  portfolioProjects?: any[];
}> = ({ lang, dictionary, comparisons = [], testimonials = [], portfolioProjects = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const open = useCallback(() => setModalOpen(true), []);
  const close = useCallback(() => setModalOpen(false), []);

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

  // ⚡ Bolt Optimization: Replacing native scroll listeners and DOM layout reads with Framer Motion's useScroll
  // to avoid synchronous layout thrashing and main-thread blocking.
  const { scrollYProgress } = useScroll();
  const modalFiredRef = useRef(false);

  const handleScroll = useCallback((latest: number) => {
    if (modalFiredRef.current) return;
    const KEY = 'at_modal_auto_popup_v1';
    if (typeof window !== 'undefined' && sessionStorage.getItem(KEY)) {
      modalFiredRef.current = true;
      return;
    }
    if (latest >= 0.85) {
      modalFiredRef.current = true;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(KEY, '1');
      }
      setModalOpen(true);
    }
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', handleScroll);

  useEffect(() => {
    // Initial state check on mount in case the user starts already scrolled down
    handleScroll(scrollYProgress.get());
  }, [handleScroll, scrollYProgress]);

  // Global CTA hodisalarini (mobil nav, boshqa triggerlar) Atelier modaliga yo'naltirish
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const openHandler = () => setModalOpen(true);
    window.addEventListener('openContactModal', openHandler);
    return () => window.removeEventListener('openContactModal', openHandler);
  }, []);

  return (
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
      <AtHero onOpen={open} lang={lang} portfolioImages={heroImages} />
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
      <AtPricing onOpen={open} lang={lang} />
      <AtFaq lang={lang} onOpen={open} />
      <AtFinalCta onOpen={open} lang={lang} />

      {/* ── Utility / overlays ──── */}
      <AtModal open={modalOpen} onClose={close} lang={lang} dictionary={dictionary.contactModal} />
      <AtStickyCta onOpen={open} lang={lang} />
      <ExitIntentPopup onOpen={open} lang={lang} />
      <ScrollDepthAnalytics />
    </div>
  );
};

export default HomeComponent;
