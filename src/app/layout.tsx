

import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import type { FC, ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import MainLayout from '@/components/layout/main-layout';
import type { Locale } from '@/lib/i18n/locale';
import { locales } from '@/lib/i18n/locale';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const APP_NAME = "Jon.Branding | Biznesingiz uchun natija keltiradigan brending";
const APP_DESCRIPTION = "Biz shunchaki logotip chizmaymiz. Biz biznesingiz uchun natija keltiradigan, strategiyaga asoslangan va mijozlaringiz qalbidan joy oladigan brend tizimini qurib beramiz.";
const OG_IMAGE_URL = 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2';
const BASE_URL = 'https://jonbranding.uz';

export function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Metadata {
  const alternates: { [key: string]: string } = {};
  locales.forEach(l => {
    alternates[l] = `${BASE_URL}/${l}`;
  });

  return {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: alternates,
    },
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      url: `${BASE_URL}/${lang}`,
      siteName: 'Jon.Branding',
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: APP_DESCRIPTION,
        },
      ],
      type: 'website',
      locale: lang,
    },
    twitter: {
      card: 'summary_large_image',
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [OG_IMAGE_URL],
    },
  };
}

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


const RootLayout: FC<Readonly<{ children: ReactNode, params: { lang: Locale } }>> = ({ children, params }) => {
    const lang = params.lang || 'uz';

  return (
    <html lang={lang} suppressHydrationWarning className={`${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{display: 'none'}}
               src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`} />
        </noscript>
        {/* End Meta Pixel Code */}

      </head>
      <body className="font-body bg-white antialiased">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        
        {/* Google Analytics */}
        <Script
            strategy="beforeInteractive"
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-1CE32W25SP`}
        />
        <Script
          id="gtag-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1CE32W25SP');
          `,
          }}
        />

        {/* Hotjar */}
        <Script
          id="hotjar-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:6527829,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}

export default RootLayout;
