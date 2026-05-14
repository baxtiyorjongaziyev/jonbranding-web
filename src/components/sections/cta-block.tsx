import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CtaBlockProps {
  title: string;
  description: string;
  buttonText: string;
  onCtaClick: () => void;
}

const CtaBlock: FC<CtaBlockProps> = ({ title, description, buttonText, onCtaClick }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-brand-ink px-8 py-16 text-center shadow-[0_40px_100px_-40px_rgba(15,23,42,0.3)] sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-blue-600/15 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-[80px]" />
          </div>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-white/60">
            {description}
          </p>
          <div className="mt-10">
            <Button
              onClick={onCtaClick}
              size="lg"
              className="group h-14 rounded-2xl bg-white px-8 text-base font-bold text-brand-ink shadow-lg transition-all duration-200 hover:bg-brand-lime hover:shadow-xl active:scale-[0.97] sm:h-16 sm:px-10 sm:text-lg"
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
