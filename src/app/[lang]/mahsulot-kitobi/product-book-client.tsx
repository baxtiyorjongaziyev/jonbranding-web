'use client';

import Link from 'next/link';
import { useMemo, useState, type FC } from 'react';
import { BookOpen, Calculator, Check, ChevronDown, Copy, Package as PackageIcon, Search, ShieldAlert } from 'lucide-react';
import type { SalesContent, Service, ServiceId } from '@/lib/sales-content';
import { cn } from '@/lib/utils';

type Props = { content: SalesContent };
type Tab = 'services' | 'packages' | 'calc' | 'process' | 'faq';

const TABS: { id: Tab; label: string }[] = [
  { id: 'services', label: 'Xizmatlar' },
  { id: 'packages', label: 'Paketlar' },
  { id: 'calc', label: 'Narx kalkulyatori' },
  { id: 'process', label: 'Jarayon va kafolat' },
  { id: 'faq', label: 'Savol-javob' },
];

/** Paket tarkibi xizmat ID larida (docs/NARXLAR.md 3-bo'lim: alohida narxlar yig'indisi `separate` ga teng). */
const PACKAGE_SERVICES: Record<string, Partial<Record<ServiceId, number>>> = {
  STANDART: { naming: 1, logo: 1, 'trademark-standard': 1 },
  PREMIUM: { naming: 1, logo: 1, 'visual-identity': 1, brandbook: 1, 'trademark-standard': 1 },
  VIP: { naming: 1, logo: 1, 'visual-identity': 1, brandbook: 1, 'trademark-standard': 1, packaging: 1, 'packaging-extra': 2 },
};

const toNumber = (price: string) => Number(price.replace(/[^\d]/g, '')) || 0;
const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU').replace(/\u00a0|,/g, ' ');

const ServiceCard: FC<{ service: Service; group: string; currency: string }> = ({ service, group, currency }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pitch = `${service.name} — ${service.price} ${currency}${service.duration ? `, ${service.duration}` : ''}. ${service.benefit}`;

  const copy = async () => {
    await navigator.clipboard.writeText(pitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-[44px] w-full items-center gap-4 p-5 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{group}</p>
          <h3 className="mt-1 text-lg font-semibold text-[#0A0B0E]">{service.name}</h3>
        </div>
        <div className="text-right">
          <p className="font-semibold tabular-nums text-[#0A0B0E]">{service.price} <span className="text-sm font-normal text-slate-500">{currency}</span></p>
          {service.duration ? <p className="text-sm text-slate-500">{service.duration}</p> : null}
        </div>
        <ChevronDown className={cn('h-5 w-5 shrink-0 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open ? (
        <div className="grid gap-5 border-t border-slate-200 p-5 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-slate-700">{service.lead}</p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2554FF]">Mijoz foydasi</p>
              <p className="mt-1 text-slate-800">{service.benefit}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2554FF]">Kimga</p>
              <p className="mt-1 text-slate-800">{service.audience}</p>
            </div>
            {service.note ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{service.note}</p> : null}
            {service.addon ? (
              <p className="text-sm text-slate-700">{service.addon.label}: <b className="tabular-nums">{service.addon.price}</b></p>
            ) : null}
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2554FF]">Mijoz nima oladi</p>
              <ul className="mt-2 space-y-1.5">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-slate-800"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2554FF]" />{d}</li>
                ))}
              </ul>
            </div>
            {service.proof ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2554FF]">{service.proof.label}</p>
                <p className="mt-1 text-sm text-slate-700">{service.proof.items.join(', ')}</p>
              </div>
            ) : null}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Mijozga qisqa taqdimot</p>
              <p className="mt-1 text-sm text-slate-800">{pitch}</p>
              <button type="button" onClick={copy} className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[#2554FF] hover:text-[#1D4ED8]">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Nusxalandi' : 'Nusxa olish'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
};

const ProductBookClient: FC<Props> = ({ content }) => {
  const [tab, setTab] = useState<Tab>('services');
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string>('all');
  const [qty, setQty] = useState<Partial<Record<ServiceId, number>>>({});
  const [extraClasses, setExtraClasses] = useState(0);
  const [prepay, setPrepay] = useState(false);
  const [promo, setPromo] = useState(false);

  const currency = content.ui.currency;
  const services = useMemo(
    () => content.serviceGroups.flatMap((g) => g.items.map((s) => ({ ...s, group: g.title }))),
    [content]
  );
  const byId = useMemo(() => new Map(services.map((s) => [s.id, s])), [services]);

  const filtered = services.filter((s) => {
    if (group !== 'all' && s.group !== group) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [s.name, s.lead, s.benefit, s.audience, ...s.deliverables].join(' ').toLowerCase().includes(q);
  });

  const addonPrice = toNumber(byId.get('trademark-search')?.addon?.price ?? '0');
  const subtotal =
    services.reduce((sum, s) => sum + toNumber(s.price) * (qty[s.id] ?? 0), 0) +
    (qty['trademark-search'] ? extraClasses * addonPrice : 0);

  const covering = content.packages.filter((p) => {
    const inside = PACKAGE_SERVICES[p.name];
    if (!inside) return false;
    const selected = Object.entries(qty).filter(([, n]) => (n ?? 0) > 0);
    return selected.length > 0 && selected.every(([id, n]) => (inside[id as ServiceId] ?? 0) >= (n ?? 0));
  });
  const bestPackage = covering.sort((a, b) => toNumber(a.price) - toNumber(b.price))[0];

  const base = bestPackage && toNumber(bestPackage.price) < subtotal ? toNumber(bestPackage.price) : subtotal;
  const step1 = base * 0.9;
  const step2 = prepay ? step1 * 0.9 : step1;
  const step3 = promo ? step2 * 0.9 : step2;

  const setService = (id: ServiceId, n: number) => setQty((prev) => ({ ...prev, [id]: Math.max(0, n) }));
  const applyPackage = (name: string) => {
    setQty({ ...PACKAGE_SERVICES[name] });
    setExtraClasses(0);
    setTab('calc');
  };

  return (
    <main className="min-h-screen bg-white text-[#0A0B0E]">
      <section className="border-b border-[#E5E7EB]">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2554FF]">
            <BookOpen className="h-4 w-4" /> Ichki hujjat · faqat jamoa uchun
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Mahsulot kitobi: <em className="font-serif font-normal">nima sotamiz, qancha, kimga</em>
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[#4B5563]">
            Har bir xizmat, paket, narx va muddat bir joyda. Ma’lumotlar <code>/narxlar</code> sahifasi bilan bir manbadan olinadi —
            saytda narx o‘zgarsa, bu yerda ham o‘zgaradi. E’tirozlar bilan ishlash uchun{' '}
            <Link href="/uz/sotuv-texnikalari" className="font-semibold text-[#2554FF] underline-offset-4 hover:underline">sotuv texnikalari</Link> sahifasiga qarang.
          </p>
          <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-4">
            {[
              [String(services.length), 'xizmat'],
              [String(content.packages.length), 'paket'],
              ['50 / 50', 'to‘lov bosqichi'],
            ].map(([v, l]) => (
              <div key={l} className="border-l-2 border-[#2554FF] pl-3">
                <dt className="text-2xl font-bold tabular-nums">{v}</dt>
                <dd className="text-sm text-[#4B5563]">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <nav className="sticky top-16 z-30 border-b border-[#E5E7EB] bg-white/95 backdrop-blur" aria-label="Bo‘limlar">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'min-h-[44px] whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors',
                tab === t.id ? 'border-[#0A0B0E] bg-[#0A0B0E] text-white' : 'border-[#E5E7EB] hover:border-[#2554FF]/40 hover:text-[#2554FF]'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {tab === 'services' ? (
          <section>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Qidirish</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Xizmat, foyda yoki mijoz turi bo‘yicha qidiring…"
                  className="min-h-[44px] w-full rounded-xl border border-[#E5E7EB] pl-9 pr-3 outline-none focus:border-[#2554FF]"
                />
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                aria-label="Guruh"
                className="min-h-[44px] rounded-xl border border-[#E5E7EB] px-3"
              >
                <option value="all">Barcha guruhlar</option>
                {content.serviceGroups.map((g) => <option key={g.title} value={g.title}>{g.title}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {filtered.map((s) => <ServiceCard key={s.id} service={s} group={s.group} currency={currency} />)}
              {filtered.length === 0 ? <p className="text-[#4B5563]">Hech narsa topilmadi.</p> : null}
            </div>
          </section>
        ) : null}

        {tab === 'packages' ? (
          <section className="grid gap-4 md:grid-cols-3">
            {content.packages.map((p) => (
              <article key={p.name} className={cn('flex flex-col rounded-2xl border p-6', p.featured ? 'border-[#2554FF]' : 'border-[#E5E7EB]')}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  {p.badge ? <span className="rounded-full bg-[#2554FF] px-3 py-1 text-xs font-semibold text-white">{p.badge}</span> : null}
                </div>
                <p className="mt-3 text-3xl font-bold tabular-nums">{p.price} <span className="text-base font-normal text-[#4B5563]">{currency}</span></p>
                <p className="mt-1 text-sm text-[#4B5563]">Alohida: <s className="tabular-nums">{p.separate}</s> · Tejaladi: <b className="tabular-nums text-[#0A0B0E]">{p.saving}</b></p>
                <p className="mt-4 text-sm text-slate-700">{p.audience}</p>
                <ul className="mt-4 flex-1 space-y-1.5">
                  {p.features.map((f) => <li key={f} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2554FF]" />{f}</li>)}
                </ul>
                <p className="mt-4 text-sm text-[#4B5563]">Dizayn muddati: {p.duration}</p>
                <button type="button" onClick={() => applyPackage(p.name)} className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0A0B0E] px-4 font-semibold text-white hover:bg-[#2554FF]">
                  <Calculator className="h-4 w-4" /> Kalkulyatorda hisoblash
                </button>
              </article>
            ))}
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 md:col-span-3">
              Paket muddati faqat dizayn ishlariga tegishli. Patent guvohnomasi alohida chiqadi: oddiy tartibda 7 oy, tezkorda 20–40 kun. Mijozga shuni aniq ayting.
            </p>
          </section>
        ) : null}

        {tab === 'calc' ? (
          <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-2">
              {services.map((s) => {
                const n = qty[s.id] ?? 0;
                return (
                  <div key={s.id} className={cn('flex items-center gap-3 rounded-xl border p-3', n > 0 ? 'border-[#2554FF] bg-blue-50/40' : 'border-[#E5E7EB]')}>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm tabular-nums text-[#4B5563]">{s.price} {currency}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" aria-label={`${s.name} kamaytirish`} onClick={() => setService(s.id, n - 1)} className="h-11 w-11 rounded-lg border border-[#E5E7EB] text-lg">−</button>
                      <span className="w-6 text-center tabular-nums">{n}</span>
                      <button type="button" aria-label={`${s.name} qo‘shish`} onClick={() => setService(s.id, n + 1)} className="h-11 w-11 rounded-lg border border-[#E5E7EB] text-lg">+</button>
                    </div>
                  </div>
                );
              })}
              {qty['trademark-search'] ? (
                <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] p-3">
                  <p className="flex-1 text-sm">Qo‘shimcha sinflar soni (har biri {fmt(addonPrice)} {currency})</p>
                  <input type="number" min={0} value={extraClasses} onChange={(e) => setExtraClasses(Math.max(0, Number(e.target.value)))} aria-label="Qo‘shimcha sinflar" className="h-11 w-20 rounded-lg border border-[#E5E7EB] px-2 tabular-nums" />
                </div>
              ) : null}
            </div>

            <aside className="h-fit rounded-2xl bg-[#0A0B0E] p-6 text-white lg:sticky lg:top-36">
              <p className="text-sm text-slate-400">Alohida xizmatlar yig‘indisi</p>
              <p className="text-3xl font-bold tabular-nums">{fmt(subtotal)} {currency}</p>
              {bestPackage && toNumber(bestPackage.price) < subtotal ? (
                <p className="mt-3 rounded-xl bg-[#2554FF] p-3 text-sm">
                  <PackageIcon className="mr-1 inline h-4 w-4" /> {bestPackage.name} paketi tanlangan xizmatlarni qamraydi va arzonroq: <b className="tabular-nums">{bestPackage.price} {currency}</b>. Mijozga paketni taklif qiling.
                </p>
              ) : null}
              <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-sm">
                <p className="font-semibold">Chegirma kaskadi (24 soat ichida to‘lov)</p>
                <div className="flex justify-between"><span>1. Istisno chegirmasi −10%</span><span className="tabular-nums">{fmt(step1)}</span></div>
                <label className="flex min-h-[44px] cursor-pointer items-center justify-between gap-2">
                  <span><input type="checkbox" checked={prepay} onChange={(e) => setPrepay(e.target.checked)} className="mr-2" />2. 100% oldindan to‘lov −10%</span>
                  <span className="tabular-nums">{fmt(step2)}</span>
                </label>
                <label className="flex min-h-[44px] cursor-pointer items-center justify-between gap-2">
                  <span><input type="checkbox" checked={promo} onChange={(e) => setPromo(e.target.checked)} className="mr-2" />3. Promokod −10%</span>
                  <span className="tabular-nums">{fmt(step3)}</span>
                </label>
              </div>
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-sm text-slate-400">Yakuniy summa</p>
                <p className="text-4xl font-bold tabular-nums">{fmt(step3)} <span className="text-base font-normal">{currency}</span></p>
                {!prepay ? <p className="mt-2 text-sm text-slate-300">To‘lov: 50% shartnomada ({fmt(step3 / 2)}), 50% topshirishda.</p> : null}
                <p className="mt-3 text-xs text-slate-400">24 soatda to‘lay olmasa: $50 to‘lab narxni 3 kunga muzlatish (Arboun) taklif qilinadi.</p>
              </div>
              <button type="button" onClick={() => { setQty({}); setExtraClasses(0); setPrepay(false); setPromo(false); }} className="mt-5 min-h-[44px] w-full rounded-xl border border-white/20 text-sm hover:bg-white/10">Tozalash</button>
            </aside>
          </section>
        ) : null}

        {tab === 'process' ? (
          <section className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Ish jarayoni</h2>
              <ol className="mt-5 space-y-4">
                {content.processSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2554FF] text-sm font-bold text-white">{i + 1}</span>
                    <div><p className="font-semibold">{s.title}</p><p className="text-[#4B5563]">{s.desc}</p></div>
                  </li>
                ))}
              </ol>
              <h2 className="mt-10 text-2xl font-bold">Narxga ta’sir qiluvchi omillar</h2>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-700">{content.priceFactors.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Kafolatlar — faqat shularni va’da qilamiz</h2>
              <ul className="mt-5 space-y-2">
                {content.guarantees.map((g) => <li key={g} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[#2554FF]" />{g}</li>)}
              </ul>
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
                <p className="flex items-center gap-2 font-semibold"><ShieldAlert className="h-5 w-5" /> Qizil zona — va’da qilinmaydi</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                  <li>Pul qaytarish kafolati yo‘q — o‘zingizdan qo‘shmang.</li>
                  <li>Patent guvohnomasini paket muddatiga (20–45 kun) bog‘lamang.</li>
                  <li>Ro‘yxatda yo‘q chegirma yoki narx aytmang.</li>
                </ul>
              </div>
              <h2 className="mt-10 text-2xl font-bold">Mijoz qaysi muammodan qutuladi</h2>
              <div className="mt-4 space-y-3">
                {content.jobs.map((j) => (
                  <div key={j.pain} className="grid gap-2 rounded-xl border border-[#E5E7EB] p-4 sm:grid-cols-2">
                    <p className="text-sm text-[#4B5563]">Hozir: {j.pain}</p>
                    <p className="text-sm font-medium">Biz bilan: {j.gain}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {tab === 'faq' ? (
          <section className="mx-auto max-w-3xl space-y-3">
            {content.faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-[#E5E7EB] p-4">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                  {f.q}<ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-[#4B5563]">{f.a}</p>
              </details>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
};

export default ProductBookClient;
