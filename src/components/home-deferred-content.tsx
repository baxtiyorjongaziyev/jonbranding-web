'use client';

import dynamic from 'next/dynamic';
import DeferredSection from '@/components/deferred-section';

const BeforeAfterSkeleton = () => (
  <div className="bg-[#070b12] py-20 sm:py-28 animate-pulse relative overflow-hidden min-h-[600px]">
    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#fbfaf7] to-transparent pointer-events-none" />
    <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
      <div className="space-y-4">
        <div className="h-6 w-28 bg-white/8 rounded-full" />
        <div className="h-12 w-3/4 bg-white/8 rounded-lg" />
        <div className="h-28 bg-white/8 rounded-lg" />
      </div>
      <div className="h-96 bg-white/8 rounded-lg" />
    </div>
  </div>
);

const TestimonialsSkeleton = () => (
  <div className="bg-brand-mist py-16 sm:py-20 animate-pulse min-h-[500px]">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center space-y-4 mb-12">
        <div className="h-6 w-28 bg-gray-200/80 rounded-full" />
        <div className="h-10 w-2/3 bg-gray-200/80 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[420px] bg-white border border-brand-line rounded-[8px]" />
        ))}
      </div>
    </div>
  </div>
);

const FounderSkeleton = () => (
  <div className="bg-[#070b12] py-24 sm:py-32 animate-pulse relative overflow-hidden min-h-[550px]">
    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-brand-paper to-transparent pointer-events-none" />
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="h-10 w-2/3 bg-white/8 rounded-lg" />
        <div className="h-32 bg-white/8 rounded-lg" />
        <div className="h-12 w-1/3 bg-white/8 rounded-lg" />
      </div>
      <div className="aspect-[4/5] bg-white/8 rounded-lg" />
    </div>
  </div>
);

const FaqSkeleton = () => (
  <div className="bg-[#fbfaf7] py-16 sm:py-20 animate-pulse">
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="flex flex-col items-center space-y-4 mb-10">
        <div className="h-6 w-20 bg-gray-200/80 rounded-full" />
        <div className="h-10 w-2/3 bg-gray-200/80 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-white border border-brand-line rounded-2xl" />
        ))}
      </div>
    </div>
  </div>
);

const CtaBlockSkeleton = () => (
  <div className="bg-[#fbfaf7] py-16 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="h-44 bg-[#070b12]/10 rounded-[8px] border border-brand-line/40" />
    </div>
  </div>
);

const BeforeAfter = dynamic(() => import('@/components/sections/before-after'), {
  ssr: false,
  loading: () => <BeforeAfterSkeleton />,
});
const Testimonials = dynamic(() => import('@/components/sections/testimonials'), {
  ssr: false,
  loading: () => <TestimonialsSkeleton />,
});
const Process = dynamic(() => import('@/components/sections/process'), {
  ssr: false,
  loading: () => <CtaBlockSkeleton />,
});
const Founder = dynamic(() => import('@/components/sections/founder'), {
  ssr: false,
  loading: () => <FounderSkeleton />,
});
const Faq = dynamic(() => import('@/components/sections/faq'), {
  ssr: false,
  loading: () => <FaqSkeleton />,
});
const CtaBlock = dynamic(() => import('@/components/sections/cta-block'), {
  ssr: false,
  loading: () => <CtaBlockSkeleton />,
});

type DeferredDictionary = {
  beforeAfter?: any;
  testimonials?: any;
  process?: any;
  founder?: any;
  faq?: any;
  home?: any;
};

export default function HomeDeferredContent({
  lang,
  dictionary,
  comparisons,
}: {
  lang: string;
  dictionary: DeferredDictionary;
  comparisons?: any[];
}) {
  return (
    <>
      <DeferredSection fallback={<BeforeAfterSkeleton />}>
        <BeforeAfter lang={lang} dictionary={dictionary.beforeAfter} comparisons={comparisons} />
      </DeferredSection>

      <DeferredSection fallback={<TestimonialsSkeleton />}>
        <Testimonials lang={lang} dictionary={dictionary.testimonials} />
      </DeferredSection>

      <DeferredSection fallback={<CtaBlockSkeleton />}>
        <Process lang={lang} dictionary={dictionary.process} />
      </DeferredSection>

      <DeferredSection fallback={<FounderSkeleton />}>
        <Founder lang={lang} dictionary={dictionary.founder} />
      </DeferredSection>

      <DeferredSection fallback={<FaqSkeleton />}>
        <Faq lang={lang} dictionary={dictionary.faq} hideCta={true} />
      </DeferredSection>

      <DeferredSection fallback={<CtaBlockSkeleton />}>
        <CtaBlock
          title={dictionary.home?.cta1_title}
          description={dictionary.home?.cta1_desc}
          buttonText={dictionary.home?.cta1_button}
          ctaSection="final_cta"
          ctaSource="homepage"
        />
      </DeferredSection>
    </>
  );
}
