'use client';
import type { FC } from 'react';
import { useState, useMemo } from 'react';
import AtHero from '@/components/sections/at-hero';
import AtMarquee from '@/components/sections/at-marquee';
import AtLedger from '@/components/sections/at-ledger';
import AtFeatured from '@/components/sections/at-featured';
import AtShowcase from '@/components/sections/at-showcase';
import AtVideo from '@/components/sections/at-video';
import AtManifesto from '@/components/sections/at-manifesto';
import AtStats from '@/components/sections/at-stats';
import AtDiagnosis from '@/components/sections/at-diagnosis';
import AtServices from '@/components/sections/at-services';
import AtAudit from '@/components/sections/at-audit';
import AtSampleReport from '@/components/sections/at-sample-report';
import AtMiniQuotes from '@/components/sections/at-mini-quotes';
import AtLossCalc from '@/components/sections/at-loss-calc';
import AtWorkIndex from '@/components/sections/at-work-index';
import AtAwards from '@/components/sections/at-awards';
import AtProcess from '@/components/sections/at-process';
import AtPricing from '@/components/sections/at-pricing';
import AtQuotes from '@/components/sections/at-quotes';
import AtFaq from '@/components/sections/at-faq';
import AtFinalCta from '@/components/sections/at-final-cta';
import AtModal from '@/components/sections/at-modal';
import AtStickyCta from '@/components/sections/at-sticky-cta';
import { ATGallery } from '@/components/atelier/atelier-sections';
import ExitIntentPopup from '@/components/exit-intent-popup';
import ScrollDepthAnalytics from '@/components/scroll-depth-analytics';

const HomeComponent: FC<{ lang: string; dictionary: any; comparisons?: any[]; brands?: any[]; testimonials?: any[]; portfolioProjects?: any[] }> = ({ lang, dictionary, portfolioProjects = [] }) => {
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
      <AtLedger lang={lang} />
      <AtFeatured lang={lang} onOpen={open} />
      <AtShowcase onOpen={open} lang={lang} />
      <AtVideo lang={lang} />
      <div className="atelier-theme" style={{ background: 'var(--at-bg)', color: 'var(--at-ink)' }}>
        <ATGallery dictionary={dictionary} onOpen={open} lang={lang} projects={portfolioProjects} />
      </div>
      <AtManifesto lang={lang} />
      <AtStats lang={lang} />
      <AtDiagnosis onOpen={open} lang={lang} />
      <AtServices onOpen={open} lang={lang} />
      <AtAudit onOpen={open} lang={lang} />
      <AtSampleReport onOpen={open} lang={lang} />
      <AtMiniQuotes lang={lang} />
      <AtLossCalc onOpen={open} lang={lang} />
      <AtWorkIndex onOpen={open} lang={lang} />
      <AtAwards lang={lang} />
      <AtProcess lang={lang} onOpen={open} />
      <AtPricing onOpen={open} lang={lang} />
      <AtQuotes lang={lang} />
      <AtFaq lang={lang} onOpen={open} />
      <AtFinalCta onOpen={open} lang={lang} />
      <AtModal open={modalOpen} onClose={close} lang={lang} />
      <AtStickyCta onOpen={open} lang={lang} />
      <ExitIntentPopup onOpen={open} lang={lang} />
      <ScrollDepthAnalytics />
    </div>
  );
};

export default HomeComponent;
