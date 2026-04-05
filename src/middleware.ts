import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['uz', 'ru', 'en', 'zh'];
const defaultLocale = 'uz';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname already has a supported locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Minimalist locale detection: check cookie, then accept-language header, then default
  let locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
  if (!locales.includes(locale)) locale = defaultLocale;

  // Final redirect
  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files.
    '/((?!api|_next/static|_next/image|assets|logos|favicon.ico|sw.js|icon.svg).*)',
  ],
}
