import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from './proxy';

function requestFor(url: string) {
  return new NextRequest(new Request(url, { headers: { 'accept-language': 'uz' } }));
}

describe('proxy locale redirect', () => {
  it('strips the default locale prefix', () => {
    const response = proxy(requestFor('https://jonbranding.uz/uz/diagnostika'));
    expect(response.status).toBe(308);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/diagnostika');
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

  it('permanently redirects legacy brand-strategiyasi routes to /brand-strategy', () => {
    const res1 = proxy(requestFor('https://jonbranding.uz/xizmatlar/brand-strategiyasi'));
    expect(res1.status).toBe(308);
    expect(new URL(res1.headers.get('location')!).pathname).toBe('/brand-strategy');

    const res2 = proxy(requestFor('https://jonbranding.uz/uz/xizmatlar/brand-strategiyasi?utm_source=tg'));
    expect(res2.status).toBe(308);
    const loc2 = new URL(res2.headers.get('location')!);
    expect(loc2.pathname).toBe('/brand-strategy');
    expect(loc2.searchParams.get('utm_source')).toBe('tg');

    const res3 = proxy(requestFor('https://jonbranding.uz/xizmatlar/brand-strategy'));
    expect(res3.status).toBe(308);
    expect(new URL(res3.headers.get('location')!).pathname).toBe('/brand-strategy');
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
});
