'use client';

import { useEffect, useState } from 'react';

const MAIN_SITE_ORIGIN = 'https://www.jonbranding.uz';

// patent.jonbranding.uz da `/` menejer kalkulyatori, shuning uchun nisbiy
// havolalar (`/`, `/#portfolio`) yana kalkulyatorga qaytadi — fragment
// serverga yetib bormaydi, proxy ularni ajrata olmaydi. Subdomenda menyu
// havolalari asosiy sayt manziliga absolyut qilinadi.
export function useMainSiteOrigin(): string {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    if (window.location.hostname.toLowerCase().startsWith('patent.')) setOrigin(MAIN_SITE_ORIGIN);
  }, []);
  return origin;
}
