import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://www.jonbranding.uz/brand-strategy',
  },
};

const BrandStrategyLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
  return <>{children}</>;
};

export default BrandStrategyLayout;

