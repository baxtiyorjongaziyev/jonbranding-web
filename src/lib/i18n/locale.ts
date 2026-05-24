import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from 'next/server';

export const locales = ['uz', 'ru', 'en', 'zh'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'uz';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439',
  uz: "O'zbekcha",
  zh: '\u4e2d\u6587',
};

export function getLocalePrefix(locale: Locale) {
  return locale === defaultLocale ? '' : `/${locale}`;
}

export function getLocalizedPath(locale: Locale, path = '') {
  const normalizedPath = !path || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  const localizedPath = `${getLocalePrefix(locale)}${normalizedPath}`;

  return localizedPath || '/';
}

export function getLocalizedAbsoluteUrl(baseUrl: string, locale: Locale, path = '') {
  return `${baseUrl}${getLocalizedPath(locale, path)}`;
}

export function getLocaleAlternates(baseUrl: string, path = '') {
  return Object.fromEntries(
    [
      ...locales.map((locale) => [locale, getLocalizedAbsoluteUrl(baseUrl, locale, path)]),
      ['x-default', getLocalizedAbsoluteUrl(baseUrl, defaultLocale, path)],
    ],
  ) as Record<Locale | 'x-default', string>;
}

export function getLocale(request: NextRequest): Locale {
  // 1. Cookie orqali foydalanuvchi tanlagan tilni tekshiramiz.
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. O'zbekiston hududini IP-headerlar orqali aniqlaymiz.
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-country-code') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-appengine-country');

  if (country === 'UZ') {
    return 'uz';
  }

  // 3. Brauzer til sozlamalaridan eng mos locale tanlanadi.
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    return match(languages, [...locales], defaultLocale) as Locale;
  } catch (e) {
    return defaultLocale;
  }
}

export function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}
