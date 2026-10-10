import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { proxy, config } from './proxy';

function requestFor(url: string) {
  return new NextRequest(new Request(url, { headers: { 'accept-language': 'uz' } }));
}

describe('proxy locale redirect', () => {
  it.each([
    '/icon-192.png', '/icon-512.png', '/icon-192-v2.png', '/icon-512-v2.png',
    '/icon-maskable-192-v2.png', '/icon-maskable-512-v2.png', '/icon-v2.svg',
    '/apple-touch-icon-v2.png',
  ])('serves PWA asset %s without locale rewriting', (url) => {
    expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url })).toBe(false);
  });

  it('strips the default locale prefix', () => {
    const response = proxy(requestFor('https://jonbranding.uz/uz/diagnostika'));
    expect(response.status).toBe(308);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/diagnostika');
    expect(response.cookies.get('NEXT_LOCALE')?.value).toBe('uz');
  });

  it('keeps source and UTM parameters across the redirect', () => {
    // Reklama havolalari /uz/ bilan keladi. Query yo'qolsa lead atributsiyasi
    // butun sayt bo'ylab buziladi.
    const response = proxy(
      requestFor(
        'https://jonbranding.uz/uz/diagnostika?source=tez-natija-6&utm_source=telegram&utm_medium=post'
      )
    );

    const location = new URL(response.headers.get('location')!);
    expect(location.pathname).toBe('/diagnostika');
    expect(location.searchParams.get('source')).toBe('tez-natija-6');
    expect(location.searchParams.get('utm_source')).toBe('telegram');
    expect(location.searchParams.get('utm_medium')).toBe('post');
  });

  it('keeps query parameters when redirecting the bare /uz root', () => {
    const response = proxy(requestFor('https://jonbranding.uz/uz?source=instagram'));

    const location = new URL(response.headers.get('location')!);
    expect(location.pathname).toBe('/');
    expect(location.searchParams.get('source')).toBe('instagram');
  });

  it('leaves non-default locales untouched', () => {
    const response = proxy(requestFor('https://jonbranding.uz/ru/diagnostika?source=telegram'));
    expect(response.headers.get('location')).toBeNull();
  });

  it('rewrites patent subdomain to patent-menejer', () => {
    const response = proxy(requestFor('https://patent.jonbranding.uz/'));
    expect(response.headers.get('x-middleware-rewrite')).toContain('/uz/patent-menejer');
  });

  it('sends other patent subdomain paths to the main site', () => {
    const response = proxy(requestFor('https://patent.jonbranding.uz/narxlar?utm_source=x'));
    expect(response.headers.get('location')).toBe('https://www.jonbranding.uz/narxlar?utm_source=x');
  });

  it('keeps Uzbek inner pages in Uzbek for other-language browsers and crawlers', () => {
    const request = new NextRequest(
      new Request('https://www.jonbranding.uz/narxlar', { headers: { 'accept-language': 'en-US,en;q=0.9' } }),
    );
    const response = proxy(request);
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-middleware-rewrite')).toContain('/uz/narxlar');
  });

  it('still suggests the browser language on the home page', () => {
    const request = new NextRequest(
      new Request('https://www.jonbranding.uz/', { headers: { 'accept-language': 'ru-RU,ru;q=0.9' } }),
    );
    expect(new URL(proxy(request).headers.get('location')!).pathname).toBe('/ru');
  });

  it('follows a language the visitor chose explicitly on any page', () => {
    const request = new NextRequest(
      new Request('https://www.jonbranding.uz/narxlar', {
        headers: { 'accept-language': 'uz', cookie: 'NEXT_LOCALE=en' },
      }),
    );
    expect(new URL(proxy(request).headers.get('location')!).pathname).toBe('/en/narxlar');
  });

  it('excludes apple-touch-icon.png in config matcher pattern', () => {
    const pattern = new RegExp('^' + config.matcher[0] + '$');
    expect(pattern.test('/apple-touch-icon.png')).toBe(false);
    expect(pattern.test('/diagnostika')).toBe(true);
  });
});
