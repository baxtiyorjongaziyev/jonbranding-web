import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import LogoClient from './logo-client';
import ServiceLanding from '@/components/service-landing/service-landing';
import { LOGO_PAGE } from '@/lib/service-pages/logo';
import { fetchServiceCases } from '@/lib/service-pages/cases';
import { videosFrom } from '@/lib/service-pages/quotes';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';
import { pageTitle } from '@/lib/seo';

// Keyslar Sanity'dan — yangi loyiha soat ichida chiqadi.
export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.logoDesignPage?.metadata;

  return {
    title: pageTitle(metadata?.title || "Logotip Dizayni | Professional Logo Yaratish"),
    description: metadata?.description || "Biznesingiz uchun unikal va natijador logotiplar yaratamiz.",
    keywords: metadata?.keywords || "logo dizayn, logotip yaratish, brending, aydentika",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const cases = lang === 'uz' ? await fetchServiceCases(LOGO_PAGE.caseCategories) : [];

  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/logo-dizayni"
        name={dictionary.header.logo_design}
        description={dictionary.logoDesignPage.metadata.description}
      />
      {/* Uzbek-first: batafsil sahifa avval o'zbekchada. */}
      {lang === 'uz' ? (
        <ServiceLanding content={LOGO_PAGE} cases={cases} videos={videosFrom(LOGO_PAGE.videoCompanies ?? [])} />
      ) : (
        <LogoClient lang={lang as Locale} translations={dictionary.logoDesignPage} />
      )}
    </>
  );
}
