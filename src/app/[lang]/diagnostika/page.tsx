import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DiagnosticsClient from './diagnostics-client';

// useSearchParams (?source=, UTM) Suspense chegarasini talab qiladi.
export default function DiagnosticsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-grow bg-secondary/50">
          <section className="py-10 sm:py-20">
            <div className="container mx-auto px-4">
              <h1 className="sr-only">Brend diagnostikasi</h1>
              <Skeleton className="mx-auto h-96 max-w-2xl rounded-3xl" />
            </div>
          </section>
        </main>
      }
    >
      <DiagnosticsClient />
    </Suspense>
  );
}
