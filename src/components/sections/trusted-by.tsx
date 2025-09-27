
'use client';

import React from 'react';
import { type Brand } from '@/lib/types';
import { cn } from '@/lib/utils';
import { staticBrands } from '@/lib/static-data';

const Marquee = ({ brands, direction = 'forward' }: { brands: Brand[], direction?: 'forward' | 'backward' }) => {
    if (!brands || brands.length === 0) return null;

    return (
        <div className="flex w-full overflow-hidden">
            <div className="flex-grow flex w-full overflow-hidden">
                <ul className={cn(
                    "flex min-w-full shrink-0 items-center justify-around",
                    direction === 'forward' ? 'animate-marquee-forward' : 'animate-marquee-backward'
                )}>
                    {brands.map((brand, index) => (
                        <li key={index} id={brand.name === 'Savod' ? 'savod-logo-li' : undefined} className="flex-shrink-0 h-16 w-40 flex items-center justify-center mx-4">
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
                    "flex min-w-full shrink-0 items-center justify-around",
                    direction === 'forward' ? 'animate-marquee-forward' : 'animate-marquee-backward'
                )} aria-hidden="true">
                    {brands.map((brand, index) => (
                        <li key={index + brands.length} id={brand.name === 'Savod' ? 'savod-logo-li' : undefined} className="flex-shrink-0 h-16 w-40 flex items-center justify-center mx-4">
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
        </div>
    );
};

const TrustedBy: React.FC<{ lang: string }> = ({ lang }) => {
    const brands = staticBrands;
    const numBrands = brands.length;
    const third = Math.ceil(numBrands / 3);
    const brandsTopRow = brands.slice(0, third);
    const brandsMiddleRow = brands.slice(third, third * 2);
    const brandsBottomRow = brands.slice(third * 2);

    const t = {
        uz: "Bizga ishonch bildirgan kompaniyalar",
        ru: "Компании, которые нам доверяют"
    }
    const title = lang === 'ru' ? t.ru : t.uz;

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h2>
      </div>
       <div className="mt-10 flex flex-col gap-4">
            <Marquee brands={brandsTopRow} direction="forward" />
            <Marquee brands={brandsMiddleRow} direction="backward" />
            <Marquee brands={brandsBottomRow} direction="forward" />
        </div>
    </section>
  );
};

export default TrustedBy;
