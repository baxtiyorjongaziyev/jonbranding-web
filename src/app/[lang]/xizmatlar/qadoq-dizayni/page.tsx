import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import PackagingClient from './packaging-client';

type Props = {
  params: { lang: Locale };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  const metadata = dictionary.packagingPage?.metadata;

  return {
    title: metadata?.title || "Qadoq Dizayni | Professional Mahsulot Dizayni | Jon.Branding",
    description: metadata?.description || "Mahsulotingizni javonda ajratib turadigan professional qadoq dizaynlari yaratamiz.",
    keywords: metadata?.keywords || "qadoq dizayn, qadoqlash, mahsulot dizayni, brending, packaging design",
  };
}

export default async function Page(props: Props) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  
  return <PackagingClient lang={lang} translations={dictionary.packagingPage} />;
}
