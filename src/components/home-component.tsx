'use client';

import type { FC, ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/hero';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';
import { cn } from '@/lib/utils';

// Custom Premium Skeletons to completely eliminate CLS (Cumulative Layout Shift)
// and deliver S-Tier visual progression (matching dark/light blocks perfectly)
const TrustedBySkeleton = () => (
  <div className="bg-[#fbfaf7] py-16 sm:py-20 border-y border-brand-line/80 animate-pulse">
    <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
      <div className="space-y-4">
        <div className="h-6 w-24 bg-gray-200/80 rounded-full" />
        <div className="h-10 w-3/4 bg-gray-200/80 rounded-lg" />
        <div className="h-5 w-1/2 bg-gray-200/80 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white border border-brand-line rounded-[8px]" />
        ))}
      </div>
    </div>
  </div>
);

const BeforeAfterSkeleton = () => (
  <div className="bg-[#070b12] py-20 sm:py-28 animate-pulse relative overflow-hidden min-h-[600px]">
    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#fbfaf7] to-transparent pointer-events-none" />
    <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
      <div className="space-y-4">
        <div className="h-6 w-28 bg-white/8 rounded-full" />
        <div className="h-12 w-3/4 bg-white/8 rounded-lg" />
        <div className="h-28 bg-white/8 rounded-lg" />
      </div>
      <div className="h-96 bg-white/8 rounded-lg" />
    </div>
  </div>
);

const AuditOfferSkeleton = () => (
  <div className="bg-[#f7f4ee] py-16 sm:py-24 animate-pulse min-h-[550px]">
    <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
      <div className="space-y-4">
        <div className="h-6 w-24 bg-gray-200/80 rounded-full" />
        <div className="h-12 w-3/4 bg-gray-200/80 rounded-lg" />
        <div className="h-20 bg-gray-200/80 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-44 bg-white border border-brand-line rounded-[8px]" />
        ))}
      </div>
    </div>
  </div>
);

const TestimonialsSkeleton = () => (
  <div className="bg-brand-mist py-16 sm:py-20 animate-pulse min-h-[500px]">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center space-y-4 mb-12">
        <div className="h-6 w-28 bg-gray-200/80 rounded-full" />
        <div className="h-10 w-2/3 bg-gray-200/80 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[420px] bg-white border border-brand-line rounded-[8px]" />
        ))}
      </div>
    </div>
  </div>
);

const FounderSkeleton = () => (
  <div className="bg-[#070b12] py-24 sm:py-32 animate-pulse relative overflow-hidden min-h-[550px]">
    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-brand-paper to-transparent pointer-events-none" />
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="h-10 w-2/3 bg-white/8 rounded-lg" />
        <div className="h-32 bg-white/8 rounded-lg" />
        <div className="h-12 w-1/3 bg-white/8 rounded-lg" />
      </div>
      <div className="aspect-[4/5] bg-white/8 rounded-lg" />
    </div>
  </div>
);

const FaqSkeleton = () => (
  <div className="bg-[#fbfaf7] py-16 sm:py-20 animate-pulse">
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="flex flex-col items-center space-y-4 mb-10">
        <div className="h-6 w-20 bg-gray-200/80 rounded-full" />
        <div className="h-10 w-2/3 bg-gray-200/80 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-white border border-brand-line rounded-2xl" />
        ))}
      </div>
    </div>
  </div>
);

const CtaBlockSkeleton = () => (
  <div className="bg-[#fbfaf7] py-16 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="h-44 bg-[#070b12]/10 rounded-[8px] border border-brand-line/40" />
    </div>
  </div>
);

const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'), {
  loading: () => <TrustedBySkeleton />,
});
const AuditOffer = dynamic(() => import('@/components/sections/audit-offer'), {
  loading: () => <AuditOfferSkeleton />,
});
const BeforeAfter = dynamic(() => import('@/components/sections/before-after'), {
  loading: () => <BeforeAfterSkeleton />,
});
const Testimonials = dynamic(() => import('@/components/sections/testimonials'), {
  loading: () => <TestimonialsSkeleton />,
});
const Process = dynamic(() => import('@/components/sections/process'), { ssr: false });
const Founder = dynamic(() => import('@/components/sections/founder'), {
  loading: () => <FounderSkeleton />,
});
const Faq = dynamic(() => import('@/components/sections/faq'), {
  loading: () => <FaqSkeleton />,
});
const CtaBlock = dynamic(() => import('@/components/sections/cta-block'), {
  loading: () => <CtaBlockSkeleton />,
});

const DeferredSection: FC<{ fallback: ReactNode; children: ReactNode }> = ({ fallback, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) return;

    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isReady]);

  return <div ref={ref}>{isReady ? children : fallback}</div>;
};

const HomeComponent: FC<{ lang: string; dictionary: any; comparisons?: any[] }> = ({ lang, dictionary, comparisons }) => {
  const [mounted, setMounted] = useState(false);
  const { tg } = useTelegram();

  const handleOpenModal = useCallback((section = 'homepage', ctaText = 'Bepul Brand Audit olish') => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('openContactModal', {
        detail: {
          section,
          ctaText,
          source: 'homepage',
        },
      });
      window.dispatchEvent(event);
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
              <span key={i} className="text-brand-lime">
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
    <div className="relative pb-28 md:pb-0">
      <main>
        {/* 1. Hero: premium positioning + audit CTA */}
        <Hero onOpenContact={() => handleOpenModal('hero', dictionary.hero?.cta)} lang={lang} dictionary={dictionary.hero} renderHeadline={renderHeadline} />


        {/* 2. Trust: selected clients and credibility signals */}
        <TrustedBy lang={lang} dictionary={dictionary.trustedBy} />

        {/* 3. Offer: sell the free Brand Audit */}
        <AuditOffer lang={lang} dictionary={dictionary.auditOffer} onCtaClick={() => handleOpenModal('audit_offer', dictionary.auditOffer?.cta)} />

        {/* 4. Proof: visible transformation after the offer */}
        <DeferredSection fallback={<BeforeAfterSkeleton />}>
          <BeforeAfter onCtaClick={() => handleOpenModal('before_after', dictionary.beforeAfter?.cta || dictionary.beforeAfter?.ctaButton)} lang={lang} dictionary={dictionary.beforeAfter} comparisons={comparisons} />
        </DeferredSection>

        {/* 5. Testimonials: real client voices */}
        <DeferredSection fallback={<TestimonialsSkeleton />}>
          <Testimonials lang={lang} dictionary={dictionary.testimonials} />
        </DeferredSection>

        {/* 6. Process: what happens after the audit */}
        <DeferredSection fallback={<CtaBlockSkeleton />}>
          {mounted && <Process onCtaClick={() => handleOpenModal('process', dictionary.process?.ctaButton)} lang={lang} dictionary={dictionary.process} />}
        </DeferredSection>

        {/* 7. Founder: trust through personality */}
        <DeferredSection fallback={<FounderSkeleton />}>
          {mounted && <Founder lang={lang} dictionary={dictionary.founder} />}
        </DeferredSection>

        {/* 8. FAQ: objection handling */}
        <Faq lang={lang} dictionary={dictionary.faq} hideCta={true} />

        {/* 9. Final CTA: repeat the audit offer */}
        <CtaBlock
          title={dictionary.home?.cta1_title}
          description={dictionary.home?.cta1_desc}
          buttonText={dictionary.home?.cta1_button}
          onCtaClick={() => handleOpenModal('final_cta', dictionary.home?.cta1_button)}
        />
      </main>
    </div>
  );
};

export default HomeComponent;
