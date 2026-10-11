'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

import { renderHeadline } from '@/lib/headline';

interface CtaBlockProps {
  title: string;
  description: string;
  buttonText: string;
  onCtaClick?: () => void;
  ctaSection?: string;
  ctaSource?: string;
}

const CtaBlock: FC<CtaBlockProps> = ({ title, description, buttonText, onCtaClick, ctaSection = 'cta_block', ctaSource = 'homepage' }) => {
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }

    window.dispatchEvent(new CustomEvent('openContactModal', {
      detail: {
        section: ctaSection,
        ctaText: buttonText,
        source: ctaSource,
      },
    }));
  };

  return (
    <section className="bg-brand-paper py-20 sm:py-24">
      <div className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[#090b0f] px-6 py-12 shadow-[0_42px_110px_-56px_rgba(15,23,42,0.86)] sm:px-10 sm:py-16 lg:px-14">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(118deg,#090b0f_0%,#11151d_64%,#121712_100%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/14" />
          <div className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-normal text-brand-lime">
                <ShieldCheck className="h-4 w-4" />
                Jon.Branding
              </div>
              <h2 className="max-w-4xl text-balance text-3xl font-extrabold leading-tight tracking-normal text-white sm:text-5xl">
                {typeof title === 'string' ? renderHeadline(title, 'text-brand-lime') : title}
              </h2>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-white/65 sm:text-lg">{description}</p>
            </div>
            <Button
              onClick={handleCtaClick}
              size="lg"
              className="group h-14 justify-between rounded-full bg-white py-2 pl-6 pr-2 text-base font-extrabold text-brand-ink shadow-[0_26px_80px_-34px_rgba(255,255,255,0.82)] transition-[background-color,box-shadow,transform] duration-300 hover:bg-brand-lime active:scale-[0.98] sm:h-16 sm:min-w-[290px] sm:text-lg"
            >
              <span>{buttonText}</span>
              <span className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-ink text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-12 sm:w-12">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBlock;
