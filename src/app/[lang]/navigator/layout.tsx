import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Biznes Navigator | Tez Natija 6',
  robots: { index: false, follow: false },
};

export default function NavigatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
