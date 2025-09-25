
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import type { FC, ReactNode } from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});


const RootLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
  return (
    <html lang="uz" suppressHydrationWarning className={`${poppins.variable}`}>
      <body>
          {children}
          <Toaster />
      </body>
    </html>
  );
}

export default RootLayout;
