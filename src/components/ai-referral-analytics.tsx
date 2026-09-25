'use client';

import { useEffect } from 'react';
import { identifyAiReferrer } from '@/lib/seo';

export default function AiReferralAnalytics() {
  useEffect(() => {
    const source = identifyAiReferrer(document.referrer);
    if (!source) return;

    let attempts = 0;
    const report = () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'ai_referral', {
          ai_source: source,
          page_path: window.location.pathname,
          page_location: window.location.href,
        });
        return;
      }

      // Analitika cookie roziligidan keyin (birinchi tashrifda ~6 s) yuklanadi.
      attempts += 1;
      if (attempts < 30) window.setTimeout(report, 1000);
    };

    report();
  }, []);

  return null;
}
