'use client';

import Link from 'next/link';
import { ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { getLocalizedPath, type Locale } from '@/lib/i18n/locale';
import { resolveBlogCtaTarget } from '@/lib/blog-cta';

export interface BlogPostCtaCopy {
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
  ctaSecondaryPatent: string;
  ctaSecondaryPackaging: string;
  ctaSecondaryNaming: string;
  ctaSecondaryBrandbook: string;
  ctaSecondaryBranding: string;
  ctaServicePatent: string;
  ctaServicePackaging: string;
  ctaServiceNaming: string;
  ctaServiceBrandbook: string;
  ctaServiceBranding: string;
}

interface BlogPostCtaProps {
  lang: Locale;
  slug: string;
  title: string;
  keywords?: string[];
  copy: BlogPostCtaCopy;
}

export function BlogPostCta({ lang, slug, title, keywords, copy }: BlogPostCtaProps) {
  const target = resolveBlogCtaTarget({ slug, title, keywords });
  const serviceLabel = copy[target.serviceKey];
  const secondaryLabel = copy[target.secondaryKey];

  const handleConsultClick = () => {
    window.dispatchEvent(
      new CustomEvent('openContactModal', {
        detail: {
          section: 'blog_post_cta',
          source: `blog_${target.cluster}`,
          service: serviceLabel,
          intent: 'consultation',
        },
      }),
    );
  };

  return (
    <section
      aria-labelledby="blog-post-cta-heading"
      className="mt-14 rounded-3xl border border-slate-200 bg-[#0A0B0E] p-7 text-white sm:p-10"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#8FA8FF]">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        {serviceLabel}
      </div>

      <h2
        id="blog-post-cta-heading"
        className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
      >
        {copy.ctaTitle}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
        {copy.ctaDesc}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleConsultClick}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#2554FF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2554FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E]"
        >
          <span>{copy.ctaButton}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <Link
          href={getLocalizedPath(lang, target.href)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Calculator className="h-4 w-4 text-[#8FA8FF]" aria-hidden="true" />
          <span>{secondaryLabel}</span>
        </Link>
      </div>
    </section>
  );
}
