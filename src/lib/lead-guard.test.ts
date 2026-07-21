import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  HONEYPOT_FIELD,
  checkOrigin,
  guardLeadRequest,
  isHoneypotTripped,
  verifyTurnstile,
} from './lead-guard';

function mockRequest(headers: Record<string, string> = {}): Request {
  return {
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
  } as unknown as Request;
}

describe('lead-guard', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.TURNSTILE_SECRET_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('honeypot', () => {
    it('trips when the hidden field is filled', () => {
      expect(isHoneypotTripped({ [HONEYPOT_FIELD]: 'http://spam.test' })).toBe(true);
    });

    it('ignores empty, whitespace and absent values', () => {
      expect(isHoneypotTripped({ [HONEYPOT_FIELD]: '' })).toBe(false);
      expect(isHoneypotTripped({ [HONEYPOT_FIELD]: '   ' })).toBe(false);
      expect(isHoneypotTripped({ fullName: 'Sardor' })).toBe(false);
      expect(isHoneypotTripped(null)).toBe(false);
    });
  });

  describe('checkOrigin', () => {
    it('trusts the production domain', () => {
      expect(checkOrigin(mockRequest({ origin: 'https://jonbranding.uz' })).trusted).toBe(true);
    });

    it('trusts Vercel preview deployments', () => {
      const check = checkOrigin(mockRequest({ origin: 'https://jb-abc123.vercel.app' }));
      expect(check.trusted).toBe(true);
    });

    it('falls back to referer when origin is absent', () => {
      const check = checkOrigin(mockRequest({ referer: 'https://jonbranding.uz/narxlar' }));
      expect(check.trusted).toBe(true);
      expect(check.host).toBe('jonbranding.uz');
    });

    it('rejects a foreign origin', () => {
      const check = checkOrigin(mockRequest({ origin: 'https://spam.test' }));
      expect(check.trusted).toBe(false);
      expect(check.missing).toBe(false);
    });

    it('reports missing headers separately from untrusted ones', () => {
      const check = checkOrigin(mockRequest());
      expect(check.missing).toBe(true);
      expect(check.trusted).toBe(false);
    });
  });

  describe('verifyTurnstile', () => {
    it('skips verification when no secret is configured', async () => {
      const result = await verifyTurnstile('anything');
      expect(result).toEqual({ ok: true, skipped: true });
    });

    it('rejects a missing token when a secret is configured', async () => {
      process.env.TURNSTILE_SECRET_KEY = 'secret';
      const result = await verifyTurnstile('');
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('missing-token');
    });

    it('accepts a token Cloudflare confirms', async () => {
      process.env.TURNSTILE_SECRET_KEY = 'secret';
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      }));
      expect((await verifyTurnstile('good-token')).ok).toBe(true);
    });

    it('rejects a token Cloudflare denies', async () => {
      process.env.TURNSTILE_SECRET_KEY = 'secret';
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
      }));
      const result = await verifyTurnstile('bad-token');
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('invalid-input-response');
    });

    it('fails open on a 5xx siteverify response', async () => {
      process.env.TURNSTILE_SECRET_KEY = 'secret';
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => { throw new Error('not json'); },
      }));
      const result = await verifyTurnstile('token');
      expect(result.ok).toBe(true);
      expect(result.skipped).toBe(true);
    });

    it('lets the lead through when Cloudflare is unreachable', async () => {
      process.env.TURNSTILE_SECRET_KEY = 'secret';
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
      const result = await verifyTurnstile('token');
      expect(result.ok).toBe(true);
      expect(result.skipped).toBe(true);
    });
  });

  describe('guardLeadRequest', () => {
    const trusted = mockRequest({ origin: 'https://jonbranding.uz' });

    it('drops honeypot submissions', async () => {
      const verdict = await guardLeadRequest(
        trusted,
        { fullName: 'Bot', [HONEYPOT_FIELD]: 'spam' },
        '1.2.3.4',
        'test',
      );
      expect(verdict).toEqual({ action: 'drop', reason: 'honeypot' });
    });

    it('allows a clean submission', async () => {
      const verdict = await guardLeadRequest(trusted, { fullName: 'Sardor' }, '1.2.3.4', 'test');
      expect(verdict).toEqual({ action: 'allow' });
    });

    it('allows an untrusted origin through but does not drop it', async () => {
      const verdict = await guardLeadRequest(
        mockRequest({ origin: 'https://spam.test' }),
        { fullName: 'Sardor' },
        '1.2.3.4',
        'test',
      );
      expect(verdict).toEqual({ action: 'allow' });
    });

    it('rejects when Turnstile is configured and the token is absent', async () => {
      process.env.TURNSTILE_SECRET_KEY = 'secret';
      const verdict = await guardLeadRequest(trusted, { fullName: 'Sardor' }, '1.2.3.4', 'test');
      expect(verdict.action).toBe('reject');
    });
  });
});
