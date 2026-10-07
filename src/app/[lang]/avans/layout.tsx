import type { Metadata } from 'next';
import type { Locale } from '@/lib/dictionaries';

import { getPageAlternates } from '@/lib/seo';




export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const safeLang: Locale = (['uz', 'ru', 'en', 'zh'] as const).includes(lang as Locale) ? (lang as Locale) : 'uz';
  const alternates = await getPageAlternates(safeLang, '/avans');
  return {
    title: 'Xavfsiz Avans Kalkulyatori',
    robots: { index: false, follow: false },
    alternates,
  } as Metadata;
}


export default function AvansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
