import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { findAffiliateByToken, getAffiliateDashboard } from '@/lib/affiliate/store';
import { serviceFromHint } from '@/lib/affiliate/payouts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false } };

function shortenName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0].toUpperCase()}.`;
}

function fmtSom(n: number): string {
  return `${n.toLocaleString('fr-FR')} so'm`;
}

export default async function AffiliateDashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale; token: string }>;
}) {
  const { lang, token } = await params;
  const affiliate = await findAffiliateByToken(token);
  if (!affiliate) notFound();

  const dictionary = await getDictionary(lang);
  const d = (dictionary as any)?.affiliate?.dashboard ?? {};
  const { referrals, payouts, stats } = await getAffiliateDashboard(affiliate.id);

  const payoutByReferral = new Map(payouts.map((p) => [p.referralId, p]));

  const statusLabel = (s: string) =>
    s === 'won' ? d.statusWon : s === 'lost' ? d.statusLost : d.statusNew;

  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="text-2xl font-black tracking-tight">
        {d.greeting}, {affiliate.fullName}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold uppercase tracking-widest text-slate-500">{d.yourCode}:</span>
        <span className="text-2xl font-black text-primary">{affiliate.promoCode}</span>
      </div>
      <p className="mt-1 text-sm text-slate-500">{d.shareHint}</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          [d.statTotal, String(stats.totalReferrals)],
          [d.statWon, String(stats.wonReferrals)],
          [d.statBonus, fmtSom(stats.totalBonus)],
          [d.statPaid, fmtSom(stats.paidBonus)],
          [d.statPending, fmtSom(stats.pendingBonus)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-slate-50 p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-x-auto">
        {referrals.length === 0 ? (
          <p className="text-slate-500">{d.empty}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-[11px] uppercase tracking-widest text-slate-500">
                <th className="py-2 pr-3">{d.tableClient}</th>
                <th className="py-2 pr-3">{d.tableDate}</th>
                <th className="py-2 pr-3">{d.tableService}</th>
                <th className="py-2 pr-3">{d.tableStatus}</th>
                <th className="py-2 pr-3">{d.tableBonus}</th>
                <th className="py-2 pr-3">{d.tablePayout}</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => {
                const payout = payoutByReferral.get(r.id);
                const svc = serviceFromHint(r.serviceHint);
                return (
                  <tr key={r.id} className="border-b">
                    <td className="py-2 pr-3 font-medium">{shortenName(r.leadName)}</td>
                    <td className="py-2 pr-3 text-slate-500">{new Date(r.createdAt).toLocaleDateString('uz-UZ')}</td>
                    <td className="py-2 pr-3">{svc ?? '—'}</td>
                    <td className="py-2 pr-3">{statusLabel(r.status)}</td>
                    <td className="py-2 pr-3">{payout ? fmtSom(payout.amount) : '—'}</td>
                    <td className="py-2 pr-3">
                      {payout ? (payout.paid ? d.payoutPaid : d.payoutPending) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
