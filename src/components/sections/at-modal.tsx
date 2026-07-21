'use client';
import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { generateEventId, getGaClientId, trackEvent, trackLead } from '@/lib/analytics';
import { HoneypotField } from '@/components/ui/honeypot-field';
import {
  isValidPhone,
  isValidTelegramUsername,
  normalizePhone,
  normalizeTelegramUsername,
} from '@/lib/lead-contact';

interface Props {
  open: boolean;
  onClose: () => void;
  lang?: string;
  dictionary: any;
}

type ServiceOption = 'free' | 'full' | 'roadmap' | 'unsure';
type BudgetOption = 'free' | 'starter' | 'growth' | 'unsure';

// Budjet tanlovini taxminiy UZS qiymatga moslash — value-based bidding uchun
const BUDGET_VALUE: Partial<Record<BudgetOption, number>> = {
  starter: 4500000,
  growth: 12000000,
};

const AtModal: FC<Props> = ({ open, onClose, lang = 'uz', dictionary }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [name, setName] = useState('');
  const [service, setService] = useState<ServiceOption>('free');
  const [budget, setBudget] = useState<BudgetOption>('free');
  const [phoneErr, setPhoneErr] = useState('');
  const [telegramErr, setTelegramErr] = useState('');
  const [submitErr, setSubmitErr] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const phoneRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      setStep(1); setDone(false); setPhoneErr(''); setTelegramErr(''); setSubmitErr(''); setSending(false); setPhone(''); setTelegram(''); setName(''); setService('free'); setBudget('free');
      trackEvent({ action: 'modal_open', category: 'Lead Form', label: 'Atelier Mini Audit', source: 'at_modal' });
    }
  }, [open]);

  const goToStep2 = () => {
    if (!validateStep1()) return;
    trackEvent({ action: 'modal_step2', category: 'Lead Form', label: 'Atelier Mini Audit', source: 'at_modal' });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitErr('');
    setSending(true);
    const normalizedPhone = normalizePhone(phone);
    const telegramUsername = normalizeTelegramUsername(telegram);
    const hasTelegram = Boolean(telegramUsername);
    const serviceLabel = dictionary.atModal.serviceOptions[service];
    const budgetLabel = dictionary.atModal.budgetOptions[budget];
    const eventId = generateEventId('lead');
    const gaClientId = getGaClientId();
    const pageLocation = typeof window !== 'undefined' ? window.location.href : undefined;
    const value = BUDGET_VALUE[budget];

    trackEvent({
      action: 'lead_form_submitted',
      category: 'Lead Form',
      label: 'Atelier Mini Audit',
      event_id: eventId,
      form_name: 'atelier_mini_audit',
      cta_source: 'at_modal',
      page_location: pageLocation,
    });

    let result: { ok?: boolean; eventId?: string; error?: string } = {};
    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name || 'Mijoz',
          phone: normalizedPhone,
          telegram: hasTelegram ? telegramUsername : undefined,
          role: serviceLabel,
          budget: budgetLabel,
          source: 'at_modal',
          lang,
          eventId,
          gaClientId,
          pageLocation,
          ctaSource: 'at_modal',
          totalPrice: value,
          companyWebsite: honeypot,
        }),
      });
      result = await res.json().catch(() => ({}));
      if (!res.ok) {
        trackEvent({ action: 'lead_form_error', category: 'Lead Form', label: 'Atelier Mini Audit', event_id: eventId, error_message: result?.error || 'server' });
        setSubmitErr(dictionary.errorToast.description);
        setSending(false);
        return;
      }
    } catch {
      trackEvent({ action: 'lead_form_error', category: 'Lead Form', label: 'Atelier Mini Audit', event_id: eventId, error_message: 'network' });
      setSubmitErr(dictionary.errorToast.description);
      setSending(false);
      return;
    }

    // To'liq konversiya — GA4 generate_lead + Google Ads conversion + Meta + Amplitude (server bilan dedup)
    trackLead({
      source: 'at_modal',
      value,
      eventId: result.eventId || eventId,
      serverTracked: true,
      gaClientId,
      service: serviceLabel,
      budget: budgetLabel,
      has_telegram: hasTelegram,
      form_name: 'atelier_mini_audit',
      cta_source: 'at_modal',
    });
    setSending(false);
    setDone(true);
  };

  const validateStep1 = () => {
    if (!isValidPhone(phone)) {
      setPhoneErr(dictionary.formErrors.phone);
      phoneRef.current?.focus();
      return false;
    }

    if (telegram.trim() && !isValidTelegramUsername(telegram)) {
      setTelegramErr(dictionary.formErrors.telegram);
      return false;
    }

    setPhoneErr('');
    setTelegramErr('');
    return true;
  };

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(14,16,21,0.6)', backdropFilter: 'blur(8px)' }}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl p-6 shadow-2xl sm:p-8"
          style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)' }}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            previousFocusRef.current =
              document.activeElement instanceof HTMLElement && document.activeElement !== document.body
                ? document.activeElement
                : null;
            phoneRef.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            previousFocusRef.current?.focus();
            previousFocusRef.current = null;
          }}
        >
        <Dialog.Title className="sr-only">{dictionary.sidebarTitle}</Dialog.Title>
        <Dialog.Description className="sr-only">{dictionary.description}</Dialog.Description>
        <Dialog.Close asChild>
          <button aria-label={dictionary.buttons.close} className="absolute top-5 right-5 w-8 h-8 rounded-full grid place-items-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" style={{ border: '1px solid var(--at-line)', color: 'var(--at-muted)' }}>✕</button>
        </Dialog.Close>
        {done ? (
          <div className="flex flex-col gap-5">
            <div className="w-14 h-14 rounded-full grid place-items-center text-2xl font-bold" style={{ background: 'var(--at-accent-soft)', color: 'var(--at-accent)' }}>✓</div>
            <h3 className="font-bold" style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--at-ink)' }}>{dictionary.successStep.title}</h3>
            <p style={{ fontSize: 15, color: 'var(--at-ink-2)', lineHeight: 1.6 }}>{dictionary.successStep.description}</p>
            <div className="flex flex-col gap-3">
              <a href="https://t.me/jonbranding" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 font-semibold rounded-full py-4 text-sm" style={{ background: 'var(--at-accent)', color: '#fff' }}>✉ {dictionary.successStep.telegramButton}</a>
              <button onClick={onClose} className="font-semibold rounded-full py-4 text-sm" style={{ border: '1px solid var(--at-line)', color: 'var(--at-ink)' }}>{dictionary.buttons.close}</button>
            </div>
          </div>
        ) : step === 1 ? (
          <div>
            <div className="inline-flex items-center gap-2 mb-3" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
              {dictionary.atModal.eyebrow}
            </div>
            <div className="text-xs mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--at-muted)' }}>{dictionary.atModal.stepContact}</div>
            <div className="h-1 rounded-full mb-6" style={{ background: 'var(--at-line)' }}><div className="h-full rounded-full w-1/2" style={{ background: 'var(--at-accent)' }} /></div>
            <h3 className="font-bold mb-5" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--at-ink)' }}>{dictionary.steps.step4.subtitle}</h3>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="at-modal-phone" className="text-sm font-medium" style={{ color: 'var(--at-ink-2)' }}>{dictionary.fields.phone.label} *</label>
                <input
                  id="at-modal-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  ref={phoneRef}
                  value={phone}
                  onChange={(event) => { setPhone(event.target.value); setPhoneErr(''); }}
                  onKeyDown={(event) => { if (event.key === 'Enter') goToStep2(); }}
                  placeholder={dictionary.fields.phone.placeholder}
                  aria-invalid={Boolean(phoneErr)}
                  aria-describedby={phoneErr ? 'at-modal-phone-error' : undefined}
                  className="rounded-xl px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  style={{ border: `1px solid ${phoneErr ? 'var(--at-red)' : 'var(--at-line)'}`, background: 'var(--at-bg)', color: 'var(--at-ink)' }}
                />
                {phoneErr && <span id="at-modal-phone-error" role="alert" className="text-xs" style={{ color: 'var(--at-red)' }}>{phoneErr}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="at-modal-telegram" className="text-sm font-medium" style={{ color: 'var(--at-ink-2)' }}>{dictionary.fields.telegram.label}</label>
                <input
                  id="at-modal-telegram"
                  name="telegram"
                  value={telegram}
                  onChange={(event) => { setTelegram(event.target.value); setTelegramErr(''); }}
                  onKeyDown={(event) => { if (event.key === 'Enter') goToStep2(); }}
                  placeholder={dictionary.fields.telegram.placeholder}
                  aria-invalid={Boolean(telegramErr)}
                  aria-describedby={telegramErr ? 'at-modal-telegram-error' : undefined}
                  className="rounded-xl px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  style={{ border: `1px solid ${telegramErr ? 'var(--at-red)' : 'var(--at-line)'}`, background: 'var(--at-bg)', color: 'var(--at-ink)' }}
                />
                {telegramErr && <span id="at-modal-telegram-error" role="alert" className="text-xs" style={{ color: 'var(--at-red)' }}>{telegramErr}</span>}
              </div>
            </div>
            <button onClick={goToStep2} className="w-full flex items-center justify-center gap-2 font-semibold rounded-full py-4 mb-4 transition-all hover:-translate-y-0.5" style={{ background: 'var(--at-accent)', color: '#fff', fontSize: 15 }}>{dictionary.buttons.next} ↗</button>
            <a href="https://t.me/jonbranding" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 font-semibold rounded-full py-4 mb-4 text-sm" style={{ border: '1px solid var(--at-line)', color: 'var(--at-ink)' }}>{dictionary.telegramLinkLabel} →</a>
            <p className="text-center text-xs" style={{ color: 'var(--at-muted)' }}>{dictionary.trustBadge}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <HoneypotField value={honeypot} onChange={setHoneypot} />
            <div className="inline-flex items-center gap-2 mb-3" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
              {dictionary.atModal.eyebrow}
            </div>
            <div className="text-xs mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--at-muted)' }}>{dictionary.atModal.stepDetails}</div>
            <div className="h-1 rounded-full mb-6" style={{ background: 'var(--at-line)' }}><div className="h-full rounded-full w-full" style={{ background: 'var(--at-accent)' }} /></div>
            <h3 className="font-bold mb-5" style={{ fontSize: 22, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--at-ink)' }}>{dictionary.atModal.detailsTitle}</h3>
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium" style={{ color: 'var(--at-ink-2)' }}>{dictionary.fields.name.label}</label>
                <input id="name" value={name} onChange={e=>setName(e.target.value)} placeholder={dictionary.fields.name.placeholder} className="rounded-xl px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" style={{ border: '1px solid var(--at-line)', background: 'var(--at-bg)', color: 'var(--at-ink)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="service" className="text-sm font-medium" style={{ color: 'var(--at-ink-2)' }}>{dictionary.atModal.serviceLabel}</label>
                  <select id="service" value={service} onChange={e=>setService(e.target.value as ServiceOption)} className="rounded-xl px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" style={{ border: '1px solid var(--at-line)', background: 'var(--at-bg)', color: 'var(--at-ink)' }}>
                    <option value="free">{dictionary.atModal.serviceOptions.free}</option><option value="full">{dictionary.atModal.serviceOptions.full}</option><option value="roadmap">{dictionary.atModal.serviceOptions.roadmap}</option><option value="unsure">{dictionary.atModal.serviceOptions.unsure}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="budget" className="text-sm font-medium" style={{ color: 'var(--at-ink-2)' }}>{dictionary.atModal.budgetLabel}</label>
                  <select id="budget" value={budget} onChange={e=>setBudget(e.target.value as BudgetOption)} className="rounded-xl px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" style={{ border: '1px solid var(--at-line)', background: 'var(--at-bg)', color: 'var(--at-ink)' }}>
                    <option value="free">{dictionary.atModal.budgetOptions.free}</option><option value="starter">{dictionary.atModal.budgetOptions.starter}</option><option value="growth">{dictionary.atModal.budgetOptions.growth}</option><option value="unsure">{dictionary.atModal.budgetOptions.unsure}</option>
                  </select>
                </div>
              </div>
            </div>
            {submitErr && <p role="alert" className="text-xs mb-3 text-center" style={{ color: 'var(--at-red)' }}>{submitErr}</p>}
            <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 font-semibold rounded-full py-4 mb-3 transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: 'var(--at-accent)', color: '#fff', fontSize: 15 }}>{sending ? `${dictionary.atModal.submitting}…` : `${dictionary.buttons.submit} ↗`}</button>
            <button type="button" onClick={()=>setStep(1)} className="w-full text-sm text-center py-2" style={{ color: 'var(--at-muted)' }}>← {dictionary.buttons.back}</button>
          </form>
        )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AtModal;
