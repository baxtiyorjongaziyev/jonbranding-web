
'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';

const PackageBuilder = dynamic(() => import('@/components/sections/package-builder'));
const Comparison = dynamic(() => import('@/components/sections/comparison'));
const QueueStatus = dynamic(() => import('@/components/sections/queue-status'));
const ServicesHero = dynamic(() => import('@/components/sections/services-hero'));
const WhyUs = dynamic(() => import('@/components/sections/why-us'));
const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => null
});
const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'));
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const UrgencyBlock = dynamic(() => import('@/components/sections/urgency-block'));
const PersonalOfferBlock = dynamic(() => import('@/components/sections/personal-offer-block'));

const XizmatlarClient = ({ lang, dictionary }: { lang: string, dictionary: any }) => {
  const handleOpenModal = useCallback(() => {
    const event = new CustomEvent('openContactModal', {
      detail: {
        section: 'services_page',
        ctaText: dictionary?.header?.free_consultation || '',
        source: 'services_page',
      },
    });
    window.dispatchEvent(event);
  }, [dictionary]);

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
    </>
  );
};

export default XizmatlarClient;
