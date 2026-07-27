import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import LogoClient from './logo-client';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.logoDesignPage?.metadata;

  return {
    title: metadata?.title || "Logotip Dizayni | Professional Logo Yaratish | Jon.Branding",
    description: metadata?.description || "Biznesingiz uchun unikal va natijador logotiplar yaratamiz.",
    keywords: metadata?.keywords || "logo dizayn, logotip yaratish, brending, aydentika",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  
  return (
    <>
      <ServiceJsonLd
        lang={lang as Locale}
        path="/xizmatlar/logo-dizayni"
        name={dictionary.header.logo_design}
        description={dictionary.logoDesignPage.metadata.description}
      />
      <LogoClient lang={lang as Locale} translations={dictionary.logoDesignPage} />
    </>
  );
}
