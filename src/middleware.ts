
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLocale, locales, defaultLocale } from './lib/i18n/locale';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname already has a supported locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // If not, determine the best locale and redirect.
  const country = request.geo?.country;
  let locale: string;

  if (country === 'UZ') {
    // Force Uzbek for users from Uzbekistan on their first visit.
    locale = 'uz';
  } else {
    // For other users, determine locale from browser settings.
    locale = getLocale(request);
  }

  // Redirect to the URL with the determined locale.
  request.nextUrl.pathname = `/${locale}${pathname}`
  
  // e.g. incoming request is /products
  // The new URL is now /uz/products (if from UZ) or /en/products (if browser is EN)
  return Response.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files.
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
}
