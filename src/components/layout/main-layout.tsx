import type { FC, ReactNode } from 'react';
import ClientEnhancementsLoader from '@/components/layout/client-enhancements-loader';
import { LenisProvider } from '@/components/layout/lenis-provider';

interface MainLayoutProps {
  children: ReactNode;
  leadMagnetDictionary?: any;
  headerDictionary?: any;
  lang?: string;
  stickyCtaLabel?: string;
  tabNotificationMessage?: string;
  settings?: { phone?: string; telegramPersonal?: string; telegramChannel?: string };
}

const MainLayout: FC<MainLayoutProps> = ({
  children,
  leadMagnetDictionary,
  headerDictionary,
  lang,
  stickyCtaLabel,
  tabNotificationMessage,
  settings,
}) => (
  <LenisProvider>
    <div className="flex min-h-screen flex-col bg-secondary/50" suppressHydrationWarning>
      {children}
      <ClientEnhancementsLoader
        leadMagnetDictionary={leadMagnetDictionary}
        headerDictionary={headerDictionary}
        lang={lang}
        stickyCtaLabel={stickyCtaLabel}
        tabNotificationMessage={tabNotificationMessage}
        settings={settings}
      />
    </div>
  </LenisProvider>
);

export default MainLayout;
