'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Pause, PlayCircle, Star, Volume2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';
import { cn } from '@/lib/utils';
import { staticTestimonials, staticTestimonialsEn, staticTestimonialsRu, staticTestimonialsZh } from '@/lib/static-data';
import { type Testimonial } from '@/lib/types';

const CASE_STUDY_VIDEO_IDS = ['1145610708'];

const isCaseStudyVideo = (testimonial: Testimonial) => {
  if (!testimonial.videoUrl) return false;
  return CASE_STUDY_VIDEO_IDS.some((videoId) => testimonial.videoUrl?.includes(videoId));
};

const getVimeoEmbedUrl = (url?: string, autoplay = false) => {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const isVimeo = parsed.hostname.includes('vimeo.com');

    if (isVimeo && parsed.hostname !== 'player.vimeo.com') {
      const videoId = parsed.pathname.split('/').filter(Boolean).pop();
      if (videoId) {
        parsed.hostname = 'player.vimeo.com';
        parsed.pathname = `/video/${videoId}`;
      }
    }

    parsed.searchParams.set('badge', '0');
    parsed.searchParams.set('autopause', '0');
    parsed.searchParams.set('dnt', '1');
    parsed.searchParams.set('title', '0');
    parsed.searchParams.set('byline', '0');
    parsed.searchParams.set('portrait', '0');

    if (autoplay) {
      parsed.searchParams.set('autoplay', '1');
    }

    return parsed.toString();
  } catch {
    return url;
  }
};

const VideoTestimonialCard = ({ testimonial, labels }: { testimonial: Testimonial; labels: { play: string } }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = getVimeoEmbedUrl(testimonial.videoUrl, isPlaying);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-brand-line bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
      <CardContent className="p-0">
        <div className="relative aspect-[9/16] overflow-hidden bg-brand-ink">
          {isPlaying ? (
            <iframe
              src={embedUrl}
              title={`${testimonial.name} video testimonial`}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label={labels.play}
              className="relative block h-full w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-blue"
            >
              {testimonial.image ? (
                <img src={testimonial.image} alt={testimonial.name} loading="lazy" className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="h-full w-full bg-[linear-gradient(135deg,#070b12,#122055_55%,#07323a)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">{testimonial.name}</p>
                  <p className="mt-1 truncate text-xs font-bold text-white/65">{testimonial.company}</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/95 text-brand-ink shadow-[0_14px_35px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105">
                  <PlayCircle className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <span className="sr-only">{labels.play}</span>
            </button>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-brand-line">
              <AvatarImage src={testimonial.image} alt={testimonial.name} />
              <AvatarFallback>{testimonial.avatar}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-brand-ink">{testimonial.name}</p>
              <p className="truncate text-xs text-brand-slate">{testimonial.company}</p>
            </div>
          </div>
          {testimonial.quote && (
            <p className="mt-3 text-pretty text-sm italic leading-relaxed text-brand-slate">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
          )}
        </div>
      </CardContent>
    </div>
  );
};

const Stars = () => (
  <div className="flex gap-0.5 text-amber-400" aria-label="5 star testimonial">
    {[...Array(5)].map((_, i) => (
      <Star key={i} fill="currentColor" className="h-4 w-4" aria-hidden="true" />
    ))}
  </div>
);

const AudioTestimonialCard = ({ testimonial, labels }: { testimonial: Testimonial; labels: { play: string; pause: string } }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[8px] border border-brand-line bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.09)]">
      <audio ref={audioRef} src={testimonial.audioUrl} preload="none" onEnded={() => setIsPlaying(false)} />
      <div className="flex flex-grow flex-col justify-between">
        <div>
          <Stars />
          <p className="mt-4 text-pretty text-sm italic leading-relaxed text-brand-slate">&ldquo;{testimonial.quote}&rdquo;</p>
          <button
            type="button"
            onClick={toggleAudio}
            aria-label={isPlaying ? labels.pause : labels.play}
            className={cn(
              'mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-[background-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue active:scale-[0.98]',
              isPlaying
                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/25'
                : 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white hover:shadow-lg hover:shadow-brand-blue/25',
            )}
          >
            {isPlaying ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
            {isPlaying ? labels.pause : labels.play}
          </button>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-brand-line">
            <AvatarImage src={testimonial.image} alt={testimonial.name} />
            <AvatarFallback>{testimonial.avatar}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-brand-ink">{testimonial.name}</p>
            <p className="truncate text-xs text-brand-slate">{testimonial.company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TextTestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[8px] border border-brand-line bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.09)]">
      <div className="flex flex-grow flex-col justify-between">
        <div>
          <Stars />
          <p className="mt-4 text-pretty text-sm italic leading-relaxed text-brand-slate">&ldquo;{testimonial.quote}&rdquo;</p>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-brand-line">
            <AvatarImage src={testimonial.image} alt={testimonial.name} />
            <AvatarFallback>{testimonial.avatar}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-brand-ink">{testimonial.name}</p>
            <p className="truncate text-xs text-brand-slate">{testimonial.company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsClient = ({ testimonials, dictionary }: { testimonials: Testimonial[]; dictionary: any }) => {
  const videoAutoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const textAutoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const translations = dictionary;

  const [videoTestimonials, setVideoTestimonials] = useState<Testimonial[]>([]);
  const [audioTestimonials, setAudioTestimonials] = useState<Testimonial[]>([]);
  const [textTestimonials, setTextTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const video = testimonials.filter((testimonial) => testimonial.videoUrl && !isCaseStudyVideo(testimonial));
    const audio = testimonials.filter((testimonial) => !testimonial.videoUrl && testimonial.audioUrl);
    const text = testimonials.filter((testimonial) => !testimonial.videoUrl && !testimonial.audioUrl && testimonial.quote?.trim());

    const prioritizedVideos = video.sort((a, b) => {
      if (a.name.includes('Ibrohimjon Mahammadjonov')) return -1;
      if (b.name.includes('Ibrohimjon Mahammadjonov')) return 1;
      if (a.name.includes('Sherzod Beknazarov')) return -1;
      if (b.name.includes('Sherzod Beknazarov')) return 1;
      return 0;
    });

    setVideoTestimonials(prioritizedVideos);
    setAudioTestimonials(audio);
    setTextTestimonials(text);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0 || !translations) {
    return null;
  }

  const audioLabels = {
    play: translations.playAudio || 'Ovozli izohni tinglash',
    pause: translations.pauseAudio || "To'xtatish",
  };
  const videoLabels = {
    play: translations.playVideo || "Videoni shu yerda ko'rish",
  };

  return (
    <BrandSection tone="soft" className="overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionIntro eyebrow={translations.eyebrow || 'Mijozlar ovozi'} title={translations.title} description={translations.subtitle} className="mb-12" />

        {videoTestimonials.length > 0 && (
          <div className="mx-auto max-w-6xl">
            <Carousel
              plugins={[videoAutoplay.current]}
              opts={{ align: 'center', loop: true }}
              onMouseEnter={videoAutoplay.current.stop}
              onMouseLeave={videoAutoplay.current.reset}
              className="relative w-full"
            >
              <CarouselContent className="-ml-4">
                {videoTestimonials.map((testimonial, index) => (
                  <CarouselItem key={`video-${index}`} className="basis-[80%] pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="h-full py-2">
                      <VideoTestimonialCard testimonial={testimonial} labels={videoLabels} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden sm:block">
                <CarouselPrevious className="absolute -left-4 h-11 w-11 border-brand-line shadow-md transition-[background-color,color] duration-200 hover:bg-brand-ink hover:text-white lg:-left-12" />
                <CarouselNext className="absolute -right-4 h-11 w-11 border-brand-line shadow-md transition-[background-color,color] duration-200 hover:bg-brand-ink hover:text-white lg:-right-12" />
              </div>
            </Carousel>
          </div>
        )}

        {(audioTestimonials.length > 0 || textTestimonials.length > 0) && (
          <div className="mx-auto mt-12 max-w-6xl">
            <Carousel
              plugins={[textAutoplay.current]}
              opts={{ align: 'start', loop: true }}
              onMouseEnter={textAutoplay.current.stop}
              onMouseLeave={textAutoplay.current.reset}
              className="relative w-full"
            >
              <CarouselContent className="-ml-4">
                {audioTestimonials.map((testimonial, index) => (
                  <CarouselItem key={`audio-${index}`} className="basis-[85%] pl-4 sm:basis-1/2 md:basis-1/3">
                    <div className="h-full py-2">
                      <AudioTestimonialCard testimonial={testimonial} labels={audioLabels} />
                    </div>
                  </CarouselItem>
                ))}
                {textTestimonials.map((testimonial, index) => (
                  <CarouselItem key={`text-${index}`} className="basis-[85%] pl-4 sm:basis-1/2 md:basis-1/3">
                    <div className="h-full py-2">
                      <TextTestimonialCard testimonial={testimonial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden sm:block">
                <CarouselPrevious className="absolute -left-4 h-11 w-11 border-brand-line shadow-md transition-[background-color,color] duration-200 hover:bg-brand-ink hover:text-white lg:-left-12" />
                <CarouselNext className="absolute -right-4 h-11 w-11 border-brand-line shadow-md transition-[background-color,color] duration-200 hover:bg-brand-ink hover:text-white lg:-right-12" />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </BrandSection>
  );
};

const Testimonials = ({ lang, dictionary }: { lang: string; dictionary: any }) => {
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

  return <TestimonialsClient testimonials={testimonials} dictionary={dictionary} />;
};

export default Testimonials;
