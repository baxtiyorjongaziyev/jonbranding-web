import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import BrandbookClient from './brandbook-client';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.brandbookPage?.metadata;

  return {
    title: metadata?.title || "Brendbuk Yaratish | Professional Brend Qo'llanmasi | Jon.Branding",
    description: metadata?.description || "Brendingiz izchilligini ta'minlovchi professional brendbuklar yaratamiz.",
    keywords: metadata?.keywords || "brandbook, brendbuk, gaydlayn, brend qo'llanmasi, aydentika",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  
  return <BrandbookClient lang={lang as Locale} translations={dictionary.brandbookPage} />;
}