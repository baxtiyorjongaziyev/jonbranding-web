
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './lib/i18n/locale';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname already has a supported locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Always redirect to the default 'uz' locale
  const locale = defaultLocale;
  
  request.nextUrl.pathname = `/${locale}${pathname}`
  
  return Response.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files.
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
}
