import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import PackagingClient from './packaging-client';
import ServiceLanding from '@/components/service-landing/service-landing';
import { PACKAGING_PAGE } from '@/lib/service-pages/packaging';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';
import { fetchServiceWorks } from '@/lib/service-pages/works';
import { pageTitle } from '@/lib/seo';
import { fillServiceTokens } from '@/lib/service-pages/localized-facts';
import LocalizedServiceFacts, { buildServiceFaqs } from '@/components/service-landing/localized-service-facts';

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.packagingPage?.metadata;
  const currency = dictionary.serviceFacts?.currency ?? '';
  const fill = (v: string) => fillServiceTokens(v, lang, 'packaging', currency);

  return {
    title: pageTitle(metadata?.title ? fill(metadata.title) : "Qadoq Dizayni | Professional Mahsulot Dizayni"),
    description: metadata?.description ? fill(metadata.description) : "Mahsulotingizni javonda ajratib turadigan professional qadoq dizaynlari yaratamiz.",
    keywords: metadata?.keywords ? fill(metadata.keywords) : "qadoq dizayn, qadoqlash, mahsulot dizayni, brending, packaging design",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const [dictionary, works] = await Promise.all([
    getDictionary(lang as Locale),
    lang === 'uz' ? fetchServiceWorks(PACKAGING_PAGE.serviceKey, lang) : Promise.resolve([]),
  ]);

  const fillPage = (v: string) => fillServiceTokens(v, lang, 'packaging', dictionary.serviceFacts?.currency ?? '');
  const facts = dictionary.packagingPage.facts;
  const labels = dictionary.serviceFacts;
  const isUz = lang === 'uz';
  const localizedFaqs = !isUz && facts && labels ? buildServiceFaqs(lang as Locale, 'packaging', facts, labels) : undefined;

  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/qadoq-dizayni"
        name={dictionary.header.packaging_design}
        description={fillPage(dictionary.packagingPage.metadata.description)}
        faqs={isUz ? PACKAGING_PAGE.faqs : localizedFaqs}
        faqLang={lang as Locale}
      />
      {/* Uzbek-first: zamonaviy ServiceLanding sahifasi */}
      {isUz ? (
        <ServiceLanding content={PACKAGING_PAGE} works={works} />
      ) : (
        <>
          <PackagingClient lang={lang as Locale} translations={dictionary.packagingPage} />
          {facts && labels && (
            <LocalizedServiceFacts lang={lang as Locale} serviceId="packaging" copy={facts} labels={labels} />
          )}
        </>
      )}
    </>
  );
}
