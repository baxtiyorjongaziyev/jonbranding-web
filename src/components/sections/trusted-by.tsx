
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { getBrands, type Brand } from '@/lib/airtable';

const staticBrands: Brand[] = [
  { name: 'Korsun', logo: null }, { name: 'Boyarin', logo: null }, { name: 'Sarmilk', logo: null }, { name: 'M-Karim', logo: null }, { name: 'Prime Fit', logo: null }, { name: 'Revo', logo: null }, { name: 'To\'maris', logo: null }, 
  { name: 'Aisha Mebel', logo: null }, { name: 'Den Aroma', logo: null }, { name: 'Velzo', logo: null }, { name: 'Bodomchi', logo: null },
  { name: 'Fidda by Sevara', logo: null }, { name: 'Viton', logo: null }, { name: 'Ravza Mebel', logo: null }, { name: 'Coloray', logo: null }, { name: 'Dayan Color', logo: null }, { name: 'Bekbazar', logo: null }, 
  { name: 'Climart', logo: null }, { name: 'Sunnah Products', logo: null }, { name: 'Petron Polymer', logo: null }, { name: 'Perfona', logo: null }, { name: 'Esviro', logo: null }, { name: 'Savod', logo: null }
];

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
        {brands.map((brand, index) => (
            <CarouselItem
            key={index}
            className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8 pl-4"
            >
             <div className="h-12 flex items-center justify-center p-4 filter grayscale hover:grayscale-0 transition-all duration-300">
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
                    <p className="font-semibold text-gray-500 text-lg text-center whitespace-nowrap">{brand.name}</p>
                )}
             </div>
            </CarouselItem>
        ))}
        </CarouselContent>
    </Carousel>
);


const TrustedBy = () => {
    const [brands, setBrands] = useState<Brand[]>(staticBrands);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const airtableBrands = await getBrands();
                if (airtableBrands && airtableBrands.length > 0) {
                    setBrands(airtableBrands);
                }
            } catch (error) {
                console.error("Failed to fetch brands from Airtable, using static data.", error);
            }
        };
        fetchBrands();
    }, []);

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
