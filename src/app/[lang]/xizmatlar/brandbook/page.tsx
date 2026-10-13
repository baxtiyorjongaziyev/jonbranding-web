import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import BrandbookClient from './brandbook-client';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';
import { pageTitle } from '@/lib/seo';
import ServiceLanding from '@/components/service-landing/service-landing';
import { BRANDBOOK_PAGE } from '@/lib/service-pages/brandbook';
import { fetchServiceCases } from '@/lib/service-pages/cases';
import { videosFrom } from '@/lib/service-pages/quotes';

// Keyslar Sanity'dan — yangi loyiha soat ichida chiqadi.
export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.brandbookPage?.metadata;

  return {
    title: pageTitle(metadata?.title || "Brendbuk Yaratish | Professional Brend Qo'llanmasi"),
    description: metadata?.description || "Brendingiz izchilligini ta'minlovchi professional brendbuklar yaratamiz.",
    keywords: metadata?.keywords || "brandbook, brendbuk, gaydlayn, brend qo'llanmasi, aydentika",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const cases = lang === 'uz' ? await fetchServiceCases(BRANDBOOK_PAGE.caseCategories) : [];

  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/brandbook"
        name={dictionary.header.brandbook}
        description={dictionary.brandbookPage.metadata.description}
      />
      {/* Uzbek-first: batafsil sahifa avval o'zbekchada. */}
      {lang === 'uz' ? (
        <ServiceLanding content={BRANDBOOK_PAGE} cases={cases} videos={videosFrom(BRANDBOOK_PAGE.videoCompanies ?? [])} />
      ) : (
        <BrandbookClient lang={lang as Locale} translations={dictionary.brandbookPage} />
      )}
    </>
  );
}
