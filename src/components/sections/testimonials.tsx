
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { type Testimonial } from '@/lib/types';
import Autoplay from "embla-carousel-autoplay";

const staticTestimonials: Testimonial[] = [
  {
    name: "Sherzod Beknazarov",
    company: "Incontrol Consulting asoschisi",
    avatar: "SB",
    image: "https://cdn.prod.website-files.com/6732e36be7888a23d003ba42/6889ad93216bbf489283543b_photo_2025-07-29_18-13-15.jpg",
    imageHint: "male business owner",
    quote: "Did, estetik did. Bu tug'ma bo'ladimi yoki orttirilgan ko'nikma bo'ladimi? Shunday estetik did egasidan biri Baxtiyorjon - Bizni Incontrol va Sherzod Beknazarov logolarini qilishda bizga yordam berdi. Baxtiyorjonga minnatdorchilik bildirmoqchimiz. Rahmat.",
    videoUrl: "https://player.vimeo.com/video/1109892890?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&dnt=1"
  },
  {
    name: "Sevara Xolmanova",
    company: "Fidda by Sevara asoschisi",
    avatar: "SX",
    image: "https://cdn.prod.website-files.com/6732e36be7888a23d003ba42/6870dc24eb7c5e3e218d41be_photo_2025-07-11_14-39-49-p-1080.jpg",
    imageHint: "female entrepreneur portrait",
    quote: "Men bu jamoa bn ishlab ko'rdim menga juda yoqdi samarali va natijasi siz kutgandanda A'lo bo'larkan brendlashni xam stikerlash va patenlashni xam berganman 7 oyda aniq boladi Hudo xohlasa Halol ishlarkansilar Allox rozi bo'lsin silardan juda xursand bo'ldim ishilarga rivoj Rahmat."
  },
  {
    name: "Nodirbek",
    company: "Barakah Restoran asoschisi",
    avatar: "N",
    image: "https://cdn.prod.website-files.com/6732e36be7888a23d003ba42/673806bc7ef0810b3f78b5db_photo_2024-11-16_07-42-43.jpg",
    imageHint: "restaurant manager portrait",
    quote: "Esingizda bo‘lsa, 3 yil oldin shu brendning logosini sizlar ishlab bergandingiz. Sizlarga katta rahmat, ajoyib chiqqan, rostdan hamma maqtayapti. Rahmat katta, Baxtiyor aka! 🤝🏻😊"
  },
  {
    name: "Javohir Haqberdiyev",
    company: "Perfona asoschisi",
    avatar: "JH",
    image: "https://cdn.prod.website-files.com/6732e36be7888a23d003ba42/67480e63648c1fa51ca4adff_A5%20-%201.jpg",
    imageHint: "tech startup founder",
    quote: "Men kutganimdan ham zo'r bo'ldi. Hozir logotipni ko'ryapmanda o'zim ham mazza qilyapman. Menga yoqqan tomoni ishonch bo'ldi. Keyin muddatdan oldin topshirilgani juda zo'r bo'ldi. Tez natijalar bilan bo'lishganiz zo'r bo'ldi. Rahmat aka kattakon!"
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    
    return (
      <Card className="h-full flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="relative w-full h-64 flex-shrink-0 bg-black">
             <Image 
                src={testimonial.image!} 
                alt={testimonial.name} 
                data-ai-hint={testimonial.imageHint} 
                fill
                className={cn("object-cover", testimonial.name === 'Javohir Haqberdiyev' ? 'object-top' : 'object-center')}
            />
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

const TestimonialsClient = ({ testimonials }: { testimonials: Testimonial[] }) => {
    const plugin = React.useRef(
      Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const [playVideo, setPlayVideo] = useState(false);

    if (!testimonials || testimonials.length === 0) {
      return null;
    }

    const videoTestimonial = testimonials.find(t => t.videoUrl);
    const otherTestimonials = testimonials.filter(t => !t.videoUrl);

  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Mijozlarimiz biz haqimizda</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Bizning eng katta yutug'imiz - bu mamnun mijozlarimiz.
          </p>
        </div>
        
        {videoTestimonial && (
            <div className="mt-12 max-w-5xl mx-auto">
                <Card className="bg-white shadow-xl rounded-2xl p-8">
                     <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
                                </div>
                                <span className="font-bold text-gray-800">5.0</span>
                            </div>
                            <blockquote className="text-lg text-gray-700 leading-relaxed">
                                "{videoTestimonial.quote}"
                            </blockquote>
                            <div className="mt-2 flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={videoTestimonial.image} alt={videoTestimonial.name} />
                                    <AvatarFallback>{videoTestimonial.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-dark-blue">{videoTestimonial.name}</p>
                                    <p className="text-sm text-gray-500">{videoTestimonial.company}</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group" onClick={() => setPlayVideo(true)}>
                            {playVideo ? (
                                <iframe
                                    src={videoTestimonial.videoUrl}
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                    className="absolute inset-0 w-full h-full"
                                    title={videoTestimonial.name + " - Baxtiyorjon Gaziyev haqida fikrlari"}
                                ></iframe>
                            ) : (
                                <>
                                    <Image src={videoTestimonial.image!} alt={videoTestimonial.name} data-ai-hint={videoTestimonial.imageHint} fill className="object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white transition-colors" />
                                    </div>
                                </>
                            )}
                        </div>
                     </div>
                </Card>
            </div>
        )}

        {otherTestimonials.length > 0 && (
            <div className="mt-16">
                <Carousel 
                    opts={{ align: "start", loop: true }} 
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.play}
                    className="w-full">
                    <CarouselContent className="-ml-4">
                        {otherTestimonials.map((testimonial, index) => (
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
        )}
      </div>
    </section>
  )
}

const Testimonials = () => {
    return <TestimonialsClient testimonials={staticTestimonials} />
};

export default Testimonials;
