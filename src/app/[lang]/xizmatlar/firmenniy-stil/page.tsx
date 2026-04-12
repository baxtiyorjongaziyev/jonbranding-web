import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import CorporateClient from './corporate-client';

type Props = {
  params: { lang: Locale };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  const metadata = dictionary.corporateStylePage?.metadata;

  return {
    title: metadata?.title || "Firma Uslubi Yaratish | Korporativ Aydentika | Jon.Branding",
    description: metadata?.description || "Brendingizni tanitadigan yaxlit korporativ uslub va vizual tizim yaratamiz.",
    keywords: metadata?.keywords || "firma uslubi, korporativ aydentika, brend uslubi, korporativ dizayn",
  };
}

export default async function Page(props: Props) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  
  return <CorporateClient lang={lang} translations={dictionary.corporateStylePage} />;
}
