
'use client';

import { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MobileCtaBar = dynamic(() => import('@/components/sections/mobile-cta-bar'));
const PackageBuilder = dynamic(() => import('@/components/sections/package-builder'));
const Comparison = dynamic(() => import('@/components/sections/comparison'));
const QueueStatus = dynamic(() => import('@/components/sections/queue-status'));
const ServicesHero = dynamic(() => import('@/components/sections/services-hero'));
const WhyUs = dynamic(() => import('@/components/sections/why-us'));
const ServiceSections = dynamic(() => import('@/components/sections/service-sections'));
const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'));
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const UrgencyBlock = dynamic(() => import('@/components/sections/urgency-block'));
const PersonalOfferBlock = dynamic(() => import('@/components/sections/personal-offer-block'));

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
      <ServicesHero onCtaClick={handleOpenServiceModal} dictionary={dictionary.servicesHero} />
      <WhyUs onCtaClick={handleOpenModal} lang={lang} />
      <ServiceSections lang={lang} dictionary={dictionary.serviceSections} />
      
      {isClient && dictionary.servicesPage ? (
        <PackageBuilder onOrderNow={handleOpenModal} lang={lang} dictionary={dictionary.servicesPage.packageBuilder} />
      ) : (
        <div className="py-20 text-center text-gray-400">
            <Skeleton className="h-96 w-full max-w-6xl mx-auto rounded-3xl" />
        </div>
      )}

      <Comparison onCtaClick={handleOpenModal} lang={lang} />
      <TrustedBy lang={lang} dictionary={dictionary.trustedBy} />
      <Testimonials lang={lang} dictionary={dictionary.testimonials} />
      <PersonalOfferBlock onCtaClick={handleOpenModal} />
      <UrgencyBlock />
      <QueueStatus onCtaClick={handleOpenModal} />
      <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />
    </div>
  );
};

export default XizmatlarClient;
