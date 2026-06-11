import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import CorporateClient from './corporate-client';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.corporateStylePage?.metadata;

  return {
    title: metadata?.title || "Firma Uslubi Yaratish | Korporativ Aydentika | Jon.Branding",
    description: metadata?.description || "Brendingizni tanitadigan yaxlit korporativ uslub va vizual tizim yaratamiz.",
    keywords: metadata?.keywords || "firma uslubi, korporativ aydentika, brend uslubi, korporativ dizayn",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  
  return <CorporateClient lang={lang as Locale} translations={dictionary.corporateStylePage} />;
}