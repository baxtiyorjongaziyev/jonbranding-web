import type { FC } from 'react';
import HomeDeferredContent from '@/components/home-deferred-content';
import Hero from '@/components/sections/hero';
import { Skeleton } from '@/components/ui/skeleton';
import type { Brand, Testimonial } from '@/lib/types';

const HomeComponent: FC<{ lang: string; dictionary: any; comparisons?: any[]; brands?: Brand[]; testimonials?: Testimonial[] }> = ({ lang, dictionary, comparisons, brands, testimonials }) => {
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
          brands={brands}
          testimonials={testimonials}
          dictionary={{
            trustedBy: dictionary.trustedBy,
            auditOffer: dictionary.auditOffer,
            beforeAfter: dictionary.beforeAfter,
            testimonials: dictionary.testimonials,
            process: dictionary.process,
            founder: dictionary.founder,
            faq: dictionary.faq,
            home: dictionary.home,
            blog: dictionary.blog,
            opportunityCalculator: dictionary.opportunityCalculator,
          }}
        />
      </main>
    </div>
  );
};

export default HomeComponent;
