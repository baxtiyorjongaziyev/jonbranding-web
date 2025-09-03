
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { type Testimonial } from '@/lib/types';

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
    const [playVideo, setPlayVideo] = useState(false);

    const isVideo = !!testimonial.videoUrl;

    if (isVideo) {
        return (
            <Card className="h-full flex flex-col md:flex-row bg-white shadow-lg rounded-2xl overflow-hidden">
                <div className="md:w-5/12 flex-shrink-0 relative bg-black">
                    <div style={{padding:'177.78% 0 0 0', position:'relative'}}>
                        {playVideo ? (
                            <iframe
                                src={testimonial.videoUrl}
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}
                                title={testimonial.name + " - Baxtiyorjon Gaziyev haqida fikrlari"}
                            ></iframe>
                        ) : (
                            <div className="absolute inset-0 w-full h-full cursor-pointer group" onClick={() => setPlayVideo(true)}>
                                <Image src={testimonial.image!} alt={testimonial.name} data-ai-hint={testimonial.imageHint} fill className="object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                        <CardContent className="p-0 text-gray-700">
                            <p>"{testimonial.quote}"</p>
                        </CardContent>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint={testimonial.imageHint} />
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
    }
    
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
                    <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint={testimonial.imageHint} />
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
  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Mijozlarimiz biz haqimizda</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Bizning eng katta yutug'imiz - bu mamnun mijozlarimiz.
          </p>
        </div>
        <div className="mt-12">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                    {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-2/3">
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

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(staticTestimonials);

    useEffect(() => {
        // Data is now static, no need to fetch.
        setTestimonials(staticTestimonials);
    }, []);

    return <TestimonialsClient testimonials={testimonials} />
};

export default Testimonials;
