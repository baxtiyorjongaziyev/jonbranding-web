import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import NamingClient from './naming-client';
import ServiceLanding from '@/components/service-landing/service-landing';
import { NAMING_PAGE } from '@/lib/service-pages/naming';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';
import { fetchServiceWorks } from '@/lib/service-pages/works';
import { pageTitle } from '@/lib/seo';

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
    const works = await fetchServiceWorks(NAMING_PAGE.serviceKey, lang);
    return (
      <>
        <ServiceJsonLd
          lang="uz"
          path="/xizmatlar/neyming"
          name="Neyming — brend nomini yaratish"
          description={NAMING_PAGE.hero.lead}
          faqs={NAMING_PAGE.faqs}
        />
        <ServiceLanding content={NAMING_PAGE} works={works} />
      </>
    );
  }

  const dictionary = await getDictionary(lang as Locale);

  return <NamingClient lang={lang as Locale} translations={dictionary.namingPage} />;
}