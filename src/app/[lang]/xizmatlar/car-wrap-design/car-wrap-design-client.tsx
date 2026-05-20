'use client';

import type { FC, ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Languages,
  MapPin,
  Megaphone,
  Paintbrush,
  PanelTop,
  Route,
  Sparkles,
  Truck,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type TextItem = {
  title: string;
  description?: string;
};

type PricingTier = {
  name: string;
  price: string;
  features: string[];
};

type CarWrapPageTranslations = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  visual: {
    label: string;
    brand: string;
    sloganUz: string;
    sloganRu: string;
    phone: string;
    side: string;
    rear: string;
    front: string;
    notes: string[];
  };
  problem: TextItem;
  solution: TextItem;
  included: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  benefits: {
    title: string;
    items: string[];
  };
  audience: {
    title: string;
    items: string[];
  };
  process: {
    title: string;
    steps: string[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    tiers: PricingTier[];
  };
  cta: {
    brandLabel: string;
    title: string;
    description: string;
    button: string;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
};

const includedIcons = [Sparkles, Truck, MapPin, Languages, PanelTop, Paintbrush, FileCheck2, Wrench];
const benefitIcons = [Megaphone, BadgeCheck, Route, Truck, ClipboardCheck, Paintbrush, Sparkles, CheckCircle2];

function openContactModal() {
  window.dispatchEvent(new CustomEvent('openContactModal'));
}

const CarWrapDesignClient: FC<{ translations: CarWrapPageTranslations }> = ({ translations: t }) => {
  return (
    <main className="flex-grow bg-brand-paper pt-16 text-brand-ink">
      <HeroSection t={t} />
      <ProblemSolutionSection problem={t.problem} solution={t.solution} />
      <IncludedSection included={t.included} />
      <BenefitsAudienceSection benefits={t.benefits} audience={t.audience} />
      <ProcessSection process={t.process} />
      <PricingSection pricing={t.pricing} primaryCta={t.hero.primaryCta} />
      <FinalCta cta={t.cta} />
      <FaqSection faq={t.faq} />
    </main>
  );
};

function HeroSection({ t }: { t: CarWrapPageTranslations }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#06080d] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#06080d_0%,#11151f_56%,#0c2428_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:86px_86px] opacity-25" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-brand-paper via-brand-paper/[0.35] to-transparent" />
      </div>

      <div className="container mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1400px] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[11px] font-black uppercase tracking-normal text-brand-lime">
            <Truck className="h-4 w-4" aria-hidden="true" />
            {t.hero.eyebrow}
          </div>
          <h1 className="text-balance text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl xl:text-7xl">
            {t.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-xl font-bold leading-8 text-brand-lime sm:text-2xl">
            {t.hero.subtitle}
          </p>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-white/68 sm:text-lg">
            {t.hero.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              size="lg"
              onClick={openContactModal}
              className="group h-14 rounded-[8px] bg-white px-7 text-base font-black text-brand-ink shadow-[0_24px_70px_-24px_rgba(255,255,255,0.75)] hover:bg-brand-lime sm:h-16"
            >
              {t.hero.primaryCta}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-14 rounded-[8px] border border-white/15 bg-white/[0.03] px-7 text-base font-black text-white/86 transition-[background-color,color,border-color] duration-200 hover:bg-white/10 hover:text-white sm:h-16"
            >
              <Link href="#car-wrap-tariffs">{t.hero.secondaryCta}</Link>
            </Button>
          </div>
        </div>

        <CarWrapPreview visual={t.visual} />
      </div>
    </section>
  );
}

function CarWrapPreview({ visual }: { visual: CarWrapPageTranslations['visual'] }) {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.06] p-3 shadow-[0_40px_120px_-55px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <div className="rounded-[8px] border border-white/10 bg-[#0b1118] p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-normal text-brand-lime">{visual.label}</p>
              <p className="mt-1 text-sm font-bold text-white/60">{visual.side} / {visual.rear} / {visual.front}</p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-white/80">
              {visual.brand}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[linear-gradient(135deg,#f8fafc_0%,#dfe7ef_48%,#ffffff_100%)] p-5">
            <div className="absolute inset-y-0 left-[12%] w-[28%] skew-x-[-16deg] bg-brand-lime/75" />
            <div className="absolute inset-y-0 right-[9%] w-[18%] skew-x-[-16deg] bg-brand-ink/92" />
            <div className="relative mx-auto aspect-[2.55/1] max-w-2xl">
              <div className="absolute left-[9%] top-[18%] h-[52%] w-[74%] rounded-t-[48px] rounded-b-[14px] border-[6px] border-brand-ink bg-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]" />
              <div className="absolute left-[25%] top-[8%] h-[34%] w-[31%] rounded-t-[40px] border-[5px] border-brand-ink bg-[#d8eef5]" />
              <div className="absolute left-[58%] top-[14%] h-[28%] w-[18%] rounded-t-[28px] border-[5px] border-brand-ink bg-[#d8eef5]" />
              <div className="absolute left-[14%] top-[29%] h-[20%] w-[18%] rounded-[8px] bg-brand-ink text-center text-[11px] font-black uppercase tracking-normal text-white sm:text-sm">
                <span className="flex h-full items-center justify-center">{visual.brand}</span>
              </div>
              <div className="absolute left-[35%] top-[36%] w-[35%] rounded-[8px] bg-white/90 px-3 py-2 text-[10px] font-black uppercase leading-4 text-brand-ink shadow-sm sm:text-xs">
                {visual.sloganUz}
              </div>
              <div className="absolute bottom-[22%] left-[35%] w-[34%] rounded-[8px] bg-brand-lime px-3 py-2 text-[10px] font-black uppercase leading-4 text-brand-ink shadow-sm sm:text-xs">
                {visual.sloganRu}
              </div>
              <div className="absolute bottom-[13%] right-[15%] rounded-full bg-brand-ink px-3 py-1 text-[10px] font-black text-white sm:text-xs">
                {visual.phone}
              </div>
              <div className="absolute bottom-[7%] left-[16%] h-[20%] w-[13%] rounded-full border-[7px] border-brand-ink bg-slate-200" />
              <div className="absolute bottom-[7%] right-[17%] h-[20%] w-[13%] rounded-full border-[7px] border-brand-ink bg-slate-200" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {visual.notes.map((note) => (
              <div key={note} className="flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.055] px-3 py-3 text-xs font-bold leading-5 text-white/80">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-lime" aria-hidden="true" />
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemSolutionSection({ problem, solution }: { problem: TextItem; solution: TextItem }) {
  return (
    <section className="border-b border-brand-line/70 bg-brand-paper py-16 sm:py-24">
      <div className="container mx-auto grid max-w-6xl gap-4 px-4 lg:grid-cols-[0.92fr_1.08fr]">
        <ArticlePanel tone="muted" eyebrow="01" icon={<Megaphone className="h-5 w-5" aria-hidden="true" />} title={problem.title}>
          {problem.description}
        </ArticlePanel>
        <ArticlePanel tone="strong" eyebrow="02" icon={<Paintbrush className="h-5 w-5" aria-hidden="true" />} title={solution.title}>
          {solution.description}
        </ArticlePanel>
      </div>
    </section>
  );
}

function ArticlePanel({
  tone,
  eyebrow,
  icon,
  title,
  children,
}: {
  tone: 'muted' | 'strong';
  eyebrow: string;
  icon: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <article
      className={
        tone === 'strong'
          ? 'rounded-[8px] border border-brand-ink bg-brand-ink p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)] sm:p-8'
          : 'rounded-[8px] border border-brand-line/80 bg-white/82 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8'
      }
    >
      <div className="mb-6 flex items-center gap-3">
        <div className={tone === 'strong' ? 'flex h-10 w-10 items-center justify-center rounded-[8px] bg-white/10 text-brand-lime' : 'flex h-10 w-10 items-center justify-center rounded-[8px] bg-brand-lime/15 text-brand-cyan'}>
          {icon}
        </div>
        <span className={tone === 'strong' ? 'text-xs font-black uppercase tracking-normal text-white/55' : 'text-xs font-black uppercase tracking-normal text-brand-slate'}>
          {eyebrow}
        </span>
      </div>
      <h2 className={tone === 'strong' ? 'text-balance text-3xl font-black tracking-normal text-white sm:text-4xl' : 'text-balance text-3xl font-black tracking-normal text-brand-ink sm:text-4xl'}>
        {title}
      </h2>
      <p className={tone === 'strong' ? 'mt-5 text-pretty text-base leading-8 text-white/68 sm:text-lg' : 'mt-5 text-pretty text-base leading-8 text-brand-slate sm:text-lg'}>
        {children}
      </p>
    </article>
  );
}

function IncludedSection({ included }: { included: CarWrapPageTranslations['included'] }) {
  return (
    <section className="bg-brand-mist py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-3xl">
          <div className="jb-eyebrow mb-4">{included.eyebrow}</div>
          <h2 className="text-balance text-4xl font-black tracking-normal text-brand-ink sm:text-5xl">
            {included.title}
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {included.items.map((item, index) => {
            const Icon = includedIcons[index % includedIcons.length];
            const isWide = index === 0 || index === 5;

            return (
              <article
                key={item}
                className={`rounded-[8px] border border-brand-line/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-ink/20 hover:shadow-[0_28px_80px_rgba(15,23,42,0.1)] ${isWide ? 'lg:col-span-2' : ''}`}
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[8px] bg-brand-lime/15 text-brand-cyan">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-pretty text-lg font-black leading-6 text-brand-ink">{item}</h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BenefitsAudienceSection({
  benefits,
  audience,
}: {
  benefits: CarWrapPageTranslations['benefits'];
  audience: CarWrapPageTranslations['audience'];
}) {
  return (
    <section className="bg-brand-paper py-16 sm:py-24">
      <div className="container mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <h2 className="text-balance text-4xl font-black tracking-normal text-brand-ink sm:text-5xl">{benefits.title}</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.items.map((item, index) => {
              const Icon = benefitIcons[index % benefitIcons.length];
              return (
                <div key={item} className="flex items-start gap-3 rounded-[8px] border border-brand-line/80 bg-white/86 p-4">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-brand-cyan" aria-hidden="true" />
                  <p className="text-sm font-bold leading-6 text-brand-ink">{item}</p>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[8px] border border-brand-line/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] sm:p-8">
          <h2 className="text-balance text-3xl font-black tracking-normal text-brand-ink">{audience.title}</h2>
          <div className="mt-6 grid gap-2">
            {audience.items.map((item) => (
              <div key={item} className="flex items-center gap-3 border-t border-brand-line/70 py-3 first:border-t-0 first:pt-0">
                <span className="h-2 w-2 rounded-full bg-brand-lime" aria-hidden="true" />
                <p className="text-sm font-bold leading-6 text-brand-slate">{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ProcessSection({ process }: { process: CarWrapPageTranslations['process'] }) {
  return (
    <section className="bg-[#06080d] py-16 text-white sm:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-balance text-4xl font-black tracking-normal text-white sm:text-5xl">{process.title}</h2>
        <div className="mt-10 grid gap-3">
          {process.steps.map((step, index) => (
            <article key={step} className="grid gap-4 rounded-[8px] border border-white/10 bg-white/[0.055] p-5 sm:grid-cols-[100px_1fr] sm:items-center">
              <div className="font-mono text-sm font-black text-brand-lime">{String(index + 1).padStart(2, '0')}</div>
              <p className="text-lg font-bold leading-7 text-white/82">{step}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ pricing, primaryCta }: { pricing: CarWrapPageTranslations['pricing']; primaryCta: string }) {
  return (
    <section id="car-wrap-tariffs" className="scroll-mt-24 bg-brand-mist py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-3xl">
          <div className="jb-eyebrow mb-4">{pricing.eyebrow}</div>
          <h2 className="text-balance text-4xl font-black tracking-normal text-brand-ink sm:text-5xl">{pricing.title}</h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pricing.tiers.map((tier, index) => (
            <article
              key={tier.name}
              className={`flex min-h-[520px] flex-col rounded-[8px] border p-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] ${index === 1 ? 'border-brand-cyan bg-brand-ink text-white' : 'border-brand-line/80 bg-white/92 text-brand-ink'}`}
            >
              <div className="min-h-[118px]">
                <h3 className={index === 1 ? 'text-2xl font-black text-white' : 'text-2xl font-black text-brand-ink'}>{tier.name}</h3>
                <p className={index === 1 ? 'mt-4 text-3xl font-black text-brand-lime' : 'mt-4 text-3xl font-black text-brand-ink'}>{tier.price}</p>
              </div>
              <ul className="mt-6 flex-grow space-y-3 border-t border-current/10 pt-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm font-bold leading-6">
                    <CheckCircle2 className={index === 1 ? 'mt-1 h-4 w-4 shrink-0 text-brand-lime' : 'mt-1 h-4 w-4 shrink-0 text-brand-cyan'} aria-hidden="true" />
                    <span className={index === 1 ? 'text-white/76' : 'text-brand-slate'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                onClick={openContactModal}
                className={index === 1 ? 'mt-8 h-12 rounded-[8px] bg-white text-brand-ink hover:bg-brand-lime' : 'mt-8 h-12 rounded-[8px] bg-brand-ink text-white hover:bg-brand-blue'}
              >
                {primaryCta}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ cta }: { cta: CarWrapPageTranslations['cta'] }) {
  return (
    <section className="bg-brand-paper py-16">
      <div className="container mx-auto px-4">
        <div className="relative isolate overflow-hidden rounded-[8px] border border-white/10 bg-[#06080d] px-6 py-12 shadow-[0_40px_100px_-45px_rgba(15,23,42,0.7)] sm:px-10 sm:py-16">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#06080d_0%,#121722_58%,#0c2428_100%)]" />
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-normal text-brand-lime">
                <Truck className="h-4 w-4" aria-hidden="true" />
                {cta.brandLabel}
              </div>
              <h2 className="max-w-4xl text-balance text-3xl font-black tracking-normal text-white sm:text-5xl">{cta.title}</h2>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-white/65 sm:text-lg">{cta.description}</p>
            </div>
            <Button
              type="button"
              size="lg"
              onClick={openContactModal}
              className="group h-14 rounded-[8px] bg-white px-8 text-base font-black text-brand-ink shadow-lg hover:bg-brand-lime active:scale-[0.98] sm:h-16 sm:px-10 sm:text-lg"
            >
              {cta.button}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ faq }: { faq: CarWrapPageTranslations['faq'] }) {
  return (
    <section className="bg-brand-paper pb-20 pt-8 sm:pb-28">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-balance text-center text-3xl font-black tracking-normal text-brand-ink sm:text-4xl">{faq.title}</h2>
        <Accordion type="single" collapsible defaultValue="item-0" className="mt-8 space-y-3">
          {faq.items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`} className="rounded-[8px] border border-brand-line/80 bg-white/90 px-5 shadow-[0_18px_55px_rgba(15,23,42,0.05)]">
              <AccordionTrigger className="text-left text-base font-black text-brand-ink hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-7 text-brand-slate">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default CarWrapDesignClient;
