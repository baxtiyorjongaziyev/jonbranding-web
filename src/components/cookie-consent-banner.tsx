'use client';

import { useEffect, useState, type FC } from 'react';
import { usePathname } from 'next/navigation';

export const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';
export const OPEN_COOKIE_SETTINGS_EVENT = 'open-cookie-settings';

type Choice = 'true' | 'false';

const copy = {
  uz: {
    text: "Saytni yaxshilash va reklama samaradorligini o'lchash uchun analitika cookie'laridan (Google, Yandex, Meta, Clarity, Hotjar) foydalanamiz. Ular faqat roziligingiz bilan yoqiladi.",
    accept: 'Qabul qilish',
    reject: 'Rad etish',
    more: 'Batafsil',
  },
  ru: {
    text: 'Мы используем аналитические cookie (Google, Яндекс, Meta, Clarity, Hotjar), чтобы улучшать сайт и измерять рекламу. Они включаются только с вашего согласия.',
    accept: 'Принять',
    reject: 'Отклонить',
    more: 'Подробнее',
  },
  en: {
    text: 'We use analytics cookies (Google, Yandex, Meta, Clarity, Hotjar) to improve the site and measure advertising. They are enabled only with your consent.',
    accept: 'Accept',
    reject: 'Reject',
    more: 'Learn more',
  },
  zh: {
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

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-4 text-[#0E1015] shadow-2xl sm:p-5"
    >
      <p className="text-sm leading-relaxed">
        {t.text}{' '}
        <a href={privacyHref} className="underline underline-offset-2">
          {t.more}
        </a>
      </p>
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => choose('false')}
          className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold hover:bg-black/5"
        >
          {t.reject}
        </button>
        <button
          type="button"
          onClick={() => choose('true')}
          className="rounded-full bg-[#1B4DFF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1640d6]"
        >
          {t.accept}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
