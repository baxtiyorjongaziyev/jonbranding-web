'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/gtag';
import { Toaster } from '@/components/ui/toaster';
import CookieConsentBanner from '@/components/cookie-consent-banner';
import { trackCtaClick, trackEvent } from '@/lib/analytics';

const ContactModal = dynamic(() => import('@/components/contact-modal'), {
  loading: () => null,
  ssr: false,
});

const OishaWidget = dynamic(() => import('@/components/oisha-widget'), {
  ssr: false,
});

const LeadMagnetPopup = dynamic(() => import('@/components/ui/lead-magnet-popup'), {
  ssr: false,
});

const ScrollDepthTrigger = dynamic(() => import('@/components/scroll-depth-trigger'), {
  ssr: false,
});

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = () => {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
      trackEvent({
        action: 'page_viewed',
        category: 'Page',
        label: pathname,
        page_path: pathname,
        page_location: url,
      });
    };

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }

    const id = globalThis.setTimeout(run, 1500);
    return () => globalThis.clearTimeout(id);
  }, [pathname, searchParams]);

  return null;
}

export default function ClientEnhancements({ leadMagnetDictionary }: { leadMagnetDictionary?: any }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [packageSummary, setPackageSummary] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [enhancementsReady, setEnhancementsReady] = useState(false);

  const pathname = usePathname();
  const lang = (pathname.split('/')[1] || 'uz') as any;

  const handleOpenModal = useCallback(async (detail?: { section?: string; ctaText?: string; source?: string }) => {
    if (typeof window === 'undefined') return;

    let summary = '';
    let finalPrice = 0;

    try {
      const selectionsJSON = localStorage.getItem('selectedServices');
      const discountType = (localStorage.getItem('discountOption') || 'none').replace(/"/g, '');
      const promoCode = (localStorage.getItem('promoCode') || '').replace(/"/g, '');

      if (selectionsJSON) {
        const { calculatePackagePrice, generateSummary } = await import('@/lib/pricing');
        const selectedServices = JSON.parse(selectionsJSON);
        const selections = { selectedServices, discountType, promoCode };
        const priceDetails = calculatePackagePrice(selections, lang);

        if (priceDetails.base > 0) {
          summary = generateSummary(selections, lang);
          finalPrice = priceDetails.final;
        }
      }
    } catch (e) {
      console.error('Failed to parse package details from localStorage', e);
    }

    setPackageSummary(summary);
    setTotalPrice(finalPrice);
    trackCtaClick({
      ctaText: detail?.ctaText || 'Bepul Brand Audit olish',
      section: detail?.section || 'unknown',
      source: detail?.source || 'open_contact_modal',
    });
    trackEvent({
      action: 'contact_modal_requested',
      category: 'Lead Form',
      label: 'Brand Audit',
      lang,
      packageSummary: summary,
      totalPrice: finalPrice,
      section: detail?.section || 'unknown',
    });
    setModalOpen(true);
  }, [lang]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('closeContactModal'));
    }
  }, []);

  const reportError = useCallback((error: ErrorEvent) => {
    const { message, filename, lineno, colno, error: errorObj } = error;
    if (!message || message.includes('Telegram API Error') || message === 'Script error.' || (filename && !filename.includes(window.location.origin))) return;

    fetch('/api/report-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        stack: errorObj ? errorObj.stack : `${filename}:${lineno}:${colno}`,
        pathname: window.location.pathname,
        userInfo: navigator.userAgent,
      }),
    }).catch((e) => console.error('Failed to report error:', e));
  }, []);

  useEffect(() => {
    const listener = (event: Event) => {
      void handleOpenModal((event as CustomEvent).detail || {});
    };
    window.addEventListener('openContactModal', listener);
    window.addEventListener('error', reportError);

    return () => {
      window.removeEventListener('openContactModal', listener);
      window.removeEventListener('error', reportError);
    };
  }, [handleOpenModal, reportError]);

  useEffect(() => {
    const fallback = window.setTimeout(() => setEnhancementsReady(true), 6000);
    return () => {
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {enhancementsReady && (
        <ScrollDepthTrigger
          onTrigger={handleOpenModal}
          threshold={0.88}
          sessionKey="contact_modal_auto_popup_v1"
        />
      )}
      <Toaster />
      {isModalOpen && (
        <ContactModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          packageSummary={packageSummary}
          totalPrice={totalPrice}
          onFormSubmitSuccess={handleCloseModal}
          lang={lang}
        />
      )}
      {enhancementsReady && <CookieConsentBanner />}
      {enhancementsReady && <OishaWidget lang={lang} />}
      {enhancementsReady && leadMagnetDictionary && <LeadMagnetPopup dictionary={leadMagnetDictionary} />}
    </>
  );
}
