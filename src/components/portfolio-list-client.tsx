'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Trophy, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  _id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  categoryLabel?: string;
  tags: string[];
  coverImage: string;
  description: string;
  results?: { metric: string; value: string }[];
}

interface PortfolioListClientProps {
  projects: Project[];
  lang: string;
  dictionary: {
    all: string;
    brandStrategy: string;
    logoDesign: string;
    packaging: string;
    naming: string;
    viewCase: string;
    resultsTitle: string;
  };
}

// 🌟 Ultra-Premium 3D Spotlight Card Component
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
            background: `radial-gradient(500px circle at ${coords.x}px ${coords.y}px, rgba(59, 130, 246, 0.14), transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </div>
  );
}

export default function PortfolioListClient({ projects, lang, dictionary }: PortfolioListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filterOptions = [
    { value: 'all', label: dictionary.all },
    { value: 'brand-strategy', label: dictionary.brandStrategy },
    { value: 'logo-design', label: dictionary.logoDesign },
    { value: 'packaging', label: dictionary.packaging },
    { value: 'naming', label: dictionary.naming },
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-16">
      {/* 🌟 Category Filter Pills (iOS segment slider style) */}
      <div className="relative flex flex-wrap p-1.5 bg-[#0e1424]/65 backdrop-blur-md border border-white/5 rounded-full max-w-3xl mx-auto z-10 shadow-inner">
        {filterOptions.map((opt) => {
          const isActive = selectedCategory === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSelectedCategory(opt.value)}
              className={`relative z-10 flex-1 px-5 py-3.5 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors duration-300 rounded-full ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-blue-600 rounded-full -z-10 shadow-lg shadow-blue-500/25"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* 🌟 Masonry Asymmetrical Grid Layout */}
      <motion.div 
        layout 
        className="space-y-12 mt-12"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 gap-12">
              
              {/* 🏆 Featured Case Study (First project spans full width in elegant split bento format) */}
              {filteredProjects[0] && (
                <motion.div
                  layout
                  key={filteredProjects[0]._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                  <SpotlightCard className="group">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                      
                      {/* Left: Cinematic Image Box */}
                      <div className="relative h-80 sm:h-[450px] lg:col-span-7 overflow-hidden select-none">
                        <Image
                          src={filteredProjects[0].coverImage}
                          alt={filteredProjects[0].title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          priority
                        />
                        
                        {/* Glow tag overlay */}
                        <div className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-blue-400">
                          <Sparkles className="w-4 h-4" />
                          <span>{filteredProjects[0].categoryLabel || filteredProjects[0].category}</span>
                        </div>
                      </div>

                      {/* Right: Splitted Content Info */}
                      <div className="p-8 sm:p-12 lg:col-span-5 flex flex-col justify-between space-y-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                              {filteredProjects[0].client}
                            </span>
                          </div>
                          
                          <h3 className="text-3xl sm:text-4xl font-black leading-tight text-white group-hover:text-blue-400 transition-colors">
                            {filteredProjects[0].title}
                          </h3>
                          
                          <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-medium">
                            {filteredProjects[0].description}
                          </p>
                        </div>

                        {/* Bento Metrics block */}
                        {filteredProjects[0].results && filteredProjects[0].results.length > 0 && (
                          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3.5 shadow-inner">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                              <Trophy className="w-4 h-4" />
                              <span>{dictionary.resultsTitle}</span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              {filteredProjects[0].results.slice(0, 3).map((res, i) => (
                                <div key={i} className="space-y-1">
                                  <p className="text-xl sm:text-2xl font-black text-white leading-none">
                                    {res.value}
                                  </p>
                                  <p className="text-[10px] font-bold text-gray-500 leading-tight uppercase tracking-wider line-clamp-2">
                                    {res.metric}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <Button 
                            asChild
                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-full shadow-lg shadow-blue-900/20 group/btn transition-all duration-300"
                          >
                            <Link href={`/${lang}/portfolio/${filteredProjects[0].slug}`}>
                              {dictionary.viewCase}
                              <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                    </div>
                  </SpotlightCard>
                </motion.div>
              )}

              {/* 🌟 Bottom Grid: Side-by-Side Asymmetric Showcase for subsequent projects */}
              {filteredProjects.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                  {filteredProjects.slice(1).map((project) => (
                    <motion.div
                      layout
                      key={project._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <SpotlightCard className="group h-full">
                        {/* Image Box */}
                        <div className="relative h-64 md:h-72 w-full overflow-hidden select-none">
                          <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          
                          {/* Tag overlay */}
                          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-blue-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{project.categoryLabel || project.category}</span>
                          </div>
                        </div>

                        {/* Contents details */}
                        <div className="p-6 md:p-8 flex flex-col flex-grow space-y-6">
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                              {project.client}
                            </span>
                            <h3 className="text-2xl font-black leading-tight text-white group-hover:text-blue-400 transition-colors">
                              {project.title}
                            </h3>
                          </div>

                          <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-medium flex-grow">
                            {project.description}
                          </p>

                          {/* Bento results */}
                          {project.results && project.results.length > 0 && (
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3 shadow-inner">
                              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                                <Trophy className="w-3.5 h-3.5" />
                                <span>{dictionary.resultsTitle}</span>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-3">
                                {project.results.slice(0, 3).map((res, i) => (
                                  <div key={i} className="space-y-1">
                                    <p className="text-lg font-black text-white leading-none">
                                      {res.value}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-500 leading-tight uppercase tracking-wider line-clamp-2">
                                      {res.metric}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-2">
                            <Button 
                              asChild
                              className="w-full h-14 bg-white/5 hover:bg-blue-600 text-white hover:text-white border border-white/10 hover:border-blue-600 font-bold text-base rounded-full group/btn transition-all duration-300"
                            >
                              <Link href={`/${lang}/portfolio/${project.slug}`}>
                                {dictionary.viewCase}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  ))}
                </div>
              )}

            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
