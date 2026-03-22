'use client';

// Tracking IDs
const GA_TRACKING_ID = "G-B3ZSKB40XY";
const ADS_CONVERSION_ID = "AW-17674872079";
const FB_PIXEL_ID = "1134785364752294";

// Types for analytics
export type AnalyticsEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
};

/**
 * Universal event tracking function
 */
export const trackEvent = ({ action, category, label, value, ...rest }: AnalyticsEvent) => {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics (GA4)
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  }

  // 2. Facebook Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', action, {
      content_category: category,
      content_name: label,
      value: value,
      ...rest,
    });
  }
  
  console.log(`[Analytics] Event tracked: ${action}`, { category, label, value, ...rest });
};

/**
 * Specifically for Lead conversions (Forms, Signups)
 */
export const trackLead = (data: { source: string; value?: number; [key: string]: any }) => {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics
  trackEvent({
    action: 'generate_lead',
    category: 'Lead',
    label: data.source,
    value: data.value,
    ...data
  });

  // 2. Facebook Pixel (Standard Lead Event)
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: data.source,
      value: data.value,
      currency: 'UZS'
    });
  }

  // 3. Google Ads Conversion
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      'send_to': `${ADS_CONVERSION_ID}/zVvKCJ_A5-YZEK_f8to-`, // Example conversion label if known, or just use the ID
      'value': data.value || 1.0,
      'currency': 'UZS'
    });
  }
  
  console.log(`[Analytics] LEAD tracked from: ${data.source}`);
};

/**
 * Track clicks on social/contact buttons
 */
export const trackContactClick = (type: 'whatsapp' | 'telegram' | 'phone' | 'email') => {
  trackEvent({
    action: 'contact_click',
    category: 'Engagement',
    label: type,
  });
};
