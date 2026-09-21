import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Tovar belgisini ro'yxatdan o'tkazish narxini hisoblang | Jon.Branding",
  description: "O'zbekistonda tovar belgisini (brend, logo) ro'yxatdan o'tkazish bo'yicha davlat bojlari va patent xarajatlarini hisoblang.",
  robots: { index: false, follow: false },
};

type Props = { children: ReactNode };

export default function PatentManagerLayout({ children }: Props) {
  return <>{children}</>;
}
