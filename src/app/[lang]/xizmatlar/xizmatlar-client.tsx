'use client';

import { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Key fold components load immediately for faster perceived performance
import ServicesHero from '@/components/sections/services-hero';
import WhyUs from '@/components/sections/why-us';
import ServiceSections from '@/components/sections/service-sections';

// Dynamic loading only for non-critical/heavy/below-fold components
const MobileCtaBar = dynamic(() => import('@/components/sections/mobile-cta-bar'), { ssr: false });
const PackageBuilder = dynamic(() => import('@/components/sections/package-builder'), { ssr: false });
const Comparison = dynamic(() => import('@/components/sections/comparison'), { ssr: false });
const QueueStatus = dynamic(() => import('@/components/sections/queue-status'), { ssr: false });
const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/sections/testimonials'), { ssr: false });
const UrgencyBlock = dynamic(() => import('@/components/sections/urgency-block'), { ssr: false });
const PersonalOfferBlock = dynamic(() => import('@/components/sections/personal-offer-block'), { ssr: false });

const XizmatlarClient = ({ lang, dictionary }: { lang: string, dictionary: any }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
    <div suppressHydrationWarning>
      {/* 1. Hero - Key entry point */}
      <ServicesHero onCtaClick={handleOpenServiceModal} dictionary={dictionary.servicesHero} />
      
      {/* 2. Why Us - Building trust early */}
      <WhyUs onCtaClick={handleOpenModal} lang={lang} />
      
      {/* 3. Service Sections - Explaining WHAT we do */}
      <ServiceSections lang={lang} dictionary={dictionary.serviceSections} />
      
      {/* 4. Package Builder - Interactive Pricing (Core value) */}
      {isClient && dictionary.servicesPage ? (
        <PackageBuilder onOrderNow={handleOpenModal} lang={lang} dictionary={dictionary.servicesPage.packageBuilder} />
      ) : (
        <div className="py-10 text-center px-4">
            <Skeleton className="h-[600px] w-full max-w-6xl mx-auto rounded-3xl" />
        </div>
      )}

      {isClient && (
        <>
          {/* 5. Comparison - Why us over others? */}
          <Comparison onCtaClick={handleOpenModal} lang={lang} />
          
          {/* 6. Trusted By - Social proof (logos) */}
          <TrustedBy lang={lang} dictionary={dictionary.trustedBy} />
          
          {/* 7. Testimonials - Social proof (stories) */}
          <Testimonials lang={lang} dictionary={dictionary.testimonials} />
          
          {/* 8. Personal Offer - Direct value pitch */}
          <PersonalOfferBlock onCtaClick={handleOpenModal} />
          
          {/* 9. Urgency - Why now? */}
          <UrgencyBlock />
          
          {/* 10. Queue Status - Scarcity & Social proof */}
          <QueueStatus onCtaClick={handleOpenModal} />
          
          {/* Sticky Mobile Call to Action */}
          <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />
        </>
      )}
    </div>
  );
};

export default XizmatlarClient;
