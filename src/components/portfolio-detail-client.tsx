'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trophy, Sparkles, ChevronLeft, ChevronRight, X, ZoomIn, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  _id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  tags: string[];
  coverImage: string;
  beforeImage?: string;
  afterImage?: string;
  oldHint?: string;
  newHint?: string;
  description: string;
  results?: { metric: string; value: string }[];
  body: { heading: string; paragraph: string }[] | any;
  galleryImages?: string[];
}

interface PortfolioDetailClientProps {
  project: Project;
  lang: string;
  dictionary: {
    backBtn: string;
    resultsTitle: string;
    transformTitle: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaBtn: string;
  };
}

// 🌟 Spotlight Card for Bento Results
function SpotlightCard({ children, className = '', ...props }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`relative overflow-hidden rounded-[2.25rem] border border-white/5 bg-[#0a0f1d]/40 backdrop-blur-2xl transition-all duration-500 hover:border-blue-500/20 shadow-2xl ${className}`}
      {...props}
    >
      {isFocused && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[2.25rem] opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(59, 130, 246, 0.12), transparent 85%)`,
          }}
        />
      )}
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </div>
  );
}

export default function PortfolioDetailClient({ project, lang, dictionary }: PortfolioDetailClientProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Before/After Slider Move handler
  const handleSliderMove = (clientX: number, containerRect: DOMRect) => {
    const x = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX, rect);
    }
  };

  const triggerLeadModal = () => {
    const contactEvent = new CustomEvent('openContactModal', {
      detail: {
        section: 'case_study_detail_cta',
        ctaText: dictionary.ctaBtn,
        source: `portfolio_${project.slug}`,
      },
    });
    window.dispatchEvent(contactEvent);
  };

  return (
    <div className="min-h-screen bg-[#05070f] pt-32 pb-24 text-white relative overflow-hidden">
      {/* 🌟 Dynamic Background Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[180px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute inset-0 noise-texture opacity-[0.02] pointer-events-none z-0" />

      <div className="container mx-auto px-4 max-w-5xl space-y-20 relative z-10">
        
        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:text-white px-6 h-12 flex items-center gap-2 group transition-all duration-300"
          >
            <Link href={`/${lang}/portfolio`}>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{dictionary.backBtn}</span>
            </Link>
          </Button>
          
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden sm:flex items-center gap-2">
            <span>Portfolio</span>
            <span className="text-gray-700">/</span>
            <span className="text-blue-400 font-extrabold">{project.client}</span>
          </div>
        </div>

        {/* Hero details showcase */}
        <div className="space-y-6 text-center sm:text-left max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{project.client}</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed font-medium">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            {project.tags.map((tag, i) => (
              <span 
                key={i}
                className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Cinematic Cover Widescreen Box */}
        <div className="relative h-80 sm:h-[450px] md:h-[520px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 select-none">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070f]/70 via-transparent to-transparent"></div>
        </div>

        {/* Bento Results Cards Grid */}
        {project.results && project.results.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="h-10 w-10 rounded-2xl bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                <Trophy className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                {dictionary.resultsTitle}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {project.results.map((res, i) => (
                <SpotlightCard key={i} className="p-8 sm:p-10 text-center flex flex-col justify-center items-center space-y-3 group">
                  <div className="absolute top-4 right-4 text-white/[0.02] group-hover:text-blue-500/5 transition-colors">
                    <Star className="w-16 h-16 fill-current" />
                  </div>
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight group-hover:scale-105 transition-transform duration-500">
                    {res.value}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest leading-relaxed max-w-[180px]">
                    {res.metric}
                  </p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        )}

        {/* 🌟 Premium Before/After comparison Swipe Slider */}
        {project.beforeImage && project.afterImage && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                {dictionary.transformTitle}
              </h2>
            </div>
            
            <div 
              className="relative h-72 sm:h-[450px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 select-none cursor-ew-resize group"
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              onTouchMove={handleTouchMove}
            >
              {/* After (New) Image - occupies full width */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={project.afterImage}
                  alt={project.newHint || 'After'}
                  fill
                  className="object-cover"
                  draggable={false}
                />
                <div className="absolute bottom-6 right-6 px-5 py-2.5 rounded-full bg-blue-600/85 backdrop-blur-md text-xs font-black uppercase tracking-widest border border-white/20 z-25 shadow-lg">
                  {project.newHint || 'Den Aroma (Yangi)'}
                </div>
              </div>

              {/* Before (Old) Image - dynamic width overlay */}
              <div 
                className="absolute inset-0 h-full overflow-hidden border-r-2 border-white/80"
                style={{ width: `${sliderPosition}%` }}
              >
                <div className="absolute inset-0 w-full h-full" style={{ width: '100%' }}>
                  <Image
                    src={project.beforeImage}
                    alt={project.oldHint || 'Before'}
                    fill
                    className="object-cover"
                    draggable={false}
                    style={{ width: '100vw', maxWidth: 'none' }}
                  />
                </div>
                <div className="absolute bottom-6 left-6 px-5 py-2.5 rounded-full bg-black/70 backdrop-blur-md text-xs font-black uppercase tracking-widest border border-white/10 z-25 shadow-lg whitespace-nowrap">
                  {project.oldHint || 'Avvalgi'}
                </div>
              </div>

              {/* Central Drag Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white/70 cursor-ew-resize flex items-center justify-center z-30"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="h-12 w-12 rounded-full bg-white text-blue-950 flex items-center justify-center shadow-2xl border-4 border-blue-950/80 hover:scale-105 active:scale-95 transition-transform">
                  <ChevronLeft className="w-4 h-4 shrink-0 -mr-1" />
                  <ChevronRight className="w-4 h-4 shrink-0 -ml-1" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Narrative / Content Case Study */}
        {project.body && Array.isArray(project.body) && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pt-6">
            <div className="md:col-span-4 space-y-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                Loyiha yondashuvi
              </span>
              <h3 className="text-3xl font-black leading-tight text-white">
                Premium Rebrending Sirlari
              </h3>
              <div className="h-1.5 w-16 bg-blue-600 rounded-full"></div>
            </div>
            
            <div className="md:col-span-8 space-y-8">
              {project.body.map((item: any, i: number) => (
                <div key={i} className="border-l-2 border-blue-600 pl-6 sm:pl-8 space-y-3">
                  <h4 className="text-xl font-bold text-white tracking-tight">
                    {item.heading}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed">
                    {item.paragraph}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Section */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                <ZoomIn className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                {lang === 'uz' ? 'Brend Vizual Materiallari' : lang === 'ru' ? 'Визуальные Материалы Бренда' : lang === 'zh' ? '品牌视觉材料设计展示' : 'Brand Visual Materials'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {project.galleryImages.map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="relative h-56 sm:h-72 rounded-[2rem] overflow-hidden shadow-lg border border-white/5 cursor-pointer group select-none"
                >
                  <Image
                    src={img}
                    alt={`Gallery ${i}`}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ZoomIn className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accessible Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && project.galleryImages && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-12 select-none"
            >
              {/* Top controls */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest self-center">
                  Image {lightboxIndex + 1} of {project.galleryImages.length}
                </span>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLightboxIndex(null)}
                  className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  aria-label="Close image gallery"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </Button>
              </div>

              {/* Prev Button */}
              {project.galleryImages.length > 1 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex - 1 + project.galleryImages!.length) % project.galleryImages!.length);
                  }}
                  className="absolute left-6 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center z-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" aria-hidden="true" />
                </button>
              )}

              {/* Image viewport */}
              <motion.div 
                key={lightboxIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative max-w-full max-h-[75vh] w-[900px] h-[550px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl"
              >
                <Image
                  src={project.galleryImages[lightboxIndex]}
                  alt={`Lightbox ${lightboxIndex}`}
                  fill
                  className="object-contain"
                />
              </motion.div>

              {/* Next Button */}
              {project.galleryImages.length > 1 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex + 1) % project.galleryImages!.length);
                  }}
                  className="absolute right-6 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center z-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" aria-hidden="true" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌟 Immersive Lead Capture CTA Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-14 bg-gradient-to-br from-[#0c0f1d] to-[#04060b] border border-white/5 shadow-2xl text-center space-y-8 select-none group">
          {/* Animated Glowing blobs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-violet-500/10 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="relative space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">
              {dictionary.ctaTitle}
            </h3>
            
            <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed">
              {dictionary.ctaDesc}
            </p>
          </div>

          <div className="relative pt-2">
            <Button
              onClick={triggerLeadModal}
              size="lg"
              className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-full shadow-2xl shadow-blue-900/30 hover:scale-[1.03] transition-all duration-300"
            >
              {dictionary.ctaBtn}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
