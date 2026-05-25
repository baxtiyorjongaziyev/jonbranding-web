import type { FC } from 'react';
import { ArrowUpRight, CheckCircle2, FileSearch, Layers3, Route, ShieldCheck, Target } from 'lucide-react';
import ContactTriggerButton from '@/components/contact-trigger-button';
import { BrandSection } from '@/components/ui/design-system';

type AuditOfferDictionary = {
  eyebrow?: string;
  title?: string;
  description?: string;
  cta?: string;
  promise?: string;
  items?: Array<{ title: string; desc: string }>;
  outcomes?: Array<{ value: string; label: string }>;
  proof?: string[];
};

const auditIcons = [FileSearch, Target, Layers3, Route];

const AuditOffer: FC<{ lang: string; dictionary?: AuditOfferDictionary }> = ({ dictionary }) => {
  if (!dictionary) return null;

  const items = dictionary.items || [];
  const outcomes = dictionary.outcomes || [];
  const proof = dictionary.proof || [];

  return (
    <BrandSection id="audit-offer" tone="light" className="min-h-0 scroll-mt-24 bg-brand-mist py-20 sm:py-28">
      <div className="container relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            {dictionary.eyebrow && (
              <div className="jb-eyebrow mb-5">
                {dictionary.eyebrow}
              </div>
            )}
            <h2 className="max-w-2xl text-balance text-4xl font-extrabold leading-tight tracking-normal text-brand-ink sm:text-6xl">
              {dictionary.title}
            </h2>
            {dictionary.description && <p className="mt-6 text-pretty text-lg leading-8 text-brand-slate">{dictionary.description}</p>}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {dictionary.cta && (
                <ContactTriggerButton
                  section="audit_offer"
                  ctaText={dictionary.cta}
                  size="lg"
                  showArrow={false}
                  className="group h-14 justify-between rounded-full bg-brand-ink py-2 pl-6 pr-2 text-base font-extrabold text-white transition-[background-color,transform] duration-300 hover:bg-brand-blue active:scale-[0.98] sm:min-w-[260px]"
                >
                  <span>{dictionary.cta}</span>
                  <span className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </ContactTriggerButton>
              )}
              {dictionary.promise && (
                <div className="flex items-center gap-2 rounded-full border border-brand-line bg-white/65 px-4 py-3 text-sm font-bold text-brand-slate">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-brand-blue" />
                  {dictionary.promise}
                </div>
              )}
            </div>

            {outcomes.length > 0 && (
              <div className="mt-8 grid grid-cols-2 border-y border-brand-line">
                {outcomes.map((outcome) => (
                  <div key={outcome.label} className="border-r border-brand-line px-4 py-4 even:border-r-0">
                    <div className="font-mono text-2xl font-extrabold tracking-normal text-brand-ink tabular-nums">{outcome.value}</div>
                    <div className="mt-2 text-xs font-bold uppercase tracking-normal text-brand-slate">{outcome.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-brand-line bg-white/72 p-3 shadow-[0_30px_90px_rgba(35,41,55,0.08)]">
            {items.map((item, index) => {
              const Icon = auditIcons[index % auditIcons.length];

              return (
                <article key={item.title} className="grid gap-4 border-b border-brand-line px-4 py-6 last:border-b-0 sm:grid-cols-[4.5rem_1fr] sm:px-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-lime/[0.18] text-brand-ink ring-1 ring-brand-lime/[0.32]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-normal text-brand-ink">{item.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-slate">{item.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {proof.length > 0 && (
          <div className="mx-auto mt-8 flex flex-wrap justify-start gap-3 lg:justify-end">
            {proof.map((proofItem) => (
              <div key={proofItem} className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white/75 px-4 py-2 text-sm font-extrabold text-brand-ink">
                <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
                {proofItem}
              </div>
            ))}
          </div>
        )}
      </div>
    </BrandSection>
  );
};

export default AuditOffer;
