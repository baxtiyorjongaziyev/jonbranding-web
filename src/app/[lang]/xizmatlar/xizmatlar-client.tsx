
'use client';

import { useCallback, useEffect } from 'react';
import MobileCtaBar from '@/components/sections/mobile-cta-bar';

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

  // Effect to re-wire event handlers for server-rendered components that have client-side interactions
  useEffect(() => {
    const comparisonCta = document.querySelector('#comparison-cta');
    if (comparisonCta) {
      comparisonCta.addEventListener('click', handleOpenModal);
    }
    
    const offerCta = document.querySelector('#offer-cta');
    if(offerCta) {
        offerCta.addEventListener('click', handleOpenServiceModal);
    }

    const queueCta = document.querySelector('#queue-cta');
    if(queueCta) {
        queueCta.addEventListener('click', handleOpenModal);
    }
    
    const packageBuilderCta = document.querySelector('#package-builder-cta');
     if(packageBuilderCta) {
        packageBuilderCta.addEventListener('click', handleOpenModal);
    }


    return () => {
      if (comparisonCta) {
        comparisonCta.removeEventListener('click', handleOpenModal);
      }
       if(offerCta) {
        offerCta.removeEventListener('click', handleOpenServiceModal);
    }
     if(queueCta) {
        queueCta.removeEventListener('click', handleOpenModal);
    }
    if(packageBuilderCta) {
        packageBuilderCta.removeEventListener('click', handleOpenModal);
    }
    };
  }, [handleOpenModal, handleOpenServiceModal]);

  return <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary} />;
};

export default XizmatlarClient;
