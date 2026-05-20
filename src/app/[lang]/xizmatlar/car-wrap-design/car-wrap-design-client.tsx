'use client';

import type { FC } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Languages,
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

const includedIcons = [Sparkles, Truck, Megaphone, Languages, PanelTop, Paintbrush, FileCheck2, Wrench];
const benefitIcons = [Megaphone, BadgeCheck, Route, Truck, ClipboardCheck, Paintbrush, Sparkles, CheckCircle2];

function openContactModal() {
  window.dispatchEvent(new CustomEvent('openContactModal'));
}

const CarWrapDesignClient: FC<{ translations: CarWrapPageTranslations }> = ({ translations: t }) => {
  return (
    <main className="min-h-screen bg-slate-50 pt-20 text-slate-900">
      <HeroSection t={t} />
      <PricingSection pricing={t.pricing} primaryCta={t.hero.primaryCta} />
      <ProblemSolutionSection problem={t.problem} solution={t.solution} />
      <IncludedSection included={t.included} />
      <BenefitsAudienceSection benefits={t.benefits} audience={t.audience} />
      <ProcessSection process={t.process} />
      <FinalCta cta={t.cta} />
      <FaqSection faq={t.faq} />
    </main>
  );
};

function HeroSection({ t }: { t: CarWrapPageTranslations }) {
  return (
    <section className="border-b border-slate-200 bg-white py-14 sm:py-20">
      <div className="container mx-auto max-w-5xl px-4 text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-normal text-brand-blue">
          <Truck className="h-4 w-4" aria-hidden="true" />
          {t.hero.eyebrow}
        </div>
        <h1 className="text-balance text-4xl font-black leading-tight tracking-normal text-blue-950 sm:text-5xl lg:text-6xl">
          {t.hero.title}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-pretty text-xl font-bold leading-8 text-brand-cyan sm:text-2xl">
          {t.hero.subtitle}
        </p>
        <p className="mx-auto mt-5 max-w-3xl text-pretty text-base leading-8 text-slate-600 sm:text-lg">
          {t.hero.description}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            size="lg"
            onClick={openContactModal}
            className="group h-14 rounded-[8px] bg-blue-950 px-7 text-base font-black text-white shadow-[0_18px_46px_-22px_rgba(15,23,42,0.85)] hover:bg-brand-blue sm:h-16"
          >
            {t.hero.primaryCta}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-14 rounded-[8px] border-slate-200 bg-white px-7 text-base font-black text-blue-950 hover:bg-slate-100 sm:h-16"
          >
            <Link href="#car-wrap-tariffs">{t.hero.secondaryCta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function PricingSection({ pricing, primaryCta }: { pricing: CarWrapPageTranslations['pricing']; primaryCta: string }) {
  return (
    <section id="car-wrap-tariffs" className="scroll-mt-24 py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-normal text-brand-blue">
            {pricing.eyebrow}
          </div>
          <h2 className="text-balance text-3xl font-black tracking-normal text-blue-950 sm:text-5xl">{pricing.title}</h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pricing.tiers.map((tier, index) => (
            <article
              key={tier.name}
              className={`flex min-h-[520px] flex-col rounded-[8px] p-7 shadow-lg ${index === 1 ? 'bg-blue-950 text-white ring-4 ring-brand-cyan/70' : 'border border-slate-200 bg-white text-slate-900'}`}
            >
              {index === 1 && (
                <div className="mb-4 text-center">
                  <span className="inline-flex rounded-full bg-brand-cyan px-3 py-1 text-xs font-black text-blue-950">
                    Tavsiya etiladi
                  </span>
                </div>
              )}
              <h3 className={`text-center text-2xl font-black ${index === 1 ? 'text-white' : 'text-blue-950'}`}>{tier.name}</h3>
              <p className={`mt-5 text-center text-4xl font-black ${index === 1 ? 'text-brand-lime' : 'text-blue-950'}`}>
                {tier.price}
              </p>
              <ul className={`mt-7 flex-grow space-y-3 border-t pt-6 ${index === 1 ? 'border-blue-800' : 'border-slate-200'}`}>
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm font-bold leading-6">
                    <CheckCircle2 className={index === 1 ? 'mt-1 h-4 w-4 shrink-0 text-brand-lime' : 'mt-1 h-4 w-4 shrink-0 text-brand-cyan'} aria-hidden="true" />
                    <span className={index === 1 ? 'text-blue-100' : 'text-slate-600'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                onClick={openContactModal}
                className={index === 1 ? 'mt-8 h-12 rounded-[8px] bg-white text-blue-950 hover:bg-brand-lime' : 'mt-8 h-12 rounded-[8px] bg-blue-950 text-white hover:bg-brand-blue'}
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

function ProblemSolutionSection({ problem, solution }: { problem: TextItem; solution: TextItem }) {
  return (
    <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
      <div className="container mx-auto grid max-w-6xl gap-5 px-4 lg:grid-cols-2">
        <ArticlePanel title={problem.title} description={problem.description} tone="light" />
        <ArticlePanel title={solution.title} description={solution.description} tone="dark" />
      </div>
    </section>
  );
}

function ArticlePanel({ title, description, tone }: { title: string; description?: string; tone: 'light' | 'dark' }) {
  return (
    <article className={tone === 'dark' ? 'rounded-[8px] bg-blue-950 p-7 text-white shadow-lg' : 'rounded-[8px] border border-slate-200 bg-slate-50 p-7 text-slate-900'}>
      <h2 className={tone === 'dark' ? 'text-2xl font-black text-white sm:text-3xl' : 'text-2xl font-black text-blue-950 sm:text-3xl'}>{title}</h2>
      <p className={tone === 'dark' ? 'mt-4 text-base leading-8 text-blue-100' : 'mt-4 text-base leading-8 text-slate-600'}>{description}</p>
    </article>
  );
}

function IncludedSection({ included }: { included: CarWrapPageTranslations['included'] }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-normal text-brand-blue">
            {included.eyebrow}
          </div>
          <h2 className="text-balance text-3xl font-black tracking-normal text-blue-950 sm:text-5xl">{included.title}</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {included.items.map((item, index) => {
            const Icon = includedIcons[index % includedIcons.length];
            return (
              <article key={item} className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[8px] bg-brand-cyan/10 text-brand-cyan">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-pretty text-base font-black leading-6 text-blue-950">{item}</h3>
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
    <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
      <div className="container mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <h2 className="text-balance text-3xl font-black tracking-normal text-blue-950 sm:text-5xl">{benefits.title}</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.items.map((item, index) => {
              const Icon = benefitIcons[index % benefitIcons.length];
              return (
                <div key={item} className="flex items-start gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-brand-cyan" aria-hidden="true" />
                  <p className="text-sm font-bold leading-6 text-slate-700">{item}</p>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[8px] border border-slate-200 bg-slate-50 p-7 shadow-sm">
          <h2 className="text-balance text-3xl font-black tracking-normal text-blue-950">{audience.title}</h2>
          <div className="mt-6 grid gap-2">
            {audience.items.map((item) => (
              <div key={item} className="flex items-center gap-3 border-t border-slate-200 py-3 first:border-t-0 first:pt-0">
                <span className="h-2 w-2 rounded-full bg-brand-cyan" aria-hidden="true" />
                <p className="text-sm font-bold leading-6 text-slate-600">{item}</p>
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
    <section className="bg-blue-950 py-16 text-white sm:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-balance text-3xl font-black tracking-normal text-white sm:text-5xl">{process.title}</h2>
        <div className="mt-10 grid gap-3">
          {process.steps.map((step, index) => (
            <article key={step} className="grid gap-4 rounded-[8px] border border-white/10 bg-white/[0.055] p-5 sm:grid-cols-[100px_1fr] sm:items-center">
              <div className="font-mono text-sm font-black text-brand-lime">{String(index + 1).padStart(2, '0')}</div>
              <p className="text-base font-bold leading-7 text-blue-100 sm:text-lg">{step}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ cta }: { cta: CarWrapPageTranslations['cta'] }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="rounded-[8px] bg-blue-950 px-6 py-12 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.8)] sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-normal text-brand-lime">
                <Truck className="h-4 w-4" aria-hidden="true" />
                {cta.brandLabel}
              </div>
              <h2 className="max-w-4xl text-balance text-3xl font-black tracking-normal text-white sm:text-5xl">{cta.title}</h2>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-blue-100 sm:text-lg">{cta.description}</p>
            </div>
            <Button type="button" size="lg" onClick={openContactModal} className="group h-14 rounded-[8px] bg-white px-8 text-base font-black text-blue-950 hover:bg-brand-lime sm:h-16">
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
    <section className="pb-20 sm:pb-28">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-balance text-center text-3xl font-black tracking-normal text-blue-950 sm:text-4xl">{faq.title}</h2>
        <Accordion type="single" collapsible defaultValue="item-0" className="mt-8 space-y-3">
          {faq.items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`} className="rounded-[8px] border border-slate-200 bg-white px-5 shadow-sm">
              <AccordionTrigger className="text-left text-base font-black text-blue-950 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-7 text-slate-600">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default CarWrapDesignClient;
