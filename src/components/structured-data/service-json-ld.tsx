import Script from 'next/script';
import { getLocalizedAbsoluteUrl, type Locale } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import { ORGANIZATION_ID, SITE_URL } from '@/lib/seo';

type Props = {
  lang: Locale;
  path: string;
  name: string;
  description: string;
  /** Rasmiy UZS narx (sales-content manbasidan) — Schema.org Offer uchun. */
  priceValue?: number;
  priceCurrency?: string;
  /** Sahifada ko'rinadigan jarayon bosqichlari — HowTo sifatida beriladi (AEO). */
  howToSteps?: { title: string; desc?: string }[];
  /** Sahifada ko'rinadigan savol-javoblar — FAQPage sifatida beriladi (AEO). */
  faqs?: { q: string; a: string }[];
  faqLang?: Locale;
};

export default function ServiceJsonLd({
  lang,
  path,
  name,
  description,
  priceValue,
  priceCurrency = 'UZS',
  howToSteps,
  faqs,
  faqLang,
}: Props) {
  const url = getLocalizedAbsoluteUrl(SITE_URL, lang, path);
  const resolvedFaqLang = faqLang ?? lang;
  const homeLabel =
    lang === 'uz' ? 'Bosh sahifa' :
    lang === 'ru' ? 'Главная' :
    lang === 'zh' ? '首页' :
    'Home';
  const servicesLabel =
    lang === 'uz' ? 'Xizmatlar' :
    lang === 'ru' ? 'Услуги' :
    lang === 'zh' ? '服务' :
    'Services';

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name,
        description,
        url,
        inLanguage: lang,
        provider: { '@id': ORGANIZATION_ID },
        areaServed: [
          { '@type': 'Country', name: 'Uzbekistan' },
          { '@type': 'Place', name: 'Central Asia' },
        ],
        ...(typeof priceValue === 'number' && priceValue > 0
          ? {
              offers: {
                '@type': 'Offer',
                price: String(priceValue),
                priceCurrency,
                availability: 'https://schema.org/InStock',
                url,
              },
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: homeLabel,
            item: getLocalizedAbsoluteUrl(SITE_URL, lang),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: servicesLabel,
            item: getLocalizedAbsoluteUrl(SITE_URL, lang, '/xizmatlar'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name,
            item: url,
          },
        ],
      },
      ...(howToSteps?.length
        ? [
            {
              '@type': 'HowTo',
              '@id': `${url}#howto`,
              name,
              inLanguage: resolvedFaqLang,
              step: howToSteps.map((step, index) => ({
                '@type': 'HowToStep',
                position: index + 1,
                name: step.title,
                ...(step.desc ? { text: step.desc } : {}),
              })),
            },
          ]
        : []),
      ...(faqs?.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${url}#faq`,
              inLanguage: resolvedFaqLang,
              about: { '@id': `${url}#service` },
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <Script
      id={`json-ld-service-${path.split('/').filter(Boolean).pop()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonStringify(graph) }}
    />
  );
}
