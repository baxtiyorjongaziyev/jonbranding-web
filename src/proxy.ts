import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, getLocale, locales } from '@/lib/i18n/locale';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  if (request.nextUrl.searchParams.get('__rewrite') === '1') {
    return response;
  }

  if (pathname === '/uz' || pathname.startsWith('/uz/')) {
    // nextUrl.clone() query stringni saqlaydi. `new URL(path, base)` esa uni
    // tashlab yuborardi va /uz/... havolalaridagi ?source= va UTM parametrlari
    // yo'qolib, reklama atributsiyasi buzilardi.
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/uz' ? '/' : pathname.replace('/uz/', '/');
    return NextResponse.redirect(url);
  }

  const pathnameHasOtherLocale = locales
    .filter((locale) => locale !== defaultLocale)
    .some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasOtherLocale) {
    return response;
  }

  const locale = getLocale(request);

  if (locale !== defaultLocale) {
    request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

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
