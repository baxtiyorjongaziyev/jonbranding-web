
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from 'next/server';

export const locales = ['uz', 'ru', 'en', 'zh'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'uz';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  uz: 'O‘zbekcha',
  zh: '中文',
};

export function getLocale(request: NextRequest): Locale {
  // 1. Cookiedan tilni tekshirish
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. O'zbekiston hududini IP-headerlar orqali aniqlash
  // Firebase App Hosting, Vercel va Cloudflare headerlarini tekshiramiz
  const country = 
    request.headers.get('x-vercel-ip-country') || 
    request.headers.get('x-country-code') || 
    request.headers.get('cf-ipcountry');
  
  if (country === 'UZ') {
    return 'uz';
  }

  // 3. Brauzer sozlamalarini tekshirish
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
