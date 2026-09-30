import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ADMIN_COOKIE,
  createAdminSession,
  createTeamSession,
  verifyAdminSession,
  verifyTeamSession,
} from './auth';

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

describe('sales team session', () => {
  afterEach(() => {
    delete process.env.SALES_TEAM_SECRET;
  });

  it('round-trips with its own secret', () => {
    process.env.SALES_TEAM_SECRET = 'team-pass';
    const now = 1_000_000_000_000;
    expect(verifyTeamSession(createTeamSession(now), now + 1000)).toBe(true);
  });

  it('never passes as an admin session, even with an identical secret', () => {
    process.env.SALES_TEAM_SECRET = SECRET;
    const now = 1_000_000_000_000;
    const teamToken = createTeamSession(now);
    expect(verifyAdminSession(teamToken, now)).toBe(false);
    expect(verifyTeamSession(createAdminSession(now), now)).toBe(false);
  });

  it('fails closed when SALES_TEAM_SECRET is unset', () => {
    expect(verifyTeamSession('123.abc')).toBe(false);
    expect(() => createTeamSession()).toThrow();
  });
});
