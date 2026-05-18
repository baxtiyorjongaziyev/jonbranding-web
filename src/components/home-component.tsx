'use client';

import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/hero';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';
import { cn } from '@/lib/utils';

const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'), {
  loading: () => <Skeleton className="h-32 w-full" />,
});
const AuditOffer = dynamic(() => import('@/components/sections/audit-offer'), {
  loading: () => <Skeleton className="h-96 w-full" />,
});
const BeforeAfter = dynamic(() => import('@/components/sections/before-after'), {
  loading: () => <Skeleton className="h-96 w-full rounded-3xl" />,
});
const Testimonials = dynamic(() => import('@/components/sections/testimonials'), {
  loading: () => <Skeleton className="h-64 w-full rounded-2xl" />,
});
const Process = dynamic(() => import('@/components/sections/process'), { ssr: false });
const Founder = dynamic(() => import('@/components/sections/founder'), {
  loading: () => <Skeleton className="h-96 w-full" />,
});
const Faq = dynamic(() => import('@/components/sections/faq'), {
  loading: () => <Skeleton className="h-64 w-full" />,
});
const CtaBlock = dynamic(() => import('@/components/sections/cta-block'), {
  loading: () => <Skeleton className="h-48 w-full rounded-2xl" />,
});
const MobileCtaBar = dynamic(() => import('@/components/sections/mobile-cta-bar'), { ssr: false });

const HomeComponent: FC<{ lang: string; dictionary: any; comparisons?: any[] }> = ({ lang, dictionary, comparisons }) => {
  const [mounted, setMounted] = useState(false);
  const { tg } = useTelegram();

  const handleOpenModal = useCallback(() => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('openContactModal');
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
              <span key={i} className="text-brand-cyan">
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
        {/* 1. Hero: premium positioning + audit CTA */}
        <Hero onOpenContact={handleOpenModal} lang={lang} dictionary={dictionary.hero} renderHeadline={renderHeadline} />


        {/* 2. Trust: selected clients and credibility signals */}
        <TrustedBy lang={lang} dictionary={dictionary.trustedBy} />

        {/* 3. Proof: visible transformation before the offer */}
        <BeforeAfter onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.beforeAfter} comparisons={comparisons} />

        {/* 4. Offer: sell the free Brand Audit */}
        <AuditOffer lang={lang} dictionary={dictionary.auditOffer} onCtaClick={handleOpenModal} />

        {/* 5. Testimonials: real client voices */}
        <Testimonials lang={lang} dictionary={dictionary.testimonials} />

        {/* 6. Process: what happens after the audit */}
        {mounted && <Process onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.process} />}

        {/* 7. Founder: trust through personality */}
        {mounted && <Founder lang={lang} dictionary={dictionary.founder} />}

        {/* 8. FAQ: objection handling */}
        <Faq lang={lang} dictionary={dictionary.faq} hideCta={true} />

        {/* 9. Final CTA: repeat the audit offer */}
        <CtaBlock
          title={dictionary.home?.cta1_title}
          description={dictionary.home?.cta1_desc}
          buttonText={dictionary.home?.cta1_button}
          onCtaClick={handleOpenModal}
        />
      </main>
      {mounted && <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />}
    </div>
  );
};

export default HomeComponent;
