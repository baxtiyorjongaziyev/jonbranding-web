import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from './proxy';

function requestFor(url: string) {
  return new NextRequest(new Request(url, { headers: { 'accept-language': 'uz' } }));
}

describe('proxy locale redirect', () => {
  it('strips the default locale prefix', () => {
    const response = proxy(requestFor('https://jonbranding.uz/uz/diagnostika'));
    expect(response.status).toBe(307);
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
});
