'use client';
import type { FC } from 'react';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import BeforeAfter from '@/components/sections/before-after';
import AtHero from '@/components/sections/at-hero';
import AtMarquee from '@/components/sections/at-marquee';
import AtManifesto from '@/components/sections/at-manifesto';
import AtServices from '@/components/sections/at-services';
import AtPricing from '@/components/sections/at-pricing';
import AtFaq from '@/components/sections/at-faq';
import AtFinalCta from '@/components/sections/at-final-cta';
import AtModal from '@/components/sections/at-modal';
import AtStickyCta from '@/components/sections/at-sticky-cta';
import { ATGallery, ATQuotes } from '@/components/atelier/atelier-sections';
import ExitIntentPopup from '@/components/exit-intent-popup';
import ScrollDepthAnalytics from '@/components/scroll-depth-analytics';
import Founder from '@/components/sections/founder';
import AtProcess from '@/components/sections/at-process';
import ProcessVideo from '@/components/sections/process-video';

const HomeComponent: FC<{ lang: string; dictionary: any; comparisons?: any[]; brands?: any[]; testimonials?: any[]; portfolioProjects?: any[] }> = ({ lang, dictionary, comparisons = [], testimonials = [], portfolioProjects = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);

  const heroImages = useMemo(() => {
    return portfolioProjects
      .filter((p: any) => p.coverImage)
      .map((p: any) => ({
        src: p.coverImage,
        name: p.title?.split(' ')[0] || p.client,
        year: '2026',
      }));
  }, [portfolioProjects]);

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
      <AtHero onOpen={open} lang={lang} portfolioImages={heroImages} />
      <AtMarquee lang={lang} />
      <AtManifesto lang={lang} />
      <AtServices onOpen={open} lang={lang} />
      
      <div className="atelier-theme atelier-home" style={{ background: 'var(--at-bg)', color: 'var(--at-ink)' }}>
        <ATGallery dictionary={dictionary.atelier || dictionary} onOpen={open} lang={lang} projects={portfolioProjects} />
        <BeforeAfter lang={lang} dictionary={dictionary.beforeAfter || dictionary} comparisons={comparisons} />
        <ATQuotes dictionary={dictionary.atelier || dictionary} testimonials={testimonials} lang={lang} />
      </div>

      <ProcessVideo lang={lang} />
      <AtProcess lang={lang} onOpen={open} />
      <Founder lang={lang} dictionary={dictionary.founder} />
      <AtPricing onOpen={open} lang={lang} />
      <AtFaq lang={lang} onOpen={open} />
      <AtFinalCta onOpen={open} lang={lang} />
      <AtModal open={modalOpen} onClose={close} lang={lang} dictionary={dictionary.contactModal} />
      <AtStickyCta onOpen={open} lang={lang} />
      <ExitIntentPopup onOpen={open} lang={lang} />
      <ScrollDepthAnalytics />
    </div>
  );
};

export default HomeComponent;
