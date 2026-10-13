import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import PackagingClient from './packaging-client';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';
import { pageTitle } from '@/lib/seo';
import ServiceLanding from '@/components/service-landing/service-landing';
import { PACKAGING_PAGE } from '@/lib/service-pages/packaging';
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
  const metadata = dictionary.packagingPage?.metadata;

  return {
    title: pageTitle(metadata?.title || "Qadoq Dizayni | Professional Mahsulot Dizayni"),
    description: metadata?.description || "Mahsulotingizni javonda ajratib turadigan professional qadoq dizaynlari yaratamiz.",
    keywords: metadata?.keywords || "qadoq dizayn, qadoqlash, mahsulot dizayni, brending, packaging design",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const cases = lang === 'uz' ? await fetchServiceCases(PACKAGING_PAGE.caseCategories) : [];

  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/qadoq-dizayni"
        name={dictionary.header.packaging_design}
        description={dictionary.packagingPage.metadata.description}
      />
      {/* Uzbek-first: batafsil sahifa avval o'zbekchada. */}
      {lang === 'uz' ? (
        <ServiceLanding content={PACKAGING_PAGE} cases={cases} videos={videosFrom(PACKAGING_PAGE.videoCompanies ?? [])} />
      ) : (
        <PackagingClient lang={lang as Locale} translations={dictionary.packagingPage} />
      )}
    </>
  );
}
