import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['uz', 'ru', 'en', 'zh'];
const defaultLocale = 'uz';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Handle explicitly prefixed '/uz' routes by redirecting to root (SEO)
  if (pathname === '/uz' || pathname.startsWith('/uz/')) {
    const newPath = pathname === '/uz' ? '/' : pathname.replace('/uz/', '/');
    const url = new URL(newPath, request.url);
    return NextResponse.redirect(url);
  }

  // 2. Check if the pathname already has other supported locale prefixes
  const pathnameHasOtherLocale = locales.filter(l => l !== defaultLocale).some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasOtherLocale) return

  // 3. Detect target locale
  let locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
  if (!locales.includes(locale)) locale = defaultLocale;

  // 4. For non-default locales (ru, en, zh), redirect to prefixed path if missing
  if (locale !== defaultLocale) {
    request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // 5. For default locale (uz), rewrite internally to /[lang] path without visible prefix
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files.
    '/((?!api|_next/static|_next/image|assets|images|videos|logos|favicon.ico|sw.js|icon.svg|apple-icon.png|manifest.json).*)',
  ],
}
