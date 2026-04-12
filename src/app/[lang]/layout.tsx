import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '../globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { locales, defaultLocale } from '@/lib/i18n/locale';
import MainLayout from '@/components/layout/main-layout';
import StickyCTA from '@/components/ui/sticky-cta';
import MobileNavBar from '@/components/layout/mobile-nav-bar';
import LeadMagnetPopup from '@/components/ui/lead-magnet-popup';
import { Poppins } from 'next/font/google';
import TabNotification from '@/components/layout/tab-notification';
import OishaWidget from '@/components/oisha-widget';


const BASE_URL = 'https://jonbranding.uz';
const OG_IMAGE_URL = '/images/cms/og-image.jpeg';

export async function generateMetadata({ params: { lang } }: Props): Promise<Metadata> {
  const dictionary = await getDictionary(lang as Locale);
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: dictionary.meta?.title || "Jon.Branding | Professional Brending Agentligi",
      template: "%s | Jon.Branding"
    },
    description: dictionary.meta?.description || "Biznesingiz uchun natijali brend strategiyasi, neyming va logotip dizayni.",
    openGraph: {
      type: 'website',
      locale: lang === 'uz' ? 'uz_UZ' : lang === 'ru' ? 'ru_RU' : 'en_US',
      url: BASE_URL,
      siteName: 'Jon.Branding',
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'Jon Branding Agency' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [OG_IMAGE_URL],
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: {
        'uz': `${BASE_URL}/uz`,
        'ru': `${BASE_URL}/ru`,
        'en': `${BASE_URL}/en`,
      },
    },
  };
}

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800']
});

type Props = {
  children: ReactNode;
  params: { lang: Locale };
};

export default async function LocalizedLayout({ children, params }: Props) {
  const { lang: rawLang } = params;
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="JonBranding" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://vimeo.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://player.vimeo.com" />
        <link rel="dns-prefetch" href="https://vimeo.com" />
        <Script
          id="json-ld-professional-service"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Jon.Branding",
              "alternateName": "JonBranding Agency",
              "image": "https://jonbranding.uz/icon.svg",
              "logo": "https://jonbranding.uz/icon.svg",
              "url": "https://jonbranding.uz",
              "telephone": "+998336450097",
              "priceRange": "$$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Tashkent, Uzbekistan",
                "addressLocality": "Tashkent",
                "addressRegion": "Toshkent",
                "postalCode": "100000",
                "addressCountry": "UZ"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 41.2995,
                "longitude": 69.2401
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ],
                "opens": "09:00",
                "closes": "20:00"
              },
              "sameAs": [
                "https://instagram.com/jonbranding",
                "https://t.me/jonbranding",
                "https://facebook.com/jonbranding"
              ],
              "service": [
                {
                  "@type": "Service",
                  "name": "Neyming (Naming)",
                  "description": "Professional brand naming services."
                },
                {
                  "@type": "Service",
                  "name": "Logotip Dizayni (Logo Design)",
                  "description": "Custom logo creation and identity design."
                },
                {
                  "@type": "Service",
                  "name": "Brend Strategiyasi (Branding Strategy)",
                  "description": "Comprehensive market analysis and strategy."
                }
              ]
            })
          }}
        />
      </head>
      <body className="font-body bg-white antialiased" suppressHydrationWarning>
        <TabNotification 
          message={
            lang === 'ru' ? '(1) Новое сообщение! | Jon Branding' :
            lang === 'en' ? '(1) New message! | Jon Branding' :
            lang === 'zh' ? '(1) 新消息！ | Jon Branding' :
            '(1) Yangi xabar! | Jon Branding'
          } 
        />
        <GoogleTagManager gtmId="GTM-5GRQBW84" />
        {/* Optimized Analytics Loading Strategy */}
        <Script id="analytics-delayed-load" strategy="afterInteractive">
          {`
            (function() {
              const loadAnalytics = () => {
                if (window.analyticsLoaded) return;
                window.analyticsLoaded = true;

                // 1. Google Analytics
                const ga = document.createElement('script');
                ga.async = true;
                ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-B3ZSKB40XY';
                document.head.appendChild(ga);
                ga.onload = () => {
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-B3ZSKB40XY');
                  gtag('config', 'AW-17674872079');
                };

                // 2. Microsoft Clarity
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "w7knsud9mg");

                // 3. Hotjar
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:6527829,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

                // 4. FB Pixel
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
              };

              // Events to trigger loading
              ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
                window.addEventListener(event, loadAnalytics, { once: true, passive: true });
              });
              
              // Fallback for bots or slow interactions
              setTimeout(loadAnalytics, 5000);
            })();
          `}
        </Script>

        
        <MainLayout>
          <Header lang={lang} dictionary={dictionary.header} />
          <div className="flex-grow">
            {children}
          </div>
          <Footer lang={lang} dictionary={dictionary.footer} />
          <StickyCTA lang={lang} />
          <MobileNavBar lang={lang} dictionary={dictionary.common} />
          <OishaWidget lang={lang as 'uz' | 'ru'} />
          {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="lazyOnload">
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