import type { FC } from 'react';
import Link from 'next/link';
import { getLocalizedPath, type Locale } from '@/lib/i18n/locale';
import type { ServiceId } from '@/lib/sales-content';
import { fillServiceTokens, getServiceFact } from '@/lib/service-pages/localized-facts';

export type ServiceFactsCopy = {
  title: string;
  intro: string;
  faqs: { q: string; a: string }[];
};

export type ServiceFactsLabels = {
  currency: string;
  price: string;
  duration: string;
  includes: string;
  faqTitle: string;
  pricesLink: string;
};

type Props = {
  lang: Locale;
  serviceId: ServiceId;
  copy: ServiceFactsCopy;
  labels: ServiceFactsLabels;
};

/** FAQ matni (JSON-LD va ko'rinadigan matn bir xil bo'lishi uchun) — narx/tarkib manbadan. */
export function buildServiceFaqs(lang: Locale, serviceId: ServiceId, copy: ServiceFactsCopy, labels: ServiceFactsLabels) {
  const service = getServiceFact(lang, serviceId);
  return copy.faqs.map((f) => ({
    q: f.q,
    a: fillServiceTokens(f.a, lang, serviceId, labels.currency).replaceAll('{includes}', service.deliverables.join('; ')),
  }));
}

/**
 * Ru/en/zh xizmat sahifalari uchun "narx, muddat, tarkib, savol-javob" bloki.
 * O'zbekcha sahifa `ServiceLanding` ishlatadi — unda bular allaqachon bor.
 */
const LocalizedServiceFacts: FC<Props> = ({ lang, serviceId, copy, labels }) => {
  const service = getServiceFact(lang, serviceId);
  const faqs = buildServiceFaqs(lang, serviceId, copy, labels);

  return (
    <section className="bg-white py-16 sm:py-24" aria-labelledby={`facts-${serviceId}`}>
      <div className="container mx-auto max-w-4xl px-4">
        <h2 id={`facts-${serviceId}`} className="text-3xl font-bold text-[#0A0B0E] sm:text-4xl">
          {copy.title}
        </h2>
        <p className="mt-4 text-lg text-gray-700">
          {fillServiceTokens(copy.intro, lang, serviceId, labels.currency)}
        </p>

        <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-6">
            <dt className="text-sm text-gray-600">{labels.price}</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-[#0A0B0E]">
              {service.price} {labels.currency}
            </dd>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6">
            <dt className="text-sm text-gray-600">{labels.duration}</dt>
            <dd className="mt-1 text-2xl font-bold text-[#0A0B0E]">{service.duration}</dd>
          </div>
        </dl>

        <h3 className="mt-10 text-xl font-bold text-[#0A0B0E]">{labels.includes}</h3>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
          {service.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>

        <h3 className="mt-12 text-xl font-bold text-[#0A0B0E]">{labels.faqTitle}</h3>
        <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-[#0A0B0E]">{f.q}</summary>
              <p className="mt-2 text-gray-700">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8">
          <Link
            href={getLocalizedPath(lang, `/narxlar#service-${serviceId}`)}
            className="font-semibold text-[#2554FF] hover:text-[#1D4ED8]"
          >
            {labels.pricesLink}
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LocalizedServiceFacts;
