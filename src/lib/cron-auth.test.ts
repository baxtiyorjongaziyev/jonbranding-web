import { afterEach, describe, expect, it, vi } from 'vitest';
import { isAuthorizedCronRequest } from './cron-auth';

const req = (url: string, auth?: string) =>
  new Request(url, auth ? { headers: { authorization: auth } } : undefined);

afterEach(() => vi.unstubAllEnvs());

describe('isAuthorizedCronRequest', () => {
  it('accepts either configured secret as a Bearer token', () => {
    vi.stubEnv('CRON_SECRET', 'cron-1');
    vi.stubEnv('AMOCRM_CRON_SECRET', 'amo-2');
    expect(isAuthorizedCronRequest(req('https://x/api/a', 'Bearer cron-1'))).toBe(true);
    expect(isAuthorizedCronRequest(req('https://x/api/a', 'Bearer amo-2'))).toBe(true);
    expect(isAuthorizedCronRequest(req('https://x/api/a', 'Bearer nope'))).toBe(false);
  });

  it('no longer accepts the secret in the query string', () => {
    vi.stubEnv('CRON_SECRET', 'cron-1');
    expect(isAuthorizedCronRequest(req('https://x/api/a?secret=cron-1'))).toBe(false);
  });

  it('fails closed when nothing is configured', () => {
    vi.stubEnv('CRON_SECRET', '');
    vi.stubEnv('AMOCRM_CRON_SECRET', '');
    expect(isAuthorizedCronRequest(req('https://x/api/a', 'Bearer '))).toBe(false);
  });
});
