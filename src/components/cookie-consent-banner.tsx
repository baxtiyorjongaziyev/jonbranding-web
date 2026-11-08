'use client';

import { useEffect, useState, type FC } from 'react';
import { usePathname } from 'next/navigation';

export const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';
export const OPEN_COOKIE_SETTINGS_EVENT = 'open-cookie-settings';

type Choice = 'true' | 'false';

const copy = {
  uz: {
    short: "Analitika cookie'larini yoqamizmi?",
    text: "Saytni yaxshilash va reklama samaradorligini o'lchash uchun analitika cookie'laridan (Google, Yandex, Meta, Clarity, Hotjar) foydalanamiz. Ular faqat roziligingiz bilan yoqiladi.",
    accept: 'Qabul qilish',
    reject: 'Rad etish',
    more: 'Batafsil',
  },
  ru: {
    short: 'Включить аналитические cookie?',
    text: 'Мы используем аналитические cookie (Google, Яндекс, Meta, Clarity, Hotjar), чтобы улучшать сайт и измерять рекламу. Они включаются только с вашего согласия.',
    accept: 'Принять',
    reject: 'Отклонить',
    more: 'Подробнее',
  },
  en: {
    short: 'Allow analytics cookies?',
    text: 'We use analytics cookies (Google, Yandex, Meta, Clarity, Hotjar) to improve the site and measure advertising. They are enabled only with your consent.',
    accept: 'Accept',
    reject: 'Reject',
    more: 'Learn more',
  },
  zh: {
    short: '允许使用分析 Cookie 吗？',
    text: '我们使用分析 Cookie（Google、Yandex、Meta、Clarity、Hotjar）来改进网站并衡量广告效果。仅在您同意后启用。',
    accept: '接受',
    reject: '拒绝',
    more: '了解更多',
  },
} as const;

function readChoice(): Choice | null {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_CONSENT_KEY}=(true|false)`));
    return match ? (match[1] as Choice) : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice) {
  try {
    document.cookie = `${COOKIE_CONSENT_KEY}=${choice}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  } catch {}
}

/** Foydalanuvchi tanlovigacha hech narsa yozilmaydi va analytics yuklanmaydi. */
const CookieConsentBanner: FC = () => {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);

  const segment = pathname.split('/')[1];
  const lang = (segment === 'ru' || segment === 'en' || segment === 'zh' ? segment : 'uz') as keyof typeof copy;
  const t = copy[lang];
  const privacyHref = lang === 'uz' ? '/privacy' : `/${lang}/privacy`;

  useEffect(() => {
    if (readChoice() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  const choose = (choice: Choice) => {
    const previous = readChoice();
    saveChoice(choice);
    setOpen(false);
    if (choice === 'true') {
      window.dispatchEvent(new CustomEvent('cookie-consent-accepted'));
    } else if (previous === 'true') {
      // Yuklangan skriptlarni to'xtatish uchun sahifani qayta yuklaymiz.
      window.location.reload();
    }
  };

  if (!open) return null;

  // Mobilda: bitta ixcham qator, pastki tez-harakat panelining USTIDA — CTA va panelni
  // yopmaydi (docs/audits/2026-11-07-konversiya-audit.md, K-1). Desktop'da avvalgi karta.
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie"
      className="fixed inset-x-3 bottom-[calc(100px+env(safe-area-inset-bottom,0px))] sm:inset-x-auto sm:left-6 sm:bottom-6 z-[45] sm:max-w-md flex items-center gap-2 sm:block rounded-2xl border border-black/10 bg-white px-3 py-2 sm:p-5 text-[#0A0B0E] shadow-[0_12px_32px_rgba(0,0,0,0.14)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
    >
      <p className="flex-1 text-xs sm:text-sm leading-snug sm:leading-relaxed text-[#4B5563]">
        <span className="sm:hidden">{t.short}</span>
        <span className="hidden sm:inline">{t.text}</span>{' '}
        <a href={privacyHref} className="underline underline-offset-2 font-medium text-[#0A0B0E] hover:text-[#2554FF] transition-colors">
          {t.more}
        </a>
      </p>
      <div className="flex shrink-0 gap-1.5 sm:mt-3 sm:flex-wrap sm:justify-end sm:gap-2">
        <button
          type="button"
          onClick={() => choose('false')}
          className="rounded-full border border-black/15 px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold hover:bg-black/5 min-h-[40px] text-[#0A0B0E] transition-colors"
        >
          {t.reject}
        </button>
        <button
          type="button"
          onClick={() => choose('true')}
          className="rounded-full bg-[#2554FF] hover:bg-[#1D4ED8] px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold !text-white transition-colors min-h-[40px]"
        >
          {t.accept}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
