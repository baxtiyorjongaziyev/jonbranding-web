'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ClientEnhancements = dynamic(() => import('@/components/layout/client-enhancements'), {
  loading: () => null,
  ssr: false,
});

type ClientEnhancementsLoaderProps = {
  leadMagnetDictionary?: any;
  headerDictionary?: any;
  pwaDictionary?: any;
  lang?: string;
  stickyCtaLabel?: string;
  tabNotificationMessage?: string;
};

export default function ClientEnhancementsLoader(props: ClientEnhancementsLoaderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadEnhancements = (event?: Event) => {
      if (event?.type === 'openContactModal' && event instanceof CustomEvent) {
        (window as any).__pendingContactModal = event.detail || {};
      }
      if (event?.type === 'toggleOisha') (window as any).__pendingOisha = true;
      if (event?.type === 'openPwaInstallPrompt') (window as any).__pendingPwaInstall = true;
      setReady(true);
    };
    const onInteraction = () => loadEnhancements();
    window.addEventListener('openContactModal', loadEnhancements);
    window.addEventListener('toggleOisha', loadEnhancements);
    window.addEventListener('openPwaInstallPrompt', loadEnhancements);
    window.addEventListener('scroll', onInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', onInteraction, { once: true, passive: true });
    window.addEventListener('pointerdown', onInteraction, { once: true, passive: true });

    const id = globalThis.setTimeout(loadEnhancements, 2500);
    return () => {
      window.removeEventListener('openContactModal', loadEnhancements);
      window.removeEventListener('toggleOisha', loadEnhancements);
      window.removeEventListener('openPwaInstallPrompt', loadEnhancements);
      window.removeEventListener('scroll', onInteraction);
      window.removeEventListener('touchstart', onInteraction);
      window.removeEventListener('pointerdown', onInteraction);
      globalThis.clearTimeout(id);
    };
  }, []);

  if (!ready) return null;

  return <ClientEnhancements {...props} />;
}
