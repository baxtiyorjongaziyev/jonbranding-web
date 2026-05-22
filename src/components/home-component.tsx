import type { FC } from 'react';
import HomeDeferredContent from '@/components/home-deferred-content';
import Hero from '@/components/sections/hero';
import AuditOffer from '@/components/sections/audit-offer';
import TrustedBy from '@/components/sections/trusted-by';
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
        <TrustedBy lang={lang} dictionary={dictionary.trustedBy} />
        <AuditOffer lang={lang} dictionary={dictionary.auditOffer} />
        <HomeDeferredContent
          lang={lang}
          comparisons={comparisons}
          dictionary={{
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
