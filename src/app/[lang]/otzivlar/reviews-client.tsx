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

export default function ReviewsClient({ testimonials, lang, dictionary }: Props) {
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fallback translations if dictionary doesn't have it
  const dict = dictionary?.reviewsPage || {
    title: lang === 'ru' ? 'Отзывы наших клиентов' : lang === 'en' ? 'Our Clients\' Reviews' : lang === 'zh' ? '客户评价' : 'Mijozlarimiz sharhlari',
    subtitle: lang === 'ru' ? 'Результаты говорят сами за себя. Голоса и видео реальных людей о нашей работе.' : lang === 'en' ? 'Results speak for themselves. Voice and video reviews from real people.' : lang === 'zh' ? '用事实说话。来自真实客户的语音和视频评价。' : 'Natijalar o\'zi gapiradi. Ishimiz haqida real insonlarning ovozli va video fikrlari.',
    back: lang === 'ru' ? 'На главную' : lang === 'en' ? 'Back to home' : lang === 'zh' ? '返回首页' : 'Bosh sahifaga',
    ctaText: lang === 'ru' ? 'Получить бесплатный аудит' : lang === 'en' ? 'Get free audit' : lang === 'zh' ? '获取免费审计' : 'Bepul audit olish',
    voiceLabel: lang === 'ru' ? 'Голосовой отзыв' : lang === 'en' ? 'Voice Review' : lang === 'zh' ? '语音评价' : 'Ovozli sharh',
    videoLabel: lang === 'ru' ? 'Видео отзыв' : lang === 'en' ? 'Video Review' : lang === 'zh' ? '视频评价' : 'Video sharh',
  };

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
    <div className="min-h-screen bg-[#05070f] pt-32 pb-24 text-white relative overflow-hidden atelier-theme">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none z-0" />

      {/* Invisible HTML5 Audio tag */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onAudioEnded}
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            {dict.back}
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            FEEDBACKS
          </div>
          <h1 className="text-4.5xl md:text-6xl font-black tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            {dict.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            {dict.subtitle}
          </p>
        </div>

        {/* Grid of Feedbacks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, index) => {
            const hasAudio = !!(t.audioFileUrl || t.audioUrl);
            const hasVideo = !!(t.videoFileUrl || t.videoUrl);
            const audioSourceUrl = t.audioFileUrl || t.audioUrl;
            const videoSourceUrl = t.videoFileUrl || t.videoUrl;

            return (
              <div
                key={t._id || `${t.name}-${index}`}
                className="rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all duration-300 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
                style={{ backdropFilter: 'blur(12px)' }}
              >
                {/* Header: Avatar, Name, Company, Stars */}
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-blue-600/20 flex items-center justify-center border border-white/10">
                    {t.image ? (
                      <Image
                        src={t.image}
                        alt={t.imageHint || t.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-blue-400">
                        {t.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold truncate text-white">{t.name}</h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{t.company}</p>
                    <div className="flex gap-0.5 mt-2">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Badge representing feedback type */}
                  {hasVideo && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">
                      <Video className="w-3 h-3" />
                      {dict.videoLabel}
                    </span>
                  )}
                  {!hasVideo && hasAudio && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <Volume2 className="w-3 h-3" />
                      {dict.voiceLabel}
                    </span>
                  )}
                </div>

                {/* Body Text */}
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line italic relative pl-4">
                  <span className="absolute left-0 top-0 text-3xl font-serif leading-none text-blue-500/30">“</span>
                  {t.quote}
                </div>

                {/* Audio Custom Player Block */}
                {hasAudio && audioSourceUrl && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleAudioPlayPause(audioSourceUrl)}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-400 active:scale-95 transition-all text-white shrink-0 shadow-lg shadow-blue-500/20"
                      >
                        {activeAudio === audioSourceUrl && isPlaying ? (
                          <Pause className="w-5 h-5 fill-white" />
                        ) : (
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        )}
                      </button>
                      
                      <div className="flex-1 space-y-1 min-w-0">
                        {/* Audio Wave / Track Progress */}
                        <div
                          className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer relative"
                          onClick={(e) => {
                            if (activeAudio === audioSourceUrl) {
                              handleProgressBarClick(e);
                            }
                          }}
                        >
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-100 ease-out"
                            style={{
                              width: `${
                                activeAudio === audioSourceUrl && duration > 0
                                  ? (currentTime / duration) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        
                        {/* Timestamps */}
                        <div className="flex justify-between text-[10px] font-mono text-gray-500">
                          <span>
                            {activeAudio === audioSourceUrl
                              ? formatTime(currentTime)
                              : '0:00'}
                          </span>
                          <span>
                            {activeAudio === audioSourceUrl && duration > 0
                              ? formatTime(duration)
                              : '0:30'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Play Button Block */}
                {hasVideo && videoSourceUrl && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => openVideo(videoSourceUrl)}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all duration-200 text-white shadow-lg shadow-violet-600/30"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      {lang === 'uz' ? 'Video sharhni ko\'rish' : lang === 'ru' ? 'Смотреть видеоотзыв' : lang === 'zh' ? '观看视频评价' : 'Watch Video Review'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-20 text-center space-y-6 max-w-md mx-auto p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
          <h3 className="text-xl font-bold text-white">
            {lang === 'uz' ? 'O\'z brendingizni hoziroq yaxshilang' : lang === 'ru' ? 'Улучшите свой бренд прямо сейчас' : lang === 'zh' ? '立即提升您的品牌价值' : 'Improve your brand right now'}
          </h3>
          <p className="text-gray-400 text-sm">
            {lang === 'uz' ? '15 daqiqada brendingizdagi 3 ta yirik zaiflikni topib beramiz.' : lang === 'ru' ? 'За 15 минут найдем 3 главные слабости вашего бренда.' : lang === 'zh' ? '我们将在15分钟内为您找出品牌最大的3个弱点。' : 'We will find the 3 biggest weaknesses of your brand in 15 minutes.'}
          </p>
          <Link
            href={`/${lang}/#narxlar`}
            className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-sm transition-all duration-200 active:scale-[0.98]"
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
