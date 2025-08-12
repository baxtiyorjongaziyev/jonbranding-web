'use client';

export const pageview = (url: string) => {
  if (typeof window.gtag !== 'function' || !window.__ENV__?.NEXT_PUBLIC_GA_ID) {
    return;
  }
  window.gtag('config', window.__ENV__.NEXT_PUBLIC_GA_ID, {
    page_path: url,
  });
};

export const event = (name: string, params: Record<string, any>) => {
  if (typeof window.gtag !== 'function' || !window.__ENV__?.NEXT_PUBLIC_GA_ID) {
    return;
  }
  window.gtag('event', name, params);
};
