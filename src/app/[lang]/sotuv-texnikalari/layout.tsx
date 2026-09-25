import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, TEAM_COOKIE, verifyAdminSession, verifyTeamSession } from '@/lib/admin/auth';
import LoginForm from '@/app/admin/hamkorlar/login-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sotuv texnikalari',
  description: 'Jon Branding sotuvchilari uchun SPIN, FAB, JTBD, LAER, Contrast va boshqa konsultativ sotuv texnikalari.',
  robots: { index: false, follow: false, nocache: true },
};

// Ichki sotuv skriptlari (narx e'tirozlari va h.k.) — faqat jamoa paroli
// (SALES_TEAM_SECRET) yoki admin sessiyasi bilan ochiladi.
export default async function SalesTechniquesLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const allowed =
    verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value) ||
    verifyTeamSession(cookieStore.get(TEAM_COOKIE)?.value);

  if (!allowed) {
    return <LoginForm title="Sotuv texnikalari — jamoa uchun" scope="team" />;
  }

  return <>{children}</>;
}
