
import HomeComponent from '@/components/home-component';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Metadata } from 'next';
import Script from 'next/script';
import { fetchComparisons } from '@/lib/data/comparisons';
import { fetchTestimonials } from '@/lib/data/testimonials';
import { fetchPortfolioList } from '@/lib/data/portfolio';
import { safeJsonStringify } from '@/lib/security';
import {
  getLocalizedAbsoluteUrl,
  getLocaleAlternates,
  locales,
} from '@/lib/i18n/locale';
import { ORGANIZATION_ID, SITE_URL } from '@/lib/seo';

export const revalidate = 60;

type Props = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return ['uz', 'ru', 'en', 'zh'].map((lang) => ({ lang }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const lang = (locales.includes(rawLang as Locale) ? rawLang : 'uz') as Locale;
  const dictionary = await getDictionary(lang);
  const seo = dictionary.homeSeo;
  const canonical = getLocalizedAbsoluteUrl(SITE_URL, lang);

  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical,
      languages: getLocaleAlternates(SITE_URL),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'website',
      url: canonical,
      locale: lang === 'uz' ? 'uz_UZ' : lang === 'ru' ? 'ru_RU' : lang === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Jon.Branding',
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630, alt: 'Jon Branding Agency' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: ['/images/cms/og-image.jpeg'],
    },
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;

  let dictionary;
  try {
    dictionary = await getDictionary(lang as Locale);
  } catch (e) {
    console.error("Page dictionary load error, falling back to 'uz':", e);
    dictionary = await getDictionary('uz');
  }

  const [comparisons, testimonials, portfolioProjects] = await Promise.all([
    fetchComparisons(),
    fetchTestimonials(lang),
    fetchPortfolioList(lang),
  ]);

  // HomeComponent klient komponent: unga berilgan hamma narsa HTML ichidagi RSC
  // ma'lumotiga yoziladi. Butun lug'at (ru ~95 KB) o'rniga faqat bosh sahifa
  // ishlatadigan bo'limlar beriladi.
  const homeDictionary = {
    atelier: dictionary.atelier,
    beforeAfter: dictionary.beforeAfter,
    processVideo: dictionary.processVideo,
    founder: dictionary.founder,
    answerHub: dictionary.answerHub,
    contactModal: dictionary.contactModal,
  };

  const safeLang = locales.includes(lang as Locale) ? (lang as Locale) : 'uz';
  const canonical = getLocalizedAbsoluteUrl(SITE_URL, safeLang);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonical}#branding-answers`,
    mainEntity: dictionary.answerHub.items.map((item: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: dictionary.homeSeo.title,
    description: dictionary.homeSeo.description,
    inLanguage: safeLang,
    about: { '@id': ORGANIZATION_ID },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: { '@id': `${canonical}#branding-answers` },
  };

  return (
    <>
      <Script
        id="json-ld-home-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(webPageJsonLd) }}
      />
      <Script
        id="json-ld-home-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(faqJsonLd) }}
      />
      <HomeComponent
        lang={safeLang}
        dictionary={homeDictionary}
        comparisons={comparisons}
        testimonials={testimonials}
        portfolioProjects={portfolioProjects}
      />
    </>
  );
}
