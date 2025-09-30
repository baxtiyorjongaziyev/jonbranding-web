
'use client';

import { useCallback } from 'react';
import MobileCtaBar from '@/components/sections/mobile-cta-bar';
import PackageBuilder from '@/components/sections/package-builder';
import Comparison from '@/components/sections/comparison';
import Offer from '@/components/sections/offer';
import QueueStatus from '@/components/sections/queue-status';
import ServicesHero from '@/components/sections/services-hero';
import WhyUs from '@/components/sections/why-us';
import ServiceSections from '@/components/sections/service-sections';
import TrustedBy from '@/components/sections/trusted-by';
import Testimonials from '@/components/sections/testimonials';

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
      <WhyUs onCtaClick={handleOpenModal} lang={lang} />
      <TrustedBy lang={lang} dictionary={dictionary.trustedBy} />
      <ServiceSections lang={lang} />
      <PackageBuilder onOrderNow={handleOpenModal} lang={lang} dictionary={dictionary.servicesPage.packageBuilder} />
      <Offer onCTAClick={handleOpenServiceModal} lang={lang} dictionary={dictionary.offer} />
      <QueueStatus onCtaClick={handleOpenModal} />
      <Testimonials lang={lang} dictionary={dictionary.testimonials} />
      <Comparison onCtaClick={handleOpenModal} lang={lang} />
      <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />
    </>
  );
};

export default XizmatlarClient;
