import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import type { ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { locales, defaultLocale } from '@/lib/i18n/locale';
import MainLayout from '@/components/layout/main-layout';
import StickyCTA from '@/components/ui/sticky-cta';
import LeadMagnetPopup from '@/components/ui/lead-magnet-popup';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800']
});

type Props = {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
};

export default async function LocalizedLayout({ children, params }: Props) {
  const { lang: rawLang } = await params;
  const lang = locales.includes(rawLang as Locale) ? (rawLang as Locale) : defaultLocale;
  let dictionary;
  try {
    dictionary = await getDictionary(lang as Locale);
  } catch (e) {
    console.error("Layout dictionary load error:", e);
    // Provide a minimum shape to prevent crash
    dictionary = await getDictionary('uz');
  }

  return (
    <html lang={lang} suppressHydrationWarning className={poppins.variable}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate" hrefLang="uz-UZ" href="https://jonbranding.uz/uz" />
        <link rel="alternate" hrefLang="ru-RU" href="https://jonbranding.uz/ru" />
        <link rel="alternate" hrefLang="en-US" href="https://jonbranding.uz/en" />
        <link rel="alternate" hrefLang="x-default" href="https://jonbranding.uz/uz" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <Script
          id="json-ld-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Jon.Branding",
              "image": "https://jonbranding.uz/icon.svg",
              "url": "https://jonbranding.uz",
              "telephone": "+998336450097",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Tashkent, Uzbekistan",
                "addressLocality": "Tashkent",
                "addressCountry": "UZ"
              },
              "description": "Professional branding agency providing naming, strategy, and logo design services."
            })
          }}
        />
      </head>
      <body className="font-body bg-white antialiased" suppressHydrationWarning>
        <GoogleTagManager gtmId="GTM-5GRQBW84" />
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
        
        <MainLayout>
          <Header lang={lang} dictionary={dictionary.header} />
          <div className="flex-grow">
            {children}
          </div>
          <Footer lang={lang} dictionary={dictionary.footer} />
          <StickyCTA />
          {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

            ym(91628105, 'init', {webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/91628105" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
        
          <LeadMagnetPopup dictionary={(dictionary as any).leadMagnetPopup} />
        </MainLayout>
      </body>
    </html>
  );
}