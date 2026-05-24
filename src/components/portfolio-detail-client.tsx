'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trophy, Calendar, Sparkles, CheckCircle, ChevronLeft, ChevronRight, X, ZoomIn, Star } from 'lucide-react';
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

export default function PortfolioDetailClient({ project, lang, dictionary }: PortfolioDetailClientProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Before/After Slider Interaction handler
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
    <div className="min-h-screen bg-brand-paper dark:bg-[#070b13] pt-32 pb-24 text-white">
      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        
        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:text-white px-5 h-12 flex items-center gap-2 group transition-all duration-300"
          >
            <Link href={`/${lang}/portfolio`}>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{dictionary.backBtn}</span>
            </Link>
          </Button>
          
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden sm:block">
            Portfolio / {project.client}
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{project.client}</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed max-w-4xl font-medium">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            {project.tags.map((tag, i) => (
              <span 
                key={i}
                className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Cover Image Parallax Box */}
        <div className="relative h-72 sm:h-96 md:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Results Bento Grid (Displaying metrics) */}
        {project.results && project.results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider flex items-center gap-3">
              <Trophy className="w-6 h-6 text-blue-500" />
              <span>{dictionary.resultsTitle}</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {project.results.map((res, i) => (
                <div 
                  key={i}
                  className="relative p-6 sm:p-8 rounded-3xl bg-[#0B0F19]/45 backdrop-blur-xl border border-white/5 hover:border-blue-500/20 shadow-xl flex flex-col justify-center items-center text-center space-y-2 group transition-all duration-300"
                >
                  <div className="absolute top-3 right-3 text-white/5 group-hover:text-blue-500/10 transition-colors">
                    <Star className="w-12 h-12 fill-current" />
                  </div>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none tracking-tight group-hover:scale-105 transition-transform duration-300">
                    {res.value}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest">
                    {res.metric}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Before/After Swipe Slider (Only shown if both images are present) */}
        {project.beforeImage && project.afterImage && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
              {dictionary.transformTitle}
            </h2>
            
            <div 
              className="relative h-64 sm:h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5 select-none cursor-ew-resize"
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
                <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-blue-600/80 backdrop-blur-md text-xs font-bold border border-white/20">
                  {project.newHint || 'Den Aroma (Yangi)'}
                </div>
              </div>

              {/* Before (Old) Image - sits on top and width is dynamic */}
              <div 
                className="absolute inset-0 h-full overflow-hidden border-r-2 border-white"
                style={{ width: `${sliderPosition}%` }}
              >
                <div className="absolute inset-0 w-full h-full" style={{ width: '100%' }}>
                  <Image
                    src={project.beforeImage}
                    alt={project.oldHint || 'Before'}
                    fill
                    className="object-cover"
                    draggable={false}
                    style={{ width: '100vw', maxWidth: 'none' }} // Keeps image from compressing
                  />
                </div>
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold border border-white/10 z-10 whitespace-nowrap">
                  {project.oldHint || 'Avvalgi'}
                </div>
              </div>

              {/* Central Drag Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center z-30"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="h-10 w-10 rounded-full bg-white text-blue-950 flex items-center justify-center shadow-2xl border-4 border-blue-950/80 select-none hover:scale-105 active:scale-95 transition-transform">
                  <ChevronLeft className="w-4 h-4 shrink-0 -mr-1" />
                  <ChevronRight className="w-4 h-4 shrink-0 -ml-1" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Narrative / Content Case Study */}
        {project.body && Array.isArray(project.body) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            <div className="md:col-span-1 space-y-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Loyiha yondashuvi
              </span>
              <h3 className="text-3xl font-black leading-tight text-white">
                Premium Rebrending Sirlari
              </h3>
              <div className="h-1.5 w-16 bg-blue-500 rounded-full"></div>
            </div>
            
            <div className="md:col-span-2 space-y-8">
              {project.body.map((item: any, i: number) => (
                <div key={i} className="border-l-2 border-blue-500 pl-6 space-y-3">
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
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
              {lang === 'uz' ? 'Brend Vizual Materiallari' : lang === 'ru' ? 'Визуальные Материалы Бренда' : lang === 'zh' ? '品牌视觉材料设计展示' : 'Brand Visual Materials'}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {project.galleryImages.map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-lg border border-white/5 cursor-pointer group"
                >
                  <Image
                    src={img}
                    alt={`Gallery ${i}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover visual enhancement */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Fullscreen Lightbox Overlay */}
        <AnimatePresence>
          {lightboxIndex !== null && project.galleryImages && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-12 select-none"
            >
              {/* Top bar controls */}
              <div className="absolute top-6 left-6 right-6 flex items-between justify-between z-50">
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest self-center">
                  Image {lightboxIndex + 1} of {project.galleryImages.length}
                </span>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLightboxIndex(null)}
                  className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Prev Button */}
              {project.galleryImages.length > 1 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex - 1 + project.galleryImages!.length) % project.galleryImages!.length);
                  }}
                  className="absolute left-6 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center z-50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Image viewport */}
              <motion.div 
                key={lightboxIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative max-w-full max-h-[75vh] w-[900px] h-[550px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
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
                  className="absolute right-6 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center z-50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Immersive CTA Capture Card */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#0B0F19] to-black border border-white/5 shadow-2xl text-center space-y-6">
          {/* Glowing background circles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-600/10 blur-[80px]"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-blue-500/10 blur-[80px]"></div>
          
          <div className="relative space-y-4 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-black leading-tight text-white">
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
              className="h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-full shadow-xl shadow-blue-900/30 transition-all hover:scale-[1.02] duration-300"
            >
              {dictionary.ctaBtn}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
