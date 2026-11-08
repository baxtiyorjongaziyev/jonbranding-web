import { Check } from 'lucide-react';
import TrademarkCalculator from '@/components/sections/trademark-calculator';
import Script from 'next/script';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { getLocalizedAbsoluteUrl } from '@/lib/i18n/locale';
import { safeJsonStringify } from '@/lib/security';
import { SITE_URL, ORGANIZATION_ID } from '@/lib/seo';
import { patentFaqs } from '@/lib/patent-faq';

const CRUMBS: Record<Locale, [string, string]> = {
  uz: ['Bosh sahifa', 'Xizmatlar'],
  ru: ['Главная', 'Услуги'],
  en: ['Home', 'Services'],
  zh: ['首页', '服务'],
};

type Props = { params: Promise<{ lang: string }> };

// Server komponent: sarlavha va matn HTML'ning o'zida keladi. Avval lug'at
// useEffect'da yuklanardi va server faqat bo'sh skeleton qaytarardi (h1 yo'q edi).
export default async function PatentCalculatorPage({ params }: Props) {
  const { lang } = await params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const translations = (await getDictionary(safeLang)).patentCalculatorPage;
  const landing = translations.landing;
  const url = getLocalizedAbsoluteUrl(SITE_URL, safeLang, '/xizmatlar/patent-kalkulyatori');
  const title: string = landing?.title ?? translations.title;
  const faqTitle: string | undefined = translations.faq?.title;
  const faqs = patentFaqs(safeLang, translations.faq?.items ?? []);

  // Google va AI qidiruvlar sahifani bepul onlayn hisoblagich sifatida tanishi uchun.
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': `${url}#calculator`,
      name: title,
      description: translations.seoDescription,
      url,
      inLanguage: safeLang,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'UZS' },
      provider: { '@id': ORGANIZATION_ID },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: CRUMBS[safeLang][0], item: getLocalizedAbsoluteUrl(SITE_URL, safeLang) },
        { '@type': 'ListItem', position: 2, name: CRUMBS[safeLang][1], item: getLocalizedAbsoluteUrl(SITE_URL, safeLang, '/xizmatlar') },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
    ...(faqs.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': `${url}#faq`,
            inLanguage: safeLang,
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]
      : []),
  ];
  const trust = [landing?.trustSpeed, landing?.trustAccuracy, landing?.trustExperts].filter(Boolean);

  return (
    <div className="flex-grow pt-20">
      <Script
        id="json-ld-patent-calculator"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLd) }}
      />
      <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 bg-white">
        <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-dark-blue">
                {title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-gray-700">
                {landing?.subtitle ?? translations.subtitle}
            </p>
            {trust.length > 0 && (
              <ul className="mt-5 flex flex-wrap justify-center gap-2 text-sm text-gray-700">
                {trust.map((item: string) => (
                  <li key={item} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                    <Check className="h-4 w-4 text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </section>

      <section id="patent-calculator" className="py-8 sm:py-12 bg-secondary">
        <div className="container mx-auto px-4">
            <TrademarkCalculator translations={translations.trademarkCalculator} />
        </div>
      </section>

      {faqs.length > 0 && (
        <section id="savollar" className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-blue">{faqTitle}</h2>
            <div className="mt-6 divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
              {faqs.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base sm:text-lg font-semibold text-[#0A0B0E]">
                    <span>{f.q}</span>
                    <span aria-hidden className="mt-1 text-[#2554FF] transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-700">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
