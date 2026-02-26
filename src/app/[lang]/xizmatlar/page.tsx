
import { getDictionary, Locale } from '@/lib/dictionaries';
import XizmatlarClient from './xizmatlar-client';

const XizmatlarPage = async (props: { params: Promise<{ lang: Locale }> }) => {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang);

    return (
      <main className="flex-grow">
          <XizmatlarClient lang={lang} dictionary={dictionary} />
      </main>
    );
};

export default XizmatlarPage;
