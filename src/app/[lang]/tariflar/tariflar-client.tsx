'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { generateEventId, getGaClientId, trackEvent, trackLead } from '@/lib/analytics';
import { isValidPhone, normalizePhone } from '@/lib/lead-contact';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

type Package = {
  name: string;
  price: string;
  audience: string;
  features: string[];
  duration: string;
  featured?: boolean;
  badge?: string;
};

const PACKAGES: Package[] = [
  {
    name: 'VIP',
    price: '70 000 000',
    audience: 'Eksportga chiqayotgan, marketplace yoki tarmoq do‘konga kirayotgan ishlab chiqaruvchilar uchun',
    features: ['Naming', 'Logo', 'Visual identity', 'Brandbook', 'Patent', 'Packaging (3 SKU)'],
    duration: '35–45 kun',
  },
  {
    name: 'PREMIUM',
    price: '55 000 000',
    audience: 'Brendini to‘liq tartibga solmoqchi bo‘lgan, o‘sayotgan biznes uchun',
    features: ['Naming', 'Logo', 'Visual identity', 'Brandbook', 'Patent'],
    duration: '30–35 kun',
    featured: true,
    badge: 'Ko‘p tanlanadi',
  },
  {
    name: 'STANDART',
    price: '20 000 000',
    audience: 'Endi boshlayotgan yoki brendi hali yo‘q biznes uchun',
    features: ['Naming', 'Logo', 'Patent'],
    duration: '20–25 kun',
  },
];

const SERVICES_TABLE = [
  { name: 'Brandbook', price: '24 000 000', duration: '7 kun' },
  { name: 'Visual identity', price: '18 000 000', duration: '10 kun' },
  { name: 'Packaging (1 SKU)', price: '12 000 000', duration: '7 kun' },
  { name: 'Har qo‘shimcha SKU', price: '4 000 000 dan', duration: '+3 kun' },
  { name: 'Naming', price: '10 000 000', duration: '10 kun' },
  { name: 'Logo', price: '8 000 000', duration: '7 kun' },
  { name: 'Patent (tezkor)', price: '7 000 000', duration: '7 kun' },
  { name: 'Patent (oddiy)', price: '5 000 000', duration: '30 kun' },
  { name: 'Patent tekshiruvi', price: '880 000', duration: '2 kun' },
  { name: 'Har qo‘shimcha klass', price: '440 000', duration: '—' },
];

const PROCESS_STEPS = [
  { title: 'Brif va tahlil', desc: 'Biznesingizni, raqobatchilaringizni, auditoriyangizni o‘rganaman' },
  { title: 'Konsepsiya', desc: '3 ta yo‘nalish taqdim etaman, bittasini tanlaysiz' },
  { title: 'Ishlab chiqish', desc: 'Tanlangan yo‘nalish sayqallanadi' },
  { title: 'Topshirish', desc: 'Barcha fayllar va hujjatlar qo‘lingizda' },
];

const PRICE_FACTORS = [
  'Mahsulot turlari soni (SKU)',
  'Patent klasslari soni',
  'Tashuvchilar soni (vizitka, banner, forma va boshqalar)',
  'Muddat — tezkor bajarish +50%',
];

function LeadModal({ open, onClose, presetService }: { open: boolean; onClose: () => void; presetService: string }) {
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
      trackEvent({ action: 'modal_open', category: 'Lead Form', label: 'Tariflar', source: 'tariflar_modal' });
    }
  }, [open, presetService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      setPhoneErr('Telefon raqamini to‘g‘ri kiriting');
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
      label: 'Tariflar',
      event_id: eventId,
      form_name: 'tariflar_page',
      cta_source: 'tariflar_modal',
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
          role: service,
          source: 'tariflar_modal',
          lang: 'uz',
          eventId,
          gaClientId,
          pageLocation,
          ctaSource: 'tariflar_modal',
          companyWebsite: honeypot,
        }),
      });
      result = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitErr('Xatolik yuz berdi. Qayta urinib ko‘ring.');
        setSending(false);
        return;
      }
    } catch {
      setSubmitErr('Xatolik yuz berdi. Qayta urinib ko‘ring.');
      setSending(false);
      return;
    }

    trackLead({
      source: 'tariflar_modal',
      eventId: result.eventId || eventId,
      serverTracked: true,
      gaClientId,
      service,
      form_name: 'tariflar_page',
      cta_source: 'tariflar_modal',
    });
    setSending(false);
    setDone(true);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          onOpenAutoFocus={(e) => { e.preventDefault(); phoneRef.current?.focus(); }}
        >
          <Dialog.Title className="text-2xl font-bold tracking-tight text-black mb-1">
            {done ? 'Rahmat!' : 'Ariza qoldirish'}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-neutral-500 mb-6">
            {done ? 'Tez orada siz bilan bog‘lanaman.' : 'Ism va telefon raqamingizni qoldiring, o‘zim aloqaga chiqaman.'}
          </Dialog.Description>
          <Dialog.Close asChild>
            <button aria-label="Yopish" className="absolute top-5 right-5 w-8 h-8 rounded-full grid place-items-center border border-neutral-200 text-neutral-500 hover:bg-neutral-50">✕</button>
          </Dialog.Close>

          {done ? (
            <button onClick={onClose} className="w-full rounded-full bg-black text-white font-semibold py-4 text-sm">Yopish</button>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <HoneypotField value={honeypot} onChange={setHoneypot} />
              <div className="flex flex-col gap-1">
                <label htmlFor="tariflar-name" className="text-sm font-medium text-neutral-700">Ism</label>
                <input
                  id="tariflar-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingiz"
                  className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-black"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="tariflar-phone" className="text-sm font-medium text-neutral-700">Telefon *</label>
                <input
                  id="tariflar-phone"
                  ref={phoneRef}
                  type="tel"
                  inputMode="tel"
                  required
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setPhoneErr(''); }}
                  placeholder="+998 90 123 45 67"
                  aria-invalid={Boolean(phoneErr)}
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-black"
                  style={{ borderColor: phoneErr ? '#dc2626' : undefined }}
                />
                {phoneErr && <span role="alert" className="text-xs text-red-600">{phoneErr}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="tariflar-service" className="text-sm font-medium text-neutral-700">Xizmat</label>
                <select
                  id="tariflar-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="rounded-xl border border-neutral-200 px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <option>VIP</option>
                  <option>PREMIUM</option>
                  <option>STANDART</option>
                  <option>Bittalab xizmat</option>
                  <option>Aniq emas — maslahat kerak</option>
                </select>
              </div>
              {submitErr && <p role="alert" className="text-xs text-red-600 text-center">{submitErr}</p>}
              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="w-full rounded-full bg-black text-white font-semibold py-4 text-sm disabled:opacity-60"
              >
                {sending ? 'Yuborilmoqda…' : 'Yuborish'}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function TariflarClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [presetService, setPresetService] = useState('Aniq emas — maslahat kerak');

  const openModal = (service: string) => {
    setPresetService(service);
    setModalOpen(true);
  };

  return (
    <div className="bg-white text-black">
      {/* HERO */}
      <section className="px-5 sm:px-8 pt-20 pb-14 md:pt-28 md:pb-20 max-w-3xl mx-auto text-center">
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-bold tracking-tight leading-[1.05]"
          style={{ fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: '-0.03em' }}
        >
          Narxlarim ochiq
        </motion.h1>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-5 text-neutral-600 text-base sm:text-lg leading-relaxed"
        >
          9 yil, 500 dan ortiq mijoz, 1000 dan ortiq loyiha.
          <br />
          Narxni yashirmayman — ishni ham.
        </motion.p>
      </section>

      {/* PAKETLAR */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PACKAGES.map((pkg) => (
            <motion.div
              key={pkg.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`relative flex flex-col rounded-2xl p-8 ${pkg.featured ? 'bg-black text-white md:-translate-y-3 md:shadow-2xl' : 'bg-white text-black border border-neutral-200'}`}
            >
              {pkg.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white text-black text-xs font-semibold px-4 py-1 border border-neutral-200">
                  {pkg.badge}
                </span>
              )}
              <h2 className="text-sm font-semibold tracking-[0.08em] uppercase mb-3" style={{ color: pkg.featured ? 'rgba(255,255,255,.6)' : '#737373' }}>
                {pkg.name}
              </h2>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-bold" style={{ fontSize: 'clamp(28px, 3vw, 36px)', letterSpacing: '-0.02em' }}>
                  {pkg.price}
                </span>
                <span className="text-sm" style={{ color: pkg.featured ? 'rgba(255,255,255,.6)' : '#737373' }}>so‘m</span>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: pkg.featured ? 'rgba(255,255,255,.75)' : '#525252' }}>
                {pkg.audience}
              </p>
              <ul className="flex flex-col gap-2.5 mb-8 flex-grow">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 shrink-0" style={{ color: pkg.featured ? '#fff' : '#000' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <p className="text-xs mb-5" style={{ color: pkg.featured ? 'rgba(255,255,255,.5)' : '#a3a3a3' }}>
                Muddat: {pkg.duration}
              </p>
              <button
                onClick={() => openModal(pkg.name)}
                className={`w-full rounded-full py-4 text-sm font-semibold transition-opacity hover:opacity-90 ${pkg.featured ? 'bg-white text-black' : 'bg-black text-white'}`}
              >
                Ariza qoldirish
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ALOHIDA XIZMATLAR */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-4xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-bold tracking-tight mb-8 text-center"
          style={{ fontSize: 'clamp(26px, 3.4vw, 40px)', letterSpacing: '-0.025em' }}
        >
          Bittalab olish
        </motion.h2>

        {/* Desktop table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="hidden sm:block overflow-hidden rounded-2xl border border-neutral-200"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                <th className="py-3 px-5 font-semibold">Xizmat</th>
                <th className="py-3 px-5 font-semibold">Narx (so‘m)</th>
                <th className="py-3 px-5 font-semibold">Muddat</th>
              </tr>
            </thead>
            <tbody>
              {SERVICES_TABLE.map((row, i) => (
                <tr key={row.name} className={i !== SERVICES_TABLE.length - 1 ? 'border-b border-neutral-100' : ''}>
                  <td className="py-3.5 px-5">{row.name}</td>
                  <td className="py-3.5 px-5 font-medium">{row.price}</td>
                  <td className="py-3.5 px-5 text-neutral-500">{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile cards */}
        <div className="sm:hidden flex flex-col gap-3">
          {SERVICES_TABLE.map((row) => (
            <motion.div
              key={row.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-xl border border-neutral-200 p-4 flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium text-sm">{row.name}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{row.duration}</p>
              </div>
              <p className="font-semibold text-sm whitespace-nowrap">{row.price} so‘m</p>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-neutral-400 text-center mt-6">
          Narxlar xizmat uchun. Davlat bojlari alohida to‘lanadi.
        </p>
      </section>

      {/* ISHLASH TARTIBI */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-4xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-bold tracking-tight mb-10 text-center"
          style={{ fontSize: 'clamp(26px, 3.4vw, 40px)', letterSpacing: '-0.025em' }}
        >
          Qanday ishlayman
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex gap-4"
            >
              <span className="shrink-0 w-9 h-9 rounded-full bg-black text-white grid place-items-center text-sm font-semibold">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="rounded-2xl border border-neutral-200 p-6 sm:p-8"
        >
          <h3 className="text-sm font-semibold tracking-[0.08em] uppercase text-neutral-500 mb-5">To‘lov bosqichlari</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold">50%</p>
              <p className="text-sm text-neutral-600 mt-1">Shartnoma imzolanganda</p>
            </div>
            <div>
              <p className="text-3xl font-bold">30%</p>
              <p className="text-sm text-neutral-600 mt-1">Konsepsiya tasdiqlanganda</p>
            </div>
            <div>
              <p className="text-3xl font-bold">20%</p>
              <p className="text-sm text-neutral-600 mt-1">Fayllar topshirilganda</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* NARXGA TA'SIR QILUVCHI OMILLAR */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-3xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-bold tracking-tight mb-6 text-center"
          style={{ fontSize: 'clamp(24px, 3vw, 34px)', letterSpacing: '-0.02em' }}
        >
          Narxga nima ta’sir qiladi
        </motion.h2>
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col gap-3"
        >
          {PRICE_FACTORS.map((factor) => (
            <li key={factor} className="flex items-start gap-3 text-sm sm:text-base text-neutral-700 border border-neutral-200 rounded-xl px-5 py-4">
              <span className="mt-0.5 shrink-0 font-semibold">•</span>
              {factor}
            </li>
          ))}
        </motion.ul>
      </section>

      {/* CTA BLOK */}
      <section className="px-5 sm:px-8 py-20 md:py-28 bg-black text-white text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-bold tracking-tight max-w-2xl mx-auto"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.025em' }}
        >
          Qaysi paket sizga to‘g‘ri kelishini bilmayapsizmi?
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-4 text-neutral-300 max-w-xl mx-auto"
        >
          20 daqiqalik bepul suhbatda aytaman. Sotmayman — maslahat beraman.
        </motion.p>
        <motion.button
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          onClick={() => openModal('Aniq emas — maslahat kerak')}
          className="mt-8 rounded-full bg-white text-black font-semibold px-8 py-4 text-sm hover:opacity-90 transition-opacity"
        >
          Suhbatga yozilish
        </motion.button>
      </section>

      {/* FOOTER ABOVE */}
      <p className="text-center text-xs text-neutral-400 px-5 py-8">
        Narxlar 2026 yil sentyabr holatiga. Yakuniy narx loyiha hajmiga qarab aniqlanadi.
      </p>

      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} presetService={presetService} />
    </div>
  );
}
