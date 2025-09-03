
'use client';

import React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { type Brand } from '@/lib/types';
import { cn } from '@/lib/utils';

const BrandCarousel = ({ brands, direction = 'forward' }: { brands: Brand[], direction?: 'forward' | 'backward' }) => (
    <Carousel
        plugins={[
        Autoplay({
            delay: 2000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            direction,
        }),
        ]}
        opts={{
        align: 'start',
        loop: true,
        }}
        className="w-full"
    >
        <CarouselContent className="-ml-4">
        {brands.map((brand, index) => {
            return (
                <CarouselItem
                key={index}
                className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8 pl-4"
                >
                <div className="flex items-center justify-center p-2 filter grayscale hover:grayscale-0 transition-all duration-300 h-20">
                    {brand.logo ? (
                        <div className="relative w-full h-full">
                            <Image 
                                src={brand.logo}
                                alt={brand.name}
                                fill
                                sizes="(max-width: 768px) 10vw, (max-width: 1200px) 8vw, 6vw"
                                className="object-contain"
                            />
                        </div>
                    ) : (
                        <p className="font-semibold text-gray-500 text-base text-center whitespace-nowrap">{brand.name}</p>
                    )}
                </div>
                </CarouselItem>
            );
        })}
        </CarouselContent>
    </Carousel>
);

interface TrustedByProps {
  brands: Brand[];
}

const TrustedBy: React.FC<TrustedByProps> = ({ brands }) => {
    const middleIndex = Math.ceil(brands.length / 2);
    const brandsMovingLeft = brands.slice(0, middleIndex);
    const brandsMovingRight = brands.slice(middleIndex);

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-bold uppercase tracking-wider text-gray-500">
          Bizga ishonch bildirgan kompaniyalar
        </p>
        <div className="mt-8 flex flex-col gap-4">
            <BrandCarousel brands={brandsMovingLeft} direction="forward" />
            <BrandCarousel brands={brandsMovingRight} direction="backward" />
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
