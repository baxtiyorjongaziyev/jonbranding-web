'use client';

import { useCallback, useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Key fold components load immediately for faster perceived performance
import ServicesHero from '@/components/sections/services-hero';
import WhyUs from '@/components/sections/why-us';
import ServiceSections from '@/components/sections/service-sections';

// Dynamic loading only for non-critical/heavy/below-fold components
const PackageBuilder = dynamic(() => import('@/components/sections/package-builder'), { ssr: false });
const Comparison = dynamic(() => import('@/components/sections/comparison'), { ssr: false });
const QueueStatus = dynamic(() => import('@/components/sections/queue-status'), { ssr: false });
const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/sections/testimonials'), { ssr: false });
const UrgencyBlock = dynamic(() => import('@/components/sections/urgency-block'), { ssr: false });
const PersonalOfferBlock = dynamic(() => import('@/components/sections/personal-offer-block'), { ssr: false });

const XizmatlarClient = ({ lang, dictionary }: { lang: string, dictionary: any }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Progressive staggered loading to prevent blocking the UI thread
    const timers = [
      setTimeout(() => setStep(1), 500), // Render Comparison
      setTimeout(() => setStep(2), 800), // Render TrustedBy
      setTimeout(() => setStep(3), 1100), // Render Testimonials
      setTimeout(() => setStep(4), 1400), // Render the rest
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleOpenModal = useCallback(() => {
    const event = new CustomEvent('openContactModal');
    window.dispatchEvent(event);
  }, []);

  const handleOpenServiceModal = useCallback(() => {
    const servicesSection = document.getElementById('package-builder');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (!dictionary) return <div className="py-20 text-center"><Skeleton className="h-screen w-full" /></div>;

  return (
    <div suppressHydrationWarning className="flex flex-col gap-0 overflow-visible">
      {/* 1. Hero - Immediate */}
      <ServicesHero onCtaClick={handleOpenServiceModal} dictionary={dictionary?.servicesHero} />

      {/* 2. Pricing - immediate, so high-intent visitors reach it after the hero */}
      <Suspense fallback={<div className="py-20 text-center"><Skeleton className="h-[800px] w-full max-w-6xl mx-auto rounded-3xl" /></div>}>
        <PackageBuilder onOrderNow={handleOpenModal} lang={lang} dictionary={dictionary?.servicesPage?.packageBuilder} />
      </Suspense>

      {/* 3. Proof and service overview */}
      <WhyUs lang={lang} dictionary={dictionary?.whyUs} />
      <ServiceSections lang={lang} dictionary={dictionary?.serviceSections} />

      {/* 4. Comparison */}
      {step >= 1 && (
        <Suspense fallback={<div className="py-20"><Skeleton className="h-96 w-full" /></div>}>
          <Comparison onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary?.comparison} />
        </Suspense>
      )}

      {/* 5. Social proof and offers */}
      {step >= 2 && (
        <>
          <TrustedBy lang={lang} dictionary={dictionary?.trustedBy} />
          {step >= 3 && <Testimonials lang={lang} dictionary={dictionary?.testimonials} />}
          {step >= 4 && (
            <div className="flex flex-col">
              <PersonalOfferBlock onCtaClick={handleOpenModal} />
              <UrgencyBlock />
              <QueueStatus onCtaClick={handleOpenModal} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default XizmatlarClient;
