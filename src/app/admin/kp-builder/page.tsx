import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin/auth';
import LoginForm from '../hamkorlar/login-form';
import KpBuilderClient from './kp-builder-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'KP Builder | JonBranding',
  robots: { index: false, follow: false },
};

export default async function KpBuilderPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!verifyAdminSession(session)) {
    return <LoginForm title="Admin — KP Builder" />;
  }

  return <KpBuilderClient />;
}
