
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
    <section className="bg-brand-paper py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-ink p-8 text-center text-white shadow-2xl sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(58,225,255,0.28),transparent_34rem)]" />
          <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">{title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/72">
            {description}
          </p>
          <div className="mt-8">
            <Button
              onClick={onCtaClick}
              size="lg"
              variant="default"
              className="h-auto w-full whitespace-normal rounded-2xl bg-white px-6 py-3 text-base text-brand-ink shadow-lg hover:bg-brand-lime sm:w-auto sm:text-lg"
            >
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
            </Button>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBlock;
