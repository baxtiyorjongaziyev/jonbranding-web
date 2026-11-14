import { webcrypto, createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { secureWebsiteResponse } from './website-response-security';
import { verifiedWebsiteRole } from './website-admin-session';
import { guardWebsiteRequest, type WebsiteGuardEnv } from './website-edge-guard';

const site = 'https://jonbranding.uz';
const secret = 'synthetic-unit-test-admin-key';
function signed(role: 'admin' | 'team', expiry = Date.now() + 60000) {
  const value = String(expiry);
  return `${role}_session=${value}.${createHmac('sha256', secret).update(role === 'team' ? `team:${value}` : value).digest('hex')}`;
}
function env(): WebsiteGuardEnv {
  const limit = async () => ({ success: true });
  const limiter = { limit };
  return { ADMIN_SECRET: secret, SALES_TEAM_SECRET: secret, JB_API_LIMIT: limiter, JB_FORM_LIMIT: limiter, JB_CONTACT_LIMIT: limiter, JB_LOGIN_LIMIT: limiter, JB_PAGE_LIMIT: limiter };
}
beforeEach(() => vi.stubGlobal('crypto', webcrypto));
afterEach(() => vi.unstubAllGlobals());

describe('privileged website boundary', () => {
  it('accepts existing signed cookies and keeps team/admin roles separate', async () => {
    const request = (cookie: string) => new Request(site, { headers: { cookie } });
    expect(await verifiedWebsiteRole(request(signed('admin')), env())).toBe(true);
    expect(await verifiedWebsiteRole(request(signed('team')), env())).toBe(false);
    expect(await verifiedWebsiteRole(request(signed('team')), env(), 'team')).toBe(true);
    expect(await verifiedWebsiteRole(request(signed('team').replace('team_session', 'admin_session')), env())).toBe(false);
  });
  it('rejects expired, malformed, forged and excessively long-lived sessions', async () => {
    for (const cookie of [signed('admin', Date.now() - 1000), signed('admin', Date.now() + 8 * 86400000), signed('admin') + '.extra', signed('admin').replace(/.$/, 'z'), '__Host-jb-intake=not-an-admin']) {
      expect(await verifiedWebsiteRole(new Request(site, { headers: { cookie } }), env())).toBe(false);
    }
  });
  it.each(['/jamoa', '/jamoa.html', '/jamoa/'])('does not expose internal form without a team session: %s', async path => {
    const result = await guardWebsiteRequest(new Request(site + path), env()) as Response;
    expect(result.status).toBe(401);
    expect(await guardWebsiteRequest(new Request(site + path, { headers: { cookie: signed('team') } }), env())).toBeInstanceOf(Request);
  });
  it('requires admin role and same-origin for payout writes, including non-numeric IDs', async () => {
    const path = site + '/api/admin/payouts/a-test-id/mark-paid';
    const request = (cookie: string, origin = site) => new Request(path, { method: 'POST', headers: { cookie, origin } });
    expect((await guardWebsiteRequest(request(signed('team')), env()) as Response).status).toBe(401);
    expect((await guardWebsiteRequest(request(signed('admin'), 'https://evil.test'), env()) as Response).status).toBe(403);
    expect(await guardWebsiteRequest(request(signed('admin')), env())).toBeInstanceOf(Request);
  });
});

describe('outer response security', () => {
  it('preserves legitimate cookies while stripping internal cookie mirrors', async () => {
    const response = secureWebsiteResponse(new Request(site), new Response('page', { headers: { 'set-cookie': 'admin_session=synthetic; HttpOnly; Secure', 'x-middleware-set-cookie': 'admin_session=synthetic', 'x-powered-by': 'Next', 'x-nextjs-cache': 'HIT' } }));
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.headers.has('x-middleware-set-cookie')).toBe(false);
    expect(response.headers.has('x-powered-by')).toBe(false);
    expect(response.headers.has('x-nextjs-cache')).toBe(false);
  });
  it('retains script allowlists while blocking event handlers and base tag hijacking', () => {
    const response = secureWebsiteResponse(new Request(site), new Response('page', { headers: { 'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; base-uri 'self'" } }));
    expect(response.headers.get('content-security-policy')).toContain("script-src-attr 'none'");
    expect(response.headers.get('content-security-policy')).toContain("base-uri 'none'");
    expect(response.headers.get('content-security-policy')).toContain('https://challenges.cloudflare.com');
    expect(response.headers.get('permissions-policy')).toContain('geolocation=()');
  });
  it('also protects errors and original-handler throttling responses', () => {
    const response = secureWebsiteResponse(new Request(site + '/api/admin/login'), Response.json({ error: 'rate_limited' }, { status: 429 }));
    expect(response.headers.get('retry-after')).toBe('60');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
  });
});
