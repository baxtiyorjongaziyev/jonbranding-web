
import HomeComponent from '@/components/home-component';
import { getDictionary, Locale } from '@/lib/dictionaries';

const Page = async (props: { params: Promise<{ lang: Locale }> }) => {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  return <HomeComponent lang={lang} dictionary={dictionary} />;
};

export default Page;
