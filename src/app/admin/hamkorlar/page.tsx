import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin/auth';
import { listAffiliatesWithStats, listPayouts } from '@/lib/affiliate/store';
import LoginForm from './login-form';
import AdminClient from './admin-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminAffiliatesPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!verifyAdminSession(session)) {
    return <LoginForm />;
  }

  const [affiliates, payouts] = await Promise.all([
    listAffiliatesWithStats(),
    listPayouts('all'),
  ]);

  return <AdminClient affiliates={affiliates} payouts={payouts} />;
}
