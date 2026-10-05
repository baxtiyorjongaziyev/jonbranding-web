'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, Video, Volume2, MessageSquare, Star, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Testimonial } from '@/lib/types';

interface Props {
  testimonials: Testimonial[];
  lang: string;
  dictionary: any;
}

// Atelier tokens, scoped here: `.atelier-theme *` resets margin/padding and would break Tailwind spacing.
const TOKENS = {
  '--bg': '#F2EFE6', '--bg-2': '#E9E5D9', '--paper': '#FBF9F2', '--ink': '#0E1015', '--ink-2': '#3B3D45',
  '--muted': '#8B8779', '--line': '#D8D2C2', '--line-2': '#E5E0D2', '--accent': '#1B4DFF',
  '--accent-soft': '#E6EBFF', '--terra': '#C2552A',
} as React.CSSProperties;

export default function ReviewsClient({ testimonials, lang, dictionary }: Props) {
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const dict = dictionary.reviewsPage;
  const sec = dict;

  const hasVideoOf = (t: Testimonial) => !!(t.videoFileUrl || t.videoUrl);
  const hasAudioOf = (t: Testimonial) => !!(t.audioFileUrl || t.audioUrl);
  const videoList = testimonials.filter(hasVideoOf);
  const audioList = testimonials.filter((t) => !hasVideoOf(t) && hasAudioOf(t));
  const textList = testimonials.filter((t) => !hasVideoOf(t) && !hasAudioOf(t) && t.quote?.trim());

  useEffect(() => {
    if (audioRef.current) {
      if (activeAudio) {
        audioRef.current.src = activeAudio;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [activeAudio]);

  const handleAudioPlayPause = (audioUrl: string) => {
    if (activeAudio === audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setActiveAudio(audioUrl);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onAudioEnded = () => {
    setIsPlaying(false);
    setActiveAudio(null);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;
      audioRef.current.currentTime = percentage * duration;
      setCurrentTime(percentage * duration);
    }
  };

  // Extract Vimeo ID from URL helper
  const getVimeoVideoId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const openVideo = (url: string) => {
    setActiveVideo(url);
    setVideoModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 md:pt-36" style={{ ...TOKENS, background: 'var(--bg)', color: 'var(--ink)' }}>
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onAudioEnded}
      />

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-xs font-mono transition-opacity hover:opacity-60"
          style={{ color: 'var(--muted)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          {dict.back}
        </Link>

        <header className="mt-8 mb-14 md:mb-20 max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
            {dict.badge}
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">{dict.title}</h1>
          <p className="mt-5 text-base md:text-lg leading-relaxed" style={{ color: 'var(--ink-2)' }}>
            {dict.subtitle}
          </p>

          <nav className="mt-8 flex flex-wrap gap-2">
            {[
              { key: 'video', n: videoList.length, label: sec.video },
              { key: 'audio', n: audioList.length, label: sec.audio },
              { key: 'text', n: textList.length, label: sec.text },
            ]
              .filter((s) => s.n > 0)
              .map((s) => (
                <a
                  key={s.key}
                  href={`#${s.key}`}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-70"
                  style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}
                >
                  {s.label} <span style={{ color: 'var(--muted)' }}>· {s.n}</span>
                </a>
              ))}
          </nav>
        </header>

        {([
          { key: 'video', items: videoList, icon: Video, title: sec.video, desc: sec.videoDesc },
          { key: 'audio', items: audioList, icon: Volume2, title: sec.audio, desc: sec.audioDesc },
          { key: 'text', items: textList, icon: MessageSquare, title: sec.text, desc: sec.textDesc },
        ] as const)
          .filter((s) => s.items.length > 0)
          .map(({ key, items, icon: Icon, title, desc }) => (
            <section key={key} id={key} className="mb-16 md:mb-24 scroll-mt-28">
              <div className="mb-8 flex items-center gap-4 pb-5" style={{ borderBottom: '1px solid var(--line)' }}>
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--ink)', color: 'var(--bg)' }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h2>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{desc}</p>
                </div>
                <span className="ml-auto text-sm font-mono" style={{ color: 'var(--muted)' }}>{items.length}</span>
              </div>

              <div className={key === 'text' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}>
                {items.map((t, index) => {
                  const audioSourceUrl = t.audioFileUrl || t.audioUrl;
                  const videoSourceUrl = t.videoFileUrl || t.videoUrl;
                  const active = activeAudio === audioSourceUrl;
                  return (
                    <article
                      key={t._id || `${t.name}-${index}`}
                      className="rounded-3xl p-5 sm:p-6 flex flex-col gap-5"
                      style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}
                    >
                      {key === 'video' && videoSourceUrl && (
                        <button
                          onClick={() => openVideo(videoSourceUrl)}
                          className="group relative block w-full aspect-video rounded-2xl overflow-hidden"
                          style={{ background: 'var(--bg-2)' }}
                          aria-label={`${sec.watch}: ${t.name}`}
                        >
                          {t.image && (
                            <Image
                              src={t.image}
                              alt={t.imageHint || t.name}
                              fill
                              sizes="(min-width: 768px) 50vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          )}
                          <span className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-16 h-16 rounded-full flex items-center justify-center bg-white/95 shadow-xl transition-transform group-hover:scale-110 group-active:scale-95">
                              <Play className="w-6 h-6 ml-0.5" style={{ fill: 'var(--ink)', color: 'var(--ink)' }} />
                            </span>
                          </span>
                        </button>
                      )}

                      {key === 'audio' && audioSourceUrl && (
                        <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'var(--bg)', border: '1px solid var(--line-2)' }}>
                          <button
                            onClick={() => handleAudioPlayPause(audioSourceUrl)}
                            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95"
                            style={{ background: 'var(--accent)', color: '#fff' }}
                            aria-label={sec.listen}
                          >
                            {active && isPlaying ? (
                              <Pause className="w-5 h-5 fill-white" />
                            ) : (
                              <Play className="w-5 h-5 fill-white ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div
                              className="h-1.5 w-full rounded-full overflow-hidden cursor-pointer"
                              style={{ background: 'var(--line)' }}
                              onClick={(e) => {
                                if (active) handleProgressBarClick(e);
                              }}
                            >
                              <div
                                className="h-full transition-all duration-100 ease-out"
                                style={{
                                  background: 'var(--accent)',
                                  width: `${active && duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
                              <span>{active ? formatTime(currentTime) : '0:00'}</span>
                              <span>{active && duration > 0 ? formatTime(duration) : '--:--'}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div
                          className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                          style={{ background: 'var(--accent-soft)', border: '1px solid var(--line)' }}
                        >
                          {t.image ? (
                            <Image src={t.image} alt={t.imageHint || t.name} fill sizes="44px" className="object-cover" />
                          ) : (
                            <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                              {t.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold leading-tight truncate">{t.name}</h3>
                          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted)' }}>{t.company}</p>
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5" style={{ fill: 'var(--terra)', color: 'var(--terra)' }} />
                          ))}
                        </div>
                      </div>

                      {t.quote?.trim() && (
                        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--ink-2)' }}>
                          “{t.quote}”
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

        <div
          className="mt-8 text-center space-y-5 max-w-lg mx-auto p-8 rounded-3xl"
          style={{ background: 'var(--ink)', color: 'var(--bg)' }}
        >
          <h3 className="text-xl font-bold">
            {dict.ctaTitle}
          </h3>
          <p className="text-sm opacity-70">
            {dict.ctaDesc}
          </p>
          <Link
            href={`/${lang}/#narxlar`}
            className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl font-bold text-sm transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {dict.ctaText} ↗
          </Link>
        </div>
      </div>

      {/* Video Modal Player Popup */}
      <AnimatePresence>
        {videoModalOpen && activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {getVimeoVideoId(activeVideo) ? (
                <iframe
                  src={`https://player.vimeo.com/video/${getVimeoVideoId(activeVideo)}?autoplay=1`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Client video testimonial"
                />
              ) : activeVideo.endsWith('.mp4') || activeVideo.endsWith('.webm') || activeVideo.endsWith('.mov') ? (
                <video
                  src={activeVideo}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={activeVideo}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  title="Client video testimonial"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
