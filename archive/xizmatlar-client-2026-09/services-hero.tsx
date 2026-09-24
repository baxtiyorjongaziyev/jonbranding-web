
'use client';

import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface ServicesHeroProps {
    onCtaClick: () => void;
    dictionary: any;
}

const ServicesHero: FC<ServicesHeroProps> = ({ onCtaClick, dictionary }) => {
    if (!dictionary) {
        return null;
    }

    return (
        <section className="relative bg-background py-20 sm:py-28 lg:py-32 overflow-hidden">
            <div aria-hidden="true" className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl leading-tight sm:text-5xl md:text-6xl font-extrabold text-foreground">
                        {dictionary.title}
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
                        {dictionary.subtitle}
                    </p>
                    <div className="mt-10 flex justify-center">
                        <Button onClick={onCtaClick} size="lg" variant="default" className="w-full sm:w-auto text-base px-8 py-6 shadow-lg">
                            {dictionary.cta}
                            <ArrowDown className="w-5 h-5 ml-2"/>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesHero;
