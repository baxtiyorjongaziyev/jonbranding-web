import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import LogoClient from './logo-client';

type Props = {
  params: { lang: Locale };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  const metadata = dictionary.logoDesignPage?.metadata;

  return {
    title: metadata?.title || "Logotip Dizayni | Professional Logo Yaratish | Jon.Branding",
    description: metadata?.description || "Biznesingiz uchun unikal va natijador logotiplar yaratamiz.",
    keywords: metadata?.keywords || "logo dizayn, logotip yaratish, brending, aydentika",
  };
}

export default async function Page(props: Props) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  
  return <LogoClient lang={lang} translations={dictionary.logoDesignPage} />;
}
