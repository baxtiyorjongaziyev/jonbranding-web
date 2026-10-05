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

const AtModal: FC<Props> = ({ open, onClose, lang = 'uz', dictionary }) => {
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [name, setName] = useState('');
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
      setDone(false);
      setPhoneErr('');
      setTelegramErr('');
      setSubmitErr('');
      setSending(false);
      setPhone('');
      setTelegram('');
      setName('');
      trackEvent({
        action: 'modal_open',
        category: 'Lead Form',
        label: 'Atelier Brand Audit',
        source: 'at_modal',
      });
    }
  }, [open]);

  const validate = () => {
    if (!isValidPhone(phone)) {
      setPhoneErr(dictionary?.formErrors?.phone || "To'liq telefon raqamini kiriting");
      phoneRef.current?.focus();
      return false;
    }

    if (telegram.trim() && !isValidTelegramUsername(telegram)) {
      setTelegramErr(dictionary?.formErrors?.telegram || "To'g'ri Telegram username kiriting");
      return false;
    }

    setPhoneErr('');
    setTelegramErr('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitErr('');
    setSending(true);
    const normalizedPhone = normalizePhone(phone);
    const telegramUsername = normalizeTelegramUsername(telegram);
    const hasTelegram = Boolean(telegramUsername);
    const eventId = generateEventId('lead');
    const gaClientId = getGaClientId();
    const pageLocation = typeof window !== 'undefined' ? window.location.href : undefined;
    const pagePath = typeof window !== 'undefined' ? window.location.pathname : undefined;
    const referrer = typeof document !== 'undefined' ? document.referrer || undefined : undefined;
    const searchParams = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;

    trackEvent({
      action: 'lead_form_submitted',
      category: 'Lead Form',
      label: 'Atelier Brand Audit',
      event_id: eventId,
      form_name: 'atelier_brand_audit',
      cta_source: 'at_modal',
      page_location: pageLocation,
    });

    let result: { ok?: boolean; eventId?: string; error?: string } = {};
    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name.trim() || 'Mijoz',
          phone: normalizedPhone,
          telegram: hasTelegram ? telegramUsername : undefined,
          role: 'Bepul Brand Audit',
          budget: 'Bepul',
          source: 'at_modal',
          lang,
          eventId,
          gaClientId,
          pageLocation,
          ctaSource: 'at_modal',
          pagePath,
          referrer,
          section: 'lead_modal',
          offerType: 'brand_audit',
          ctaLabel: dictionary?.buttons?.submit || 'Bepul Brand Audit olish',
          utmSource: searchParams?.get('utm_source') || undefined,
          utmMedium: searchParams?.get('utm_medium') || undefined,
          utmCampaign: searchParams?.get('utm_campaign') || undefined,
          utmContent: searchParams?.get('utm_content') || undefined,
          utmTerm: searchParams?.get('utm_term') || undefined,
          companyWebsite: honeypot,
          promoCode: typeof window !== 'undefined'
            ? (localStorage.getItem('promoCode') || '').replace(/"/g, '')
            : undefined,
        }),
      });
      result = await res.json().catch(() => ({}));
      if (!res.ok) {
        trackEvent({
          action: 'lead_form_error',
          category: 'Lead Form',
          label: 'Atelier Brand Audit',
          event_id: eventId,
          error_message: result?.error || 'server',
        });
        setSubmitErr(dictionary?.errorToast?.description || "Xatolik yuz berdi. Qaytadan urinib ko'ring.");
        setSending(false);
        return;
      }
    } catch {
      trackEvent({
        action: 'lead_form_error',
        category: 'Lead Form',
        label: 'Atelier Brand Audit',
        event_id: eventId,
        error_message: 'network',
      });
      setSubmitErr(dictionary?.errorToast?.description || "Internet aloqasida xatolik. Qaytadan urinib ko'ring.");
      setSending(false);
      return;
    }

    trackLead({
      source: 'at_modal',
      eventId: result.eventId || eventId,
      serverTracked: true,
      gaClientId,
      service: 'Bepul Brand Audit',
      budget: 'Bepul',
      has_telegram: hasTelegram,
      form_name: 'atelier_brand_audit',
      cta_source: 'at_modal',
    });
    setSending(false);
    setDone(true);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(14,16,21,0.65)', backdropFilter: 'blur(8px)' }}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl p-6 shadow-2xl sm:p-8"
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
          <Dialog.Title className="sr-only">{dictionary?.sidebarTitle || 'Bepul Brand Audit'}</Dialog.Title>
          <Dialog.Description className="sr-only">{dictionary?.description || 'Brand audit arizasi'}</Dialog.Description>
          <Dialog.Close asChild>
            <button
              aria-label={dictionary?.buttons?.close || 'Yopish'}
              className="absolute top-5 right-5 w-8 h-8 rounded-full grid place-items-center text-sm transition-all duration-200 hover:bg-black/5 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--at-accent)] cursor-pointer"
              style={{ border: '1px solid var(--at-line)', color: 'var(--at-muted)' }}
            >
              ✕
            </button>
          </Dialog.Close>

          {done ? (
            <div className="flex flex-col gap-5 py-2">
              <div
                className="w-14 h-14 rounded-full grid place-items-center text-2xl font-bold"
                style={{ background: 'var(--at-accent-soft)', color: 'var(--at-accent)' }}
              >
                ✓
              </div>
              <h3
                className="font-bold text-2xl sm:text-3xl"
                style={{ lineHeight: 1.15, letterSpacing: '-0.03em', color: 'var(--at-ink)' }}
              >
                {dictionary?.successStep?.title || 'Arizangiz qabul qilindi!'}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--at-ink-2)', lineHeight: 1.6 }}>
                {dictionary?.successStep?.description || 'Tez orada mutaxassisimiz siz bilan bog‘lanadi.'}
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href="https://t.me/jonbranding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 font-semibold rounded-full py-4 text-sm transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ background: 'var(--at-accent)', color: '#fff' }}
                >
                  ✉ {dictionary?.successStep?.telegramButton || 'Telegram orqali bog‘lanish'}
                </a>
                <button
                  onClick={onClose}
                  className="font-semibold rounded-full py-3.5 text-sm transition-colors hover:bg-black/5 cursor-pointer"
                  style={{ border: '1px solid var(--at-line)', color: 'var(--at-ink)' }}
                >
                  {dictionary?.buttons?.close || 'Oynani yopish'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <HoneypotField value={honeypot} onChange={setHoneypot} />
              <div
                className="inline-flex items-center gap-2 mb-3"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--at-muted)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                <span className="at-pulse inline-block w-2 h-2 rounded-full" style={{ background: 'var(--at-green)' }} />
                {dictionary?.atModal?.eyebrow || 'Bepul Brand Audit · 15 daqiqa'}
              </div>

              <h3
                className="font-bold mb-2 text-2xl sm:text-[26px]"
                style={{ lineHeight: 1.15, letterSpacing: '-0.03em', color: 'var(--at-ink)' }}
              >
                {dictionary?.sidebarTitle || 'Bepul Brand Audit'}
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--at-ink-2)' }}>
                {dictionary?.sidebarSubtitle || dictionary?.steps?.step4?.subtitle || "Dizayn mutaxassisimiz bog'lanishi uchun ma'lumotlaringizni qoldiring."}
              </p>

              <div className="flex flex-col gap-4 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="at-modal-name" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--at-ink-2)' }}>
                    {dictionary?.fields?.name?.label || 'Ismingiz'}
                  </label>
                  <input
                    id="at-modal-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={dictionary?.fields?.name?.placeholder || 'Aziz Abduhakimov'}
                    className="rounded-xl px-4 py-3.5 text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    style={{
                      border: '1px solid var(--at-line)',
                      background: 'var(--at-bg)',
                      color: 'var(--at-ink)',
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="at-modal-phone" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--at-ink-2)' }}>
                    {dictionary?.fields?.phone?.label || 'Telefon raqamingiz'} *
                  </label>
                  <input
                    id="at-modal-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    ref={phoneRef}
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      setPhoneErr('');
                    }}
                    placeholder={dictionary?.fields?.phone?.placeholder || '+998 (__) ___-__-__'}
                    aria-invalid={Boolean(phoneErr)}
                    aria-describedby={phoneErr ? 'at-modal-phone-error' : undefined}
                    className="rounded-xl px-4 py-3.5 text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    style={{
                      border: `1px solid ${phoneErr ? 'var(--at-red)' : 'var(--at-line)'}`,
                      background: 'var(--at-bg)',
                      color: 'var(--at-ink)',
                    }}
                  />
                  {phoneErr && (
                    <span id="at-modal-phone-error" role="alert" className="text-xs font-medium" style={{ color: 'var(--at-red)' }}>
                      {phoneErr}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="at-modal-telegram" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--at-ink-2)' }}>
                    {dictionary?.fields?.telegram?.label || 'Telegram (ixtiyoriy)'}
                  </label>
                  <input
                    id="at-modal-telegram"
                    name="telegram"
                    type="text"
                    autoComplete="username"
                    value={telegram}
                    onChange={(event) => {
                      setTelegram(event.target.value);
                      setTelegramErr('');
                    }}
                    placeholder={dictionary?.fields?.telegram?.placeholder || '@username'}
                    aria-invalid={Boolean(telegramErr)}
                    aria-describedby={telegramErr ? 'at-modal-telegram-error' : undefined}
                    className="rounded-xl px-4 py-3.5 text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    style={{
                      border: `1px solid ${telegramErr ? 'var(--at-red)' : 'var(--at-line)'}`,
                      background: 'var(--at-bg)',
                      color: 'var(--at-ink)',
                    }}
                  />
                  {telegramErr && (
                    <span id="at-modal-telegram-error" role="alert" className="text-xs font-medium" style={{ color: 'var(--at-red)' }}>
                      {telegramErr}
                    </span>
                  )}
                </div>
              </div>

              {submitErr && (
                <p role="alert" className="text-xs mb-3 text-center font-medium" style={{ color: 'var(--at-red)' }}>
                  {submitErr}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="w-full flex items-center justify-center gap-2 font-semibold rounded-full py-4 mb-3 transition-[transform,opacity,box-shadow] duration-200 motion-reduce:transition-none hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 shadow-lg shadow-blue-500/15 cursor-pointer"
                style={{ background: 'var(--at-accent)', color: '#fff', fontSize: 15 }}
              >
                {sending ? `${dictionary?.atModal?.submitting || 'Yuborilmoqda'}…` : `${dictionary?.buttons?.submit || 'Bepul Brand Audit olish'} ↗`}
              </button>

              <a
                href="https://t.me/jonbranding"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 font-medium rounded-full py-2.5 mb-2 text-xs transition-colors hover:bg-black/5"
                style={{ color: 'var(--at-ink-2)' }}
              >
                ✉ {dictionary?.telegramLinkLabel || 'Telegram orqali to‘g‘ridan-to‘g‘ri yozish'} →
              </a>

              <p className="text-center text-xs" style={{ color: 'var(--at-muted)' }}>
                🔒 {dictionary?.trustBadge || '100% bepul · Spamsiz · Ma’lumotlaringiz maxfiy saqlanadi'}
              </p>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AtModal;
