'use client';
import { FC, useState } from 'react';

const LoginForm: FC = () => {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    });
    setBusy(false);
    if (res.ok) {
      window.location.reload();
    } else {
      setError(true);
    }
  };

  return (
    <main className="mx-auto max-w-sm px-5 py-24">
      <h1 className="text-xl font-black">Admin — Hamkorlar</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Parol"
          className="w-full rounded-xl border px-4 py-3"
          autoFocus
        />
        {error && <p className="text-sm font-bold text-red-600">Parol noto'g'ri</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-primary py-3 font-black text-white disabled:opacity-60"
        >
          Kirish
        </button>
      </form>
    </main>
  );
};

export default LoginForm;
