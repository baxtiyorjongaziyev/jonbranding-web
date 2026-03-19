
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import type { FC, ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import MainLayout from '@/components/layout/main-layout';
import { locales, defaultLocale } from '@/lib/i18n/locale';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800']
});

const BASE_URL = 'https://jonbranding.uz';
const OG_IMAGE_URL = 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Jon.Branding | Toshkentdagi Professional Brending Agentligi",
    template: "%s | Jon.Branding"
  },
  description: "Biznesingiz uchun natijali brend strategiyasi, neyming va logotip dizayni.",
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: BASE_URL,
    siteName: 'Jon.Branding',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'Jon Branding Agency' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE_URL],
  },
};

const RootLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
  return (
    <html lang="uz" suppressHydrationWarning className={poppins.variable}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted',
              'analytics_storage': 'granted'
            });
          `}
        </Script>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-B3ZSKB40XY" strategy="afterInteractive"></Script>
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B3ZSKB40XY', { page_path: window.location.pathname });
              gtag('config', 'AW-17674872079');
            `,
          }}
        />
      </head>
      <body className="font-body bg-white antialiased" suppressHydrationWarning>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}

export default RootLayout;
