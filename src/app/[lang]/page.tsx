
import HomeComponent from '@/components/home-component';
import { getDictionary, Locale } from '@/lib/dictionaries';

const Page = async ({ params }: { params: { lang: Locale } }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  return <HomeComponent lang={lang} dictionary={dictionary} />;
};

export default Page;
