
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
    uz: "Jon.Branding | Toshkentdagi Professional Brending Agentligi",
    ru: "Jon.Branding | Брендинговое Агентство в Ташкенте: Дизайн и Стратегия",
    en: "Jon.Branding | Premier Branding Agency in Uzbekistan",
    zh: "Jon.Branding | 乌兹别克斯坦领先的品牌代理机构"
  };

  const descriptions = {
    uz: "Biznesingiz uchun natijali brend strategiyasi, neyming va logotip dizayni. Toshkentda Ma'no, Mountain, Abba va Minim darajasidagi premium xizmatlar.",
    ru: "Стратегический брендинг, нейминг и дизайн логотипов в Ташкенте. Премиальное качество от экспертов с 9-летним опытом.",
    en: "Strategic branding, naming, and logo design in Tashkent. Elevate your business with results-driven identity solutions.",
    zh: "在塔什干提供战略品牌、命名和标志设计。通过以结果为导向的身份解决方案提升您的业务。"
  };

  const keywords = {
    uz: "branding, ma'no branding, brending uz, logo dizayn, neyming, naming, qadoq dizayn, brandbook, mountain branding, abba marketing, minim, redfox",
    ru: "брендинг, логотип, нейминг, дизайн упаковки, брендбук, брендинговое агентство ташкент, abba, mountain, ma'no",
    en: "branding agency uzbekistan, logo design tashkent, naming services, brandbook development, mountain branding, abba marketing",
    zh: "品牌代理, 标志设计, 命名服务, 包装设计, 品牌手册"
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
  description: 'Jon.Branding is a premier strategic branding consultancy in Uzbekistan specializing in business-centric identity, naming, and brand strategy.',
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Google Consent Mode v2 */}
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

        {/* Google Analytics & Ads */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-B3ZSKB40XY" strategy="lazyOnload"></Script>
        <Script
          id="gtag-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B3ZSKB40XY');
              gtag('config', 'AW-17674872079');
            `,
          }}
        />
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
