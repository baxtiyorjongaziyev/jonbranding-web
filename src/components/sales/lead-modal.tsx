'use client';

import { useState, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { generateEventId, getGaClientId, trackEvent, trackLead } from '@/lib/analytics';
import { isValidPhone, normalizePhone } from '@/lib/lead-contact';
import { getSalesContent } from '@/lib/sales-content';
import { getSalesFlow } from '@/lib/sales-flow';

type LeadModalProps = {
  open: boolean;
  onClose: () => void;
  presetService: string;
  /** Analitikada arizani qaysi sahifa keltirganini ajratish uchun. */
  source?: string;
  /** Xizmatlar ro'yxati va CRM yozuvi shu tilda bo'ladi. */
  lang?: string;
  intent?: 'consultation' | 'project';
};

export default function LeadModal({ open, onClose, presetService, source = 'narxlar', lang = 'uz', intent = 'project' }: LeadModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(presetService);
  const [phoneErr, setPhoneErr] = useState('');
  const [submitErr, setSubmitErr] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setPhone('');
      setService(presetService);
      setPhoneErr('');
      setSubmitErr('');
      setSending(false);
      setDone(false);
      trackEvent({ action: 'modal_open', category: 'Lead Form', label: source, source: `${source}_modal` });
    }
  }, [open, presetService, source]);

  const content = getSalesContent(lang);
  const t = content.ui.modal;
  const flow = getSalesFlow(lang);
  const allServices = content.serviceGroups.flatMap((group) =>
    group.items.map((item) => item.name)
  );
  const packageOptions = content.packages.map((pkg) => `${pkg.name} ${t.packageSuffix}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      setPhoneErr(t.phoneError);
      phoneRef.current?.focus();
      return;
    }
    setPhoneErr('');
    setSubmitErr('');
    setSending(true);

    const normalizedPhone = normalizePhone(phone);
    const eventId = generateEventId('lead');
    const gaClientId = getGaClientId();
    const pageLocation = typeof window !== 'undefined' ? window.location.href : undefined;

    trackEvent({
      action: 'lead_form_submitted',
      category: 'Lead Form',
      label: source,
      event_id: eventId,
      form_name: `${source}_page`,
      cta_source: `${source}_modal`,
      page_location: pageLocation,
    });

    let result: { ok?: boolean; eventId?: string; error?: string } = {};
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name || 'Mijoz',
          phone: normalizedPhone,
          role: intent === 'consultation' ? `${flow.consultation} — ${service}` : service,
          source: `${source}_modal`,
          lang,
          eventId,
          gaClientId,
          pageLocation,
          ctaSource: `${source}_modal`,
          companyWebsite: honeypot,
        }),
      });
      result = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitErr(t.submitError);
        setSending(false);
        return;
      }
    } catch {
      setSubmitErr(t.submitError);
      setSending(false);
      return;
    } finally {
      window.clearTimeout(timeout);
    }

    trackLead({
      source: `${source}_modal`,
      eventId: result.eventId || eventId,
      serverTracked: true,
      gaClientId,
      service,
      form_name: `${source}_page`,
      cta_source: `${source}_modal`,
    });
    setSending(false);
    setDone(true);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          data-mobile-overlay="true"
          className="fixed inset-x-0 bottom-0 top-auto z-50 max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-[28px] rounded-b-none bg-white p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100%-2rem)] sm:max-w-md sm:rounded-2xl sm:p-8"
          onOpenAutoFocus={(e) => { e.preventDefault(); phoneRef.current?.focus(); }}
        >
          {/* Mobile pull/sheet indicator handle */}
          <div className="mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-neutral-300 sm:hidden" aria-hidden="true" />
          <Dialog.Title className="mb-1.5 pr-9 text-2xl font-bold text-black" style={{ letterSpacing: '-0.03em' }}>
            {done ? t.titleDone : intent === 'consultation' ? flow.consultation : t.title}
          </Dialog.Title>
          <Dialog.Description className="mb-6 text-sm text-neutral-500" style={{ lineHeight: 1.6 }}>
            {done ? flow.done : intent === 'consultation' ? flow.consultationDesc : flow.projectDesc}
          </Dialog.Description>
          <Dialog.Close asChild>
            <button aria-label={t.close} className="absolute top-3 right-3 w-11 h-11 rounded-full grid place-items-center border border-neutral-200 text-neutral-500 hover:bg-neutral-50">✕</button>
          </Dialog.Close>

          {done ? (
            <button onClick={onClose} className="w-full rounded-full bg-black text-white font-semibold py-4 text-sm">{t.close}</button>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <HoneypotField value={honeypot} onChange={setHoneypot} />
              <div className="flex flex-col gap-1">
                <label htmlFor="tariflar-name" className="text-sm font-medium text-neutral-700">{t.name}</label>
                <input
                  id="tariflar-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="rounded-xl border border-neutral-200 px-4 py-3 text-base md:text-sm outline-none focus-visible:ring-2 focus-visible:ring-black"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="tariflar-phone" className="text-sm font-medium text-neutral-700">{t.phone}</label>
                <input
                  id="tariflar-phone"
                  ref={phoneRef}
                  type="tel"
                  inputMode="tel"
                  required
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setPhoneErr(''); }}
                  placeholder={t.phonePlaceholder}
                  aria-invalid={Boolean(phoneErr)}
                  className="rounded-xl border px-4 py-3 text-base md:text-sm outline-none focus-visible:ring-2 focus-visible:ring-black"
                  style={{ borderColor: phoneErr ? '#dc2626' : undefined }}
                />
                {phoneErr && <span role="alert" className="text-xs text-red-600">{phoneErr}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="tariflar-service" className="text-sm font-medium text-neutral-700">{t.service}</label>
                <select
                  id="tariflar-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="rounded-xl border border-neutral-200 px-3 py-3 text-base md:text-sm outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  {allServices.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                  {packageOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                  <option>{content.ui.notSure}</option>
                </select>
              </div>
              {submitErr && <p role="alert" className="text-xs text-red-600 text-center">{submitErr}</p>}
              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="flex w-full items-center justify-center rounded-full bg-black text-white font-semibold py-4 text-sm text-center disabled:opacity-60"
              >
                {sending ? t.sending : flow.submit}
              </button>
              <p className="text-xs leading-relaxed text-neutral-600">{flow.privacy}</p>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
