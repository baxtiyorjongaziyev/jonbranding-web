import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import BrandbookClient from './brandbook-client';
import ServiceLanding from '@/components/service-landing/service-landing';
import { BRANDBOOK_PAGE } from '@/lib/service-pages/brandbook';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';
import { fetchServiceWorks } from '@/lib/service-pages/works';
import { pageTitle } from '@/lib/seo';

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
  const [dictionary, works] = await Promise.all([
    getDictionary(lang as Locale),
    lang === 'uz' ? fetchServiceWorks(BRANDBOOK_PAGE.serviceKey, lang) : Promise.resolve([]),
  ]);

  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/brandbook"
        name={dictionary.header.brandbook}
        description={dictionary.brandbookPage.metadata.description}
        faqs={lang === 'uz' ? BRANDBOOK_PAGE.faqs : undefined}
      />
      {/* Uzbek-first: zamonaviy ServiceLanding sahifasi */}
      {lang === 'uz' ? (
        <ServiceLanding content={BRANDBOOK_PAGE} works={works} />
      ) : (
        <BrandbookClient lang={lang as Locale} translations={dictionary.brandbookPage} />
      )}
    </>
  );
}
