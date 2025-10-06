
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import type { FC, ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import MainLayout from '@/components/layout/main-layout';
import type { Locale } from '@/lib/i18n/locale';
import { locales, defaultLocale } from '@/lib/i18n/locale';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const APP_NAME_UZ = "Jon.Branding | Toshkentdagi brending agentligi: Brend strategiyasi, Naming, Logotip dizayn";
const APP_DESCRIPTION_UZ = "Jon.Branding — O'zbekistondagi premium brending agentligi. Brend strategiyasi, neyming, logotip dizayn, firma uslubi, brandbook tayyorlash va biznes upakovka xizmatlari. Biznesingiz uchun natija keltiradigan brend yaratamiz.";
const KEYWORDS_UZ = [
    "branding agentligi toshkent", "brend strategiyasi", "naming xizmatlari", "logotip dizayn", 
    "firma uslubi yaratish", "brandbook tayyorlash", "qadoqlash dizayni", "qadoq dizayn agentligi", 
    "brend yaratish xizmati", "brend dizayn toshkent", "premium brending o‘zbekiston", 
    "packaging design uzbekistan", "logo design agency uzbekistan", "creative agency fergana valley", 
    "jon branding agency", "biznes upakovka", "biznesni upakovka qilish",
    "Branding.uz", "Jamal Akbarov", "MA'NO Branding", "Lokals", "Taboo Branding", "Mountain branding",
    "Minim", "OQILA", "xspace.uz", "change.uz", "Golden Minds"
];

const APP_NAME_RU = "Jon.Branding | Брендинговое агентство в Ташкенте: Бренд-стратегия, Нейминг, Дизайн логотипа";
const APP_DESCRIPTION_RU = "Jon.Branding — премиальное брендинговое агентство в Узбекистане. Услуги по разработке бренд-стратегии, неймингу, дизайну логотипа, фирменному стилю, созданию брендбука и упаковке бизнеса. Создаем бренды, приносящие результат вашему бизнесу.";
const KEYWORDS_RU = [
    "брендинговое агентство ташкент", "бренд стратегия", "услуги нейминга", "дизайн логотипа", 
    "создание фирменного стиля", "разработка брендбука", "дизайн упаковки", "агентство по дизайну упаковки", 
    "услуги по созданию бренда", "бренд дизайн ташкент", "премиум брендинг узбекистан", 
    "packaging design uzbekistan", "logo design agency uzbekistan", "creative agency fergana valley", 
    "jon branding agency", "упаковка бизнеса",
    "Branding.uz", "Джамал Акбаров", "MA'NO Branding", "Lokals", "Taboo Branding", "Mountain branding",
    "Minim", "OQILA", "xspace.uz", "change.uz", "Golden Minds"
];

const APP_NAME_EN = "Jon.Branding | Branding Agency in Tashkent: Brand Strategy, Naming, Logo Design";
const APP_DESCRIPTION_EN = "Jon.Branding is a premium branding agency in Uzbekistan. We offer brand strategy, naming, logo design, corporate identity, brandbook creation, and business packaging services. We create brands that bring results to your business.";
const KEYWORDS_EN = [
    "branding agency tashkent", "brand strategy", "naming services", "logo design", 
    "corporate identity creation", "brandbook development", "packaging design", "packaging design agency", 
    "brand creation service", "brand design tashkent", "premium branding uzbekistan", 
    "packaging design uzbekistan", "logo design agency uzbekistan", "creative agency fergana valley", 
    "jon branding agency", "business packaging",
    "Branding.uz", "Jamal Akbarov", "MA'NO Branding", "Lokals", "Taboo Branding", "Mountain branding",
    "Minim", "OQILA", "xspace.uz", "change.uz", "Golden Minds"
];

const OG_IMAGE_URL = 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2';
const BASE_URL = 'https://jonbranding.uz';

export function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Metadata {
  const alternates: { [key: string]: string } = {};
  locales.forEach(l => {
    alternates[l] = `${BASE_URL}/${l === defaultLocale ? '' : l}`;
  });

  let title, description, keywords;
  switch (lang) {
      case 'ru':
          title = APP_NAME_RU;
          description = APP_DESCRIPTION_RU;
          keywords = KEYWORDS_RU;
          break;
      case 'en':
          title = APP_NAME_EN;
          description = APP_DESCRIPTION_EN;
          keywords = KEYWORDS_EN;
          break;
      default:
          title = APP_NAME_UZ;
          description = APP_DESCRIPTION_UZ;
          keywords = KEYWORDS_UZ;
          break;
  }

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${BASE_URL}/${lang === defaultLocale ? '' : lang}`,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${lang}`,
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
      locale: lang,
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
  '@type': 'Organization',
  name: 'Jon.Branding',
  founder: {
    '@type': 'Person',
    'name': 'Baxtiyorjon Gaziyev',
  },
  telephone: '+998336450097',
  url: 'https://jonbranding.uz',
  logo: 'https://img2.teletype.in/files/92/3c/923cd394-a437-47e1-86a1-51e1a2a3eb38.png',
  description: APP_DESCRIPTION_UZ,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Toshkent',
    addressCountry: 'UZ'
  }
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
        <noscript>
          <div><img src="https://mc.yandex.ru/watch/97914878" style={{ position:'absolute', left:'-9999px' }} alt="" /></div>
        </noscript>
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

    