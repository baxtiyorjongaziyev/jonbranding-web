import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import NamingClient from './naming-client';
import ServiceLanding from '@/components/service-landing/service-landing';
import { NAMING_PAGE } from '@/lib/service-pages/naming';
import { fetchServiceCases } from '@/lib/service-pages/cases';
import { videosFrom } from '@/lib/service-pages/quotes';
import { pageTitle } from '@/lib/seo';

// Keyslar Sanity'dan — yangi loyiha soat ichida chiqadi.
export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.namingPage?.metadata;

  return {
    title: pageTitle(metadata?.title || "Neyming Xizmati"),
    description: metadata?.description || "Professional brend neyming xizmatlari.",
    keywords: metadata?.keywords || "neyming, naming, brend nomi",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  // Uzbek-first: batafsil sahifa avval o'zbekchada; tarjimalar tayyor bo'lguncha
  // boshqa tillar eski sahifani ko'rsatadi.
  if (lang === 'uz') {
    const cases = await fetchServiceCases(NAMING_PAGE.caseCategories);
    return <ServiceLanding content={NAMING_PAGE} cases={cases} videos={videosFrom(NAMING_PAGE.videoCompanies ?? [])} />;
  }

  const dictionary = await getDictionary(lang as Locale);

  return <NamingClient lang={lang as Locale} translations={dictionary.namingPage} />;
}