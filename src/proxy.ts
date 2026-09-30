import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, getLocale, locales } from '@/lib/i18n/locale';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Xavfsizlik header'lari faqat next.config.js'da (bitta manba). Bu yerda
  // ham turli qiymatlar bilan qo'yilardi va redirect/rewrite javoblarida yo'q edi.
  const response = NextResponse.next();

  if (request.nextUrl.searchParams.get('__rewrite') === '1') {
    return response;
  }

  const host = (request.nextUrl.hostname || request.headers.get('host') || '').toLowerCase();
  if (host.startsWith('patent.')) {
    const locale = getLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/patent-menejer`;
    url.searchParams.set('__rewrite', '1');
    return NextResponse.rewrite(url);
  }

  if (pathname === '/uz' || pathname.startsWith('/uz/')) {
    // nextUrl.clone() query stringni saqlaydi. `new URL(path, base)` esa uni
    // tashlab yuborardi va /uz/... havolalaridagi ?source= va UTM parametrlari
    // yo'qolib, reklama atributsiyasi buzilardi.
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/uz' ? '/' : pathname.replace('/uz/', '/');
    // Doimiy (308): /uz/... hech qachon kanonik manzil emas.
    return NextResponse.redirect(url, 308);
  }

  const pathnameHasOtherLocale = locales
    .filter((locale) => locale !== defaultLocale)
    .some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasOtherLocale) {
    return response;
  }

  // Til bo'yicha avtomatik redirect: foydalanuvchi tilni o'zi tanlagan bo'lsa
  // (cookie) — har qanday sahifada; brauzer tiliga qarab esa faqat bosh sahifada.
  // Aks holda o'zbekcha kanonik sahifalar en/ru brauzerli mehmonlar va
  // crawler'lar uchun boshqa tilga "qochib" ketardi.
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const hasChosenLocale = locales.includes(cookieLocale as (typeof locales)[number]);
  const locale = hasChosenLocale || pathname === '/' ? getLocale(request) : defaultLocale;

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
