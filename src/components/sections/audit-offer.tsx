'use client';

import type { FC } from 'react';
import { ArrowRight, CheckCircle2, FileSearch, Layers3, Route, ShieldCheck, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandCard, BrandSection } from '@/components/ui/design-system';

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

const AuditOffer: FC<{ lang: string; dictionary?: AuditOfferDictionary; onCtaClick: () => void }> = ({ dictionary, onCtaClick }) => {
  if (!dictionary) return null;

  const items = dictionary.items || [];
  const outcomes = dictionary.outcomes || [];
  const proof = dictionary.proof || [];

  return (
    <BrandSection id="audit-offer" tone="light" className="min-h-0 scroll-mt-24 bg-brand-mist py-16 sm:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(84,213,233,0.12),transparent_34%,rgba(24,78,78,0.08))]" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            {dictionary.eyebrow && (
              <div className="jb-eyebrow mb-5">
                {dictionary.eyebrow}
              </div>
            )}
            <h2 className="text-balance text-4xl font-black tracking-normal text-brand-ink sm:text-6xl">
              {dictionary.title}
            </h2>
            {dictionary.description && <p className="mt-6 text-pretty text-lg leading-8 text-brand-slate">{dictionary.description}</p>}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {dictionary.cta && (
                <Button onClick={onCtaClick} size="lg" className="group h-14 min-w-[220px] rounded-[8px] bg-brand-ink px-7 text-base font-black text-white hover:bg-brand-blue">
                  {dictionary.cta}
                  <ArrowRight className="ml-2 h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              )}
              {dictionary.promise && (
                <div className="flex items-center gap-2 rounded-[8px] border border-brand-line bg-white/70 px-4 py-3 text-sm font-bold text-brand-slate">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-brand-blue" />
                  {dictionary.promise}
                </div>
              )}
            </div>

            {outcomes.length > 0 && (
              <div className="mt-7 grid grid-cols-2 gap-3">
                {outcomes.map((outcome) => (
                  <div key={outcome.label} className="rounded-[8px] border border-brand-line bg-white px-4 py-4 shadow-sm">
                    <div className="text-2xl font-black tracking-normal text-brand-ink">{outcome.value}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-normal text-brand-slate">{outcome.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item, index) => {
              const Icon = auditIcons[index % auditIcons.length];

              return (
                <BrandCard key={item.title} className="group p-6 transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-brand-lime/[0.18] text-brand-ink ring-1 ring-brand-lime/[0.35]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black tracking-normal text-brand-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-brand-slate">{item.desc}</p>
                </BrandCard>
              );
            })}
          </div>
        </div>

        {proof.length > 0 && (
          <div className="mx-auto mt-8 flex max-w-6xl flex-wrap justify-center gap-3 lg:justify-end">
            {proof.map((proofItem) => (
              <div key={proofItem} className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white/75 px-4 py-2 text-sm font-black text-brand-ink">
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
