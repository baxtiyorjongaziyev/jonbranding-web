
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Star, PlayCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { type Testimonial } from '@/lib/types';
import Autoplay from "embla-carousel-autoplay";
import { staticTestimonials, staticTestimonialsRu, staticTestimonialsEn, staticTestimonialsZh } from '@/lib/static-data';

const VideoTestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    const [playVideo, setPlayVideo] = useState(false);

    const handlePlayVideo = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setPlayVideo(true);
    };
    
    return (
        <Card className="h-full flex flex-col bg-white shadow-xl rounded-2xl overflow-hidden group">
            <CardContent className="p-0">
                <div className="relative w-full aspect-video bg-black cursor-pointer" onClick={handlePlayVideo}>
                    {playVideo ? (
                        <div className="absolute inset-0 w-full h-full z-10">
                            <iframe
                                src={`${testimonial.videoUrl}&autoplay=1`}
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                                className="w-full h-full"
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
                                className={cn("object-cover", testimonial.name === 'Javohir Haqberdiyev' ? 'object-top' : 'object-center', "transition-transform duration-500 group-hover:scale-105")}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 transition-opacity opacity-0 group-hover:opacity-100">
                                <PlayCircle className="w-20 h-20 text-white/80" />
                            </div>
                        </>
                    )}
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-dark-blue">{testimonial.name}</p>
                            <p className="text-sm text-gray-500">{testimonial.company}</p>
                        </div>
                    </div>
                     <blockquote className="mt-4 border-l-4 border-primary/20 pl-4 text-gray-600 italic">
                        "{testimonial.quote}"
                    </blockquote>
                </div>
            </CardContent>
        </Card>
    );
};


const TextTestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    return (
      <Card className="h-full flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-6 flex flex-col justify-between flex-grow">
            <div>
                 <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
                </div>
                <p className="text-gray-700">"{testimonial.quote}"</p>
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
        </CardContent>
      </Card>
    );
};

const TestimonialsClient = ({ testimonials, dictionary }: { testimonials: Testimonial[], dictionary: any }) => {
    const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
    const translations = dictionary;
    
    const [videoTestimonials, setVideoTestimonials] = useState<Testimonial[]>([]);
    const [textTestimonials, setTextTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        const video = testimonials.filter(t => t.videoUrl);
        const text = testimonials.filter(t => !t.videoUrl);
        
        // Ensure Sherzod Beknazarov and Ibrohimjon Mahammadjonov are first if they exist
        const prioritizedVideos = video.sort((a, b) => {
            if (a.name.includes('Sherzod Beknazarov')) return -1;
            if (b.name.includes('Sherzod Beknazarov')) return 1;
            if (a.name.includes('Ibrohimjon Mahammadjonov')) return -1;
            if (b.name.includes('Ibrohimjon Mahammadjonov')) return 1;
            return 0;
        });

        setVideoTestimonials(prioritizedVideos);
        setTextTestimonials(text);
    }, [testimonials]);
    
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
        
        {videoTestimonials.length > 0 && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {videoTestimonials.map((testimonial, index) => (
                    <VideoTestimonialCard key={`video-${index}`} testimonial={testimonial} />
                ))}
            </div>
        )}
        
        {textTestimonials.length > 0 && (
             <div className="mt-16">
                <h3 className="text-center text-2xl font-bold text-dark-blue mb-2 flex items-center justify-center gap-2">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    {translations.textReviewsTitle}
                </h3>
                 <p className="text-center text-muted-foreground mb-12">{translations.textReviewsSubtitle}</p>
                <Carousel 
                    plugins={[autoplayPlugin.current]}
                    opts={{ align: "start", loop: true }} 
                    onMouseEnter={autoplayPlugin.current.stop}
                    onMouseLeave={autoplayPlugin.current.reset}
                    className="w-full">
                    <CarouselContent className="-ml-4">
                        {textTestimonials.map((testimonial, index) => (
                        <CarouselItem key={`text-${index}`} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <div className="p-1 h-full">
                                <TextTestimonialCard testimonial={testimonial} />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                </Carousel>
            </div>
        )}
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
    return <TestimonialsClient testimonials={testimonials} dictionary={dictionary} />
};

export default Testimonials;
