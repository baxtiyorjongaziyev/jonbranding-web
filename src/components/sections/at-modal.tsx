'use client';
import type { FC } from 'react';
import { useState, useEffect } from 'react';

interface Props { open: boolean; onClose: () => void; lang?: string; }

const AtModal: FC<Props> = ({ open, onClose, lang = 'uz' }) => {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [service, setService] = useState('Bepul mini-tashxis');
  const [budget, setBudget] = useState('Bepul — mini-tashxis');
  const [contactErr, setContactErr] = useState('');
  const [submitErr, setSubmitErr] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      setStep(1); setDone(false); setContactErr(''); setSubmitErr(''); setSending(false); setContact(''); setName('');
      (window as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'modal_open', { event_category: 'engagement' });
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const gtag = () => (window as { gtag?: (...a: unknown[]) => void }).gtag;

  const goToStep2 = () => {
    if (!validateStep1()) return;
    gtag()?.('event', 'modal_step2', { event_category: 'engagement' });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitErr('');
    setSending(true);
    const trimmed = contact.trim();
    const isTg = trimmed.startsWith('@');
    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name || 'Mijoz',
          ...(isTg ? {} : { phone: trimmed }),
          telegram: isTg ? trimmed : undefined,
          role: service,
          budget,
          source: 'at_modal',
          lang,
        }),
      });
      if (!res.ok) {
        setSubmitErr("Yuborishda xatolik. Telegram orqali yozing yoki qayta urinib ko'ring.");
        setSending(false);
        return;
      }
    } catch {
      setSubmitErr("Tarmoq xatosi. Telegram orqali yozing yoki qayta urinib ko'ring.");
      setSending(false);
      return;
    }
    gtag()?.('event', 'lead_submitted', { event_category: 'conversion', service, budget });
    setSending(false);
    setDone(true);
  };

  if (!open) return null;

  const validateStep1 = () => {
    const v = contact.trim();
    const isPhone = v.replace(/\D/g, '').length >= 7;
    const isTg = v.startsWith('@') && v.length > 2;
    if (!isPhone && !isTg) { setContactErr('Telefon (+998..) yoki @telegram_username kiriting'); return false; }
    setContactErr('');
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(14,16,21,0.6)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl" style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)' }} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full grid place-items-center text-sm" style={{ border: '1px solid var(--at-line)', color: 'var(--at-muted)' }}>✕</button>
        {done ? (
          <div className="flex flex-col gap-5">
            <div className="w-14 h-14 rounded-full grid place-items-center text-2xl font-bold" style={{ background: 'var(--at-accent-soft)', color: 'var(--at-accent)' }}>✓</div>
            <h3 className="font-bold" style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--at-ink)' }}>Qabul qildik,<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>rahmat.</span></h3>
            <p style={{ fontSize: 15, color: 'var(--at-ink-2)', lineHeight: 1.6 }}>24 soat ichida siz bilan bog&apos;lanamiz. Yoki darhol Telegram&apos;da yozing — <strong style={{ color: 'var(--at-ink)' }}>tezroq javob.</strong></p>
            <div className="flex flex-col gap-3">
              <a href="https://t.me/jonbranding" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 font-semibold rounded-full py-4 text-sm" style={{ background: 'var(--at-accent)', color: '#fff' }}>✉ Telegram&apos;da yozish</a>
              <button onClick={onClose} className="font-semibold rounded-full py-4 text-sm" style={{ border: '1px solid var(--at-line)', color: 'var(--at-ink)' }}>Yopish</button>
            </div>
          </div>
        ) : step === 1 ? (
          <div>
            <div className="inline-flex items-center gap-2 mb-3" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
              Mini-tashxis · 1 daqiqada
            </div>
            <div className="text-xs mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--at-muted)' }}>1/2 · Aloqa</div>
            <div className="h-1 rounded-full mb-6" style={{ background: 'var(--at-line)' }}><div className="h-full rounded-full w-1/2" style={{ background: 'var(--at-accent)' }} /></div>
            <h3 className="font-bold mb-5" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--at-ink)' }}>Faqat telefon yoki <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>Telegram</span> kifoya.</h3>
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-sm font-medium" style={{ color: 'var(--at-ink-2)' }}>Telefon yoki @telegram_username *</label>
              <input autoFocus value={contact} onChange={e=>setContact(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') goToStep2();}} placeholder="+998 90 ___ __ __  yoki  @sardor" className="rounded-xl px-4 py-3 text-sm outline-none" style={{ border: `1px solid ${contactErr?'var(--at-red)':'var(--at-line)'}`, background: 'var(--at-bg)', color: 'var(--at-ink)' }} />
              {contactErr && <span className="text-xs" style={{ color: 'var(--at-red)' }}>{contactErr}</span>}
            </div>
            <button onClick={goToStep2} className="w-full flex items-center justify-center gap-2 font-semibold rounded-full py-4 mb-4 transition-all hover:-translate-y-0.5" style={{ background: 'var(--at-accent)', color: '#fff', fontSize: 15 }}>Davom etish ↗</button>
            <a href="https://t.me/jonbranding" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 font-semibold rounded-full py-4 mb-4 text-sm" style={{ border: '1px solid var(--at-line)', color: 'var(--at-ink)' }}>Yoki Telegram&apos;da darhol yozish →</a>
            <p className="text-center text-xs" style={{ color: 'var(--at-muted)' }}>Ma&apos;lumotlaringiz xavfsiz. Spam yo&apos;q.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="inline-flex items-center gap-2 mb-3" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
              Mini-tashxis · 1 daqiqada
            </div>
            <div className="text-xs mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--at-muted)' }}>2/2 · Ma&apos;lumotlar (ixtiyoriy)</div>
            <div className="h-1 rounded-full mb-6" style={{ background: 'var(--at-line)' }}><div className="h-full rounded-full w-full" style={{ background: 'var(--at-accent)' }} /></div>
            <h3 className="font-bold mb-5" style={{ fontSize: 22, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--at-ink)' }}>Bir nechta savol — yaxshiroq tayyorlanamiz.</h3>
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" style={{ color: 'var(--at-ink-2)' }}>Ismingiz</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Sardor Toshmatov" className="rounded-xl px-4 py-3 text-sm outline-none" style={{ border: '1px solid var(--at-line)', background: 'var(--at-bg)', color: 'var(--at-ink)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium" style={{ color: 'var(--at-ink-2)' }}>Tashxis turi</label>
                  <select value={service} onChange={e=>setService(e.target.value)} className="rounded-xl px-3 py-3 text-sm outline-none" style={{ border: '1px solid var(--at-line)', background: 'var(--at-bg)', color: 'var(--at-ink)' }}>
                    <option>Bepul mini-tashxis</option><option>To&apos;liq tashxis (4.8M)</option><option>Tashxis + Yo&apos;l xaritasi (12M)</option><option>Hali aniq emas</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium" style={{ color: 'var(--at-ink-2)' }}>Byudjet</label>
                  <select value={budget} onChange={e=>setBudget(e.target.value)} className="rounded-xl px-3 py-3 text-sm outline-none" style={{ border: '1px solid var(--at-line)', background: 'var(--at-bg)', color: 'var(--at-ink)' }}>
                    <option>Bepul — mini-tashxis</option><option>4—5M</option><option>10—15M</option><option>Hali aniq emas</option>
                  </select>
                </div>
              </div>
            </div>
            {submitErr && <p className="text-xs mb-3 text-center" style={{ color: 'var(--at-red)' }}>{submitErr}</p>}
            <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 font-semibold rounded-full py-4 mb-3 transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: 'var(--at-accent)', color: '#fff', fontSize: 15 }}>{sending ? 'Yuborilmoqda…' : 'Yuborish ↗'}</button>
            <button type="button" onClick={()=>setStep(1)} className="w-full text-sm text-center py-2" style={{ color: 'var(--at-muted)' }}>← Orqaga</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AtModal;
