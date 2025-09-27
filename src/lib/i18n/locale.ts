
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from 'next/server';

export const locales = ['uz', 'en', 'ru'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  uz: 'O‘zbekcha',
};

export function getLocale(request: NextRequest): Locale {
  // 1. Check for locale in cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. Use Negotiator and intl-localematcher to find the best-matching locale
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  
  try {
    return match(languages, [...locales], defaultLocale) as Locale;
  } catch (e) {
    // Fallback to default if matching fails
    return defaultLocale;
  }
}

export function setLocaleCookie(locale: Locale) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}
