import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ATTRIBUTION_TTL_MS, attributionFromVisit, captureLeadAttribution, getLeadAttribution } from './lead-attribution';

const KEY = 'jb_lead_attribution_v1';

function visit(path: string, referrer = '') {
  window.history.replaceState(null, '', path);
  Object.defineProperty(document, 'referrer', { value: referrer, configurable: true });
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  visit('/');
  vi.restoreAllMocks();
});

describe('attributionFromVisit', () => {
  it('reads UTM tags and the landing page', () => {
    expect(attributionFromVisit('https://www.jonbranding.uz/narxlar?utm_source=google&utm_medium=cpc&utm_campaign=logo&x=1', '')).toEqual({
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'logo',
      landingPage: '/narxlar',
    });
  });

  it('keeps an external referrer without its query string', () => {
    expect(attributionFromVisit('https://www.jonbranding.uz/', 'https://www.instagram.com/p/abc/?igsh=secret')).toEqual({
      referrer: 'https://www.instagram.com/p/abc/',
      landingPage: '/',
    });
  });

  it('ignores our own site, its subdomains and direct visits', () => {
    expect(attributionFromVisit('https://www.jonbranding.uz/portfolio', 'https://jonbranding.uz/')).toBeNull();
    expect(attributionFromVisit('https://www.jonbranding.uz/portfolio', 'https://patent.jonbranding.uz/x')).toBeNull();
    expect(attributionFromVisit('https://www.jonbranding.uz/portfolio', '')).toBeNull();
  });

  it('clips oversized values to what the lead API accepts', () => {
    const result = attributionFromVisit(`https://www.jonbranding.uz/?utm_campaign=${'a'.repeat(500)}`, '');
    expect(result?.utmCampaign).toHaveLength(200);
  });
});

describe('capture and read back across pages', () => {
  it('remembers the ad landing when the visitor writes from another page', () => {
    visit('/narxlar?utm_source=meta&utm_campaign=reels', 'https://l.instagram.com/');
    captureLeadAttribution();
    visit('/portfolio', 'http://localhost:3000/narxlar');
    captureLeadAttribution();
    expect(getLeadAttribution()).toEqual({
      utmSource: 'meta',
      utmCampaign: 'reels',
      referrer: 'https://l.instagram.com',
      landingPage: '/narxlar',
    });
  });

  it('lets a newer campaign visit replace the older one', () => {
    visit('/?utm_source=google');
    captureLeadAttribution();
    visit('/?utm_source=telegram');
    captureLeadAttribution();
    visit('/aloqa');
    expect(getLeadAttribution().utmSource).toBe('telegram');
  });

  it('forgets attribution older than 30 days', () => {
    visit('/?utm_source=google');
    captureLeadAttribution(1_000);
    visit('/aloqa');
    expect(getLeadAttribution(1_000 + ATTRIBUTION_TTL_MS + 1)).toEqual({});
  });

  it('ignores a tampered stored value', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ utmSource: { evil: true }, capturedAt: Date.now() }));
    expect(getLeadAttribution()).toEqual({});
  });

  it('still works when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    visit('/?utm_source=google');
    expect(() => captureLeadAttribution()).not.toThrow();
    expect(getLeadAttribution().utmSource).toBe('google');
  });
});
