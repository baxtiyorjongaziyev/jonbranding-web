import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Sotuv texnikalari | Jon Branding Sales Playbook',
  description: 'Jon Branding sotuvchilari uchun SPIN, FAB, JTBD, LAER, Contrast va boshqa konsultativ sotuv texnikalari.',
  robots: { index: false, follow: false, nocache: true },
};

export default function SalesTechniquesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
