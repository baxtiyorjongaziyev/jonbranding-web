import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import BrandbookClient from './brandbook-client';
import ServiceLanding from '@/components/service-landing/service-landing';
import { BRANDBOOK_PAGE } from '@/lib/service-pages/brandbook';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';
import { fetchServiceWorks } from '@/lib/service-pages/works';
import { pageTitle } from '@/lib/seo';
import { fillServiceTokens } from '@/lib/service-pages/localized-facts';
import LocalizedServiceFacts, { buildServiceFaqs } from '@/components/service-landing/localized-service-facts';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.brandbookPage?.metadata;
  const currency = dictionary.serviceFacts?.currency ?? '';
  const fill = (v: string) => fillServiceTokens(v, lang, 'brandbook', currency);

  return {
    title: pageTitle(metadata?.title ? fill(metadata.title) : "Brendbuk ishlab chiqish | Brend qo'llanmasi"),
    description: metadata?.description ? fill(metadata.description) : "Brend izchilligini ta'minlovchi brendbuk: logotip qoidalari, ranglar, shriftlar va maketlar.",
    keywords: metadata?.keywords ? fill(metadata.keywords) : "brandbook, brendbuk, gaydlayn, brend qo'llanmasi, aydentika",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const [dictionary, works] = await Promise.all([
    getDictionary(lang as Locale),
    lang === 'uz' ? fetchServiceWorks(BRANDBOOK_PAGE.serviceKey, lang) : Promise.resolve([]),
  ]);

  const fill = (v: string) => fillServiceTokens(v, lang, 'brandbook', dictionary.serviceFacts?.currency ?? '');
  const facts = dictionary.brandbookPage.facts;
  const labels = dictionary.serviceFacts;
  const isUz = lang === 'uz';
  const localizedFaqs = !isUz && facts && labels ? buildServiceFaqs(lang as Locale, 'brandbook', facts, labels) : undefined;

  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/brandbook"
        name={dictionary.header.brandbook}
        description={fill(dictionary.brandbookPage.metadata.description)}
        faqs={isUz ? BRANDBOOK_PAGE.faqs : localizedFaqs}
        faqLang={lang as Locale}
      />
      {/* Uzbek-first: batafsil sahifa avval o'zbekchada. */}
      {isUz ? (
        <ServiceLanding content={BRANDBOOK_PAGE} works={works} />
      ) : (
        <>
          <BrandbookClient lang={lang as Locale} translations={dictionary.brandbookPage} />
          {facts && labels && (
            <LocalizedServiceFacts lang={lang as Locale} serviceId="brandbook" copy={facts} labels={labels} />
          )}
        </>
      )}
    </>
  );
}
