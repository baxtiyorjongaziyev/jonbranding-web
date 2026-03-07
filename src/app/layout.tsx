
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import type { FC, ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import MainLayout from '@/components/layout/main-layout';
import type { Locale } from '@/lib/i18n/locale';
import { locales, defaultLocale } from '@/lib/i18n/locale';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800']
});

const BASE_URL = 'https://jonbranding.uz';
const OG_IMAGE_URL = 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2';

export function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Metadata {
  const currentLang = locales.includes(lang) ? lang : defaultLocale;
  
  const titles = {
    uz: "Jon.Branding | O'zbekistondagi Eng Yaxshi Brending Agentligi: Strategiya, Naming, Logo",
    ru: "Jon.Branding | Лучшее Брендинговое Агентство в Узбекистане: Стратегия, Нейминг, Логотип",
    en: "Jon.Branding | #1 Branding Agency in Uzbekistan: Strategy, Naming, Logo Design",
    zh: "Jon.Branding | 乌兹别克斯坦领先的品牌代理机构：战略、命名、标志设计"
  };

  const descriptions = {
    uz: "Jon.Branding — strategik fikrlash va biznes tahlilni birlashtirgan premium brending agentligi. Biznesingiz uchun eng yaxshi brend strategiyasi, neyming va logotip dizayn xizmatlari.",
    ru: "Jon.Branding — премиальное брендинговое агентство, сочетающее стратегическое мышление и бизнес-аналитику. Лучшие услуги по бренд-стратегии, неймингу и дизайну логотипов.",
    en: "Jon.Branding is the premier strategic branding consultancy in Uzbekistan. We specialize in naming, logo design, and brand identity that drives real business growth.",
    zh: "Jon.Branding 是乌兹别克斯坦领先的品牌代理机构，以将战略性业务思维与创意品牌形象、命名和标志设计相结合而闻名。"
  };

  const keywords = {
    uz: "brending, branding uz, ma'no branding, logo dizayn, neyming, naming, qadoq dizayn, brandbook, brendbuk, mountain branding, abba marketing, minim, redfox",
    ru: "брендинг, branding uz, ma'no branding, логотип, нейминг, дизайн упаковки, брендбук, брендинговое агентство ташкент",
    en: "branding, branding uz, ma'no branding, logo design, naming, packaging design, brandbook, branding agency tashkent",
    zh: "品牌, 标志设计, 命名, 包装设计, 品牌手册, 品牌代理机构"
  };

  return {
    title: titles[currentLang],
    description: descriptions[currentLang],
    keywords: keywords[currentLang],
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${currentLang === defaultLocale ? '' : currentLang}`,
      languages: {
        'uz': `${BASE_URL}/uz`,
        'ru': `${BASE_URL}/ru`,
        'en': `${BASE_URL}/en`,
        'zh': `${BASE_URL}/zh`,
      },
    },
    openGraph: {
      title: titles[currentLang],
      description: descriptions[currentLang],
      url: `${BASE_URL}/${currentLang}`,
      siteName: 'Jon.Branding',
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'Jon Branding Agency' }],
      type: 'website',
      locale: currentLang,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[currentLang],
      description: descriptions[currentLang],
      images: [OG_IMAGE_URL],
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BrandingAgency',
  '@id': 'https://jonbranding.uz/#organization',
  name: 'Jon.Branding',
  url: 'https://jonbranding.uz',
  logo: 'https://img2.teletype.in/files/92/3c/923cd394-a437-47e1-86a1-51e1a2a3eb38.png',
  image: OG_IMAGE_URL,
  description: 'Jon.Branding is an independent, award-winning branding consultancy in Uzbekistan specializing in business-centric identity, naming, and brand strategy.',
  telephone: '+998336450097',
  priceRange: '$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Tashkent City',
    addressLocality: 'Tashkent',
    addressCountry: 'UZ'
  },
  sameAs: [
    'https://t.me/JonBranding',
    'https://www.instagram.com/jon.branding/',
    'https://www.linkedin.com/in/baxtiyorjongaziyev/'
  ],
  founder: {
    '@type': 'Person',
    name: 'Bakhtiyorjon Gaziyev',
    jobTitle: 'Founder & Strategic Director'
  },
  areaServed: {
    '@type': 'Country',
    name: 'Uzbekistan'
  }
};

const RootLayout: FC<Readonly<{ children: ReactNode, params: any }>> = async ({ children, params }) => {
  const { lang: rawLang } = await params;
  const lang = locales.includes(rawLang) ? rawLang : defaultLocale;

  return (
    <html lang={lang} suppressHydrationWarning className={poppins.variable}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Google Consent Mode v2 Initialization */}
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

        {/* Google Tag Manager / GA4 / Google Ads */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-B3ZSKB40XY" strategy="lazyOnload"></Script>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17674872079" strategy="lazyOnload"></Script>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-389056476" strategy="lazyOnload"></Script>
        
        <Script
          id="gtag-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B3ZSKB40XY', { 'page_path': window.location.pathname });
              gtag('config', 'AW-17674872079');
              gtag('config', 'AW-389056476');
            `,
          }}
        />

        {/* Amplitude Session Replay & Autocapture (Official Loader Snippet) */}
        <Script id="amplitude-loader" strategy="afterInteractive">
          {`
            !function(e,t){var n=e.amplitude||{_q:[],_iq:{}};if(n.invoked)e.console&&console.error&&console.error("Amplitude snippet has already been invoked");else{n.invoked=!0;var r=t.createElement("script");r.type="text/javascript",r.integrity="sha384-PPf95Y9vmL9YStYpZAsAmZ9kNvNrCcbaidZQXpKgDDR8dUInIdESYIxmOfvD5KNK",r.crossOrigin="anonymous",r.async=!0,r.src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz",r.onload=function(){e.amplitude.runQueuedFunctions?e.amplitude.runQueuedFunctions():console.log("[Amplitude] Error: could not load SDK")};var s=t.getElementsByTagName("script")[0];s.parentNode.insertBefore(r,s);function i(e,t){e.prototype[t]=function(){return this._q.push({name:t,args:Array.prototype.slice.call(arguments)}),this}}var o=function(){return this._q=[],this},a=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],c=["identify","logEvent","setUserProperties"],u=["setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],l=["setGroup","setGroupProperties"],p=["init","onInit","setOptOut","setUserId","setDeviceId","setSessionId","setVersionName","setAppId","setTransport","setGlobalUserProperties","setGroup","setGroupProperties","setAlias","setLogEvent","setSessionId","reset"];function d(e){function t(t,n){e[t]=function(){var r={promise:new Promise(((n,r)=>{e._q.push({name:t,args:Array.prototype.slice.call(arguments),resolve:n,reject:r})}))};if(n)return r}}for(var n=0;n<p.length;n++)t(p[n],!1);for(var r=0;r<a.length;r++)t(a[r],!1);for(var s=0;s<c.length;s++)t(c[s],!0);for(var i=0;i<u.length;i++)t(u[i],!1);for(var o=0;o<l.length;o++)t(l[o],!1)}d(n),n.Identify=o,i(n.Identify,"add"),i(n.Identify,"append"),i(n.Identify,"clearAll"),i(n.Identify,"prepend"),i(n.Identify,"set"),i(n.Identify,"setOnce"),i(n.Identify,"unset"),i(n.Identify,"preInsert"),i(n.Identify,"postInsert"),i(n.Identify,"remove"),n.Revenue=o,i(n.Revenue,"setProductId"),i(n.Revenue,"setQuantity"),i(n.Revenue,"setPrice"),i(n.Revenue,"setRevenue"),i(n.Revenue,"setRevenueType"),i(n.Revenue,"setEventProperties"),n._iq={},n.getInstance=function(e){return e=e||"_default",Object.prototype.hasOwnProperty.call(n._iq,e)||(n._iq[e]={_q:[]},d(n._iq[e])),n._iq[e]},e.amplitude=n}}(window,document);
            
            amplitude.init('1c82e6734ed6525393807b4e56f105a5', {
              fetchRemoteConfig: true,
              autocapture: {
                attribution: true,
                fileDownloads: true,
                formInteractions: true,
                pageViews: true,
                sessions: true,
                elementInteractions: true,
                networkTracking: true,
                webVitals: true,
                frustrationInteractions: {
                  thrashedCursor: true,
                  errorClicks: true,
                  deadClicks: true,
                  rageClicks: true
                }
              }
            });
          `}
        </Script>
        
        {/* AmoCRM Social Button */}
        <Script id="amocrm-widget" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: `(function(a,m,o,c,r,m){a[m]={id:"436993",hash:"8761545509f209e1154d24b2b1b57dfa1e78de77f34c8085c2297e1dddf2bfec",locale:"ru",inline:true,setMeta:function(p){this.params=(this.params||[]).concat([p])}};a[o]=a[o]||function(){(a[o].q=a[o].q||[]).push(arguments)};var d=a.document,s=d.createElement('script');s.async=true;s.id=m+'_script';s.src='https://gso.amocrm.ru/js/button.js';d.head&&d.head.appendChild(s)})(window,0,'amoSocialButton',0,0,'amo_social_button');` }} />
      </head>
      <body className={`font-body bg-white antialiased`} suppressHydrationWarning>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}

export default RootLayout;
