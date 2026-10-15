import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import LogoClient from './logo-client';
import ServiceLanding from '@/components/service-landing/service-landing';
import { LOGO_PAGE } from '@/lib/service-pages/logo';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';
import { pageTitle } from '@/lib/seo';
import ServiceFactsFaq from '@/components/service-landing/service-facts-faq';
import { fillServiceFacts, getServiceFacts } from '@/lib/service-facts';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.logoDesignPage?.metadata;
  const facts = getServiceFacts(lang, 'logo');

  return {
    title: pageTitle(fillServiceFacts(metadata?.title || "Logotip Dizayni | Professional Logo Yaratish", facts)),
    description: fillServiceFacts(metadata?.description || "Biznesingiz uchun unikal va natijador logotiplar yaratamiz.", facts),
    keywords: metadata?.keywords || "logo dizayn, logotip yaratish, brending, aydentika",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const facts = getServiceFacts(lang, 'logo');
  
  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/logo-dizayni"
        name={dictionary.header.logo_design}
        description={fillServiceFacts(dictionary.logoDesignPage.metadata.description, facts)}
      />
      {/* Uzbek-first: batafsil sahifa avval o'zbekchada. */}
      {lang === 'uz' ? (
        <ServiceLanding content={LOGO_PAGE} />
      ) : (
        <LogoClient
          lang={lang as Locale}
          translations={dictionary.logoDesignPage}
          factsSlot={<ServiceFactsFaq id="logo" content={dictionary.serviceFacts.logo} facts={facts} />}
        />
      )}
    </>
  );
}
