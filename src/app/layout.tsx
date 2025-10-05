
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
  logo: 'https://img2.teletype.in/files/92/3c/923cd394-a437-47e1-86a1-51e1a2a3eb38.png',
};


const RootLayout: FC<Readonly<{ children: ReactNode, params: { lang: Locale } }>> = ({ children, params }) => {
    const lang = params.lang || 'uz';

  return (
    <html lang={lang} suppressHydrationWarning className={`${poppins.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ctext x='5' y='85' font-family='Poppins, sans-serif' font-weight='900' font-size='85' fill='black'%3eJ%3c/text%3e%3ccircle cx='75' cy='80' r='10' fill='%230060FF'/%3e%3c/svg%3e" sizes="any" />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5GRQBW84');`,
          }}
        />
      </head>
      <body className="font-body bg-white antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5GRQBW84"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <Script id="telegram-web-app" src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}

export default RootLayout;
