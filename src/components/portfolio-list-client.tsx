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
    brandStrategy?: string;
    logoDesign: string;
    brandbook?: string;
    corporateStyle?: string;
    packaging: string;
    naming: string;
    viewCase: string;
    resultsTitle: string;
  };
}

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
      className={`relative overflow-hidden rounded-[2.25rem] border border-[#E5E7EB] bg-white transition-all duration-500 hover:border-[#2554FF]/40 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-xl ${className}`}
      {...props}
    >
      {isFocused && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[2.25rem] opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(500px circle at ${coords.x}px ${coords.y}px, rgba(37, 84, 255, 0.08), transparent 80%)`,
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'brand-strategy': return dictionary.brandStrategy || 'Brend-strategiya';
      case 'logo-design': return dictionary.logoDesign || 'Logotip dizayni';
      case 'corporate-style': return dictionary.corporateStyle || 'Firma uslubi';
      case 'brandbook': return dictionary.brandbook || 'Brendbuk';
      case 'packaging': return dictionary.packaging || 'Qadoq dizayni';
      case 'naming': return dictionary.naming || 'Neyming';
      default: return category;
    }
  };

  const filterOptions = [
    { value: 'all', label: dictionary.all },
    { value: 'brand-strategy', label: dictionary.brandStrategy || 'Brend-strategiya' },
    { value: 'logo-design', label: dictionary.logoDesign },
    { value: 'corporate-style', label: dictionary.corporateStyle || 'Firma uslubi' },
    { value: 'brandbook', label: dictionary.brandbook || 'Brendbuk' },
    { value: 'packaging', label: dictionary.packaging },
    { value: 'naming', label: dictionary.naming },
  ];


  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-16">
      <div className="relative flex flex-wrap p-1.5 bg-[#F8F9FB] border border-[#E5E7EB] rounded-full max-w-3xl mx-auto z-10 shadow-xs">
        {filterOptions.map((opt) => {
          const isActive = selectedCategory === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSelectedCategory(opt.value)}
              className={`relative z-10 flex-1 px-5 py-3.5 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors duration-300 rounded-full ${
                isActive ? 'text-white' : 'text-[#6B7280] hover:text-[#0A0B0E]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-[#2554FF] rounded-full -z-10 shadow-md shadow-[#2554FF]/25"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>

      <motion.div layout className="space-y-12 mt-12">
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 gap-12">
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
                      <div className="relative h-80 sm:h-[450px] lg:col-span-7 overflow-hidden select-none">
                        <Image
                          src={filteredProjects[0].coverImage}
                          alt={filteredProjects[0].title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          priority
                        />
                        <div className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#E5E7EB] text-xs font-bold text-[#2554FF] shadow-xs">
                          <Sparkles className="w-4 h-4" />
                          <span>{filteredProjects[0].categoryLabel || getCategoryLabel(filteredProjects[0].category)}</span>
                        </div>
                      </div>
                      <div className="p-8 sm:p-12 lg:col-span-5 flex flex-col justify-between space-y-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2554FF] animate-pulse"></span>
                            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">
                              {filteredProjects[0].client}
                            </span>
                          </div>
                          <h3 className="text-3xl sm:text-4xl font-black leading-tight text-[#0A0B0E] group-hover:text-[#2554FF] transition-colors">
                            {filteredProjects[0].title}
                          </h3>
                          <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed font-medium">
                            {filteredProjects[0].description}
                          </p>
                        </div>
                        {filteredProjects[0].results && filteredProjects[0].results.length > 0 && (
                          <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl p-5 space-y-3.5 shadow-inner">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#2554FF] uppercase tracking-widest">
                              <Trophy className="w-4 h-4" />
                              <span>{dictionary.resultsTitle}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {filteredProjects[0].results.slice(0, 4).map((result, i) => (
                                <div key={i} className="text-center p-3 rounded-xl bg-white border border-[#E5E7EB]">
                                  <div className="text-xl font-black text-[#0A0B0E]">{result.value}</div>
                                  <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mt-0.5">{result.metric}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <Link href={`/${lang}/portfolio/${filteredProjects[0].slug}`}>
                          <Button className="w-full bg-[#2554FF] hover:bg-[#1C46E6] text-white rounded-2xl py-4 font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-[#2554FF]/25">
                            {dictionary.viewCase}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              )}

              {filteredProjects.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.slice(1).map((project, index) => (
                    <motion.div
                      layout
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <SpotlightCard className="group h-full">
                        <div className="relative h-56 overflow-hidden select-none">
                          <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E5E7EB] text-[10px] font-bold text-[#2554FF] shadow-xs">
                            <Star className="w-3 h-3" />
                            <span>{project.categoryLabel || getCategoryLabel(project.category)}</span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                          <div>
                            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">{project.client}</p>
                            <h3 className="text-lg font-black leading-tight text-[#0A0B0E] group-hover:text-[#2554FF] transition-colors line-clamp-2">
                              {project.title}
                            </h3>
                            <p className="mt-2 text-sm text-[#4B5563] line-clamp-2 leading-relaxed">{project.description}</p>
                          </div>
                          <Link href={`/${lang}/portfolio/${project.slug}`} className="block">
                            <Button className="w-full bg-[#F8F9FB] hover:bg-[#2554FF] text-[#0A0B0E] hover:text-white border border-[#E5E7EB] hover:border-[#2554FF] rounded-xl transition-all duration-300 text-xs font-bold tracking-wide">
                              {dictionary.viewCase}
                              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                            </Button>
                          </Link>
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
