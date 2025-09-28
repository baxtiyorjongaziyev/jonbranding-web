
import { getDictionary, Locale } from '@/lib/dictionaries';
import XizmatlarClient from './xizmatlar-client';

const XizmatlarPage = async ({ params: { lang } }: { params: { lang: Locale } }) => {
    const dictionary = await getDictionary(lang);

    return (
      <main className="flex-grow">
          <XizmatlarClient lang={lang} dictionary={dictionary} />
      </main>
    );
};

export default XizmatlarPage;
