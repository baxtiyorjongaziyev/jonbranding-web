'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Star, PlayCircle, Pause, Play, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { type Testimonial } from '@/lib/types';
import Autoplay from "embla-carousel-autoplay";
import { staticTestimonials, staticTestimonialsRu, staticTestimonialsEn, staticTestimonialsZh } from '@/lib/static-data';
import { BrandCard, BrandSection, SectionIntro } from '@/components/ui/design-system';

const VideoTestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    const [playVideo, setPlayVideo] = useState(false);

    const handlePlayVideo = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setPlayVideo(true);
    };
    
    return (
        <BrandCard className="h-full flex flex-col overflow-hidden group p-0">
            <CardContent className="p-0">
                <div className="relative w-full aspect-[3/4] sm:aspect-[9/16] bg-black cursor-pointer rounded-t-2xl overflow-hidden" onClick={handlePlayVideo}>
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
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 transition-opacity opacity-70 group-hover:opacity-100">
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
                            <p className="font-bold text-brand-ink">{testimonial.name}</p>
                            <p className="text-sm text-brand-slate">{testimonial.company}</p>
                        </div>
                    </div>
                     {testimonial.quote && (
                        <blockquote className="mt-4 border-l-4 border-primary/20 pl-4 text-gray-600 italic">
                            "{testimonial.quote}"
                        </blockquote>
                     )}
                </div>
            </CardContent>
        </BrandCard>
    );
};


const TextTestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    return (
      <BrandCard className="h-full flex flex-col overflow-hidden">
        <div className="p-8 flex flex-col justify-between flex-grow">
            <div>
                 <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
                </div>
                <p className="text-brand-slate leading-relaxed italic">"{testimonial.quote}"</p>
            </div>
            <div className="mt-8 flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-bold text-brand-ink">{testimonial.name}</p>
                    <p className="text-xs text-brand-slate">{testimonial.company}</p>
                </div>
            </div>
        </div>
      </BrandCard>
    );
};

interface AudioTestimonial {
  name: string;
  company: string;
  avatar: string;
  quote: string;
  audioSrc: string;
  image?: string;
}

const audioTestimonials: AudioTestimonial[] = [
  {
    name: 'Javohir Haqberdiyev',
    company: 'Perfona asoschisi',
    avatar: 'JH',
    quote: "Men kutganimdan ham zo'r bo'ldi. Hozir logotipni ko'ryapmanda o'zim ham mazza qilyapman. Menga yoqqan tomoni ishonch bo'ldi. Keyin muddatdan oldin topshirilgani juda zo'r bo'ldi. Tez natijalar bilan bo'lishganiz zo'r bo'ldi. Rahmat aka kattakon!",
    audioSrc: '/audio/javohir-haqberdiyev.ogg',
    image: '',
  },
  {
    name: 'Sevara Xolmanova',
    company: 'Fidda by Sevara asoschisi',
    avatar: 'SX',
    quote: "Men bu jamoa bn ishlab ko'rdim menga juda yoqdi samarali va natijasi siz kutgandanda A'lo bo'larkan brendlashni xam stikerlash va patenlashni xam berganman 7 oyda aniq boladi Hudo xohlasa Halol ishlarkansilar Allox rozi bo'lsin silardan juda xursand bo'ldim ishilarga rivoj Rahmat.",
    audioSrc: '/audio/sevara-holmanova.ogg',
    image: 'https://cdn.sanity.io/images/h6ymmj0v/production/0485c3ac7efb8043632c9bb57db90cca1223fbe0-219x71.png',
  },
];

const AudioTestimonialCard = ({ testimonial }: { testimonial: AudioTestimonial }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(pct);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => setIsPlaying(false);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <BrandCard className="h-full flex flex-col overflow-hidden">
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-2xl bg-brand-mist/70 p-4">
          <button
            onClick={togglePlay}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <div className="flex-1">
            <div className="h-2 cursor-pointer rounded-full bg-brand-line" onClick={handleSeek}>
              <div className="h-full rounded-full bg-brand-blue transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-brand-slate">
              <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
              <span>{duration ? formatTime(duration) : '--:--'}</span>
            </div>
          </div>
          <Volume2 className="h-4 w-4 text-brand-slate" />
        </div>

        {testimonial.quote && (
          <p className="text-sm text-brand-slate leading-relaxed italic">"{testimonial.quote}"</p>
        )}

        <div className="flex items-center gap-4 pt-2 border-t border-brand-line/50">
          <Avatar className="h-12 w-12 ring-2 ring-primary/10">
            {testimonial.image && <AvatarImage src={testimonial.image} alt={testimonial.name} />}
            <AvatarFallback>{testimonial.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-brand-ink">{testimonial.name}</p>
            <p className="text-xs text-brand-slate">{testimonial.company}</p>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={testimonial.audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
        />
      </div>
    </BrandCard>
  );
};

const TestimonialsClient = ({ testimonials, dictionary, lang }: { testimonials: Testimonial[], dictionary: any, lang: string }) => {
    const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
    const translations = dictionary;
    
    const [videoTestimonials, setVideoTestimonials] = useState<Testimonial[]>([]);
    const [textTestimonials, setTextTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        const audioNames = audioTestimonials.map(a => a.name.toLowerCase());
        const video = testimonials.filter(t => t.videoUrl);
        const text = testimonials.filter(t => !t.videoUrl && !audioNames.includes(t.name.toLowerCase()));
        
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

  const proofStats =
    lang === 'uz'
      ? [
          ['Video sharh', 'Mijozning yuzini va ovozini ko\'rasiz — montajsiz'],
          ['Haqiqiy tadbirkorlar', 'Agentlik emas, biznes egasi gapiryapti'],
          ['Aniq natija', 'Oldin/keyin farqini o\'zlari aytishadi'],
        ]
      : lang === 'ru'
        ? [
            ['Видео-отзыв', 'Лицо и голос клиента — без монтажа'],
            ['Настоящие предприниматели', 'Говорит владелец бизнеса, не агентство'],
            ['Конкретный результат', 'Разницу до/после клиенты озвучивают сами'],
          ]
        : lang === 'zh'
          ? [
              ['视频评价', '看到客户真实面孔和声音'],
              ['真实企业主', '不是代理商，是老板本人在说'],
              ['具体结果', '前后差异由客户自己描述'],
            ]
          : [
              ['Video review', 'See the client face and voice — unedited'],
              ['Real business owners', 'The owner speaks, not the agency'],
              ['Specific outcomes', 'Before/after difference in their own words'],
            ];

  return (
    <BrandSection tone="soft" className="overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionIntro eyebrow={lang === 'uz' ? "Ishonch dalili" : "Proof"} title={translations.title} description={translations.subtitle} className="mb-8" />
        <div className="mx-auto mb-8 grid max-w-4xl gap-3 grid-cols-3">
          {proofStats.map(([title, desc]) => (
            <BrandCard key={title} className="p-3 sm:p-5">
              <div className="text-xs sm:text-base font-black text-brand-ink">{title}</div>
              <div className="mt-1 text-[11px] sm:text-sm leading-5 sm:leading-6 text-brand-slate">{desc}</div>
            </BrandCard>
          ))}
        </div>

        {videoTestimonials.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <h3 className="mb-4 text-lg font-black text-brand-ink sm:text-xl">
                {lang === 'uz' ? 'Video izohlar' : lang === 'ru' ? 'Видео-отзывы' : lang === 'zh' ? '视频评价' : 'Video reviews'}
              </h3>
              <Carousel
                plugins={[autoplayPlugin.current]}
                opts={{ align: "center", loop: true }}
                onMouseEnter={autoplayPlugin.current.stop}
                onMouseLeave={autoplayPlugin.current.reset}
                className="w-full relative"
              >
                <CarouselContent className="-ml-4">
                  {videoTestimonials.map((testimonial, index) => (
                    <CarouselItem key={`video-${index}`} className="pl-4 basis-[72%] sm:basis-1/2 lg:basis-1/3">
                      <div className="h-full">
                        <VideoTestimonialCard testimonial={testimonial} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden sm:block">
                  <CarouselPrevious className="absolute -left-4 lg:-left-12 h-12 w-12 shadow-lg border-brand-line hover:bg-brand-ink hover:text-white transition-all" />
                  <CarouselNext className="absolute -right-4 lg:-right-12 h-12 w-12 shadow-lg border-brand-line hover:bg-brand-ink hover:text-white transition-all" />
                </div>
              </Carousel>
            </div>
        )}

        {(audioTestimonials.length > 0 || textTestimonials.length > 0) && (
            <div className="max-w-6xl mx-auto mt-12">
              <h3 className="mb-4 text-lg font-black text-brand-ink sm:text-xl">
                {lang === 'uz' ? 'Audio va yozma izohlar' : lang === 'ru' ? 'Аудио и письменные отзывы' : lang === 'zh' ? '音频与文字评价' : 'Audio & written reviews'}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {audioTestimonials.map((testimonial, index) => (
                  <AudioTestimonialCard key={`audio-${index}`} testimonial={testimonial} />
                ))}
                {textTestimonials.map((testimonial, index) => (
                  <TextTestimonialCard key={`text-${index}`} testimonial={testimonial} />
                ))}
              </div>
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
