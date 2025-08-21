import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import type { FC, ReactNode } from 'react';

const APP_NAME = "Jon.Branding";
const APP_DESCRIPTION = "Jon.Branding bilan strategiyaga asoslangan vizual ko‘rinishga ega bo‘ling.";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    url: 'https://jonbranding.uz',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    type: 'website',
    siteName: APP_NAME,
    images: [
      {
        url: 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2',
        width: 1200,
        height: 630,
        alt: APP_DESCRIPTION,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ['https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2'],
  },
  alternates: {
    canonical: 'https://jonbranding.uz',
  },
  icons: {
    icon: '/favicon.ico',
  }
};

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
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500&display=swap" rel="stylesheet" />
        
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <Script
            id="app-config"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
            __html: `
                window.__ENV__ = {
                  NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL: '${process.env.NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL || '/api/telegram'}',
                  NEXT_PUBLIC_GA_ID: '${process.env.NEXT_PUBLIC_GA_ID || ''}',
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}

export default RootLayout;
