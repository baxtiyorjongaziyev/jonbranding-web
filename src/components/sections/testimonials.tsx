'use client';

import { useEffect, useRef, useState, useMemo, type MouseEvent } from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, PlayCircle, Star, Volume2, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';
import { cn } from '@/lib/utils';
import { staticTestimonials, staticTestimonialsEn, staticTestimonialsRu, staticTestimonialsZh } from '@/lib/static-data';
import { type Testimonial } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';
import type { TestimonialsDictionary } from '@/lib/types/dictionary';

const CASE_STUDY_VIDEO_IDS = ['1145610708'];
const VIMEO_HOSTS = new Set(['vimeo.com', 'www.vimeo.com', 'player.vimeo.com']);

const getVimeoVideoId = (url?: string) => {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (!VIMEO_HOSTS.has(hostname)) return '';

    const parts = parsed.pathname.split('/').filter(Boolean);
    const videoIndex = parts.indexOf('video');
    return videoIndex >= 0 ? parts[videoIndex + 1] || '' : parts[0] || '';
  } catch {
    return '';
  }
};

const isCaseStudyVideo = (testimonial: Testimonial) =>
  CASE_STUDY_VIDEO_IDS.includes(getVimeoVideoId(testimonial.videoUrl));

const getVimeoEmbedUrl = (url?: string, autoplay = false) => {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (!VIMEO_HOSTS.has(hostname)) return '';

    if (hostname !== 'player.vimeo.com') {
      const videoId = getVimeoVideoId(url);
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
    return '';
  }
};

const getAvatarImageUrl = (url?: string) => {
  if (!url || !url.includes('cdn.sanity.io/images/')) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=96&h=96&fit=crop&auto=format&q=75`;
};

const VideoTestimonialCard = ({ testimonial, labels, onPlay }: { testimonial: Testimonial; labels: { play: string }; onPlay: () => void }) => {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
      <CardContent className="p-0">
        <div className="relative aspect-[9/16] overflow-hidden bg-brand-ink">
          <button
            type="button"
            onClick={onPlay}
            className="relative block h-full w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-blue"
          >
            {testimonial.image ? (
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />
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
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-brand-line">
              <AvatarImage src={getAvatarImageUrl(testimonial.image)} alt={testimonial.name} />
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

const Stars = ({ rating = 5 }: { rating?: number }) => (
  <div className="flex gap-0.5 text-amber-400" role="img" aria-label={`${rating} star testimonial`}>
    {[...Array(5)].map((_, i) => (
      <Star key={i} fill={i < rating ? 'currentColor' : 'none'} className="h-4 w-4" aria-hidden="true" />
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
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-line bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.09)]">
      <audio ref={audioRef} src={testimonial.audioUrl} preload="none" onEnded={() => setIsPlaying(false)} />
      <div className="flex flex-grow flex-col justify-between">
        <div>
          <Stars rating={testimonial.rating} />
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
            <AvatarImage src={getAvatarImageUrl(testimonial.image)} alt={testimonial.name} />
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
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-line bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.09)]">
      <div className="flex flex-grow flex-col justify-between">
        <div>
          <Stars rating={testimonial.rating} />
          <p className="mt-4 text-pretty text-sm italic leading-relaxed text-brand-slate">&ldquo;{testimonial.quote}&rdquo;</p>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-brand-line">
            <AvatarImage src={getAvatarImageUrl(testimonial.image)} alt={testimonial.name} />
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

const TestimonialsClient = ({ testimonials, dictionary, lang }: { testimonials: Testimonial[]; dictionary: TestimonialsDictionary; lang: string }) => {
  const videoAutoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const textAutoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const translations = dictionary;
  const [activeVideo, setActiveVideo] = useState<Testimonial | null>(null);

  const { videoTestimonials, audioTestimonials, textTestimonials } = useMemo(() => {
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

    return {
      videoTestimonials: prioritizedVideos,
      audioTestimonials: audio,
      textTestimonials: text,
    };
  }, [testimonials]);

  const openLightbox = (testimonial: Testimonial) => {
    trackEvent({
      action: 'video_played',
      category: 'Proof',
      label: testimonial.name,
      section: 'testimonials',
      video_url: testimonial.videoUrl,
    });
    setActiveVideo(testimonial);
    videoAutoplay.current.stop();
  };

  const closeLightbox = () => {
    setActiveVideo(null);
    videoAutoplay.current.reset();
  };

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeLightbox();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activeVideo]);

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
                      <VideoTestimonialCard testimonial={testimonial} labels={videoLabels} onPlay={() => openLightbox(testimonial)} />
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

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[9/16] overflow-hidden rounded-[20px] border border-white/10 bg-[#070b13] shadow-[0_30px_100px_rgba(0,0,0,0.9)] flex flex-col justify-end"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={getVimeoEmbedUrl(activeVideo.videoUrl, true)}
                title={`${activeVideo.name} video testimonial`}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <button
                type="button"
                onClick={closeLightbox}
                aria-label={lang === 'uz' ? 'Yopish' : 'Close'}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/70 border border-white/10 text-white backdrop-blur-md transition-all hover:bg-slate-950/90 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 pt-16 flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-white/15">
                  <AvatarImage src={getAvatarImageUrl(activeVideo.image)} alt={activeVideo.name} />
                  <AvatarFallback>{activeVideo.avatar}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 text-white">
                  <p className="truncate text-base font-black leading-snug">{activeVideo.name}</p>
                  <p className="truncate text-xs font-bold text-white/70 mt-0.5">{activeVideo.company}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BrandSection>
  );
};

const Testimonials = ({ lang, dictionary, testimonials: testimonialsProp }: { lang: string; dictionary: TestimonialsDictionary; testimonials?: Testimonial[] }) => {
  let testimonials: Testimonial[];
  if (testimonialsProp && testimonialsProp.length > 0) {
    testimonials = testimonialsProp;
  } else {
    switch (lang) {
      case 'ru': testimonials = staticTestimonialsRu; break;
      case 'en': testimonials = staticTestimonialsEn; break;
      case 'zh': testimonials = staticTestimonialsZh; break;
      default: testimonials = staticTestimonials;
    }
  }

  return <TestimonialsClient testimonials={testimonials} dictionary={dictionary} lang={lang} />;
};

export default Testimonials;
