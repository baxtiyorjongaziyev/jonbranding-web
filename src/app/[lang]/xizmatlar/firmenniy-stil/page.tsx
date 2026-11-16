import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import CorporateClient from './corporate-client';
import ServiceLanding from '@/components/service-landing/service-landing';
import { VISUAL_IDENTITY_PAGE } from '@/lib/service-pages/visual-identity';
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
  const metadata = dictionary.corporateStylePage?.metadata;
  const currency = dictionary.serviceFacts?.currency ?? '';
  const fill = (v: string) => fillServiceTokens(v, lang, 'visual-identity', currency);

  return {
    title: pageTitle(metadata?.title ? fill(metadata.title) : "Firma Uslubi Yaratish | Korporativ Aydentika"),
    description: metadata?.description ? fill(metadata.description) : "Brendingizni tanitadigan yaxlit korporativ uslub va vizual tizim yaratamiz.",
    keywords: metadata?.keywords ? fill(metadata.keywords) : "firma uslubi, korporativ aydentika, brend uslubi, korporativ dizayn",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const [dictionary, works] = await Promise.all([
    getDictionary(lang as Locale),
    lang === 'uz' ? fetchServiceWorks(VISUAL_IDENTITY_PAGE.serviceKey, lang) : Promise.resolve([]),
  ]);

  const fillPage = (v: string) => fillServiceTokens(v, lang, 'visual-identity', dictionary.serviceFacts?.currency ?? '');
  const facts = dictionary.corporateStylePage.facts;
  const labels = dictionary.serviceFacts;
  const isUz = lang === 'uz';
  const localizedFaqs = !isUz && facts && labels ? buildServiceFaqs(lang as Locale, 'visual-identity', facts, labels) : undefined;

  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/firmenniy-stil"
        name={dictionary.header.corporate_style}
        description={fillPage(dictionary.corporateStylePage.metadata.description)}
        faqs={isUz ? VISUAL_IDENTITY_PAGE.faqs : localizedFaqs}
        faqLang={lang as Locale}
      />
      {/* Uzbek-first: zamonaviy ServiceLanding sahifasi */}
      {isUz ? (
        <ServiceLanding content={VISUAL_IDENTITY_PAGE} works={works} />
      ) : (
        <>
          <CorporateClient lang={lang as Locale} translations={dictionary.corporateStylePage} />
          {facts && labels && (
            <LocalizedServiceFacts lang={lang as Locale} serviceId="visual-identity" copy={facts} labels={labels} />
          )}
        </>
      )}
    </>
  );
}
