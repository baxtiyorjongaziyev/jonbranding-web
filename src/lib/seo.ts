import {
  getLocaleAlternates,
  getLocalizedAbsoluteUrl,
  type Locale,
} from '@/lib/i18n/locale';
import { TELEGRAM_CHANNEL_URL } from '@/lib/contacts';

export const SITE_URL = 'https://www.jonbranding.uz';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const FOUNDER_ID = `${SITE_URL}/#baxtiyorjon-gaziyev`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Sahifaning o'z canonical va hreflang manzillari (Next.js `alternates`).
 * `[lang]/layout.tsx` canonical bermaydi, shuning uchun indekslanadigan har
 * bir sahifa buni o'zi chaqirishi kerak.
 */
const BRAND_SUFFIX = /(\s*[|—–-]\s*Jon[ .]?Branding(\s+(Agentligi|Agency|Portfolio|tomonidan))?)+\s*$/i;

/**
 * `[lang]/layout.tsx` shabloni har sarlavhaga "| Jon.Branding" qo'shadi.
 * Sarlavhaning o'zida ham brend bo'lsa, u ikki marta chiqardi — shu yerda olib tashlanadi.
 */
export function stripBrandSuffix(title: string): string {
  const stripped = title.replace(BRAND_SUFFIX, '').trim();
  return stripped || title;
}

const BRAND_MENTION = /jon[ .]?branding/i;

/**
 * Sahifa `title`i uchun: oxiridagi brend olib tashlanadi; matn o'rtasida brend
 * baribir bo'lsa ("… | Агентство Jon.Branding"), shablon qo'shilmasligi uchun
 * `absolute` qaytariladi. Aks holda oddiy satr — shablon "| Jon.Branding" qo'shadi.
 */
export function pageTitle(title: string): string | { absolute: string } {
  const clean = stripBrandSuffix(title);
  return BRAND_MENTION.test(clean) ? { absolute: clean } : clean;
}

export function getPageAlternates(locale: Locale, path = '') {
  return {
    canonical: getLocalizedAbsoluteUrl(SITE_URL, locale, path),
    languages: getLocaleAlternates(SITE_URL, path),
  };
}

const AI_REFERRER_HOSTS = {
  'chatgpt.com': 'chatgpt',
  'perplexity.ai': 'perplexity',
  'gemini.google.com': 'gemini',
  'copilot.microsoft.com': 'copilot',
  'claude.ai': 'claude',
} as const;

export type AiReferrer = (typeof AI_REFERRER_HOSTS)[keyof typeof AI_REFERRER_HOSTS];

export function identifyAiReferrer(referrer: string): AiReferrer | null {
  if (!referrer) return null;

  try {
    const hostname = new URL(referrer).hostname.toLowerCase();
    const match = Object.entries(AI_REFERRER_HOSTS).find(
      ([domain]) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

type ServiceCatalogEntry = {
  path: string;
  names: Record<Locale, string>;
};

const SERVICE_CATALOG: readonly ServiceCatalogEntry[] = [
  {
    path: '/brand-strategy',
    names: {
      uz: 'Brend strategiyasi',
      ru: 'Бренд-стратегия',
      en: 'Brand strategy',
      zh: '品牌战略',
    },
  },
  {
    path: '/xizmatlar/neyming',
    names: {
      uz: 'Neyming — brend nomi yaratish',
      ru: 'Нейминг — разработка названия',
      en: 'Brand naming',
      zh: '品牌命名',
    },
  },
  {
    path: '/xizmatlar/logo-dizayni',
    names: {
      uz: 'Logotip dizayni',
      ru: 'Разработка логотипа',
      en: 'Logo design',
      zh: '标志设计',
    },
  },
  {
    path: '/xizmatlar/firmenniy-stil',
    names: {
      uz: 'Firma uslubi',
      ru: 'Фирменный стиль',
      en: 'Corporate identity',
      zh: '视觉识别系统',
    },
  },
  {
    path: '/xizmatlar/brandbook',
    names: {
      uz: 'Brendbuk yaratish',
      ru: 'Разработка брендбука',
      en: 'Brand guidelines',
      zh: '品牌手册',
    },
  },
  {
    path: '/xizmatlar/qadoq-dizayni',
    names: {
      uz: 'Qadoq dizayni',
      ru: 'Дизайн упаковки',
      en: 'Packaging design',
      zh: '包装设计',
    },
  },
  {
    path: '/xizmatlar/patent',
    names: {
      uz: 'Tovar belgisini ro‘yxatdan o‘tkazish (patent)',
      ru: 'Регистрация товарного знака (патента)',
      en: 'Trademark registration',
      zh: '商标注册',
    },
  },
  {
    path: '/xizmatlar/posm-materiallar',
    names: {
      uz: 'POSM materiallar dizayni',
      ru: 'Дизайн POSM-материалов',
      en: 'POSM design',
      zh: 'POSM 物料设计',
    },
  },
  {
    path: '/xizmatlar/car-wrap-design',
    names: {
      uz: 'Avtomobil brendlash (Car Wrap)',
      ru: 'Брендирование автомобилей',
      en: 'Car wrap design',
      zh: '车身广告设计',
    },
  },
];

const founderJobTitles: Record<Locale, string> = {
  uz: 'Brending mutaxassisi, asoschi',
  ru: 'Специалист по брендингу, основатель',
  en: 'Founder and branding specialist',
  zh: '品牌专家兼创始人',
};

export function getSiteEntityGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': ORGANIZATION_ID,
        name: 'Jon.Branding',
        alternateName: ['JonBranding', 'Jon Branding Agency'],
        url: SITE_URL,
        foundingDate: '2018-11-27',
        logo: `${SITE_URL}/icon.svg`,
        image: `${SITE_URL}/images/cms/og-image.jpeg`,
        telephone: '+998792000097',
        priceRange: '$$$',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Tashkent',
          addressRegion: 'Toshkent',
          postalCode: '100000',
          addressCountry: 'UZ',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 41.2995,
          longitude: 69.2401,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
          opens: '09:00',
          closes: '20:00',
        },
        areaServed: [
          { '@type': 'Country', name: 'Uzbekistan' },
          { '@type': 'Place', name: 'Central Asia' },
        ],
        founder: { '@id': FOUNDER_ID },
        sameAs: [
          'https://www.instagram.com/jon.branding/',
          TELEGRAM_CHANNEL_URL,
          'https://www.linkedin.com/in/baxtiyorjongaziyev/',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Jon.Branding services',
          itemListElement: SERVICE_CATALOG.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.names[locale],
              url: getLocalizedAbsoluteUrl(SITE_URL, locale, service.path),
            },
          })),
        },
      },
      {
        '@type': 'Person',
        '@id': FOUNDER_ID,
        name: 'Baxtiyorjon Gaziyev',
        jobTitle: founderJobTitles[locale],
        url: getLocalizedAbsoluteUrl(SITE_URL, locale, '/haqimizda'),
        worksFor: { '@id': ORGANIZATION_ID },
        knowsAbout: [
          'Logo design',
          'Corporate identity',
          'Brand guidelines',
          'Packaging design',
          'Naming',
          'Trademark registration',
        ],
        sameAs: [
          'https://www.linkedin.com/in/baxtiyorjongaziyev/',
          'https://www.instagram.com/jon.branding/',
          TELEGRAM_CHANNEL_URL,
        ],
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: 'Jon.Branding',
        url: SITE_URL,
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: ['uz', 'ru', 'en', 'zh'],
      },
    ],
  };
}
