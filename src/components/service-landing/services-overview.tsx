import type { FC } from 'react';
import Link from 'next/link';
import { getLocalizedPath, type Locale } from '@/lib/i18n/locale';
import { getSalesContent } from '@/lib/sales-content';
import {
  buildOverviewFaqs,
  type ServicesOverviewCopy,
} from '@/lib/service-pages/overview-facts';

type Props = {
  lang: Locale;
  copy: ServicesOverviewCopy;
  currency: string;
};

/** `/xizmatlar` uchun: brending nima, paketlar (narx/muddat/tarkib), jarayon, savol-javob. */
const ServicesOverview: FC<Props> = ({ lang, copy, currency }) => {
  const content = getSalesContent(lang);
  const faqs = buildOverviewFaqs(lang, copy, currency);
  // docs/NARXLAR.md: paketlar VIP, PREMIUM, STANDART tartibida — arzonidan boshlab ko'rsatamiz.
  const packages = [...content.packages].reverse();

  return (
    <section className="bg-white py-16 sm:py-24" aria-labelledby="services-overview">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 id="services-overview" className="text-3xl font-bold text-[#0A0B0E] sm:text-4xl">
          {copy.title}
        </h2>
        <p className="mt-4 text-lg text-gray-700">{copy.intro}</p>

        <h3 className="mt-10 text-xl font-bold text-[#0A0B0E]">{copy.packagesTitle}</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {packages.map((p) => (
            <div key={p.name} className="rounded-2xl border border-gray-200 p-6">
              <p className="text-sm font-semibold text-gray-600">{p.name}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[#0A0B0E]">
                {copy.packagesFrom.replaceAll('{price}', p.price).replaceAll('{currency}', currency)}
              </p>
              <p className="mt-3 text-sm text-gray-600">
                {copy.packagesDuration}: <span className="font-semibold text-[#0A0B0E]">{p.duration}</span>
              </p>
              <p className="mt-3 text-sm text-gray-600">{copy.packagesIncludes}:</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-700">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600">{copy.packagesNote}</p>

        <h3 className="mt-10 text-xl font-bold text-[#0A0B0E]">{copy.processTitle}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-gray-700">
          {content.processSteps.map((s) => (
            <li key={s.title}>
              <span className="font-semibold text-[#0A0B0E]">{s.title}</span> — {s.desc}
            </li>
          ))}
        </ol>

        <h3 className="mt-12 text-xl font-bold text-[#0A0B0E]">{copy.faqTitle}</h3>
        <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-[#0A0B0E]">{f.q}</summary>
              <p className="mt-2 text-gray-700">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8">
          <Link href={getLocalizedPath(lang, '/narxlar')} className="font-semibold text-[#2554FF] hover:text-[#1D4ED8]">
            {copy.pricesLink}
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ServicesOverview;
