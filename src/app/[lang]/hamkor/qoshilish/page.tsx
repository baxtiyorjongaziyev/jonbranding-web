import type { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import RegisterForm from './register-form';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AffiliateJoinPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const dict = (dictionary as any)?.affiliate?.join ?? {};

  return (
    <main className="mx-auto max-w-xl px-5 py-16 sm:py-24">
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{dict.title}</h1>
      <p className="mt-3 text-slate-600">{dict.subtitle}</p>

      <div className="mt-10">
        <RegisterForm lang={lang} dict={dict} />
      </div>

      <div className="mt-14 rounded-2xl border bg-slate-50 p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{dict.bonusTableTitle}</p>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          <li>{dict.bonusNaming}</li>
          <li>{dict.bonusLogo}</li>
          <li>{dict.bonusPatent}</li>
          <li>{dict.bonusPackaging}</li>
          <li>{dict.bonusFull}</li>
        </ul>
      </div>
    </main>
  );
}
