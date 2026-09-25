import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { fetchTestimonials } from '@/lib/data/testimonials';
import ReviewsClient from './reviews-client';
import { getPageAlternates } from '@/lib/seo';

export const revalidate = 60; // Revalidate reviews cache every 60 seconds

type Props = {
  params: Promise<{ lang: string }>;
};

const titles = {
  uz: "Mijozlar Fikrlari va Ovozli Sharhlar | Jon.Branding",
  ru: "Отзывы Клиентов и Аудио-записи | Jon.Branding",
  en: "Client Reviews & Voice Feedback | Jon.Branding",
  zh: "客户评价与语音反馈 | Jon.Branding"
};

const descriptions = {
  uz: "Jon Branding brend-agentligi mijozlarining ovozli va video fikrlari: Den Aroma, FIDDA by Sevara, Perfona va boshqa hamkorlarimiz o'z tajribasi haqida.",
  ru: "Голосовые и видеоотзывы клиентов бренд-агентства Jon Branding: Den Aroma, FIDDA by Sevara, Perfona и другие партнёры о своём опыте.",
  en: "Voice and video testimonials from clients of Jon Branding agency: Den Aroma, FIDDA by Sevara, Perfona and other partners share their experience.",
  zh: "Jon Branding品牌代理机构客户的语音和视频评价：Den Aroma、FIDDA by Sevara、Perfona 等合作伙伴分享他们的合作体验。"
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const lang = (['uz', 'ru', 'en', 'zh'].includes(rawLang) ? rawLang : 'uz') as Locale;

  const alternates = getPageAlternates(lang, '/otzivlar');

  return {
    title: titles[lang] || titles.uz,
    description: descriptions[lang] || descriptions.uz,
    alternates,
    openGraph: {
      title: titles[lang] || titles.uz,
      description: descriptions[lang] || descriptions.uz,
      type: 'website',
      url: alternates.canonical,
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang] || titles.uz,
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

  return (
    <ReviewsClient
      testimonials={testimonials}
      lang={lang}
      dictionary={dictionary}
    />
  );
}
