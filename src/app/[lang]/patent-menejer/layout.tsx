import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Patent Kalkulyatori (Sotuv Menejeri) | Jon.Branding',
  description: 'Jon.Branding sotuv menejerlari uchun patent xarajatlarini real-vaqt rejimida hisoblash va kaskad chegirmalarni taqdim etish paneli.',
  robots: { index: false, follow: false },
};

type Props = { children: ReactNode };

export default function PatentManagerLayout({ children }: Props) {
  return <>{children}</>;
}
