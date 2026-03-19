
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import type { FC, ReactNode } from 'react';
import MainLayout from '@/components/layout/main-layout';

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
    <>
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
        {/* Meta Pixel Code */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1134785364752294');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <MainLayout>
        {children}
      </MainLayout>
    </>
  );
}

export default RootLayout;
