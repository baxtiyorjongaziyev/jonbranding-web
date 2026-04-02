
'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';

const MobileCtaBar = dynamic(() => import('@/components/sections/mobile-cta-bar'));
const PackageBuilder = dynamic(() => import('@/components/sections/package-builder'));
const Comparison = dynamic(() => import('@/components/sections/comparison'));
const QueueStatus = dynamic(() => import('@/components/sections/queue-status'));
const ServicesHero = dynamic(() => import('@/components/sections/services-hero'));
const WhyUs = dynamic(() => import('@/components/sections/why-us'));
const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <div className="py-20 text-center text-gray-400">Bu blokda nima bor edi?</div>
});
const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'));
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const UrgencyBlock = dynamic(() => import('@/components/sections/urgency-block'));
const PersonalOfferBlock = dynamic(() => import('@/components/sections/personal-offer-block'));

const XizmatlarClient = ({ lang, dictionary }: { lang: string, dictionary: any }) => {
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


  return (
    <>
      <ServicesHero onCtaClick={handleOpenServiceModal} dictionary={dictionary.servicesHero} />
      <WhyUs onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.whyUs} />
      <TrustedBy lang={lang} dictionary={dictionary.trustedBy} />
      <ServiceSections lang={lang} dictionary={dictionary.serviceSections} />
      <PackageBuilder onOrderNow={handleOpenModal} lang={lang} dictionary={dictionary.servicesPage.packageBuilder} />
      <UrgencyBlock />
      <PersonalOfferBlock onCtaClick={handleOpenModal} />
      <QueueStatus onCtaClick={handleOpenModal} />
      <Testimonials lang={lang} dictionary={dictionary.testimonials} />
      <Comparison onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.comparison} />
      <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />
    </>
  );
};

export default XizmatlarClient;
