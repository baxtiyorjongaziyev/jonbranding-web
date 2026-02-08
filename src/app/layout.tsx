
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import type { FC, ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import MainLayout from '@/components/layout/main-layout';
import type { Locale } from '@/lib/i18n/locale';
import { locales, defaultLocale } from '@/lib/i18n/locale';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const APP_NAME_UZ = "Jon.Branding | O'zbekistondagi eng yaxshi brending agentligi: Strategiya, Naming, Logo";
const APP_DESCRIPTION_UZ = "Jon.Branding — O'zbekistondagi premium brending agentligi. 9 yillik tajriba, 500+ mamnun mijoz. Biznesingiz uchun eng yaxshi brend strategiyasi, neyming va logotip dizayn xizmatlari.";

const APP_NAME_RU = "Jon.Branding | Лучшее брендинговое агентство в Узбекистане: Стратегия, Нейминг, Логотип";
const APP_DESCRIPTION_RU = "Jon.Branding — премиальное брендинговое агентство в Узбекистане. 9 лет опыта, 500+ довольных клиентов. Лучшие услуги по бренд-стратегии, неймингу и дизайну логотипов.";

const APP_NAME_EN = "Jon.Branding | Best Branding Agency in Uzbekistan: Strategy, Naming, Logo Design";
const APP_DESCRIPTION_EN = "Jon.Branding is the leading premium branding agency in Uzbekistan. 9+ years of experience, 500+ satisfied clients. Top-rated brand strategy, naming, and logo design services.";

const OG_IMAGE_URL = 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2';
const BASE_URL = 'https://jonbranding.uz';

export function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Metadata {
  const currentLang = locales.includes(lang) ? lang : defaultLocale;
  const alternates: { [key: string]: string } = {};
  locales.forEach(l => {
    alternates[l] = `${BASE_URL}/${l === defaultLocale ? '' : l}`;
  });

  let title, description;
  switch (currentLang) {
      case 'ru':
          title = APP_NAME_RU;
          description = APP_DESCRIPTION_RU;
          break;
      case 'en':
          title = APP_NAME_EN;
          description = APP_DESCRIPTION_EN;
          break;
      default:
          title = APP_NAME_UZ;
          description = APP_DESCRIPTION_UZ;
          break;
  }

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${currentLang === defaultLocale ? '' : currentLang}`,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${currentLang}`,
      siteName: 'Jon.Branding',
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: description,
        },
      ],
      type: 'website',
      locale: currentLang,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE_URL],
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://jonbranding.uz/#organization',
  name: 'Jon.Branding',
  url: 'https://jonbranding.uz',
  logo: 'https://img2.teletype.in/files/92/3c/923cd394-a437-47e1-86a1-51e1a2a3eb38.png',
  image: OG_IMAGE_URL,
  description: 'Leading branding and creative agency in Uzbekistan specializing in strategy, naming, and visual identity.',
  telephone: '+998336450097',
  priceRange: '$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Tashkent City',
    addressLocality: 'Tashkent',
    addressCountry: 'UZ'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.311081,
    longitude: 69.240562
  },
  founder: {
    '@type': 'Person',
    name: 'Bakhtiyorjon Gaziyev',
    jobTitle: 'Creative Director & Founder',
    sameAs: [
      'https://t.me/baxtiyorjon_gaziyev',
      'https://www.linkedin.com/in/baxtiyorjongaziyev/'
    ]
  },
  sameAs: [
    'https://t.me/JonBranding',
    'http://instagram.com/baxtiyorjongaziyev'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Branding Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Brand Strategy & Platform'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Professional Naming'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Logo Design & Corporate Identity'
        }
      }
    ]
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '500'
  }
};


const RootLayout: FC<Readonly<{ children: ReactNode, params: { lang: Locale } }>> = ({ children, params }) => {
    const lang = locales.includes(params.lang) ? params.lang : defaultLocale;

  return (
    <html lang={lang} suppressHydrationWarning className={poppins.variable}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script id="amocrm-widget" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(a,m,o,c,r,m){a[m]={id:"436993",hash:"8761545509f209e1154d24b2b1b57dfa1e78de77f34c8085c2297e1dddf2bfec",locale:"ru",inline:true,setMeta:function(p){this.params=(this.params||[]).concat([p])}};a[o]=a[o]||function(){(a[o].q=a[o].q||[]).push(arguments)};var d=a.document,s=d.createElement('script');s.async=true;s.id=m+'_script';s.src='https://gso.amocrm.ru/js/button.js';d.head&&d.head.appendChild(s)})(window,0,'amoSocialButton',0,0,'amo_social_button');` }} />

        {/* Google Analytics & Ads */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17674872079" strategy="afterInteractive"></Script>
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
              });

              gtag('config', 'G-B3ZSKB40XY');
              gtag('config', 'AW-17674872079');
            `,
          }}
        />

        {/* Yandex.Metrika */}
        <Script id="yandex-metrika" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(97914878, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true
              });
            `
          }}
      />
      </head>
      <body className={`font-body bg-white antialiased`}>
        <MainLayout>
          {children}
        </MainLayout>
        <noscript><div><img src="https://mc.yandex.ru/watch/97914878" style={{ position:'absolute', left:'-9999px' }} alt="" /></div></noscript>
      </body>
    </html>
  );
}

export default RootLayout;
