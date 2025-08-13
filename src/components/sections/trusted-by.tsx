'use client';

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card } from '@/components/ui/card';

const brands = [
  'Korsun', 'Boyarin', 'Sarmilk', 'M-Karim', 'Prime Fit', 'Revo', 'To\'maris', 
  'Aisha Mebel', 'Den Aroma', 'Velzo', 'Bodomchi', 'Fidda by Sevara', 'Viton',
  'Ravza Mebel', 'Coloray', 'Dayan Color', 'Bekbazar', 'Climart', 'Sunnah Products',
  'Petron Polymer', 'Perfona', 'Esviro', 'Savod'
];

const brandsPart1 = brands.slice(0, Math.ceil(brands.length / 2));
const brandsPart2 = brands.slice(Math.ceil(brands.length / 2));

const TrustedBy = () => {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-bold uppercase tracking-wider text-gray-500">
          Bizga ishonch bildirgan kompaniyalar
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {brandsPart1.map((brand, index) => (
                <CarouselItem
                  key={index}
                  className="basis-auto pl-4"
                >
                  <Card className="px-5 py-3 whitespace-nowrap bg-secondary/50 border-gray-200">
                    <p className="font-semibold text-gray-700">{brand}</p>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
           <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
                direction: 'right',
              }),
            ]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {brandsPart2.map((brand, index) => (
                <CarouselItem
                  key={index}
                  className="basis-auto pl-4"
                >
                  <Card className="px-5 py-3 whitespace-nowrap bg-secondary/50 border-gray-200">
                     <p className="font-semibold text-gray-700">{brand}</p>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
