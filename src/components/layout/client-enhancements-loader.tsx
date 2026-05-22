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
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }

    const id = globalThis.setTimeout(() => setReady(true), 2200);
    return () => globalThis.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return <ClientEnhancements {...props} />;
}
