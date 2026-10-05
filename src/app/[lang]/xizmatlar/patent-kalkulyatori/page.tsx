import { Check } from 'lucide-react';
import TrademarkCalculator from '@/components/sections/trademark-calculator';
import { getDictionary, Locale } from '@/lib/dictionaries';

type Props = { params: Promise<{ lang: string }> };

// Server komponent: sarlavha va matn HTML'ning o'zida keladi. Avval lug'at
// useEffect'da yuklanardi va server faqat bo'sh skeleton qaytarardi (h1 yo'q edi).
export default async function PatentCalculatorPage({ params }: Props) {
  const { lang } = await params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const translations = (await getDictionary(safeLang)).patentCalculatorPage;
  const landing = translations.landing;
  const trust = [landing?.trustSpeed, landing?.trustAccuracy, landing?.trustExperts].filter(Boolean);

  return (
    <div className="flex-grow pt-20">
      <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 bg-white">
        <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-dark-blue">
                {landing?.title ?? translations.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-gray-700">
                {landing?.subtitle ?? translations.subtitle}
            </p>
            {trust.length > 0 && (
              <ul className="mt-5 flex flex-wrap justify-center gap-2 text-sm text-gray-700">
                {trust.map((item: string) => (
                  <li key={item} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                    <Check className="h-4 w-4 text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </section>

      <section id="patent-calculator" className="py-8 sm:py-12 bg-secondary">
        <div className="container mx-auto px-4">
            <TrademarkCalculator translations={translations.trademarkCalculator} />
        </div>
      </section>
    </div>
  );
}
