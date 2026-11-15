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

const serviceNames: Record<Locale, [string, string, string]> = {
  uz: ['Logotip va firma uslubi', 'Brendbuk', 'Qadoq dizayni'],
  ru: ['Логотип и фирменный стиль', 'Брендбук', 'Дизайн упаковки'],
  en: ['Logo and corporate identity', 'Brand guidelines', 'Packaging design'],
  zh: ['标志与企业形象', '品牌手册', '包装设计'],
};

const founderJobTitles: Record<Locale, string> = {
  uz: 'Brending mutaxassisi, asoschi',
  ru: 'Специалист по брендингу, основатель',
  en: 'Founder and branding specialist',
  zh: '品牌专家兼创始人',
};

export function getSiteEntityGraph(locale: Locale) {
  const [identity, brandbook, packaging] = serviceNames[locale];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': ORGANIZATION_ID,
        name: 'Jon.Branding',
        alternateName: ['JonBranding', 'Jon Branding Agency'],
        url: SITE_URL,
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
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: identity,
                url: getLocalizedAbsoluteUrl(SITE_URL, locale, '/xizmatlar/firmenniy-stil'),
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: brandbook,
                url: getLocalizedAbsoluteUrl(SITE_URL, locale, '/xizmatlar/brandbook'),
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: packaging,
                url: getLocalizedAbsoluteUrl(SITE_URL, locale, '/xizmatlar/qadoq-dizayni'),
              },
            },
          ],
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
