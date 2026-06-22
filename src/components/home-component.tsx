'use client';
import type { FC } from 'react';
import { useState } from 'react';
import AtMasthead from '@/components/sections/at-masthead';
import AtHero from '@/components/sections/at-hero';
import AtMarquee from '@/components/sections/at-marquee';
import AtLedger from '@/components/sections/at-ledger';
import AtFeatured from '@/components/sections/at-featured';
import AtShowcase from '@/components/sections/at-showcase';
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

const HomeComponent: FC<{ lang: string; dictionary: any; comparisons?: any[]; brands?: any[]; testimonials?: any[] }> = ({ lang, dictionary: _dictionary }) => {
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
      <AtHero onOpen={open} lang={lang} />
      <AtMarquee lang={lang} />
      <AtLedger lang={lang} />
      <AtFeatured lang={lang} />
      <AtShowcase onOpen={open} lang={lang} />
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
      <AtProcess lang={lang} />
      <AtPricing onOpen={open} lang={lang} />
      <AtQuotes lang={lang} />
      <AtFaq lang={lang} />
      <AtFinalCta onOpen={open} lang={lang} />
      <AtModal open={modalOpen} onClose={close} lang={lang} />
      <AtStickyCta onOpen={open} lang={lang} />
    </div>
  );
};

export default HomeComponent;
