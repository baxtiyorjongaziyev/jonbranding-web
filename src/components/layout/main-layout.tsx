import type { FC, ReactNode } from 'react';
import ClientEnhancements from '@/components/layout/client-enhancements';

interface MainLayoutProps {
  children: ReactNode;
  leadMagnetDictionary?: any;
  headerDictionary?: any;
  lang?: string;
  stickyCtaLabel?: string;
  tabNotificationMessage?: string;
}

const MainLayout: FC<MainLayoutProps> = ({
  children,
  leadMagnetDictionary,
  headerDictionary,
  lang,
  stickyCtaLabel,
  tabNotificationMessage,
}) => (
  <div className="flex min-h-screen flex-col bg-secondary/50" suppressHydrationWarning>
    {children}
    <ClientEnhancements
      leadMagnetDictionary={leadMagnetDictionary}
      headerDictionary={headerDictionary}
      lang={lang}
      stickyCtaLabel={stickyCtaLabel}
      tabNotificationMessage={tabNotificationMessage}
    />
  </div>
);

export default MainLayout;
