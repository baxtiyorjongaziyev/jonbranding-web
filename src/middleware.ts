
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLocale, locales } from './lib/i18n/locale';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname already has a supported locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // If not, redirect to the best-matching locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`
  
  // e.g. incoming request is /products
  // The new URL is now /en/products
  return Response.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
}
