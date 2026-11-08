import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import CorporateClient from './corporate-client';
import ServiceLanding from '@/components/service-landing/service-landing';
import { VISUAL_IDENTITY_PAGE } from '@/lib/service-pages/visual-identity';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';
import { fetchServiceWorks } from '@/lib/service-pages/works';
import { pageTitle } from '@/lib/seo';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.corporateStylePage?.metadata;

  return {
    title: pageTitle(metadata?.title || "Firma Uslubi Yaratish | Korporativ Aydentika"),
    description: metadata?.description || "Brendingizni tanitadigan yaxlit korporativ uslub va vizual tizim yaratamiz.",
    keywords: metadata?.keywords || "firma uslubi, korporativ aydentika, brend uslubi, korporativ dizayn",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const [dictionary, works] = await Promise.all([
    getDictionary(lang as Locale),
    lang === 'uz' ? fetchServiceWorks(VISUAL_IDENTITY_PAGE.serviceKey, lang) : Promise.resolve([]),
  ]);

  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/firmenniy-stil"
        name={dictionary.header.corporate_style}
        description={dictionary.corporateStylePage.metadata.description}
        faqs={lang === 'uz' ? VISUAL_IDENTITY_PAGE.faqs : undefined}
      />
      {/* Uzbek-first: zamonaviy ServiceLanding sahifasi */}
      {lang === 'uz' ? (
        <ServiceLanding content={VISUAL_IDENTITY_PAGE} works={works} />
      ) : (
        <CorporateClient lang={lang as Locale} translations={dictionary.corporateStylePage} />
      )}
    </>
  );
}
