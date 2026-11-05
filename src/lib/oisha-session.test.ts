import { describe, expect, it } from 'vitest';
import { getOishaSession } from './oisha-session';

const secret = 'test-only-session-signing-key';
const request = (cookie?: string) => new Request('https://example.com/api/oisha', {
  headers: cookie ? { cookie } : {},
});

describe('Oisha visitor isolation', () => {
  it('keeps the same chat only with the signed browser cookie', () => {
    const first = getOishaSession(request(), secret);
    const response = first.attach(new Response());
    const cookie = response.headers.get('set-cookie')!;
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Secure');
    expect(getOishaSession(request(cookie.split(';')[0]), secret).userId).toBe(first.userId);
    expect(getOishaSession(request(), secret).userId).not.toBe(first.userId);
  });

  it('replaces a tampered chat identity', () => {
    const first = getOishaSession(request(), secret);
    const cookie = first.attach(new Response()).headers.get('set-cookie')!.split(';')[0];
    const forged = cookie.replace(first.userId, 'web_11111111-1111-4111-8111-111111111111');
    const next = getOishaSession(request(forged), secret);
    expect(next.userId).not.toBe(first.userId);
    expect(next.userId).not.toBe('web_11111111-1111-4111-8111-111111111111');
  });
});
