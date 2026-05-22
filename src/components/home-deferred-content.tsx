import TrustedBy from '@/components/sections/trusted-by';
import AuditOffer from '@/components/sections/audit-offer';
import BeforeAfter from '@/components/sections/before-after';
import Testimonials from '@/components/sections/testimonials';
import Process from '@/components/sections/process';
import Founder from '@/components/sections/founder';
import Faq from '@/components/sections/faq';
import CtaBlock from '@/components/sections/cta-block';

type DeferredDictionary = {
  trustedBy?: any;
  auditOffer?: any;
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
      <TrustedBy lang={lang} dictionary={dictionary.trustedBy} />
      <AuditOffer lang={lang} dictionary={dictionary.auditOffer} />

      <BeforeAfter lang={lang} dictionary={dictionary.beforeAfter} comparisons={comparisons} />
      <Testimonials lang={lang} dictionary={dictionary.testimonials} />
      <Process lang={lang} dictionary={dictionary.process} />
      <Founder lang={lang} dictionary={dictionary.founder} />
      <Faq lang={lang} dictionary={dictionary.faq} hideCta={true} />
      <CtaBlock
        title={dictionary.home?.cta1_title}
        description={dictionary.home?.cta1_desc}
        buttonText={dictionary.home?.cta1_button}
        ctaSection="final_cta"
        ctaSource="homepage"
      />
    </>
  );
}
