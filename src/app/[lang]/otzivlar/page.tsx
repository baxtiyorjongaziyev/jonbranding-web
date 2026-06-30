import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { fetchTestimonials } from '@/lib/data/testimonials';
import ReviewsClient from './reviews-client';

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
  uz: "Jon Branding brend-agentligi mijozlarining ovozli va video fikrlari. Qumri Coffee, Oltin Bulut va boshqa hamkorlarimiz erishgan real natijalar.",
  ru: "Голосовые и видеоотзывы клиентов бренд-агентства Jon Branding. Реальные результаты Qumri Coffee, Oltin Bulut и других партнеров.",
  en: "Voice and video testimonials from clients of Jon Branding agency. Real results achieved by Qumri Coffee, Oltin Bulut, and other partners.",
  zh: "Jon Branding品牌代理机构客户的语音和视频评价。Qumri Coffee、Oltin Bulut及其他合作伙伴取得的真实成效。"
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const lang = (['uz', 'ru', 'en', 'zh'].includes(rawLang) ? rawLang : 'uz') as Locale;

  return {
    title: titles[lang] || titles.uz,
    description: descriptions[lang] || descriptions.uz,
    openGraph: {
      title: titles[lang] || titles.uz,
      description: descriptions[lang] || descriptions.uz,
      type: 'website',
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
