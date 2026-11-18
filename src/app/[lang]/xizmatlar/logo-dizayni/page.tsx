import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import LogoClient from './logo-client';
import ServiceLanding from '@/components/service-landing/service-landing';
import { LOGO_PAGE } from '@/lib/service-pages/logo';
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
  const metadata = dictionary.logoDesignPage?.metadata;
  const currency = dictionary.serviceFacts?.currency ?? '';
  const fill = (v: string) => fillServiceTokens(v, lang, 'logo', currency);

  return {
    title: pageTitle(metadata?.title ? fill(metadata.title) : 'Logotip dizayni | Toshkentda logotip buyurtma qilish'),
    description: metadata?.description ? fill(metadata.description) : "Biznesingiz uchun strategik logotip: 3 ta konsepsiya, barcha fayl formatlari va qo'llash qoidalari.",
    keywords: metadata?.keywords ? fill(metadata.keywords) : 'logo dizayn, logotip buyurtma qilish, brending, aydentika',
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const [dictionary, works] = await Promise.all([
    getDictionary(lang as Locale),
    lang === 'uz' ? fetchServiceWorks(LOGO_PAGE.serviceKey, lang) : Promise.resolve([]),
  ]);

  const fill = (v: string) => fillServiceTokens(v, lang, 'logo', dictionary.serviceFacts?.currency ?? '');
  const facts = dictionary.logoDesignPage.facts;
  const labels = dictionary.serviceFacts;
  const isUz = lang === 'uz';
  const localizedFaqs = !isUz && facts && labels ? buildServiceFaqs(lang as Locale, 'logo', facts, labels) : undefined;

  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/logo-dizayni"
        name={dictionary.header.logo_design}
        description={fill(dictionary.logoDesignPage.metadata.description)}
        faqs={isUz ? LOGO_PAGE.faqs : localizedFaqs}
        faqLang={lang as Locale}
      />
      {/* Uzbek-first: batafsil sahifa avval o'zbekchada. */}
      {isUz ? (
        <ServiceLanding content={LOGO_PAGE} works={works} />
      ) : (
        <>
          <LogoClient lang={lang as Locale} translations={dictionary.logoDesignPage} />
          {facts && labels && (
            <LocalizedServiceFacts lang={lang as Locale} serviceId="logo" copy={facts} labels={labels} />
          )}
        </>
      )}
    </>
  );
}
