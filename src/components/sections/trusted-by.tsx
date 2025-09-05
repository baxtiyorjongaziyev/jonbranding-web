
'use client';

import React from 'react';
import { type Brand } from '@/lib/types';
import { cn } from '@/lib/utils';

const Marquee = ({ brands, direction = 'forward' }: { brands: Brand[], direction?: 'forward' | 'backward' }) => (
    <div className="flex w-full overflow-hidden">
      <ul className={cn(
        "flex min-w-full shrink-0 items-center gap-16",
        direction === 'forward' ? 'animate-marquee-forward' : 'animate-marquee-backward'
      )}>
        {brands.map((brand, index) => (
          <li key={index} id={brand.name === 'Savod' ? 'savod-logo-li' : undefined} className="flex-shrink-0 h-16 w-40 flex items-center justify-center">
             <div className="flex items-center justify-center p-2 h-full w-full transition-all duration-300">
                {brand.logo ? (
                    <img
                        src={brand.logo}
                        alt={brand.name}
                        className="object-contain max-w-full max-h-full"
                    />
                ) : (
                    <p className="font-semibold text-gray-500 text-base text-center whitespace-nowrap">{brand.name}</p>
                )}
            </div>
          </li>
        ))}
      </ul>
      {/* Second list for seamless animation */}
      <ul className={cn(
        "flex min-w-full shrink-0 items-center gap-16",
        direction === 'forward' ? 'animate-marquee-forward' : 'animate-marquee-backward'
      )} aria-hidden="true">
        {brands.map((brand, index) => (
          <li key={index + brands.length} id={brand.name === 'Savod' ? 'savod-logo-li' : undefined} className="flex-shrink-0 h-16 w-40 flex items-center justify-center">
             <div className="flex items-center justify-center p-2 h-full w-full transition-all duration-300">
                {brand.logo ? (
                    <img
                        src={brand.logo}
                        alt={brand.name}
                        className="object-contain max-w-full max-h-full"
                    />
                ) : (
                    <p className="font-semibold text-gray-500 text-base text-center whitespace-nowrap">{brand.name}</p>
                )}
            </div>
          </li>
        ))}
      </ul>
    </div>
);

interface TrustedByProps {
  brands: Brand[];
}

const TrustedBy: React.FC<TrustedByProps> = ({ brands }) => {
    const numBrands = brands.length;
    const third = Math.ceil(numBrands / 3);
    const brandsTopRow = brands.slice(0, third);
    const brandsMiddleRow = brands.slice(third, third * 2);
    const brandsBottomRow = brands.slice(third * 2);

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-center text-base font-bold uppercase tracking-wider text-gray-600">
          Bizga ishonch bildirgan kompaniyalar
        </p>
      </div>
       <div className="mt-8 flex flex-col gap-4">
            <Marquee brands={brandsTopRow} direction="forward" />
            <Marquee brands={brandsMiddleRow} direction="backward" />
            <Marquee brands={brandsBottomRow} direction="forward" />
        </div>
    </section>
  );
};

export default TrustedBy;
