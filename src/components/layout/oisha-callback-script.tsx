'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    OishaCallback?: { applyPhones?: () => void };
  }
}

const OISHA_WIDGET_SRC = 'https://oisha.jonbranding.uz/callback-widget.js';
// Brendbuk asosiy rangi — Cobalt (`--primary`, `--at-accent`).
const BRAND_COLOR = '#1B4DFF';
const PHONE_SELECTOR = '[data-oisha-phone]';

// Taqdimot sahifalari: suzuvchi tugma ekran ulashuvda slaydlar ustiga tushadi.
const DECK_PATHS = new Set(['/credentials', '/pro-preview']);

function applyPhones() {
  window.OishaCallback?.applyPhones?.();
}

function containsPhone(node: Node): boolean {
  return node instanceof Element && (node.matches(PHONE_SELECTOR) || node.querySelector(PHONE_SELECTOR) !== null);
}

/**
 * Oisha "Sizga qo'ng'iroq qilamiz" vidjeti va call tracking.
 *
 * - Skript `next/script` orqali bir marta yuklanadi va sahifa almashganda takrorlanmaydi.
 * - Sahifa almashganda va kechikib chiziladigan elementlar (mobil nav, menyu, popup)
 *   paydo bo'lganda `applyPhones()` raqamlarni qayta almashtiradi.
 * - Raqamlar va vidjet matnlari serverdan keladi — bu yerda qattiq yozilmaydi.
 */
export default function OishaCallbackScript({ lang }: { lang: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathnameWithoutLocale = pathname.replace(/^\/(uz|ru|en|zh)(?=\/|$)/, '') || '/';
  const isDeck = DECK_PATHS.has(pathnameWithoutLocale);

  useEffect(() => {
    applyPhones();
  }, [pathname, searchParams]);

  useEffect(() => {
    let frame = 0;
    const observer = new MutationObserver((mutations) => {
      if (frame) return;
      const hasNewPhone = mutations.some((mutation) => Array.from(mutation.addedNodes).some(containsPhone));
      if (!hasNewPhone) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        applyPhones();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (isDeck) return null;

  return (
    <Script
      id="oisha-callback-widget"
      src={OISHA_WIDGET_SRC}
      strategy="afterInteractive"
      data-color={BRAND_COLOR}
      // Vidjet faqat uz/ru tillarini qo'llaydi; en/zh sahifalarda ruscha forma.
      data-lang={lang === 'uz' ? 'uz' : 'ru'}
      data-call-tracking="1"
      // O'ng pastki burchakda Oisha AI chat tugmasi turadi.
      data-position="left"
      onLoad={applyPhones}
    />
  );
}
