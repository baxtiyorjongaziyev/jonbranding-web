import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xavfsiz Avans Kalkulyatori',
  robots: { index: false, follow: false },
};

export default function AvansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
