import Script from 'next/script';
import { Hanken_Grotesk, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import '../globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary, Locale } from '@/lib/dictionaries';
import {
  locales,
  defaultLocale,
  getLocalizedAbsoluteUrl,
  getLocaleAlternates,
} from '@/lib/i18n/locale';
import MainLayout from '@/components/layout/main-layout';
import { safeJsonStringify } from '@/lib/security';

const BASE_URL = 'https://www.jonbranding.uz';
const OG_IMAGE_URL = '/images/cms/og-image.jpeg';

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-hanken',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#2c2bf5',
};

const localeUrls = {
  uz: getLocalizedAbsoluteUrl(BASE_URL, 'uz'),
  ru: getLocalizedAbsoluteUrl(BASE_URL, 'ru'),
  en: getLocalizedAbsoluteUrl(BASE_URL, 'en'),
  zh: getLocalizedAbsoluteUrl(BASE_URL, 'zh'),
} satisfies Record<Locale, string>;

const ogLocales = {
  uz: 'uz_UZ',
  ru: 'ru_RU',
  en: 'en_US',
  zh: 'zh_CN',
} satisfies Record<Locale, string>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = locales.includes(lang as Locale) ? (lang as Locale) : defaultLocale;
  const dictionary = await getDictionary(safeLang);
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: dictionary.meta?.title || 'Jon.Branding | Professional Brending Agentligi',
      template: '%s | Jon.Branding',
    },

    description:
      dictionary.meta?.description ||
      'Biznesingiz uchun neyming, logotip va brendbuk dizayni — Jon.Branding.',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    },
    openGraph: {
      type: 'website',
      locale: ogLocales[safeLang],
      url: localeUrls[safeLang],
      siteName: 'Jon.Branding',
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'Jon Branding Agency' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [OG_IMAGE_URL],
    },
    alternates: {
      canonical: localeUrls[safeLang],
      languages: getLocaleAlternates(BASE_URL),
    },
  };
}

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function LocalizedLayout({ children, params }: Props) {
  const { lang: rawLang } = await params;
  const lang = locales.includes(rawLang as Locale) ? (rawLang as Locale) : defaultLocale;
  let dictionary;
  try {
    dictionary = await getDictionary(lang as Locale);
  } catch (e) {
    console.error('Layout dictionary load error:', e);
    // Provide a minimum shape to prevent crash
    dictionary = await getDictionary('uz');
  }

  const tabNotificationMessage =
    lang === 'ru'
      ? '(1) Novoe soobshchenie! | Jon Branding'
      : lang === 'en'
        ? '(1) New message! | Jon Branding'
        : lang === 'zh'
          ? '(1) New message! | Jon Branding'
          : '(1) Yangi xabar! | Jon Branding';

  return (
    <html
      lang={lang}
      className={`${hankenGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: 'html,body{background:#F2EFE6}' }} />
        <link rel="alternate" hrefLang="x-default" href="https://www.jonbranding.uz" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="JonBranding" />
        <Script
          id="json-ld-professional-service"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonStringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Jon.Branding',
              alternateName: 'JonBranding Agency',
              image: 'https://www.jonbranding.uz/icon.svg',
              logo: 'https://www.jonbranding.uz/icon.svg',
              url: 'https://www.jonbranding.uz',
              telephone: '+998336450097',
              priceRange: '$$$',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Tashkent, Uzbekistan',
                addressLocality: 'Tashkent',
                addressRegion: 'Toshkent',
                postalCode: '100000',
                addressCountry: 'UZ',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 41.2995,
                longitude: 69.2401,
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '09:00',
                closes: '20:00',
              },
              sameAs: [
                'https://instagram.com/jonbranding',
                'https://t.me/jonbranding',
                'https://facebook.com/jonbranding',
              ],
              service: [
                {
                  '@type': 'Service',
                  name: 'Neyming (Naming)',
                  description: 'Professional brand naming services.',
                },
                {
                  '@type': 'Service',
                  name: 'Logotip Dizayni (Logo Design)',
                  description: 'Custom logo creation and identity design.',
                },
                {
                  '@type': 'Service',
                  name: 'Brend Strategiyasi (Branding Strategy)',
                  description: 'Comprehensive market analysis and strategy.',
                },
              ],
            }),
          }}
        />
        <Script
          id="json-ld-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonStringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name:
                    lang === 'ru'
                      ? 'Чем хороший брендинг отличается от простого логотипа?'
                      : lang === 'en'
                        ? 'What is the difference between good branding and just a logo?'
                        : 'Yaxshi brending va shunchaki chiroyli logotipning farqi nimada?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      lang === 'ru'
                        ? "Логотип — это визуальный знак. В Jon.Branding мы рассматриваем брендинг как фундамент бизнеса: анализ стратегии, рынка и психологии клиентов. Результат — не просто 'красивый', а приносящий доход бренд."
                        : lang === 'en'
                          ? "A logo is just a visual mark. At Jon.Branding we treat branding as the foundation of your business: market positioning, strategy, and customer psychology. The result is not just 'beautiful' — it generates revenue."
                          : "Shunchaki logotip — bu vizual belgi. Jon.Branding'da biz brendingni biznesingiz poydevori deb bilamiz. Strategiya, bozordagi o'rin va mijozlar ruhiyatini tahlil qilamiz — natijada daromad keltiruvchi brend yaratamiz.",
                  },
                },
                {
                  '@type': 'Question',
                  name:
                    lang === 'ru'
                      ? 'Сколько времени занимает создание бренда?'
                      : lang === 'en'
                        ? 'How long does a branding project take?'
                        : "Loyiha qancha muddatda tayyor bo'ladi?",
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      lang === 'ru'
                        ? 'В среднем 4–8 недель. Это время необходимо для глубокого анализа, создания уникальной концепции и доработки каждой детали. Мы ставим качество на первое место.'
                        : lang === 'en'
                          ? 'On average 4–8 weeks. This time is required for deep analysis, unique concept creation, and perfecting every detail. We prioritise quality.'
                          : "O'rtacha 4 haftadan 8 haftagacha. Bu vaqt chuqur tahlil, noyob konsepsiya yaratish va har bir detalni ideal holatga keltirish uchun zarur.",
                  },
                },
                {
                  '@type': 'Question',
                  name:
                    lang === 'ru'
                      ? 'Почему ваши услуги дороже среднего?'
                      : lang === 'en'
                        ? 'Why are your services priced above average?'
                        : "Nega xizmatlaringiz narxi bozor o'rtachasidan yuqori?",
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      lang === 'ru'
                        ? 'Мы продаём не расходы, а инвестиции. Наши решения направлены на рост продаж и снижение маркетинговых затрат. Работа с Jon.Branding — это система, которая окупается многократно.'
                        : lang === 'en'
                          ? 'We sell investment, not expense. Our solutions are designed to increase sales and reduce marketing costs. Working with Jon.Branding is a system that pays back many times over.'
                          : 'Biz xarajatni emas, investitsiyani sotamiz. Bizning yechimlarimiz savdoni oshirishga va marketing xarajatlarini kamaytirishga qaratilgan — bir necha barobar foyda keltiradigan tizim.',
                  },
                },
                {
                  '@type': 'Question',
                  name:
                    lang === 'ru'
                      ? 'Есть ли гарантия результата?'
                      : lang === 'en'
                        ? 'Is there a result guarantee?'
                        : 'Natijaga kafolat bormi?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      lang === 'ru'
                        ? 'Да. Если начальные концепции не соответствуют вашим требованиям по брифу, мы доработаем проект или выполним согласованные условия возврата.'
                        : lang === 'en'
                          ? 'Yes. If the initial concepts do not match your brief requirements, we will revise the project or fulfil the agreed refund terms.'
                          : 'Albatta. Agar dastlabki konsepsiyalar sizning talablaringizga mos kelmasa, biz loyihani qayta ishlaymiz yoki kelishilgan qaytarish shartlarini bajaramiz.',
                  },
                },
                {
                  '@type': 'Question',
                  name:
                    lang === 'ru'
                      ? 'Можно ли заказать только логотип?'
                      : lang === 'en'
                        ? 'Can I order just a logo?'
                        : "Faqatgina logotip buyurtma qilsa bo'ladimi?",
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      lang === 'ru'
                        ? "Мы рекомендуем создавать полную систему айдентики, так как только логотип не обеспечивает целостность бренда. Однако для небольших проектов у нас есть пакеты 'Логотип + Минимальный фирменный стиль'."
                        : lang === 'en'
                          ? "We recommend building a full identity system, as a logo alone cannot ensure brand integrity. However, for smaller projects we have 'Logo + Minimal Corporate Style' packages."
                          : "Biz butun aydentika tizimini yaratishni tavsiya qilamiz, chunki faqat logotip brend yaxlitligini ta'minlamaydi. Biroq, kichik loyihalar uchun 'Logo + Minimal firma uslubi' paketlari mavjud.",
                  },
                },
              ],
            }),
          }}
        />
        <Script
          id="json-ld-aggregate-rating"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonStringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Jon.Branding',
              url: 'https://www.jonbranding.uz',
              telephone: '+998336450097',
              priceRange: '$$$',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Tashkent',
                addressLocality: 'Tashkent',
                addressCountry: 'UZ',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '47',
                bestRating: '5',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${hankenGrotesk.variable} font-body bg-brand-paper antialiased`}
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-link">
          {lang === 'uz' ? "Asosiy kontentga o'tish" : 'Skip to main content'}
        </a>
        <Script id="analytics-delayed-load" strategy="lazyOnload">
          {`
            (function() {
              const loadAnalytics = () => {
                if (window.analyticsLoaded) return;
                window.analyticsLoaded = true;

                // 1. Google Tag Manager
                const gtm = document.createElement('script');
                gtm.async = true;
                gtm.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5GRQBW84';
                document.head.appendChild(gtm);

                // 2. Google Analytics
                const gaId = '${process.env.NEXT_PUBLIC_GA_ID || 'G-BTSGJQLMMV'}';
                const ga = document.createElement('script');
                ga.async = true;
                ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
                document.head.appendChild(ga);
                ga.onload = () => {
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', gaId);
                  gtag('config', 'AW-17674872079');
                };

                // 3. Microsoft Clarity
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "w7knsud9mg");

                // 4. Hotjar
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:6527829,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

                // 5. FB Pixel
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

              window.addEventListener('cookie-consent-accepted', loadAnalytics);
              if (document.cookie.includes('cookie_consent_accepted=true')) {
                loadAnalytics();
              }
            })();
          `}
        </Script>

        <MainLayout
          leadMagnetDictionary={(dictionary as any).leadMagnetPopup}
          headerDictionary={dictionary.header}
          lang={lang}
          stickyCtaLabel={dictionary.header?.free_consultation || 'Contact us'}
          tabNotificationMessage={tabNotificationMessage}
        >
          <Header lang={lang} dictionary={dictionary.header} />

          <div id="main-content" className="flex-grow">
            {children}
          </div>
          <Footer lang={lang} dictionary={dictionary.footer} />
          {/* Yandex.Metrika counter */}
          <Script id="yandex-metrika" strategy="lazyOnload">
            {`
            if (document.cookie.includes('cookie_consent_accepted=true')) {
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

            ym(91628105, 'init', {webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
            }
          `}
          </Script>
          <noscript>
            <div>
              <img
                src="https://mc.yandex.ru/watch/91628105"
                style={{ position: 'absolute', left: '-9999px' }}
                alt=""
              />
            </div>
          </noscript>
        </MainLayout>
      </body>
    </html>
  );
}
