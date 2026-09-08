'use client';
import { FC, useState } from 'react';
import type { AffiliateWithStats, PayoutRow } from '@/lib/affiliate/store';

function fmtSom(n: number) {
  return `${n.toLocaleString('fr-FR')} so'm`;
}

const AdminClient: FC<{ affiliates: AffiliateWithStats[]; payouts: PayoutRow[] }> = ({
  affiliates,
  payouts,
}) => {
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('unpaid');
  const [rows, setRows] = useState(payouts);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const visible = rows.filter((p) =>
    filter === 'all' ? true : filter === 'paid' ? p.paid : !p.paid,
  );
  const pendingTotal = rows
    .filter((p) => !p.paid)
    .reduce((s, p) => s + p.amount, 0);

  const markPaid = async (id: string) => {
    setPendingId(id);
    const res = await fetch(`/api/admin/payouts/${id}/mark-paid`, { method: 'POST' });
    setPendingId(null);
    if (res.ok) {
      setRows((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, paid: true, paidAt: new Date().toISOString() } : p,
        ),
      );
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Admin — Hamkorlar</h1>
        <button onClick={logout} className="rounded-full border px-4 py-2 text-sm font-bold">
          Chiqish
        </button>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Kutilayotgan to'lovlar: <strong>{fmtSom(pendingTotal)}</strong>
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Bonuslar</h2>
        <div className="mt-3 flex gap-2">
          {(['unpaid', 'all', 'paid'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                filter === f ? 'bg-primary text-white' : 'border'
              }`}
            >
              {f === 'unpaid' ? "To'lanmagan" : f === 'paid' ? "To'langan" : 'Barchasi'}
            </button>
          ))}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-[11px] uppercase tracking-widest text-slate-500">
                <th className="py-2 pr-3">Hamkor</th>
                <th className="py-2 pr-3">Promokod</th>
                <th className="py-2 pr-3">Mijoz</th>
                <th className="py-2 pr-3">Xizmat</th>
                <th className="py-2 pr-3">Summa</th>
                <th className="py-2 pr-3">Sana</th>
                <th className="py-2 pr-3">Holat</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2 pr-3">{p.affiliateName}</td>
                  <td className="py-2 pr-3 font-mono">{p.affiliatePromoCode}</td>
                  <td className="py-2 pr-3">{p.leadName}</td>
                  <td className="py-2 pr-3">{p.service}</td>
                  <td className="py-2 pr-3">{fmtSom(p.amount)}</td>
                  <td className="py-2 pr-3 text-slate-500">
                    {new Date(p.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="py-2 pr-3">
                    {p.paid ? (
                      <span className="font-bold text-green-600">To'langan</span>
                    ) : (
                      <button
                        onClick={() => markPaid(p.id)}
                        disabled={pendingId === p.id}
                        className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-60"
                      >
                        To'landi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Hamkorlar</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-[11px] uppercase tracking-widest text-slate-500">
                <th className="py-2 pr-3">Ism</th>
                <th className="py-2 pr-3">Telefon</th>
                <th className="py-2 pr-3">Promokod</th>
                <th className="py-2 pr-3">Ro'yxat</th>
                <th className="py-2 pr-3">Takliflar</th>
                <th className="py-2 pr-3">Jami bonus</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="py-2 pr-3">{a.fullName}</td>
                  <td className="py-2 pr-3">{a.phone}</td>
                  <td className="py-2 pr-3 font-mono">{a.promoCode}</td>
                  <td className="py-2 pr-3 text-slate-500">
                    {new Date(a.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="py-2 pr-3">{a.referralCount}</td>
                  <td className="py-2 pr-3">{fmtSom(a.totalBonus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default AdminClient;
