'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { bindCallbackAccessibility } from '@/lib/callback-accessibility';

declare global {
  interface Window {
    OishaCallback?: { applyPhones?: () => void };
  }
}

const PHONE_SELECTOR = '[data-oisha-phone]';

function applyPhones() {
  window.OishaCallback?.applyPhones?.();
}

function containsPhone(node: Node): boolean {
  return node instanceof Element && (node.matches(PHONE_SELECTOR) || node.querySelector(PHONE_SELECTOR) !== null);
}

/**
 * Oisha call tracking: SPA'da raqamlarni qayta almashtirish.
 *
 * Vidjet skripti `[lang]/layout.tsx`da hydration'dan keyin bir marta yuklanadi.
 * Bu komponent sahifa almashganda
 * va kechikib chiziladigan elementlar (mobil nav, menyu, popup) paydo bo'lganda
 * `applyPhones()` ni chaqiradi.
 */
export default function OishaPhoneSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    applyPhones();
  }, [pathname, searchParams]);

  useEffect(() => {
    let frame = 0;
    let releaseCallback: (() => void) | undefined;
    let observedHost: Element | null = null;
    const observeCallback = () => {
      const host = document.querySelector('[data-oisha-callback-host]');
      if (host === observedHost) return;
      releaseCallback?.();
      releaseCallback = undefined;
      observedHost = host;
      if (!host) {
        document.body.dataset.callbackOpen = 'false';
        return;
      }
      releaseCallback = bindCallbackAccessibility(host as HTMLElement);
    };
    const updateScrollState = () => {
      document.body.dataset.scrolledPastHero = String(window.scrollY > 260);
    };
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    observeCallback();
    const observer = new MutationObserver((mutations) => {
      observeCallback();
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
      window.removeEventListener('scroll', updateScrollState);
      observer.disconnect();
      releaseCallback?.();
      delete document.body.dataset.callbackOpen;
      delete document.body.dataset.scrolledPastHero;
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
