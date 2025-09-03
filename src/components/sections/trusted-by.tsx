
'use client';

import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card } from '@/components/ui/card';
import { getBrands, type Brand } from '@/lib/airtable';

const staticBrands: Brand[] = [
  { name: 'Korsun' }, { name: 'Boyarin' }, { name: 'Sarmilk' }, { name: 'M-Karim' }, { name: 'Prime Fit' }, { name: 'Revo' }, { name: 'To\'maris' }, 
  { name: 'Aisha Mebel' }, { name: 'Den Aroma' }, { name: 'Velzo' }, { name: 'Bodomchi' },
  { name: 'Fidda by Sevara' }, { name: 'Viton' }, { name: 'Ravza Mebel' }, { name: 'Coloray' }, { name: 'Dayan Color' }, { name: 'Bekbazar' }, 
  { name: 'Climart' }, { name: 'Sunnah Products' }, { name: 'Petron Polymer' }, { name: 'Perfona' }, { name: 'Esviro' }, { name: 'Savod' }
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
            className="basis-auto pl-4"
            >
             <div className="h-12 flex items-center justify-center p-4 filter grayscale hover:grayscale-0 transition-all duration-300">
                {/* 
                  Ideal variant: SVG logotipini joylash
                  <img src="/logos/brand.svg" alt={brand.name} className="h-full w-auto object-contain" /> 
                */}
                <p className="font-semibold text-gray-500 text-lg">{brand.name}</p>
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
