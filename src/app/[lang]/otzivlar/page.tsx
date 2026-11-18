import Script from 'next/script';
import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { fetchTestimonials } from '@/lib/data/testimonials';
import ReviewsClient from './reviews-client';
import { getLocalizedAbsoluteUrl } from '@/lib/i18n/locale';
import { ORGANIZATION_ID, SITE_URL, getPageAlternates, pageTitle } from '@/lib/seo';
import { safeJsonStringify } from '@/lib/security';

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

const titles = {
  uz: "Mijozlar Fikrlari va Ovozli Sharhlar",
  ru: "Отзывы Клиентов и Аудио-записи",
  en: "Client Reviews & Voice Feedback",
  zh: "客户评价与语音反馈",
};

const descriptions = {
  uz: "Jon Branding brend-agentligi mijozlarining ovozli va video fikrlari: Den Aroma, FIDDA by Sevara, Perfona va boshqa hamkorlarimiz o'z tajribasi haqida.",
  ru: "Голосовые и видеоотзывы клиентов бренд-агентства Jon Branding: Den Aroma, FIDDA by Sevara, Perfona и другие партнёры о своём опыте.",
  en: "Voice and video testimonials from clients of Jon Branding agency: Den Aroma, FIDDA by Sevara, Perfona and other partners share their experience.",
  zh: "Jon Branding品牌代理机构客户的语音和视频评价：Den Aroma、FIDDA by Sevara、Perfona 等合作伙伴分享他们的合作体验。",
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const lang = (['uz', 'ru', 'en', 'zh'].includes(rawLang) ? rawLang : 'uz') as Locale;

  const alternates = getPageAlternates(lang, '/otzivlar');
  const rawTitle = titles[lang] || titles.uz;

  return {
    title: pageTitle(rawTitle),
    description: descriptions[lang] || descriptions.uz,
    alternates,
    openGraph: {
      title: `${rawTitle} | Jon.Branding`,
      description: descriptions[lang] || descriptions.uz,
      type: 'website',
      url: alternates.canonical,
      siteName: 'Jon.Branding',
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${rawTitle} | Jon.Branding`,
      description: descriptions[lang] || descriptions.uz,
      images: ['/images/cms/og-image.jpeg'],
    },
  };
}

export default async function ReviewsPage(props: Props) {
  const { lang: rawLang } = await props.params;
  const lang = (['uz', 'ru', 'en', 'zh'].includes(rawLang) ? rawLang : 'uz') as Locale;

  let dictionary;
  try {
    dictionary = await getDictionary(lang);
  } catch (e) {
    console.error("Reviews dictionary load error, falling back to 'uz':", e);
    dictionary = await getDictionary('uz');
  }

  // Fetch testimonials from Sanity (with fallback inside fetchTestimonials)
  const testimonials = await fetchTestimonials(lang);
  const url = getLocalizedAbsoluteUrl(SITE_URL, lang, '/otzivlar');
  const homeLabel = lang === 'ru' ? 'Главная' : lang === 'en' ? 'Home' : lang === 'zh' ? '首页' : 'Bosh sahifa';
  const reviewsLabel = lang === 'ru' ? 'Отзывы' : lang === 'en' ? 'Testimonials' : lang === 'zh' ? '客户评价' : 'Mijozlar fikrlari';
  const reviewsSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${url}#reviews`,
      url,
      name: titles[lang] || titles.uz,
      description: descriptions[lang] || descriptions.uz,
      inLanguage: lang,
      about: { '@id': ORGANIZATION_ID },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeLabel, item: getLocalizedAbsoluteUrl(SITE_URL, lang) },
        { '@type': 'ListItem', position: 2, name: reviewsLabel, item: url },
      ],
    },
  ];

  return (
    <>
      <Script
        id="json-ld-otzivlar"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(reviewsSchema) }}
      />
      <ReviewsClient
        testimonials={testimonials}
        lang={lang}
        dictionary={dictionary}
      />
    </>
  );
}
