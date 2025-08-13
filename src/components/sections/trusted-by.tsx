'use client';

import React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const logos = [
  { name: 'Korzinka', src: 'https://placehold.co/140x60.png', hint: 'Korzinka supermarket logo' },
  { name: 'Texnomart', src: 'https://placehold.co/140x60.png', hint: 'Texnomart electronics store logo' },
  { name: 'Artel', src: 'https://placehold.co/140x60.png', hint: 'Artel electronics logo' },
  { name: 'Akfa', src: 'https://placehold.co/140x60.png', hint: 'Akfa Group logo' },
  { name: 'Uzum', src: 'https://placehold.co/140x60.png', hint: 'Uzum market logo' },
  { name: 'Click', src: 'https://placehold.co/140x60.png', hint: 'Click payment system logo' },
  { name: 'Payme', src: 'https://placehold.co/140x60.png', hint: 'Payme payment system logo' },
  { name: 'TBC Bank', src: 'https://placehold.co/140x60.png', hint: 'TBC Bank Uzbekistan logo' },
];

const TrustedBy = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-bold uppercase tracking-wider text-gray-500">
          Bizga ishonch bildirgan kompaniyalar
        </p>
        <div className="mt-8">
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
            <CarouselContent className="-ml-8">
              {logos.concat(logos).map((logo, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 pl-8"
                >
                  <div className="flex items-center justify-center h-20">
                    <Image
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      width={140}
                      height={60}
                      className="object-contain max-h-12 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                      data-ai-hint={logo.hint}
                    />
                  </div>
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
