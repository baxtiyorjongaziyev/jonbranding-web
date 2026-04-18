
'use client';

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || '';

export const initAmplitude = () => {
  if (typeof window !== 'undefined' && AMPLITUDE_API_KEY) {
    try {
      // The SDK is already initialized via Script tag in layout.tsx
      // This is a safety wrapper for any manual init calls.
      if (!window.amplitude) {
        const amplitude = require('@amplitude/analytics-browser');
        amplitude.init(AMPLITUDE_API_KEY, {
          defaultTracking: {
            pageViews: true,
            sessions: true,
            formInteractions: true,
            fileDownloads: true,
          },
        });
      }
    } catch (e) {
      console.warn('Amplitude Browser SDK initialization failed', e);
    }
  }
};

export const trackEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.amplitude) {
    try {
      window.amplitude.track(eventName, eventProperties);
    } catch (e) {
      console.warn('Amplitude track event failed', e);
    }
  }
};

export const setUserId = (userId: string) => {
  if (typeof window !== 'undefined' && window.amplitude) {
    try {
      window.amplitude.setUserId(userId);
    } catch (e) {
      console.warn('Amplitude setUserId failed', e);
    }
  }
};
