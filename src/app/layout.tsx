
'use client';

import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import type { FC, ReactNode } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Poppins } from 'next/font/google';
import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { calculatePackagePrice, generateSummary } from '@/lib/pricing';
import AiAssistant from '@/components/ai-assistant';

const ContactModal = dynamic(() => import('@/components/contact-modal'));

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const APP_NAME = "Jon.Branding | Biznesingiz uchun natija keltiradigan brending";
const APP_DESCRIPTION = "Biz shunchaki logotip chizmaymiz. Biz biznesingiz uchun natija keltiradigan, strategiyaga asoslangan va mijozlaringiz qalbidan joy oladigan brend tizimini qurib beramiz.";
const OG_IMAGE_URL = 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2';
const FAVICON_URL = 'https://img3.teletype.in/files/e2/2b/e22bf3d7-9a75-4df5-aa37-7e75e7846dda.png';
const CANONICAL_URL = 'https://jonbranding.uz';


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
        const wantsUpfrontPaymentJSON = localStorage.getItem('wantsUpfrontPayment');
        
        // Reset before calculating
        setPackageSummary('');
        setTotalPrice(0);

        if (selectionsJSON) {
            try {
                const selectedServices = JSON.parse(selectionsJSON);
                const wantsUpfrontPayment = wantsUpfrontPaymentJSON ? JSON.parse(wantsUpfrontPaymentJSON) : false;
                const selections = { selectedServices, wantsUpfrontPayment };
                
                const priceDetails = calculatePackagePrice(selections);
                if (priceDetails.base > 0) {
                    const summary = generateSummary(selections);
                    setPackageSummary(summary);
                    setTotalPrice(priceDetails.final);
                }

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
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <link rel="icon" href={FAVICON_URL} type="image/png" sizes="any" />
        <link rel="canonical" href={CANONICAL_URL} />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={APP_NAME} />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={APP_NAME} />
        <meta name="twitter:description" content={APP_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
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
              fbq('init', 'YOUR_PIXEL_ID');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{display: 'none'}}
               src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1" />
        </noscript>
        {/* End Meta Pixel Code */}

      </Head>
      <body className="font-body bg-white antialiased">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        
        {/* Google Analytics */}
        <Script
            strategy="afterInteractive"
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-1CE32W25SP`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
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
                    h._hjSettings={hjid:5084931,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />

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
        <AiAssistant />
      </body>
    </html>
  );
}

export default RootLayout;
