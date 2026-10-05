'use client';

import { FC, useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { ComparisonSection } from './components/comparison-section';
import { DeliverablesSection } from './components/deliverables-section';
import { FaqSection } from './components/faq-section';
import { FinalCtaSection } from './components/final-cta-section';
import { HeroSection } from './components/hero-section';
import { ProblemSection } from './components/problem-section';
import { ProcessAndAudienceSection } from './components/process-and-audience-section';
import { WhatIsSection } from './components/what-is-section';
import { SOURCE } from './data';

export const BrandStrategyClient: FC = () => {
  const formRef = useRef<HTMLDivElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    trackEvent({
      action: 'brand_strategy_page_view',
      category: 'Brand Strategy Page',
      label: 'page_view',
      source: SOURCE,
    });
  }, []);

  const scrollToForm = (ctaLabel: string) => {
    trackEvent({
      action: 'brand_strategy_cta_click',
      category: 'Brand Strategy CTA',
      label: ctaLabel,
      source: SOURCE,
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => phoneRef.current?.focus({ preventScroll: true }), 500);
  };

  const scrollToContent = () => {
    trackEvent({
      action: 'brand_strategy_cta_click',
      category: 'Brand Strategy CTA',
      label: 'view_deliverables',
      source: SOURCE,
    });
    document.getElementById('tarkib')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        onMeetingClick={() => scrollToForm('hero_primary')}
        onDeliverablesClick={scrollToContent}
      />
      <ProblemSection />
      <WhatIsSection />
      <DeliverablesSection />
      <ComparisonSection />
      <ProcessAndAudienceSection />
      <FaqSection />
      <FinalCtaSection
        formRef={formRef}
        phoneRef={phoneRef}
        onMeetingClick={() => scrollToForm('final_primary')}
        onQuestionClick={() => scrollToForm('final_secondary')}
      />
    </div>
  );
};

export default BrandStrategyClient;
