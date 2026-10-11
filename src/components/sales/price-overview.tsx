import Link from 'next/link';
import { getSalesContent } from '@/lib/sales-content';
import { getSalesFlow } from '@/lib/sales-flow';

export default function PriceOverview({ lang, local = false }: { lang: string; local?: boolean }) {
  const content = getSalesContent(lang);
  const flow = getSalesFlow(lang);
  const services = content.serviceGroups.flatMap((group) => group.items);
  const paths = [
    { label: flow.logoPath, item: services.find((item) => item.id === 'logo')!, anchor: 'service-logo' },
    { label: flow.identityPath, item: services.find((item) => item.id === 'visual-identity')!, anchor: 'service-visual-identity' },
    { label: flow.packagingPath, item: services.find((item) => item.id === 'packaging')!, anchor: 'service-packaging' },
    { label: flow.newPath, item: content.packages[2], anchor: 'packages' },
  ];
  const href = (anchor: string) => `${local ? '' : `/${lang}/narxlar`}#${anchor}`;
  return (
    <section aria-label={flow.choose} className="mx-auto max-w-5xl px-5 py-12 text-left sm:px-8">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-neutral-900">{flow.choose}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {paths.map(({ label, item, anchor }) => (
          <Link key={anchor} href={href(anchor)} className="rounded-2xl border border-neutral-300 bg-white p-5 text-neutral-900 transition-colors hover:border-blue-600 focus-visible:outline-2 focus-visible:outline-blue-600">
            <span className="block text-sm text-neutral-600">{label}</span>
            <span className="mt-2 block font-semibold">{item.name} ↗</span>
            <span className="mt-3 block text-xl font-bold tabular-nums">{item.price} <span className="text-sm font-normal">{content.ui.currency}</span></span>
          </Link>
        ))}
      </div>
      <nav aria-label={flow.individual} className="mt-5 flex flex-wrap gap-2">
        {services.map((item) => <Link key={item.id} href={href(`service-${item.id}`)} className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 px-3 text-sm text-neutral-700 hover:border-blue-600">{item.name}</Link>)}
        <Link href={href('packages')} className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 px-3 text-sm text-neutral-700">{flow.packages}</Link>
      </nav>
    </section>
  );
}
