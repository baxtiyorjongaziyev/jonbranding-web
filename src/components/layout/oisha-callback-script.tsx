'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

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
 * Vidjet skriptining o'zi `[lang]/layout.tsx`da server HTML'iga yoziladi (bir marta,
 * layout sahifa almashganda qayta chizilmaydi). Bu komponent faqat sahifa almashganda
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
    let callbackObserver: MutationObserver | undefined;
    let observedHost: Element | null = null;
    const observeCallback = () => {
      const host = document.querySelector('[data-oisha-callback-host]');
      if (!host || host === observedHost) return;
      callbackObserver?.disconnect();
      observedHost = host;
      const root = host.shadowRoot || host;
      const syncCallback = () => {
        document.body.dataset.callbackOpen = String(!!root.querySelector('.wrap.open'));
      };
      callbackObserver = new MutationObserver(syncCallback);
      callbackObserver.observe(root, { subtree: true, attributes: true, attributeFilter: ['class'] });
      syncCallback();
    };
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
      observer.disconnect();
      callbackObserver?.disconnect();
      delete document.body.dataset.callbackOpen;
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
