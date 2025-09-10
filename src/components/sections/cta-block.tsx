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
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl bg-primary p-8 sm:p-12 text-center text-primary-foreground shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">{title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            {description}
          </p>
          <div className="mt-8">
            <Button
              onClick={onCtaClick}
              size="lg"
              variant="secondary"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-ocean text-base sm:text-lg animate-subtle-pulse h-auto py-3 px-6 whitespace-normal w-full sm:w-auto"
            >
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBlock;
