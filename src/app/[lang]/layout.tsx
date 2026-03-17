import type { Metadata } from 'next';
import Script from 'next/script';
import '../globals.css';
import type { FC, ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { locales, defaultLocale } from '@/lib/i18n/locale';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800']
});

const BASE_URL = 'https://jonbranding.uz';
const OG_IMAGE_URL = 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2';

export async function generateMetadata(props: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const currentLang = locales.includes(rawLang) ? rawLang : defaultLocale;
  
  const titles = {
    uz: "Jon.Branding | Toshkentdagi Professional Brending Agentligi: Logo va Neyming",
    ru: "Jon.Branding | Брендинговое Агентство в Ташкенте: Дизайн и Стратегия",
    en: "Jon.Branding | Premier Branding Agency in Uzbekistan: Logo & Naming",
    zh: "Jon.Branding | 乌兹别克斯坦领先的品牌代理机构"
  };

  const descriptions = {
    uz: "Biznesingiz uchun natijali brend strategiyasi, neyming va logotip dizayni. Toshkentda Ma'no, Mountain, Abba va Minim darajasidagi premium xizmatlar.",
    ru: "Стратегический брендинг, нейминг и дизайн логотипов в Ташкенте. Премиальное качество от экспертов с 9-летним опытом.",
    en: "Strategic branding, naming, and logo design in Tashkent. Elevate your business with results-driven identity solutions.",
    zh: "在塔什干提供战略品牌、命名和标志设计。通过以结果为导向的身份解决方案提升您的业务。"
  };

  return {
    title: titles[currentLang],
    description: descriptions[currentLang],
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

const RootLayout: FC<Readonly<{ children: ReactNode, params: Promise<{ lang: Locale }> }>> = async ({ children, params }) => {
  const { lang: rawLang } = await params;
  const lang = locales.includes(rawLang) ? rawLang : defaultLocale;
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning className={poppins.variable}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#050583" />
        <link rel="preconnect" href="https://img1.teletype.in" />
        <link rel="preconnect" href="https://img2.teletype.in" />
        <link rel="preconnect" href="https://images.unsplash.com" />
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
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-B3ZSKB40XY" strategy="lazyOnload"></Script>
        <Script
          id="gtag-init"
          strategy="lazyOnload"
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
      </head>
      <body className={`font-body bg-white antialiased`} suppressHydrationWarning>
        <MainLayout>
          <Header lang={lang} dictionary={dictionary.header} />
          {children}
          <Footer lang={lang} dictionary={dictionary.footer} />
        </MainLayout>
      </body>
    </html>
  );
}

export default RootLayout;