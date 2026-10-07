'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/analytics/gtag';
import { Toaster } from '@/components/ui/toaster';
import { trackCtaClick, trackEvent } from '@/lib/analytics';

const OishaWidget = dynamic(() => import('@/components/oisha-widget'), {
  ssr: false,
});

const LeadMagnetPopup = dynamic(() => import('@/components/ui/lead-magnet-popup'), {
  ssr: false,
});

const CookieConsentBanner = dynamic(() => import('@/components/cookie-consent-banner'), {
  ssr: false,
});

const ProactiveTrigger = dynamic(() => import('@/components/proactive-trigger'), {
  ssr: false,
});

const MobileNavBar = dynamic(() => import('@/components/layout/mobile-nav-bar'), {
  loading: () => null,
  ssr: false,
});

const TabNotification = dynamic(() => import('@/components/layout/tab-notification'), {
  loading: () => null,
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

type ClientEnhancementsProps = {
  leadMagnetDictionary?: any;
  headerDictionary?: any;
  lang?: string;
  stickyCtaLabel?: string;
  tabNotificationMessage?: string;
};

export default function ClientEnhancements({
  leadMagnetDictionary,
  headerDictionary,
  lang: langProp,
  tabNotificationMessage,
}: ClientEnhancementsProps) {
  const [enhancementsReady, setEnhancementsReady] = useState(false);
  const [quickActionsReady, setQuickActionsReady] = useState(false);

  const pathname = usePathname();
  const lang = (langProp || pathname.split('/')[1] || 'uz') as any;
  const pathnameWithoutLocale = pathname.replace(/^\/(uz|ru|en|zh)(?=\/|$)/, '') || '/';
  // Taqdimot sahifasi: chat widget, popup va mobil nav slaydlar ustiga
  // tushib, ekran ulashuvda ko'rinib qoladi.
  const isDeck = pathnameWithoutLocale === '/credentials';

  // Ariza formasini endi Oisha callback vidjeti ochadi (`data-oisha-callback`
  // atributi orqali). `openContactModal` hodisasi faqat CTA analitikasi uchun qoldi.
  const trackCtaRequest = useCallback((detail?: { section?: string; ctaText?: string; source?: string }) => {
    trackCtaClick({
      ctaText: detail?.ctaText || 'Bepul konsultatsiya',
      section: detail?.section || 'unknown',
      source: detail?.source || 'open_contact_modal',
    });
    trackEvent({
      action: 'callback_widget_requested',
      category: 'Lead Form',
      label: 'Oisha callback',
      lang,
      section: detail?.section || 'unknown',
    });
  }, [lang]);

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
      delete (window as any).__pendingContactModal;
      trackCtaRequest((event as CustomEvent).detail || {});
    };
    window.addEventListener('openContactModal', listener);
    window.addEventListener('error', reportError);

    const pendingContactModal = (window as any).__pendingContactModal;
    if (pendingContactModal) {
      delete (window as any).__pendingContactModal;
      trackCtaRequest(pendingContactModal);
    }

    return () => {
      window.removeEventListener('openContactModal', listener);
      window.removeEventListener('error', reportError);
    };
  }, [trackCtaRequest, reportError]);

  useEffect(() => {
    const quickActions = window.setTimeout(() => setQuickActionsReady(true), 3500);
    const fallback = window.setTimeout(() => setEnhancementsReady(true), 6000);
    return () => {
      window.clearTimeout(quickActions);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      <Toaster />
      {quickActionsReady && tabNotificationMessage && <TabNotification message={tabNotificationMessage} />}
      {quickActionsReady && !isDeck && headerDictionary && <MobileNavBar lang={lang} dictionary={headerDictionary} />}
      {enhancementsReady && !isDeck && <CookieConsentBanner />}
      {enhancementsReady && !isDeck && <OishaWidget lang={lang} />}
      {enhancementsReady && !isDeck && <ProactiveTrigger lang={lang} />}
      {enhancementsReady && !isDeck && leadMagnetDictionary && <LeadMagnetPopup dictionary={leadMagnetDictionary} />}

    </>
  );
}
