import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface CtaBlockProps {
  title: string;
  description: string;
  buttonText: string;
  onCtaClick: () => void;
}

const CtaBlock: FC<CtaBlockProps> = ({ title, description, buttonText, onCtaClick }) => {
  return (
    <section className="bg-[#fbfaf7] py-16">
      <div className="container mx-auto px-4">
        <div className="relative isolate overflow-hidden rounded-[8px] border border-white/10 bg-[#070b12] px-6 py-12 shadow-[0_40px_100px_-45px_rgba(15,23,42,0.7)] sm:px-10 sm:py-16">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,#070b12_0%,#111a3a_54%,#06292e_100%)]" />
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-brand-cyan">
                <ShieldCheck className="h-4 w-4" />
                Jon.Branding
              </div>
              <h2 className="max-w-4xl text-balance text-3xl font-black tracking-tight text-white sm:text-5xl">{title}</h2>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-white/65 sm:text-lg">{description}</p>
            </div>
            <Button
              onClick={onCtaClick}
              size="lg"
              className="group h-14 rounded-[8px] bg-white px-8 text-base font-black text-brand-ink shadow-lg transition-all duration-200 hover:bg-brand-lime active:scale-[0.98] sm:h-16 sm:px-10 sm:text-lg"
            >
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBlock;
