'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, Printer, RotateCcw } from 'lucide-react';
import { calculatePackagePrice, getServiceDetails, type SelectedServices } from '@/lib/pricing';

const SERVICE_KEYS: (keyof SelectedServices)[] = [
  'namingPremium',
  'logoPremium',
  'logoVIP',
  'packaging',
  'strategy',
  'smm',
];

const UZS_RATE = 12_700;

function money(value: number) {
  return `${Math.round(value * UZS_RATE).toLocaleString('uz-UZ')} so'm`;
}

export default function KpBuilderClient() {
  const details = getServiceDetails('uz') as Record<string, { label: string; price: number }>;
  const [client, setClient] = useState('');
  const [selectedServices, setSelectedServices] = useState<SelectedServices>({ logoPremium: true });
  const [discountType, setDiscountType] = useState<'half' | 'full'>('half');
  const [promoCode, setPromoCode] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => calculatePackagePrice({
    selectedServices,
    discountType,
    promoCode,
  }, 'uz'), [discountType, promoCode, selectedServices]);

  const selected = SERVICE_KEYS.filter((key) => selectedServices[key]);
  const proposal = [
    `JONBRANDING — TIJORAT TAKLIFI`,
    client ? `Mijoz: ${client}` : '',
    '',
    ...selected.map((key) => `• ${details[key].label} — ${money(details[key].price)}`),
    '',
    `Bazaviy narx: ${money(result.base)}`,
    ...result.discountApplied.map((item: { name: string; value: number }) => `${item.name}: -${money(item.value)}`),
    `Yakuniy narx: ${money(result.final)}`,
    discountType === 'half'
      ? `To'lov: 50% boshlanishida, 50% topshirishda`
      : `To'lov: 100% oldindan`,
    '',
    `Chegirmalar 24 soat amal qiladi. $50 Arboun bilan narx 3 kunga muzlatiladi.`,
  ].filter((line) => line !== '').join('\n');

  const toggle = (key: keyof SelectedServices) => {
    setSelectedServices((current) => ({ ...current, [key]: !current[key] }));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(proposal);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen bg-white text-neutral-950 print:bg-white">
      <header className="border-b border-neutral-200 px-5 py-4 print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">JonBranding Admin</p>
            <h1 className="text-xl font-black">KP / Invoice Builder</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => { setSelectedServices({ logoPremium: true }); setPromoCode(''); setClient(''); }} aria-label="Tozalash" title="Tozalash" className="grid size-10 place-items-center border border-neutral-300 hover:bg-neutral-100">
              <RotateCcw size={17} />
            </button>
            <button type="button" onClick={copy} className="inline-flex h-10 items-center gap-2 bg-neutral-950 px-4 text-sm font-bold text-white">
              {copied ? <Check size={17} /> : <Copy size={17} />}{copied ? 'Nusxalandi' : 'Nusxalash'}
            </button>
            <button type="button" onClick={() => window.print()} aria-label="Chop etish" title="Chop etish" className="grid size-10 place-items-center bg-blue-600 text-white">
              <Printer size={17} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.8fr)] print:block print:max-w-none print:p-0">
        <section className="space-y-8 print:hidden" aria-label="KP sozlamalari">
          <label className="block">
            <span className="mb-2 block text-sm font-bold">Mijoz / kompaniya</span>
            <input value={client} onChange={(event) => setClient(event.target.value)} placeholder="Masalan: RashMilk" className="h-12 w-full border border-neutral-300 px-4 outline-none focus:border-blue-600" />
          </label>

          <fieldset>
            <legend className="mb-3 text-sm font-bold">Xizmatlar</legend>
            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
              {SERVICE_KEYS.map((key) => (
                <label key={key} className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3">
                  <span className="flex items-center gap-3">
                    <input type="checkbox" checked={Boolean(selectedServices[key])} onChange={() => toggle(key)} className="size-4 accent-blue-600" />
                    <span className="font-semibold">{details[key].label}</span>
                  </span>
                  <span className="text-sm tabular-nums text-neutral-500">{money(details[key].price)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-bold">To'lov turi</legend>
            <div className="grid grid-cols-2 border border-neutral-300 p-1">
              <button type="button" onClick={() => setDiscountType('half')} className={`h-11 text-sm font-bold ${discountType === 'half' ? 'bg-neutral-950 text-white' : ''}`}>50 / 50</button>
              <button type="button" onClick={() => setDiscountType('full')} className={`h-11 text-sm font-bold ${discountType === 'full' ? 'bg-blue-600 text-white' : ''}`}>100% oldindan</button>
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-2 block text-sm font-bold">Promokod</span>
            <input value={promoCode} onChange={(event) => setPromoCode(event.target.value.toUpperCase())} placeholder="SALOM" className="h-12 w-full border border-neutral-300 px-4 uppercase outline-none focus:border-blue-600" />
          </label>
        </section>

        <section className="border-l-4 border-blue-600 bg-neutral-50 p-6 sm:p-8 print:border-l-0 print:bg-white print:p-10" aria-label="Tijorat taklifi">
          <div className="flex items-start justify-between border-b border-neutral-300 pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Tijorat taklifi</p>
              <h2 className="mt-2 text-3xl font-black">JONBRANDING</h2>
            </div>
            <p className="text-right text-sm text-neutral-500">{new Date().toLocaleDateString('uz-UZ')}</p>
          </div>
          {client && <p className="mt-6 text-sm"><span className="text-neutral-500">Mijoz:</span> <strong>{client}</strong></p>}
          <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-300">
            {selected.map((key) => (
              <div key={key} className="flex justify-between gap-4 py-4 text-sm">
                <span className="font-semibold">{details[key].label}</span><span className="tabular-nums">{money(details[key].price)}</span>
              </div>
            ))}
            {selected.length === 0 && <p className="py-5 text-sm text-neutral-500">Kamida bitta xizmat tanlang.</p>}
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span>Bazaviy narx</span><span>{money(result.base)}</span></div>
            {result.discountApplied.map((item: { name: string; value: number }) => (
              <div key={item.name} className="flex justify-between text-blue-700"><span>{item.name}</span><span>-{money(item.value)}</span></div>
            ))}
          </div>
          <div className="mt-6 flex items-end justify-between border-t-2 border-neutral-950 pt-5">
            <span className="font-bold">Yakuniy narx</span>
            <span className="text-2xl font-black tabular-nums">{money(result.final)}</span>
          </div>
          <p className="mt-8 text-xs leading-5 text-neutral-500">Chegirmalar 24 soat amal qiladi. $50 Arboun to'lovi bilan narx 3 kunga muzlatiladi. Yakuniy scope shartnomada tasdiqlanadi.</p>
        </section>
      </div>
    </main>
  );
}
