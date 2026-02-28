
'use client';

/**
 * @fileOverview Amplitude tracking configuration.
 * Uses both Browser and Node SDKs safely for Next.js.
 */

const AMPLITUDE_API_KEY = '1c82e6734ed6525393807b4e56f105a5';

export const initAmplitude = () => {
  if (typeof window !== 'undefined' && AMPLITUDE_API_KEY) {
    try {
      const amplitude = require('@amplitude/analytics-browser');
      amplitude.init(AMPLITUDE_API_KEY, {
        defaultTracking: {
          pageViews: true,
          sessions: true,
          formInteractions: true,
          fileDownloads: true,
        },
      });
    } catch (e) {
      console.warn('Amplitude Browser SDK initialization failed', e);
    }
  }
};

export const trackEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && AMPLITUDE_API_KEY) {
    try {
      const amplitude = require('@amplitude/analytics-browser');
      amplitude.track(eventName, eventProperties);
    } catch (e) {
      console.warn('Amplitude track event failed', e);
    }
  }
};

export const setUserId = (userId: string) => {
  if (typeof window !== 'undefined' && AMPLITUDE_API_KEY) {
    try {
      const amplitude = require('@amplitude/analytics-browser');
      amplitude.setUserId(userId);
    } catch (e) {
      console.warn('Amplitude setUserId failed', e);
    }
  }
};
