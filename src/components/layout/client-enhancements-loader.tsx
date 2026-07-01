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
  lang?: string;
  stickyCtaLabel?: string;
  tabNotificationMessage?: string;
};

export default function ClientEnhancementsLoader(props: ClientEnhancementsLoaderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadEnhancements = (event?: Event) => {
      if (event instanceof CustomEvent) {
        (window as any).__pendingContactModal = event.detail || {};
      }
      setReady(true);
    };
    window.addEventListener('openContactModal', loadEnhancements);

    const id = globalThis.setTimeout(loadEnhancements, 6000);
    return () => {
      window.removeEventListener('openContactModal', loadEnhancements);
      globalThis.clearTimeout(id);
    };
  }, []);

  if (!ready) return null;

  return <ClientEnhancements {...props} />;
}
