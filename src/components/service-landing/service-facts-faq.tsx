import Script from 'next/script';
import { safeJsonStringify } from '@/lib/security';
import { fillServiceFacts, type ServiceFacts } from '@/lib/service-facts';

export type ServiceFactsContent = {
  title: string;
  price_label: string;
  duration_label: string;
  includes_title: string;
  includes: string[];
  payment: string;
  faq_title: string;
  faq: { q: string; a: string }[];
};

type Props = {
  id: string;
  content: ServiceFactsContent;
  facts: ServiceFacts;
};

/**
 * "Narx, muddat va savollar" bo'limi: qidiruvchining asosiy savollariga
 * (qancha turadi, qancha vaqt oladi, nima kiradi) bir joyda javob. FAQ matni
 * sahifada ko'rinadi va FAQPage JSON-LD bilan bir xil.
 */
export default function ServiceFactsFaq({ id, content, facts }: Props) {
  const faq = content.faq.map((item) => ({
    q: fillServiceFacts(item.q, facts),
    a: fillServiceFacts(item.a, facts),
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section className="py-16 sm:py-24 bg-white" aria-labelledby={`${id}-facts-title`}>
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 id={`${id}-facts-title`} className="text-3xl sm:text-4xl font-bold text-dark-blue text-center">
          {content.title}
        </h2>

        <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-secondary/50 p-6">
            <dt className="text-sm text-gray-600">{content.price_label}</dt>
            <dd className="mt-1 text-2xl font-bold text-dark-blue tabular-nums">{facts.price}</dd>
          </div>
          <div className="rounded-2xl bg-secondary/50 p-6">
            <dt className="text-sm text-gray-600">{content.duration_label}</dt>
            <dd className="mt-1 text-2xl font-bold text-dark-blue">{facts.duration}</dd>
          </div>
        </dl>

        <h3 className="mt-10 text-xl font-bold text-dark-blue">{content.includes_title}</h3>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
          {content.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-gray-700">{content.payment}</p>

        <h3 className="mt-12 text-2xl font-bold text-dark-blue">{content.faq_title}</h3>
        <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200">
          {faq.map((item) => (
            <details key={item.q} className="group p-5">
              <summary className="cursor-pointer font-semibold text-dark-blue">{item.q}</summary>
              <p className="mt-3 text-gray-700">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <Script
        id={`json-ld-faq-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLd) }}
      />
    </section>
  );
}
