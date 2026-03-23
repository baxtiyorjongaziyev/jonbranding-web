
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLocale, locales } from './lib/i18n/locale';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname already has a supported locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Get the best-matching locale from the request headers, cookie or geo
  const locale = await getLocale(request);
  
  // Update pathname with detected locale
  // Ensure we don't have double slashes and handle root correctly
  const newPathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  request.nextUrl.pathname = newPathname;

  // For the root path, we perform a hard redirect to the locale version.
  if (pathname === '/') {
    return NextResponse.redirect(request.nextUrl)
  }
  
  // For other internal pages, we rewrite to keep the cleaner URL if possible, 
  // but standard practice is redirecting to the language-prefixed version.
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files.
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|icon.svg|test).*)',
  ],
}
