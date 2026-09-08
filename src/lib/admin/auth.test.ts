import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ADMIN_COOKIE, createAdminSession, verifyAdminSession } from './auth';

const SECRET = 'test-admin-secret-value';

beforeEach(() => {
  process.env.ADMIN_SECRET = SECRET;
});
afterEach(() => {
  delete process.env.ADMIN_SECRET;
});

describe('admin session', () => {
  it('exposes the cookie name', () => {
    expect(ADMIN_COOKIE).toBe('admin_session');
  });

  it('round-trips a freshly created session', () => {
    const now = 1_000_000_000_000;
    const token = createAdminSession(now);
    expect(verifyAdminSession(token, now + 1000)).toBe(true);
  });

  it('rejects an expired session', () => {
    const now = 1_000_000_000_000;
    const token = createAdminSession(now);
    const eightDays = 8 * 24 * 60 * 60 * 1000;
    expect(verifyAdminSession(token, now + eightDays)).toBe(false);
  });

  it('rejects a tampered signature', () => {
    const now = 1_000_000_000_000;
    const token = createAdminSession(now);
    const [exp] = token.split('.');
    expect(verifyAdminSession(`${exp}.deadbeef`, now)).toBe(false);
  });

  it('rejects a tampered expiry', () => {
    const now = 1_000_000_000_000;
    const token = createAdminSession(now);
    const [, sig] = token.split('.');
    const farFuture = now + 999 * 24 * 60 * 60 * 1000;
    expect(verifyAdminSession(`${farFuture}.${sig}`, now)).toBe(false);
  });

  it('rejects empty / malformed input', () => {
    expect(verifyAdminSession(undefined)).toBe(false);
    expect(verifyAdminSession('')).toBe(false);
    expect(verifyAdminSession('no-dot')).toBe(false);
  });

  it('rejects everything when ADMIN_SECRET is unset', () => {
    const token = createAdminSession(1_000_000_000_000);
    delete process.env.ADMIN_SECRET;
    expect(verifyAdminSession(token, 1_000_000_000_000)).toBe(false);
  });
});
