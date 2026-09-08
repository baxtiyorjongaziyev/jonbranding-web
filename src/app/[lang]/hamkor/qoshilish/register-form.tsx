'use client';

import { FC, useState } from 'react';

type Dict = Record<string, string>;

const RegisterForm: FC<{ lang: string; dict: Dict }> = ({ lang, dict }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramUsername, setTelegram] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<{ promoCode: string; accessUrl: string } | null>(null);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, telegramUsername: telegramUsername || undefined }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setStatus('error');
        setErrorMsg(res.status === 400 ? dict.errorValidation : dict.errorGeneric);
        return;
      }
      setResult({ promoCode: json.promoCode, accessUrl: `/${lang}${json.accessUrl}` });
      setStatus('idle');
    } catch {
      setStatus('error');
      setErrorMsg(dict.errorGeneric);
    }
  };

  const copy = async (text: string, which: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  if (result) {
    const fullLink = typeof window !== 'undefined' ? `${window.location.origin}${result.accessUrl}` : result.accessUrl;
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{dict.successTitle}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-4xl font-black tracking-tight text-primary">{result.promoCode}</span>
            <button type="button" onClick={() => copy(result.promoCode, 'code')} className="rounded-full border px-4 py-2 text-sm font-bold">
              {copied === 'code' ? dict.copied : dict.copy}
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-500">{dict.successCodeHint}</p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{dict.successLinkTitle}</p>
          <div className="mt-2 flex items-center gap-3">
            <code className="rounded bg-slate-100 px-3 py-2 text-sm break-all">{fullLink}</code>
            <button type="button" onClick={() => copy(fullLink, 'link')} className="rounded-full border px-4 py-2 text-sm font-bold shrink-0">
              {copied === 'link' ? dict.copied : dict.copy}
            </button>
          </div>
          <p className="mt-1 text-sm font-bold text-amber-600">{dict.successLinkHint}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-slate-600">{dict.nameLabel}</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} required minLength={2} maxLength={80}
          placeholder={dict.namePlaceholder} className="mt-1 w-full rounded-xl border px-4 py-3" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-600">{dict.phoneLabel}</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required inputMode="tel"
          placeholder={dict.phonePlaceholder} className="mt-1 w-full rounded-xl border px-4 py-3" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-600">{dict.telegramLabel}</label>
        <input value={telegramUsername} onChange={(e) => setTelegram(e.target.value)}
          placeholder={dict.telegramPlaceholder} className="mt-1 w-full rounded-xl border px-4 py-3" />
      </div>
      {status === 'error' && <p className="text-sm font-bold text-red-600">{errorMsg}</p>}
      <button type="submit" disabled={status === 'submitting'}
        className="w-full rounded-full bg-primary py-4 text-base font-black text-white disabled:opacity-60">
        {status === 'submitting' ? dict.submitting : dict.submit}
      </button>
    </form>
  );
};

export default RegisterForm;
