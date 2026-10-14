import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import BrandbookClient from './brandbook-client';
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
  const metadata = dictionary.brandbookPage?.metadata;
  const facts = getServiceFacts(lang, 'brandbook');

  return {
    title: pageTitle(fillServiceFacts(metadata?.title || "Brendbuk Yaratish | Professional Brend Qo'llanmasi", facts)),
    description: fillServiceFacts(metadata?.description || "Brendingiz izchilligini ta'minlovchi professional brendbuklar yaratamiz.", facts),
    keywords: metadata?.keywords || "brandbook, brendbuk, gaydlayn, brend qo'llanmasi, aydentika",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const facts = getServiceFacts(lang, 'brandbook');
  
  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/brandbook"
        name={dictionary.header.brandbook}
        description={fillServiceFacts(dictionary.brandbookPage.metadata.description, facts)}
      />
      <BrandbookClient
        lang={lang as Locale}
        translations={dictionary.brandbookPage}
        factsSlot={<ServiceFactsFaq id="brandbook" content={dictionary.serviceFacts.brandbook} facts={facts} />}
      />
    </>
  );
}
