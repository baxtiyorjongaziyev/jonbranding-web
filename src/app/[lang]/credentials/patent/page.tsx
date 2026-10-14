import type { Metadata } from 'next';
import { Locale } from '@/lib/dictionaries';
import { getPageAlternates } from '@/lib/seo';
import PatentClient from './patent-client';

/**
 * Patent bo'yicha alohida sotuv taqdimoti. `/credentials` kabi indekslanmaydi —
 * narxlar va mijoz guvohnomalari faqat suhbat davomida ko'rsatiladi.
 * Kontent hozircha faqat o'zbekcha (Uzbek-first); tarjimalar keyin.
 */
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const safeLang: Locale = (['uz', 'ru', 'en', 'zh'] as const).includes(lang as Locale) ? (lang as Locale) : 'uz';
  const alternates = await getPageAlternates(safeLang, '/credentials/patent');
  return {
    title: 'Patent — Credentials',
    description: 'Jon Branding patentlash agentligi: tovar belgisini ro‘yxatdan o‘tkazish jarayoni, muddatlar va olib bergan guvohnomalarimiz.',
    robots: { index: false, follow: false, nocache: true },
    alternates,
  };
}

const PatentCredentialsPage = () => (
  <div className="flex-grow">
    <PatentClient />
  </div>
);

export default PatentCredentialsPage;
