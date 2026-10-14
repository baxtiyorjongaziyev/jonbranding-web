'use client';

import React, { FC, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { generateEventId, getGaClientId, trackEvent, trackLead } from '@/lib/analytics';
import { isValidPhone, normalizePhone } from '@/lib/lead-contact';
import type { ServicePageContent } from './types';

const mono = { fontFamily: 'var(--font-mono), "JetBrains Mono", monospace', letterSpacing: '0.12em' } as const;

/** Bitta bosqichli ariza: ism, telefon, kompaniya, izoh → `/api/submit-form`. */
export const ServiceLeadForm: FC<{
  content: ServicePageContent;
  formRef: React.RefObject<HTMLDivElement | null>;
  phoneRef: React.RefObject<HTMLInputElement | null>;
}> = ({ content, formRef, phoneRef }) => {
  const { source, serviceKey, serviceName, price, priceValue } = content;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; submit?: string }>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    trackEvent({ action: 'service_form_start', category: 'Service Form', label: serviceKey, source });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2) nextErrors.name = 'Ismingizni kiriting';
    if (!isValidPhone(phone)) nextErrors.phone = 'Telefon raqamini to‘g‘ri kiriting (+998...)';
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) return;

    setSending(true);
    const eventId = generateEventId('lead');
    const gaClientId = getGaClientId();
    const summary = [`Xizmat: ${serviceName} (${price} so‘m)`, company && `Kompaniya: ${company}`, comment && `Izoh: ${comment}`]
      .filter(Boolean)
      .join(' | ');

    trackEvent({ action: 'service_form_submit', category: 'Service Form', label: serviceKey, event_id: eventId, source, value: priceValue });

    let result: { eventId?: string } = {};
    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name.trim(),
          phone: normalizePhone(phone),
          role: serviceName,
          packageSummary: summary.slice(0, 900),
          serviceKeys: [serviceKey],
          totalPrice: priceValue,
          source,
          lang: 'uz',
          eventId,
          gaClientId,
          pageLocation: window.location.href,
          ctaSource: `${source}_form`,
          companyWebsite: honeypot,
        }),
      });
      result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error('submit failed');
    } catch {
      setErrors({ submit: 'Xatolik yuz berdi. Qayta urinib ko‘ring yoki to‘g‘ridan-to‘g‘ri qo‘ng‘iroq qiling.' });
      setSending(false);
      return;
    }

    trackLead({
      source,
      value: priceValue,
      eventId: result.eventId || eventId,
      serverTracked: true,
      gaClientId,
      service: serviceName,
      form_name: source,
      cta_source: `${source}_form`,
    });
    setSending(false);
    setDone(true);
  };

  const inputCls =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20';

  if (done) {
    return (
      <div ref={formRef} role="status" className="rounded-3xl bg-white p-8 text-center text-neutral-900 sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <Check className="h-7 w-7" />
        </div>
        <p className="mt-5 text-xl font-bold">Arizangiz qabul qilindi</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Menejerimiz ish vaqtida tez orada qo‘ng‘iroq qiladi va loyihangizni muhokama qiladi.
        </p>
      </div>
    );
  }

  return (
    <div ref={formRef} className="scroll-mt-24 rounded-3xl bg-white p-6 text-neutral-900 sm:p-8">
      <p className="text-[11px] uppercase text-neutral-400" style={mono}>
        {serviceName} · {price} so‘m{content.priceFrom ? 'dan' : ''}
      </p>
      <p className="mt-2 text-lg font-bold">Bepul konsultatsiyaga yoziling</p>
      <form onSubmit={handleSubmit} onChange={onStart} className="mt-6 space-y-3" noValidate>
        <HoneypotField value={honeypot} onChange={setHoneypot} />
        <div>
          <input className={inputCls} placeholder="Ismingiz" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
        </div>
        <div>
          <input
            ref={phoneRef}
            className={inputCls}
            placeholder="+998 __ ___ __ __"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
          />
          {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
        </div>
        <input className={inputCls} placeholder="Kompaniya yoki brend (ixtiyoriy)" value={company} onChange={(e) => setCompany(e.target.value)} />
        <textarea className={`${inputCls} min-h-[96px] resize-y`} placeholder="Qisqacha: nima qilmoqchisiz? (ixtiyoriy)" value={comment} onChange={(e) => setComment(e.target.value)} />
        {errors.submit ? <p className="text-xs text-red-600">{errors.submit}</p> : null}
        <button
          type="submit"
          disabled={sending}
          className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
        >
          {sending ? 'Yuborilmoqda…' : 'Ariza qoldirish'}
          {!sending ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
        <p className="text-center text-[11px] text-neutral-400">Majburiyatsiz. 20 daqiqalik suhbat.</p>
      </form>
    </div>
  );
};
