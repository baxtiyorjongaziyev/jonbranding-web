'use client';

import { getLeadAttribution } from '@/lib/lead-attribution';
import { useState, useRef, useEffect, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Check, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { generateEventId, getGaClientId, trackContactClick, trackEvent, trackLead } from '@/lib/analytics';
import { TELEGRAM_CONTACT_URL } from '@/lib/contacts';
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

export type ServiceOption = {
  id: string;
  label: string;
  value: string;
};

function getCoreOptions(lang: string = 'uz'): { primary: ServiceOption[]; secondary: ServiceOption[] } {
  if (lang === 'ru') {
    return {
      primary: [
        { id: 'naming', label: 'Naming', value: 'Нейминг' },
        { id: 'logo', label: 'Logo', value: 'Логотип' },
        { id: 'patent', label: 'Patent', value: 'Патент' },
      ],
      secondary: [
        { id: 'packaging', label: 'Упаковка', value: 'Qadoq dizayni' },
        { id: 'consultation', label: 'Консультация', value: 'Не уверен — нужна консультация' },
      ],
    };
  }
  if (lang === 'en') {
    return {
      primary: [
        { id: 'naming', label: 'Naming', value: 'Naming' },
        { id: 'logo', label: 'Logo', value: 'Logo' },
        { id: 'patent', label: 'Patent', value: 'Patent' },
      ],
      secondary: [
        { id: 'packaging', label: 'Packaging', value: 'Packaging design' },
        { id: 'consultation', label: 'Need advice', value: 'Not sure — I need advice' },
      ],
    };
  }
  if (lang === 'zh') {
    return {
      primary: [
        { id: 'naming', label: 'Naming', value: '命名' },
        { id: 'logo', label: 'Logo', value: '标志' },
        { id: 'patent', label: 'Patent', value: '专利' },
      ],
      secondary: [
        { id: 'packaging', label: 'Packaging', value: '包装设计' },
        { id: 'consultation', label: '咨询', value: '还不确定——需要咨询' },
      ],
    };
  }
  // uz (default)
  return {
    primary: [
      { id: 'naming', label: 'Naming', value: 'Naming' },
      { id: 'logo', label: 'Logo', value: 'Logo' },
      { id: 'patent', label: 'Patent', value: 'Patent' },
    ],
    secondary: [
      { id: 'packaging', label: 'Qadoq dizayni', value: 'Qadoq dizayni' },
      { id: 'consultation', label: 'Maslahat kerak', value: 'Aniq emas — maslahat kerak' },
    ],
  };
}

function parseInitialServices(preset: string, allOptions: ServiceOption[], notSureValue: string): string[] {
  if (!preset) return ['Naming'];
  const pLower = preset.toLowerCase();

  if (
    pLower === notSureValue.toLowerCase() ||
    pLower.includes('maslahat') ||
    pLower.includes('aniq emas') ||
    pLower.includes('not sure') ||
    pLower.includes('не уверен') ||
    pLower.includes('不确定') ||
    pLower.includes('咨询')
  ) {
    return [notSureValue];
  }

  // Package presets
  if (pLower.includes('standart')) {
    return allOptions.filter((o) => ['naming', 'logo', 'patent'].includes(o.id)).map((o) => o.label);
  }
  if (pLower.includes('premium') || pLower.includes('vip')) {
    return allOptions.filter((o) => ['naming', 'logo', 'patent', 'packaging'].includes(o.id)).map((o) => o.label);
  }

  // Check if preset matches one of our options
  if (pLower.includes('logo')) return [preset];
  if (pLower.includes('neyming') || pLower.includes('naming')) return [preset];
  if (pLower.includes('patent')) return [preset];
  if (pLower.includes('qadoq') || pLower.includes('packaging')) return [preset];

  return [preset];
}

function isOptionChecked(opt: ServiceOption, selected: string[]): boolean {
  return selected.some((s) => {
    const sLower = s.toLowerCase();
    if (sLower === opt.value.toLowerCase() || sLower === opt.id.toLowerCase() || sLower === opt.label.toLowerCase()) {
      return true;
    }
    if (opt.id === 'logo' && sLower.includes('logo')) return true;
    if (opt.id === 'naming' && (sLower.includes('naming') || sLower.includes('neyming') || sLower.includes('nom'))) {
      return true;
    }
    if (opt.id === 'patent' && sLower.includes('patent')) return true;
    if (opt.id === 'packaging' && (sLower.includes('qadoq') || sLower.includes('packaging'))) return true;
    if (
      opt.id === 'consultation' &&
      (sLower.includes('maslahat') || sLower.includes('aniq emas') || sLower.includes('advice') || sLower.includes('consultation'))
    ) {
      return true;
    }
    return false;
  });
}

export default function LeadModal({
  open,
  onClose,
  presetService,
  source = 'narxlar',
  lang = 'uz',
  intent = 'project',
}: LeadModalProps) {
  const content = getSalesContent(lang);
  const t = content.ui.modal;
  const flow = getSalesFlow(lang);

  const { primary: primaryOptions, secondary: secondaryOptions, all: allCoreOptions } = useMemo(() => {
    const opts = getCoreOptions(lang);
    return { ...opts, all: [...opts.primary, ...opts.secondary] };
  }, [lang]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(() =>
    parseInitialServices(presetService, allCoreOptions, content.ui.notSure)
  );
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
      setSelectedServices(parseInitialServices(presetService, allCoreOptions, content.ui.notSure));
      setPhoneErr('');
      setSubmitErr('');
      setSending(false);
      setDone(false);
      trackEvent({ action: 'modal_open', category: 'Lead Form', label: source, source: `${source}_modal` });
    }
  }, [open, presetService, source, content.ui.notSure, allCoreOptions]);

  const toggleOption = (opt: ServiceOption) => {
    setSelectedServices((prev) => {
      const isCurrentlyChecked = isOptionChecked(opt, prev);

      // If selecting consultation/not_sure, clear other specific services
      if (opt.id === 'consultation') {
        return isCurrentlyChecked ? ['Naming'] : [opt.value];
      }

      // If selecting a specific service, remove consultation
      const withoutConsultation = prev.filter((s) => {
        const sLower = s.toLowerCase();
        return (
          !sLower.includes('maslahat') &&
          !sLower.includes('aniq emas') &&
          !sLower.includes('consultation') &&
          !sLower.includes('advice') &&
          !sLower.includes('不确定') &&
          !sLower.includes('咨询')
        );
      });

      if (isCurrentlyChecked) {
        // Remove this option
        const filtered = withoutConsultation.filter((s) => {
          const sLower = s.toLowerCase();
          if (opt.id === 'logo' && sLower.includes('logo')) return false;
          if (opt.id === 'naming' && (sLower.includes('naming') || sLower.includes('neyming') || sLower.includes('nom'))) {
            return false;
          }
          if (opt.id === 'patent' && sLower.includes('patent')) return false;
          if (opt.id === 'packaging' && (sLower.includes('qadoq') || sLower.includes('packaging'))) return false;
          return sLower !== opt.value.toLowerCase() && sLower !== opt.label.toLowerCase();
        });
        return filtered;
      } else {
        // Add this option
        return [...withoutConsultation, opt.label];
      }
    });
  };

  const finalServiceString =
    selectedServices.length > 0 ? selectedServices.join(', ') : content.ui.notSure;

  // Check if preset is a custom service not covered in core options
  const isPresetCustom =
    Boolean(presetService) &&
    !allCoreOptions.some((o) => isOptionChecked(o, [presetService])) &&
    !presetService.toLowerCase().includes('maslahat') &&
    !presetService.toLowerCase().includes('aniq emas');

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
          ...getLeadAttribution(),
          fullName: name || 'Mijoz',
          phone: normalizedPhone,
          role: intent === 'consultation' ? `${flow.consultation} — ${finalServiceString}` : finalServiceString,
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
      if (!res.ok || (result as { ok?: boolean }).ok !== true) {
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
      service: finalServiceString,
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
            // Ariza yuborilgandan keyin darhol qilinadigan qadam: kutishni xohlamagan
            // mijoz Telegram'da yozadi (konversiya auditi, K-7).
            <div className="flex flex-col gap-3">
              <a
                href={TELEGRAM_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick('telegram', `${source}_lead_done`)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2554FF] hover:bg-[#1D4ED8] text-white font-semibold py-4 text-sm transition-colors"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {flow.doneTelegram}
              </a>
              <button onClick={onClose} className="flex w-full items-center justify-center rounded-full border border-neutral-200 text-black font-semibold py-4 text-sm hover:bg-neutral-50 transition-colors">{t.close}</button>
            </div>
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

              {/* MODERN MULTI-SELECT CHECKBOXES */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between">
                  <label id="tariflar-service-label" className="text-sm font-medium text-neutral-700">
                    {t.servicesLabel}
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    {t.multiSelectHint}
                  </span>
                </div>

                {/* Primary 3 Options: Naming, Logo, Patent */}
                <div role="group" aria-labelledby="tariflar-service-label" className="grid grid-cols-3 gap-2">
                  {primaryOptions.map((opt) => {
                    const checked = isOptionChecked(opt, selectedServices);
                    return (
                      <label
                        key={opt.id}
                        className={cn(
                          'relative flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs sm:text-sm font-bold transition-all duration-200 select-none text-center',
                          checked
                            ? 'border-black bg-black text-white shadow-sm ring-1 ring-black'
                            : 'border-neutral-200 bg-neutral-50/70 text-neutral-800 hover:border-neutral-300 hover:bg-neutral-100'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOption(opt)}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                            checked ? 'border-white bg-white text-black' : 'border-neutral-300 bg-white'
                          )}
                        >
                          {checked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Secondary Options: Packaging & Consultation + Optional Custom Preset */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {isPresetCustom && (
                    <div className="col-span-2 flex items-center justify-between rounded-xl border border-black/80 bg-neutral-900 px-3.5 py-2.5 text-xs font-semibold text-white">
                      <span className="truncate">{t.selectedPrefix}: {presetService}</span>
                      <Check className="h-4 w-4 text-[#2ccc5a]" />
                    </div>
                  )}

                  {secondaryOptions.map((opt) => {
                    const checked = isOptionChecked(opt, selectedServices);
                    return (
                      <label
                        key={opt.id}
                        className={cn(
                          'relative flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-200 select-none text-center',
                          checked
                            ? 'border-black bg-black text-white shadow-sm ring-1 ring-black'
                            : 'border-neutral-200 bg-neutral-50/70 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOption(opt)}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors',
                            checked ? 'border-white bg-white text-black' : 'border-neutral-300 bg-white'
                          )}
                        >
                          {checked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                        <span className="truncate">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Hidden input to maintain accessible name and compatibility for forms and tests */}
                <input
                  type="hidden"
                  id="tariflar-service"
                  aria-label={t.service}
                  value={finalServiceString}
                  readOnly
                />
              </div>

              {submitErr && <p role="alert" className="text-xs text-red-600 text-center">{submitErr}</p>}
              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="flex w-full items-center justify-center rounded-full bg-black text-white font-semibold py-4 text-sm text-center disabled:opacity-60 transition-all hover:bg-neutral-800"
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
