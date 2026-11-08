import type { FC } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSalesContent } from '@/lib/sales-content';
import type { ServiceId } from '@/lib/sales-content/types';

type Props = {
  lang: string;
  dictionary?: { eyebrow: string; title: string; link: string };
};

export type PriceStripItem = { key: string; name: string; price: string; duration?: string; anchor: string };

const SERVICES: ServiceId[] = ['logo', 'visual-identity', 'packaging'];

const priceValue = (price: string) => Number(price.replace(/\D/g, '')) || Number.POSITIVE_INFINITY;

/**
 * Bosh sahifadagi narx qatori uchun ma'lumot — faqat `sales-content`dan, qo'lda yozilmaydi
 * (CLAUDE.md: narxlar yagona manbada). Paket nomi har tilda boshqacha, shuning uchun
 * eng arzon paket narx bo'yicha tanlanadi.
 */
export function getPriceStripItems(lang: string): PriceStripItem[] {
  const content = getSalesContent(lang);
  const services = content.serviceGroups.flatMap((group) => group.items);
  const items: PriceStripItem[] = SERVICES.flatMap((id) => {
    const service = services.find((s) => s.id === id);
    return service
      ? [{ key: id, name: service.name, price: service.price, duration: service.duration, anchor: `service-${id}` }]
      : [];
  });
  const entry = [...content.packages].sort((a, b) => priceValue(a.price) - priceValue(b.price))[0];
  if (entry) {
    const suffix = content.ui.modal.packageSuffix;
    items.push({
      key: 'package',
      name: lang === 'zh' ? `${entry.name}${suffix}` : `${entry.name} ${suffix}`,
      price: entry.price,
      duration: entry.duration,
      anchor: 'packages',
    });
  }
  return items;
}

/**
 * "Narxlarimiz ochiq" — raqobatchilardan farq, lekin bosh sahifada narx umuman
 * ko'rinmas edi (docs/audits/2026-11-07-konversiya-audit.md, K-4).
 */
const AtPriceStrip: FC<Props> = ({ lang, dictionary }) => {
  if (!dictionary) return null;
  const items = getPriceStripItems(lang);
  if (items.length === 0) return null;
  const currency = getSalesContent(lang).ui.currency;
  const pricesHref = lang === 'uz' ? '/narxlar' : `/${lang}/narxlar`;

  return (
    <section
      aria-labelledby="price-strip-title"
      data-price-strip=""
      className="py-14 md:py-20 relative z-[2] border-b border-[var(--at-line)]"
    >
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-2 mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-accent)] inline-block" />
              <span>{dictionary.eyebrow}</span>
            </span>
            <h2 id="price-strip-title" className="text-2xl md:text-3xl font-bold text-[var(--at-ink)]" style={{ letterSpacing: '-0.03em' }}>
              {dictionary.title}
            </h2>
          </div>
          <Link
            href={pricesHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--at-accent)] hover:text-[#1D4ED8] transition-colors"
          >
            {dictionary.link}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={`${pricesHref}#${item.anchor}`}
                className="flex h-full flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--at-line)] bg-white p-4 md:p-5 hover:border-[var(--at-accent)] transition-colors"
              >
                <span className="text-sm font-semibold leading-snug text-[var(--at-ink)]">{item.name}</span>
                <span>
                  <span className="block text-lg md:text-2xl font-bold tabular-nums text-[var(--at-ink)]">
                    {item.price} <span className="text-xs md:text-sm font-medium text-[var(--at-muted)]">{currency}</span>
                  </span>
                  {item.duration && (
                    <span className="mt-1 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--at-muted)]">
                      {item.duration}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AtPriceStrip;
