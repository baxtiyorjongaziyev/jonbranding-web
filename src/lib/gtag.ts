'use client';

// This should match the GA_TRACKING_ID in your environment
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  if (typeof window.gtag !== 'function' || !GA_TRACKING_ID) {
    return;
  }
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = (name: string, params: Record<string, any>) => {
  if (typeof window.gtag !== 'function' || !GA_TRACKING_ID) {
    return;
  }
  window.gtag('event', name, params);
};
