import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getAnalyticsLoaderScript } from './loader-script';
import { trackLead } from './index';

const ids = { gtmId: 'GTM-TEST', gaId: 'G-TEST', adsId: 'AW-TEST' };

const run = () => new Function(getAnalyticsLoaderScript(ids))();

const reset = () => {
  delete window.gtag;
  delete window.fbq;
  delete window.dataLayer;
  delete (window as unknown as Record<string, unknown>).analyticsLoaded;
  document.cookie = 'cookie_consent_accepted=; max-age=0; path=/';
  document.head.innerHTML = '<script></script>';
};

beforeEach(reset);
afterEach(reset);

describe('analytics loader script', () => {
  it('loads nothing before consent', () => {
    run();
    expect(window.gtag).toBeUndefined();
    expect(document.head.querySelectorAll('script[src]')).toHaveLength(0);
  });

  it('exposes a global gtag so lead conversions reach Google Ads', () => {
    document.cookie = 'cookie_consent_accepted=true; path=/';
    run();

    expect(typeof window.gtag).toBe('function');
    expect(window.dataLayer).toContainEqual(expect.objectContaining({ event: 'gtm.js' }));

    trackLead({ source: 'test_form', value: 100, eventId: 'lead_1' });

    const conversion = window.dataLayer!.find(
      (entry) => entry[0] === 'event' && entry[1] === 'conversion',
    );
    expect(conversion?.[2]).toEqual(
      expect.objectContaining({ event_id: 'lead_1', currency: 'UZS' }),
    );
  });

  it('loads each vendor once even if consent fires again', () => {
    run();
    window.dispatchEvent(new CustomEvent('cookie-consent-accepted'));
    window.dispatchEvent(new CustomEvent('cookie-consent-accepted'));

    const srcs = Array.from(document.head.querySelectorAll('script[src]'), (s) =>
      s.getAttribute('src'),
    );
    expect(srcs.filter((src) => src?.includes('gtm.js'))).toHaveLength(1);
    expect(srcs.filter((src) => src?.includes('gtag/js?id=G-TEST'))).toHaveLength(1);
  });
});
