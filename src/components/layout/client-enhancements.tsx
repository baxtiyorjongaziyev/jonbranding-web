'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/analytics/gtag';
import { Toaster } from '@/components/ui/toaster';
import { trackCtaClick, trackEvent } from '@/lib/analytics';
import LeadModal from '@/components/sales/lead-modal';
import { getSalesContent } from '@/lib/sales-content';

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

const PwaInstaller = dynamic(() => import('@/components/pwa/pwa-installer'), {
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
  pwaDictionary?: any;
  lang?: string;
  stickyCtaLabel?: string;
  tabNotificationMessage?: string;
};

export default function ClientEnhancements({
  leadMagnetDictionary,
  headerDictionary,
  pwaDictionary,
  lang: langProp,
  tabNotificationMessage,
}: ClientEnhancementsProps) {
  const [enhancementsReady, setEnhancementsReady] = useState(false);
  const [quickActionsReady, setQuickActionsReady] = useState(false);
  const [installRequest, setInstallRequest] = useState(0);
  const [chatRequest, setChatRequest] = useState(0);
  const [leadRequest, setLeadRequest] = useState<{ service: string; source: string; intent: 'consultation' | 'project' } | null>(null);

  // Capture clicks before the lazy widgets have downloaded and mounted.
  useEffect(() => {
    const install = () => { delete (window as any).__pendingPwaInstall; setQuickActionsReady(true); setInstallRequest(count => count + 1); };
    const chat = () => { delete (window as any).__pendingOisha; setEnhancementsReady(true); setChatRequest(count => count + 1); };
    window.addEventListener('openPwaInstallPrompt', install);
    window.addEventListener('toggleOisha', chat);
    if ((window as any).__pendingPwaInstall) install();
    if ((window as any).__pendingOisha) chat();
    return () => {
      window.removeEventListener('openPwaInstallPrompt', install);
      window.removeEventListener('toggleOisha', chat);
    };
  }, []);

  const pathname = usePathname();
  const lang = (langProp || pathname.split('/')[1] || 'uz') as any;
  const pathnameWithoutLocale = pathname.replace(/^\/(uz|ru|en|zh)(?=\/|$)/, '') || '/';
  // Taqdimot sahifasi: chat widget, popup va mobil nav slaydlar ustiga
  // tushib, ekran ulashuvda ko'rinib qoladi.
  const isDeck = pathnameWithoutLocale === '/credentials';

  // One contextual form owns website CTAs; the external widget keeps call tracking.
  const trackCtaRequest = useCallback((detail?: { section?: string; ctaText?: string; source?: string }) => {
    trackCtaClick({
      ctaText: detail?.ctaText || 'Bepul konsultatsiya',
      section: detail?.section || 'unknown',
      source: detail?.source || 'open_contact_modal',
    });
    trackEvent({
      action: 'lead_form_requested',
      category: 'Lead Form',
      label: 'Website lead form',
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
      const detail = (event as CustomEvent).detail || {};
      trackCtaRequest(detail);
      setLeadRequest({ service: detail.service || getSalesContent(lang).ui.notSure, source: detail.source || detail.section || 'website', intent: detail.intent === 'project' ? 'project' : 'consultation' });
    };
    window.addEventListener('openContactModal', listener);
    window.addEventListener('error', reportError);

    const pendingContactModal = (window as any).__pendingContactModal;
    if (pendingContactModal) {
      delete (window as any).__pendingContactModal;
      trackCtaRequest(pendingContactModal);
      setLeadRequest({ service: pendingContactModal.service || getSalesContent(lang).ui.notSure, source: pendingContactModal.source || 'website', intent: pendingContactModal.intent === 'project' ? 'project' : 'consultation' });
    }

    return () => {
      window.removeEventListener('openContactModal', listener);
      window.removeEventListener('error', reportError);
    };
  }, [trackCtaRequest, reportError, lang]);

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
      {leadRequest && <LeadModal open onClose={() => setLeadRequest(null)} presetService={leadRequest.service} source={leadRequest.source} intent={leadRequest.intent} lang={lang} />}
      {quickActionsReady && tabNotificationMessage && <TabNotification message={tabNotificationMessage} />}
      {quickActionsReady && !isDeck && headerDictionary && <MobileNavBar lang={lang} dictionary={headerDictionary} />}
      {quickActionsReady && !isDeck && <PwaInstaller lang={lang} dictionary={pwaDictionary} installRequest={installRequest} />}
      {enhancementsReady && !isDeck && <CookieConsentBanner />}
      {enhancementsReady && !isDeck && <OishaWidget lang={lang} chatRequest={chatRequest} />}
      {enhancementsReady && !isDeck && <ProactiveTrigger lang={lang} />}
      {enhancementsReady && !isDeck && leadMagnetDictionary?.roleSelection && <LeadMagnetPopup dictionary={leadMagnetDictionary} />}

    </>
  );
}
