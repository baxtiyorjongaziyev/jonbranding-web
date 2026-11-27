import { cookies } from 'next/headers';
import { ADMIN_COOKIE, TEAM_COOKIE, verifyAdminSession, verifyTeamSession } from '@/lib/admin/auth';
import LoginForm from '@/app/admin/hamkorlar/login-form';
import { getSalesContent } from '@/lib/sales-content';
import ProductBookClient from './product-book-client';

// Ichki mahsulot kitobi — faqat jamoa paroli (SALES_TEAM_SECRET) yoki admin sessiyasi bilan.
// Tekshiruv sahifaning o'zida: layout'da qilinsa, kontent RSC ma'lumotida HTML'ga tushardi.
// Barcha narx va tarkiblar `src/lib/sales-content/` dan olinadi (docs/NARXLAR.md).
export default async function ProductBookPage() {
  const cookieStore = await cookies();
  const allowed =
    verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value) ||
    verifyTeamSession(cookieStore.get(TEAM_COOKIE)?.value);

  if (!allowed) {
    return <LoginForm title="Mahsulot kitobi — jamoa uchun" scope="team" />;
  }

  return <ProductBookClient content={getSalesContent('uz')} />;
}
