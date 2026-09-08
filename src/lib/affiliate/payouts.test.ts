import { describe, expect, it } from 'vitest';
import { PAYOUT_AMOUNTS, payoutAmount, serviceFromHint } from './payouts';

describe('PAYOUT_AMOUNTS', () => {
  it('holds the agreed bonus table', () => {
    expect(PAYOUT_AMOUNTS).toEqual({
      naming: 500_000,
      logo: 500_000,
      patent: 500_000,
      packaging: 800_000,
      full_branding: 1_200_000,
    });
  });
});

describe('payoutAmount', () => {
  it('returns the amount for a service', () => {
    expect(payoutAmount('packaging')).toBe(800_000);
    expect(payoutAmount('full_branding')).toBe(1_200_000);
  });
});

describe('serviceFromHint', () => {
  it('maps a direct service key', () => {
    expect(serviceFromHint('logo')).toBe('logo');
    expect(serviceFromHint('naming')).toBe('naming');
  });

  it('maps calculator service ids to payout services', () => {
    expect(serviceFromHint('namingVIP')).toBe('naming');
    expect(serviceFromHint('namingPremium')).toBe('naming');
    expect(serviceFromHint('namingStandard')).toBe('naming');
    expect(serviceFromHint('namingCheck')).toBe('naming');
    expect(serviceFromHint('logoPremium')).toBe('logo');
    expect(serviceFromHint('logoVIP')).toBe('logo');
    expect(serviceFromHint('patentCheck')).toBe('patent');
  });

  it('picks full_branding when present among many', () => {
    expect(serviceFromHint(['logo', 'naming', 'full_branding'])).toBe('full_branding');
    expect(serviceFromHint(['logoVIP', 'packaging', 'fullBranding'])).toBe('full_branding');
  });

  it('picks the most valuable service when no full_branding', () => {
    expect(serviceFromHint(['naming', 'packaging'])).toBe('packaging');
    expect(serviceFromHint(['logo', 'naming'])).toBe('logo'); // tie → first-of-equal by table order is fine
  });

  it('parses a comma/plus separated string', () => {
    expect(serviceFromHint('naming, packaging')).toBe('packaging');
    expect(serviceFromHint('logoVIP + packaging')).toBe('packaging');
  });

  it('returns null for unknown or empty', () => {
    expect(serviceFromHint('')).toBeNull();
    expect(serviceFromHint(null)).toBeNull();
    expect(serviceFromHint('urgency')).toBeNull();
    expect(serviceFromHint(['nda', 'urgency'])).toBeNull();
  });
});
