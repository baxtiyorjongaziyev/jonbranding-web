'use client';

const ADS_CONVERSION_ID = process.env.NEXT_PUBLIC_ADS_CONVERSION_ID || 'AW-17674872079';
export const DEFAULT_GA_ID = 'G-BTSGJQLMMV';

export type AnalyticsEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
};

export const generateEventId = (prefix = 'event') => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const getGaClientId = () => {
  if (typeof document === 'undefined') return undefined;

  const gaCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('_ga='))
    ?.split('=')[1];

  if (!gaCookie) return undefined;
  const parts = gaCookie.split('.');
  if (parts.length < 4) return undefined;

  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
};

const trackAmplitudeEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.amplitude) return;

  try {
    window.amplitude.track(eventName, eventProperties);
  } catch (e) {
    console.warn('Amplitude track event failed', e);
  }
};

export const trackEvent = ({ action, category, label, value, ...rest }: AnalyticsEvent) => {
  if (typeof window === 'undefined') return;

  const eventPayload = {
    event_category: category,
    event_label: label,
    value,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...rest,
  };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: action,
      category,
      label,
      ...eventPayload,
    });
  } catch (e) {
    console.warn('[Unified Analytics] dataLayer Error:', e);
  }

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, eventPayload);
    }
  } catch (e) {
    console.warn('[Unified Analytics] GA Error:', e);
  }

  try {
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', action, {
        content_category: category,
        content_name: label,
        value,
        ...rest,
      });
    }
  } catch (e) {
    console.warn('[Unified Analytics] Meta Error:', e);
  }

  try {
    trackAmplitudeEvent(action, {
      category,
      label,
      value,
      ...rest,
    });
  } catch (e) {
    console.warn('[Unified Analytics] Amplitude Error:', e);
  }
};

export const trackLead = (data: {
  source: string;
  value?: number;
  eventId?: string;
  serverTracked?: boolean;
  [key: string]: any;
}) => {
  if (typeof window === 'undefined') return;

  const { source, value, eventId, serverTracked, ...extraData } = data;
  const leadEventId = eventId || generateEventId('lead');
  const gaClientId = extraData.gaClientId || getGaClientId();
  const leadPayload = {
    source,
    event_id: leadEventId,
    ga_client_id: gaClientId,
    ...extraData,
  };

  try {
    trackEvent({
      action: serverTracked ? 'lead_confirmed' : 'generate_lead',
      category: 'Lead',
      label: source,
      value,
      ...leadPayload,
    });

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: `${ADS_CONVERSION_ID}/zVvKCJ_A5-YZEK_f8to-`,
        value: value || 1.0,
        currency: 'UZS',
        event_id: leadEventId,
        ...extraData,
      });
    }

    trackAmplitudeEvent('Lead Generated', {
      ...leadPayload,
      server_tracked: Boolean(serverTracked),
    });
  } catch (e) {
    console.error('[Unified Analytics] Lead Tracking failed but form submission should continue:', e);
  }
};

export const trackContactClick = (type: 'whatsapp' | 'telegram' | 'phone' | 'email', location = 'unknown') => {
  trackEvent({
    action: 'contact_click',
    category: 'Engagement',
    label: type,
    contact_type: type,
    location,
  });
};

export const trackCtaClick = (data: { ctaText: string; section: string; page?: string; source?: string }) => {
  trackEvent({
    action: 'cta_clicked',
    category: 'CTA',
    label: data.ctaText,
    cta_text: data.ctaText,
    section: data.section,
    page: data.page,
    source: data.source || 'website',
  });
};
