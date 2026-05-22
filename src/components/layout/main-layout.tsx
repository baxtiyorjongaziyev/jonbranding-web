import type { FC, ReactNode } from 'react';
import ClientEnhancements from '@/components/layout/client-enhancements';

interface MainLayoutProps {
  children: ReactNode;
  leadMagnetDictionary?: any;
}

const MainLayout: FC<MainLayoutProps> = ({ children, leadMagnetDictionary }) => (
  <div className="flex min-h-screen flex-col bg-secondary/50" suppressHydrationWarning>
    {children}
    <ClientEnhancements leadMagnetDictionary={leadMagnetDictionary} />
  </div>
);

export default MainLayout;
