
'use client';

import React from 'react';
import { type Brand } from '@/lib/types';
import { cn } from '@/lib/utils';
import { staticBrands } from '@/lib/static-data';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';

const Marquee = ({ brands, direction = 'forward' }: { brands: Brand[], direction?: 'forward' | 'backward' }) => {
    if (!brands || brands.length === 0) return null;

    return (
        <div className="flex w-full overflow-hidden">
            <div className="flex-grow flex w-full overflow-hidden select-none">
                <ul className={cn(
                    "flex min-w-full shrink-0 items-center justify-around",
                    direction === 'forward' ? 'animate-marquee-forward' : 'animate-marquee-backward'
                )}>
                    {brands.map((brand, index) => (
                        <li key={index} id={brand.name === 'Savod' ? 'savod-logo-li' : undefined} className="flex-shrink-0 h-20 w-44 flex items-center justify-center mx-3">
                            <div className="brand-card flex items-center justify-center p-4 h-full w-full grayscale hover:grayscale-0 transition-all duration-300">
                                {brand.logo ? (
                                    <img
                                        src={brand.logo}
                                        alt={`${brand.name} logo`}
                                        loading="lazy"
                                        className="object-contain max-w-full max-h-full transition-all duration-300 hover:scale-105"
                                    />
                                ) : (
                                    <p className="font-semibold text-gray-500 text-base text-center whitespace-nowrap">{brand.name}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                <ul className={cn(
                    "flex min-w-full shrink-0 items-center justify-around",
                    direction === 'forward' ? 'animate-marquee-forward' : 'animate-marquee-backward'
                )} aria-hidden="true">
                    {brands.map((brand, index) => (
                        <li key={`dup-${index}`} className="flex-shrink-0 h-20 w-44 flex items-center justify-center mx-3">
                            <div className="brand-card flex items-center justify-center p-4 h-full w-full grayscale">
                                {brand.logo ? (
                                    <img
                                        src={brand.logo}
                                        alt={`${brand.name} logo`}
                                        loading="lazy"
                                        className="object-contain max-w-full max-h-full"
                                    />
                                ) : (
                                    <p className="font-semibold text-gray-500 text-base text-center">{brand.name}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const TrustedBy: React.FC<{ lang: string, dictionary: any }> = ({ lang, dictionary }) => {
    const brands = staticBrands.filter(b => !b.hiddenInHero);
    const numBrands = brands.length;
    const third = Math.ceil(numBrands / 3);
    const brandsTopRow = brands.slice(0, third);
    const brandsMiddleRow = brands.slice(third, third * 2);
    const brandsBottomRow = brands.slice(third * 2);

    const title = dictionary?.title;
    if (!title) return null;

  return (
    <BrandSection tone="light" aria-labelledby="trusted-by-title">
      <div className="container mx-auto px-4">
        <SectionIntro eyebrow="Proof wall" title={<span id="trusted-by-title">{title}</span>} />
      </div>
       <div className="mt-10 flex flex-col gap-4">
            <Marquee brands={brandsTopRow} direction="forward" />
            <Marquee brands={brandsMiddleRow} direction="backward" />
            <Marquee brands={brandsBottomRow} direction="forward" />
        </div>
    </BrandSection>
  );
};

export default TrustedBy;
