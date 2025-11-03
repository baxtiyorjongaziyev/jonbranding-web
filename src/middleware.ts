
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

  // Get the best-matching locale from the request headers or cookie
  const locale = getLocale(request);
  
  request.nextUrl.pathname = `/${locale}${pathname}`

  // For the root path, we perform a hard redirect. For others, we rewrite.
  if (pathname === '/') {
    return Response.redirect(request.nextUrl)
  }
  
  return NextResponse.rewrite(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files.
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
}
