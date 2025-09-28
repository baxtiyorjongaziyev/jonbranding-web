
'use client';

import { useCallback } from 'react';
import MobileCtaBar from '@/components/sections/mobile-cta-bar';
import PackageBuilder from '@/components/sections/package-builder';
import Comparison from '@/components/sections/comparison';
import Offer from '@/components/sections/offer';
import QueueStatus from '@/components/sections/queue-status';

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
      <PackageBuilder onOrderNow={handleOpenModal} lang={lang} dictionary={dictionary.packageBuilder} />
      <Comparison onCtaClick={handleOpenModal} lang={lang} />
      <Offer onCTAClick={handleOpenServiceModal} lang={lang} dictionary={dictionary.offer} />
      <QueueStatus onCtaClick={handleOpenModal} />
      <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />
    </>
  );
};

export default XizmatlarClient;
