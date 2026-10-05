import React, { FC, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { generateEventId, getGaClientId, trackEvent, trackLead } from '@/lib/analytics';
import { isValidPhone, normalizePhone } from '@/lib/lead-contact';
import { BRAND_STRATEGY_SERVICE } from '@/lib/sales-content';
import { mono, PRICE, PRICE_VALUE, SOURCE } from '../data';

interface FormState {
  name: string;
  phone: string;
  company: string;
  activity: string;
  website: string;
  problem: string;
  reason: string;
  isDecisionMaker: string;
}

export const BrandStrategyForm: FC<{
  formRef: React.RefObject<HTMLDivElement | null>;
  phoneRef: React.RefObject<HTMLInputElement | null>;
}> = ({ formRef, phoneRef }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [f, setF] = useState<FormState>({
    name: '',
    phone: '',
    company: '',
    activity: '',
    website: '',
    problem: '',
    reason: '',
    isDecisionMaker: 'Ha, yakuniy qaror qiluvchiman',
  });
  const [honeypot, setHoneypot] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [nameErr, setNameErr] = useState('');
  const [submitErr, setSubmitErr] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const formStartedRef = useRef(false);

  const setField = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent({
        action: 'brand_strategy_form_start',
        category: 'Brand Strategy Form',
        label: 'form_start',
        source: SOURCE,
      });
    }
    setF((prev) => ({ ...prev, [k]: e.target.value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    let hasErr = false;
    if (f.name.trim().length < 2) {
      setNameErr('Ismingizni kiriting');
      hasErr = true;
    } else {
      setNameErr('');
    }
    if (!isValidPhone(f.phone)) {
      setPhoneErr('Telefon raqamini to‘g‘ri kiriting (+998...)');
      hasErr = true;
    } else {
      setPhoneErr('');
    }
    if (hasErr) return;

    setStep(2);
    trackEvent({
      action: 'brand_strategy_form_step_2',
      category: 'Brand Strategy Form',
      label: 'step_2_reached',
      source: SOURCE,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitErr('');
    setSending(true);

    const summaryParts = [
      `Xizmat: Brand Strategy (${PRICE})`,
      f.company && `Kompaniya: ${f.company}`,
      f.activity && `Faoliyat: ${f.activity}`,
      f.website && `Sayt/Insta: ${f.website}`,
      f.problem && `Asosiy muammo: ${f.problem}`,
      f.reason && `Strategiya maqsadi: ${f.reason}`,
      f.isDecisionMaker && `Qaror qiluvchi: ${f.isDecisionMaker}`,
    ].filter(Boolean);

    const summary = summaryParts.join(' | ');
    const normalizedPhone = normalizePhone(f.phone);
    const eventId = generateEventId('lead');
    const gaClientId = getGaClientId();
    const pageLocation = typeof window !== 'undefined' ? window.location.href : undefined;

    trackEvent({
      action: 'brand_strategy_form_submit',
      category: 'Brand Strategy Form',
      label: 'form_submitted',
      event_id: eventId,
      source: SOURCE,
      value: PRICE_VALUE,
    });

    trackEvent({
      action: 'brand_strategy_meeting_request',
      category: 'Brand Strategy Lead',
      label: 'meeting_request',
      event_id: eventId,
      source: SOURCE,
      value: PRICE_VALUE,
    });

    let result: { eventId?: string } = {};
    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: f.name.trim(),
          phone: normalizedPhone,
          role: BRAND_STRATEGY_SERVICE.name,
          packageSummary: summary.slice(0, 900),
          serviceKeys: ['brand-strategy'],
          totalPrice: PRICE_VALUE,
          source: SOURCE,
          lang: 'uz',
          eventId,
          gaClientId,
          pageLocation,
          ctaSource: `${SOURCE}_meeting`,
          companyWebsite: honeypot,
        }),
      });
      result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error('submit failed');
    } catch {
      setSubmitErr('Xatolik yuz berdi. Iltimos qayta urinib ko‘ring yoki to‘g‘ridan-to‘g‘ri qo‘ng‘iroq qiling.');
      setSending(false);
      return;
    }

    trackLead({
      source: SOURCE,
      value: PRICE_VALUE,
      eventId: result.eventId || eventId,
      serverTracked: true,
      gaClientId,
      service: BRAND_STRATEGY_SERVICE.name,
      form_name: SOURCE,
      cta_source: `${SOURCE}_meeting`,
    });

    setSending(false);
    setDone(true);
  };

  const inputCls =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20';

  if (done) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-neutral-200 bg-white p-8 text-center sm:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)]"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <Check className="h-7 w-7" />
        </div>
        <p className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Arizangiz qabul qilindi!
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600">
          Brand Strategy bo‘yicha dastlabki ma’lumotlarni o‘rganib, taqdimot va strategik uchrashuv vaqtini kelishish uchun siz bilan bog‘lanamiz.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={formRef}
      id="ariza"
      className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.12)]"
    >
      <div className="mb-8 flex items-center justify-between border-b border-neutral-100 pb-5">
        <div>
          <span className="text-[11px] font-semibold uppercase text-blue-700" style={mono}>
            Ariza formasi · {step}-bosqich / 2
          </span>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-neutral-900">
            {step === 1 ? 'Kontakt ma’lumotlari' : 'Biznes va strategik ehtiyoj'}
          </h3>
        </div>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
          {PRICE}
        </span>
      </div>

      {step === 1 ? (
        <form onSubmit={handleNextStep} noValidate className="space-y-4">
          <HoneypotField value={honeypot} onChange={setHoneypot} />
          <div>
            <label htmlFor="bs-name" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Ismingiz *
            </label>
            <input
              id="bs-name"
              autoComplete="name"
              value={f.name}
              onChange={setField('name')}
              placeholder="Masalan: Baxtiyor"
              className={inputCls}
              aria-invalid={Boolean(nameErr)}
              aria-describedby={nameErr ? 'bs-name-err' : undefined}
            />
            {nameErr && <p id="bs-name-err" className="mt-1 text-xs text-red-600">{nameErr}</p>}
          </div>

          <div>
            <label htmlFor="bs-phone" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Telefon raqamingiz *
            </label>
            <input
              id="bs-phone"
              ref={phoneRef}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={f.phone}
              onChange={(e) => {
                setField('phone')(e);
                setPhoneErr('');
              }}
              placeholder="+998 90 123 45 67"
              className={inputCls}
              aria-invalid={Boolean(phoneErr)}
              aria-describedby={phoneErr ? 'bs-phone-err' : undefined}
            />
            {phoneErr && <p id="bs-phone-err" className="mt-1 text-xs text-red-600">{phoneErr}</p>}
          </div>

          <div>
            <label htmlFor="bs-company" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Kompaniya yoki brend nomi
            </label>
            <input
              id="bs-company"
              value={f.company}
              onChange={setField('company')}
              placeholder="Masalan: Safia, Korzinka yoki yangi loyiha"
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Keyingi bosqichga o‘tish
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <HoneypotField value={honeypot} onChange={setHoneypot} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="bs-activity" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
                Faoliyat turi / soha
              </label>
              <input
                id="bs-activity"
                value={f.activity}
                onChange={setField('activity')}
                placeholder="Masalan: ishlab chiqarish, retail, fintech"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="bs-website" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
                Veb-sayt yoki Instagram
              </label>
              <input
                id="bs-website"
                value={f.website}
                onChange={setField('website')}
                placeholder="@brendingiz yoki sayt.uz"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label htmlFor="bs-problem" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Hozirgi asosiy muammo
            </label>
            <textarea
              id="bs-problem"
              rows={2}
              value={f.problem}
              onChange={setField('problem')}
              placeholder="Masalan: Raqobatchilardan farqimiz yo‘qolgan, marketing va sotuv har xil gapiryapti"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="bs-reason" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Brand Strategy nima uchun kerak?
            </label>
            <textarea
              id="bs-reason"
              rows={2}
              value={f.reason}
              onChange={setField('reason')}
              placeholder="Masalan: Yangi bozorga chiqyapmiz yoki to‘liq rebranding qilyapmiz"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="bs-decision" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Qaror qiluvchi shaxs sizmisiz?
            </label>
            <select id="bs-decision" value={f.isDecisionMaker} onChange={setField('isDecisionMaker')} className={inputCls}>
              <option>Ha, yakuniy qaror qiluvchiman (Founder / CEO)</option>
              <option>Marketing yoki tijorat rahbariman</option>
              <option>Boshqaruv jamoasi bilan birgalikda qaror qilamiz</option>
            </select>
          </div>

          {submitErr && <p role="alert" className="text-center text-xs text-red-600">{submitErr}</p>}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-full border border-neutral-200 py-3.5 px-6 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Orqaga
            </button>
            <button
              type="submit"
              disabled={sending}
              aria-busy={sending}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 disabled:opacity-60"
            >
              {sending ? 'Yuborilmoqda…' : 'Brand Strategy bo‘yicha uchrashuv belgilash'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
