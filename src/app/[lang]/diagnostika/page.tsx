import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DiagnosticsClient from './diagnostics-client';
import { getDictionary, type Locale } from '@/lib/dictionaries';

// useSearchParams (?source=, UTM) Suspense chegarasini talab qiladi.
export default async function DiagnosticsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const safeLang: Locale = ['uz', 'ru', 'en', 'zh'].includes(lang) ? (lang as Locale) : 'uz';
  const dictionary = await getDictionary(safeLang);
  return (
    <Suspense
      fallback={
        <main className="flex-grow bg-secondary/50">
          <section className="py-10 sm:py-20">
            <div className="container mx-auto px-4">
              <h1 className="sr-only">{dictionary.diagnostics.ui.title}</h1>
              <Skeleton className="mx-auto h-96 max-w-2xl rounded-3xl" />
            </div>
          </section>
        </main>
      }
    >
      <DiagnosticsClient dictionary={dictionary.diagnostics} />
    </Suspense>
  );
}
