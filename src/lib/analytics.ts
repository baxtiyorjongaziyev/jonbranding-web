'use client';
import { trackEvent as trackAmplitudeEvent } from './amplitude';

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

  try {
    // 1. Google Analytics (GA4)
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...rest,
      });
    }
  } catch (e) {
    console.warn('[Unified Analytics] GA Error:', e);
  }

  try {
    // 2. Facebook Pixel (Meta)
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', action, {
        content_category: category,
        content_name: label,
        value: value,
        ...rest,
      });
    }
  } catch (e) {
    console.warn('[Unified Analytics] Meta Error:', e);
  }

  try {
    // 3. Amplitude
    trackAmplitudeEvent(action, {
      category,
      label,
      value,
      ...rest,
    });
  } catch (e) {
    console.warn('[Unified Analytics] Amplitude Error:', e);
  }
  
  console.log(`[Unified Analytics] Event: ${action}`, { category, label, value, ...rest });
};

/**
 * Specifically for Lead conversions (Forms, Signups)
 */
export const trackLead = (data: { source: string; value?: number; [key: string]: any }) => {
  if (typeof window === 'undefined') return;
  const { source, value, ...extraData } = data;

  try {
    // 1. Google Analytics
    trackEvent({
      action: 'generate_lead',
      category: 'Lead',
      label: source,
      value: value,
      ...extraData
    });

    // 2. Facebook Pixel (Meta Standard Lead Event)
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: source,
        value: value,
        currency: 'UZS',
        ...extraData
      });
    }

    // 3. Google Ads Conversion
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': `${ADS_CONVERSION_ID}/zVvKCJ_A5-YZEK_f8to-`,
        'value': value || 1.0,
        'currency': 'UZS',
        ...extraData
      });
    }

    // 4. Amplitude (Rich Lead Event)
    trackAmplitudeEvent('Lead Generated', {
      source,
      value,
      ...extraData
    });
  } catch (e) {
    console.error('[Unified Analytics] Lead Tracking failed but form submission should continue:', e);
  }
  
  console.log(`[Unified Analytics] LEAD tracked from: ${source}`, extraData);
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
