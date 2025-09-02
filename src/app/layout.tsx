
'use client';

import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import type { FC, ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Poppins } from 'next/font/google';
import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { calculatePackagePrice, generateSummary } from '@/lib/pricing';

const ContactModal = dynamic(() => import('@/components/contact-modal'));

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Jon.Branding',
  founder: {
    '@type': 'Person',
    'name': 'Baxtiyorjon Gaziyev',
  },
  telephone: '+998336450097',
  url: 'https://jonbranding.uz',
};

const RootLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [packageSummary, setPackageSummary] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    const handleOpenModal = useCallback(() => {
        const selectionsJSON = localStorage.getItem('selectedServices');
        const isPcgMemberJSON = localStorage.getItem('isPcgMember');

        if (selectionsJSON && isPcgMemberJSON) {
            try {
                const selectedServices = JSON.parse(selectionsJSON);
                const isPcgMember = JSON.parse(isPcgMemberJSON);
                const selections = { selectedServices, isPcgMember };
                const priceDetails = calculatePackagePrice(selections);
                const summary = generateSummary(selections);
                
                setPackageSummary(summary);
                setTotalPrice(priceDetails.final);
            } catch (e) {
                console.error("Failed to parse package details from localStorage", e);
                 setPackageSummary('');
                 setTotalPrice(0);
            }
        }
        setModalOpen(true);
    }, []);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        const handleOpen = () => handleOpenModal();
        window.addEventListener('openContactModal', handleOpen);
        return () => {
            window.removeEventListener('openContactModal', handleOpen);
        };
    }, [handleOpenModal]);


  return (
    <html lang="uz" suppressHydrationWarning className={`${poppins.variable}`}>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <Script
            id="app-config"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
            __html: `
                window.__ENV__ = {
                  NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL: '${process.env.NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL || '/api/telegram'}',
                  NEXT_PUBLIC_GA_ID: '${process.env.NEXT_PUBLIC_GA_ID || 'G-1CE32W25SP'}',
                  NEXT_PUBLIC_SUPABASE_URL: '${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}',
                  NEXT_PUBLIC_SUPABASE_ANON_KEY: '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}'
                };
                window.bus = window.bus || { emit:() => {}, on:() => {}, off:() => {} };
                window.analytics = window.analytics || { eventBus: { emit:() => {}, on:() => {}, off:() => {} } };
            `,
            }}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Script
            strategy="afterInteractive"
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
        )}
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              if (window.__ENV__ && window.__ENV__.NEXT_PUBLIC_GA_ID) {
                  gtag('config', window.__ENV__.NEXT_PUBLIC_GA_ID);
              }
          `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body bg-white antialiased">
        <div className="flex min-h-screen flex-col bg-secondary/50">
           <Header />
            {children}
           <Footer />
        </div>
        <Toaster />
        <ContactModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            packageSummary={packageSummary}
            totalPrice={totalPrice}
            onFormSubmitSuccess={handleCloseModal}
        />
      </body>
    </html>
  );
}

export default RootLayout;
