'use client';
import type { FC } from 'react';
import { useState } from 'react';
import AtMasthead from '@/components/sections/at-masthead';
import AtHero from '@/components/sections/at-hero';
import AtMiniQuotes from '@/components/sections/at-mini-quotes';
import AtMarquee from '@/components/sections/at-marquee';
import AtDiagnosis from '@/components/sections/at-diagnosis';
import AtLossCalc from '@/components/sections/at-loss-calc';
import AtAudit from '@/components/sections/at-audit';
import AtSampleReport from '@/components/sections/at-sample-report';
import AtPricing from '@/components/sections/at-pricing';
import AtProcess from '@/components/sections/at-process';
import AtWorkIndex from '@/components/sections/at-work-index';
import AtStats from '@/components/sections/at-stats';
import AtQuotes from '@/components/sections/at-quotes';
import AtFaq from '@/components/sections/at-faq';
import AtFinalCta from '@/components/sections/at-final-cta';
import AtModal from '@/components/sections/at-modal';
import AtStickyCta from '@/components/sections/at-sticky-cta';

const HomeComponent: FC<{ lang: string; dictionary: any; comparisons?: any[]; brands?: any[]; testimonials?: any[] }> = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);

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
      <AtMasthead />
      <AtHero onOpen={open} />
      <AtMiniQuotes />
      <AtMarquee />
      <AtDiagnosis onOpen={open} />
      <AtLossCalc onOpen={open} />
      <AtAudit onOpen={open} />
      <AtSampleReport onOpen={open} />
      <AtPricing onOpen={open} />
      <AtProcess />
      <AtWorkIndex onOpen={open} />
      <AtStats />
      <AtQuotes />
      <AtFaq />
      <AtFinalCta onOpen={open} />
      <AtModal open={modalOpen} onClose={close} />
      <AtStickyCta onOpen={open} />
    </div>
  );
};

export default HomeComponent;
