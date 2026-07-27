import Script from 'next/script';
import { getLocalizedAbsoluteUrl, type Locale } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import { ORGANIZATION_ID, SITE_URL } from '@/lib/seo';

type Props = {
  lang: Locale;
  path: string;
  name: string;
  description: string;
};

export default function ServiceJsonLd({ lang, path, name, description }: Props) {
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
