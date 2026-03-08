
import HomeComponent from '@/components/home-component';
import { getDictionary, Locale } from '@/lib/dictionaries';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const Page = async (props: Props) => {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  return <HomeComponent lang={lang} dictionary={dictionary} />;
};

export default Page;

    