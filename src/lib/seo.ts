import {
  getLocalizedAbsoluteUrl,
  type Locale,
} from '@/lib/i18n/locale';

export const SITE_URL = 'https://www.jonbranding.uz';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const FOUNDER_ID = `${SITE_URL}/#baxtiyorjon-gaziyev`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

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
        telephone: '+998336450097',
        email: 'salom@jonbranding.uz',
        priceRange: '$$$',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Tashkent',
          addressRegion: 'Toshkent',
          addressCountry: 'UZ',
        },
        areaServed: [
          { '@type': 'Country', name: 'Uzbekistan' },
          { '@type': 'Place', name: 'Central Asia' },
        ],
        founder: { '@id': FOUNDER_ID },
        sameAs: [
          'https://www.instagram.com/jon.branding/',
          'https://t.me/JonBranding',
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
        jobTitle: 'Founder and branding specialist',
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
        sameAs: ['https://www.linkedin.com/in/baxtiyorjongaziyev/'],
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
