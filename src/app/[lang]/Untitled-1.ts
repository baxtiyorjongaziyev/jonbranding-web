import Footer from '@/components/layout/footer'
import { getDictionary, Locale } from '@/lib/i18n'
import { locales, defaultLocale } from '@/middleware'
import { GoogleTagManager } from '@next/third-parties/google'

type Props = {
      children: ReactNode;
        params: Promise<{ lang: Locale }>;
};

const LocalizedLayout: FC<Props> = async (props) => {
      const { lang: rawLang } = await props.params;
        const lang = locales.includes(rawLang) ? rawLang : defaultLocale;
          const dictionary = await getDictionary(lang);
            const { children } = props;

              return (
                    <>
                          <GoogleTagManager gtmId="GTM-5GRQBW84" />
                                <Header lang={lang} dictionary={dictionary} />
                                      <div className="flex-grow">
                                              {children}
                                                    </div>
                                                          <Footer lang={lang} dictionary={dictionary} />
                                                              </>
              );
}

export default LocalizedLayout;
              )
}
}