import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Sahifa cookie orqali himoyalangan (page.tsx) — keshlanmasin.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mahsulot kitobi — sotuvchilar uchun',
  description: 'Jon Branding sotuvchilari uchun ichki mahsulot kitobi: xizmatlar, paketlar, narx kalkulyatori.',
  robots: { index: false, follow: false, nocache: true },
};

export default function ProductBookLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
