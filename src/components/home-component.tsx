import type { FC } from 'react';
import HomeDeferredContent from '@/components/home-deferred-content';
import Hero from '@/components/sections/hero';
import { Skeleton } from '@/components/ui/skeleton';

const HomeComponent: FC<{ lang: string; dictionary: any; comparisons?: any[] }> = ({ lang, dictionary, comparisons }) => {
  if (!dictionary?.hero) {
    return (
      <div className="py-20 text-center">
        <Skeleton className="h-screen w-full" />
      </div>
    );
  }

  return (
    <div className="relative pb-28 md:pb-0">
      <main>
        <Hero lang={lang} dictionary={dictionary.hero} />
        <HomeDeferredContent
          lang={lang}
          comparisons={comparisons}
          dictionary={{
            trustedBy: dictionary.trustedBy,
            auditOffer: dictionary.auditOffer,
            beforeAfter: dictionary.beforeAfter,
            testimonials: dictionary.testimonials,
            process: dictionary.process,
            founder: dictionary.founder,
            faq: dictionary.faq,
            home: dictionary.home,
          }}
        />
      </main>
    </div>
  );
};

export default HomeComponent;
