
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Star, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { type Testimonial } from '@/lib/types';
import Autoplay from "embla-carousel-autoplay";
import { staticTestimonials, staticTestimonialsRu, staticTestimonialsEn, staticTestimonialsZh } from '@/lib/static-data';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    const [playVideo, setPlayVideo] = useState(false);

    const handlePlayVideo = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setPlayVideo(true);
    };
    
    return (
      <Card className="h-full flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="relative w-full h-64 flex-shrink-0 bg-black cursor-pointer" onClick={testimonial.videoUrl ? handlePlayVideo : undefined}>
            {playVideo && testimonial.videoUrl ? (
                <div className="absolute inset-0 w-full h-full z-10">
                    <iframe
                        src={`${testimonial.videoUrl}&autoplay=1`}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                        className="absolute inset-0 w-full h-full"
                        title={testimonial.name + " - testimonial"}
                    ></iframe>
                </div>
            ) : (
                 <>
                    <Image 
                        src={testimonial.image!} 
                        alt={testimonial.name} 
                        data-ai-hint={testimonial.imageHint} 
                        fill
                        className={cn("object-cover", testimonial.name === 'Javohir Haqberdiyev' ? 'object-top' : 'object-center')}
                    />
                    {testimonial.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 transition-opacity opacity-0 group-hover:opacity-100">
                            <PlayCircle className="w-16 h-16 text-white/80" />
                        </div>
                    )}
                 </>
            )}
        </div>
        
        <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
                 <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
                </div>
                <CardContent className="p-0 text-gray-700">
                    <p>"{testimonial.quote}"</p>
                </CardContent>
            </div>
            <div className="mt-6 flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-bold text-dark-blue">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
            </div>
        </div>
      </Card>
    );
};

const TestimonialsClient = ({ testimonials, dictionary, lang }: { testimonials: Testimonial[], dictionary: any, lang: string }) => {
    const autoplayPlugin = useRef(
      Autoplay({ delay: 5000, stopOnInteraction: true })
    );
    
    const translations = dictionary;
    
    if (!testimonials || testimonials.length === 0 || !translations) {
      return null;
    }

  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            {translations.subtitle}
          </p>
        </div>
        
        <div className="mt-16">
            <Carousel 
                plugins={[autoplayPlugin.current]}
                opts={{ align: "start", loop: true }} 
                onMouseEnter={autoplayPlugin.current.stop}
                onMouseLeave={autoplayPlugin.current.reset}
                className="w-full">
                <CarouselContent className="-ml-4">
                    {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                            <TestimonialCard testimonial={testimonial} />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </div>
      </div>
    </section>
  )
}

const Testimonials = ({ lang, dictionary }: { lang: string, dictionary: any }) => {
    let testimonials;
    switch (lang) {
        case 'ru':
            testimonials = staticTestimonialsRu;
            break;
        case 'en':
            testimonials = staticTestimonialsEn;
            break;
        case 'zh':
            testimonials = staticTestimonialsZh;
            break;
        default:
            testimonials = staticTestimonials;
    }
    return <TestimonialsClient testimonials={testimonials} dictionary={dictionary} lang={lang} />
};

export default Testimonials;

    