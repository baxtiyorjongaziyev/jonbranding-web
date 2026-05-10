import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['uz', 'ru', 'en', 'zh'];
const defaultLocale = 'uz';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Security Headers
  const response = NextResponse.next();
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // 2. I18n Routing Logic
  if (request.nextUrl.searchParams.get('__rewrite') === '1') {
    return response;
  }

  // Handle explicitly prefixed '/uz' routes by redirecting to root (SEO)
  if (pathname === '/uz' || pathname.startsWith('/uz/')) {
    const newPath = pathname === '/uz' ? '/' : pathname.replace('/uz/', '/');
    const url = new URL(newPath, request.url);
    return NextResponse.redirect(url);
  }

  const pathnameHasOtherLocale = locales
    .filter((l) => l !== defaultLocale)
    .some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasOtherLocale) return response;

  // Detect target locale
  let locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
  if (!locales.includes(locale)) locale = defaultLocale;

  // For non-default locales (ru, en, zh), redirect to prefixed path if missing
  if (locale !== defaultLocale) {
    request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // For default locale (uz), rewrite internally to /[lang] path without visible prefix
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  url.searchParams.set('__rewrite', '1');
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/((?!api/|admin|_next/static|_next/image|assets|images|videos|logos|favicon.ico|sitemap.xml|robots.txt|sw.js|icon.svg|apple-icon.png|manifest.json).*)',
  ],
};
