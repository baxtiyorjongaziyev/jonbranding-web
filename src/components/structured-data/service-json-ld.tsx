import Script from 'next/script';
import { getLocalizedAbsoluteUrl, type Locale } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import { ORGANIZATION_ID, SITE_URL } from '@/lib/seo';

type Props = {
  lang: Locale;
  path: string;
  name: string;
  description: string;
  /** Sahifada ko'rinadigan savol-javoblar — FAQPage sifatida beriladi (AEO). */
  faqs?: { q: string; a: string }[];
  /** Savol-javoblar tili; xizmat sahifalari hozircha faqat o'zbekcha. */
  faqLang?: Locale;
};

export default function ServiceJsonLd({ lang, path, name, description, faqs, faqLang = 'uz' }: Props) {
  const url = getLocalizedAbsoluteUrl(SITE_URL, lang, path);
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
      ...(faqs?.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${url}#faq`,
              inLanguage: faqLang,
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
