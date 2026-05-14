'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Testimonial } from '@/lib/types';
import Autoplay from "embla-carousel-autoplay";
import { staticTestimonials, staticTestimonialsRu, staticTestimonialsEn, staticTestimonialsZh } from '@/lib/static-data';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';

const VideoTestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const [unmuted, setUnmuted] = useState(false);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-[9/16] overflow-hidden rounded-t-2xl bg-black">
          <iframe
            src={`${testimonial.videoUrl}&autoplay=1&muted=${unmuted ? '0' : '1'}&loop=1${unmuted ? '' : '&background=1'}`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            className="absolute inset-0 h-full w-full"
            title={testimonial.name + " - testimonial"}
          />
          <button
            onClick={() => setUnmuted(!unmuted)}
            className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/70 active:scale-95"
            aria-label={unmuted ? "Mute" : "Unmute"}
          >
            {unmuted ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-brand-line">
              <AvatarImage src={testimonial.image} alt={testimonial.name} />
              <AvatarFallback>{testimonial.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold text-brand-ink">{testimonial.name}</p>
              <p className="text-xs text-brand-slate">{testimonial.company}</p>
            </div>
          </div>
          {testimonial.quote && (
            <p className="mt-3 text-sm italic leading-relaxed text-brand-slate">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
          )}
        </div>
      </CardContent>
    </div>
  );
};

const TextTestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-line bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-grow flex-col justify-between">
        <div>
          <div className="flex gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="h-4 w-4" />)}
          </div>
          <p className="mt-4 text-sm italic leading-relaxed text-brand-slate">&ldquo;{testimonial.quote}&rdquo;</p>
          {testimonial.audioUrl && (
            <button
              onClick={toggleAudio}
              className={cn("mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors", isPlaying ? "bg-brand-blue text-white" : "bg-brand-mist text-brand-slate hover:bg-brand-blue/10")}
            >
              <Volume2 className="h-3.5 w-3.5" />
              {isPlaying ? "To'xtatish" : "Ovozli izoh"}
              <audio ref={audioRef} src={testimonial.audioUrl} onEnded={() => setIsPlaying(false)} />
            </button>
          )}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-brand-line">
            <AvatarImage src={testimonial.image} alt={testimonial.name} />
            <AvatarFallback>{testimonial.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-brand-ink">{testimonial.name}</p>
            <p className="text-xs text-brand-slate">{testimonial.company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsClient = ({ testimonials, dictionary, lang }: { testimonials: Testimonial[], dictionary: any, lang: string }) => {
  const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const translations = dictionary;

  const [videoTestimonials, setVideoTestimonials] = useState<Testimonial[]>([]);
  const [textTestimonials, setTextTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const video = testimonials.filter(t => t.videoUrl);
    const text = testimonials.filter(t => !t.videoUrl);

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
    <BrandSection tone="soft" className="overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionIntro eyebrow="Client voice" title={translations.title} description={translations.subtitle} className="mb-12" />

        {videoTestimonials.length > 0 && (
          <div className="mx-auto max-w-6xl">
            <Carousel
              plugins={[autoplayPlugin.current]}
              opts={{ align: "start", loop: true }}
              onMouseEnter={autoplayPlugin.current.stop}
              onMouseLeave={autoplayPlugin.current.reset}
              className="relative w-full"
            >
              <CarouselContent className="-ml-4">
                {videoTestimonials.map((testimonial, index) => (
                  <CarouselItem key={`video-${index}`} className="basis-[80%] pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="h-full py-2">
                      <VideoTestimonialCard testimonial={testimonial} />
                    </div>
                  </CarouselItem>
                ))}
                {textTestimonials.map((testimonial, index) => (
                  <CarouselItem key={`text-${index}`} className="basis-[80%] pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="h-full py-2">
                      <TextTestimonialCard testimonial={testimonial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden sm:block">
                <CarouselPrevious className="absolute -left-4 h-11 w-11 border-brand-line shadow-md transition-all duration-200 hover:bg-brand-ink hover:text-white lg:-left-12" />
                <CarouselNext className="absolute -right-4 h-11 w-11 border-brand-line shadow-md transition-all duration-200 hover:bg-brand-ink hover:text-white lg:-right-12" />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </BrandSection>
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
