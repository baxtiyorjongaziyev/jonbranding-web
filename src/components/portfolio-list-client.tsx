'use client';

import React, { useState } from 'react';
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
    <div className="space-y-12">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {filterOptions.map((opt) => {
          const isActive = selectedCategory === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSelectedCategory(opt.value)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/20'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Projects */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mt-12"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group relative bg-[#0B0F19]/45 backdrop-blur-xl border border-white/5 hover:border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Box */}
              <div className="relative h-64 md:h-72 w-full overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority={project._id.includes('den-aroma')}
                />
                
                {/* Visual Glassmorphic Tag Overlay */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  {project.categoryLabel || project.category}
                </div>
              </div>

              {/* Card Contents */}
              <div className="p-6 md:p-8 flex flex-col flex-grow space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {project.client}
                  </span>
                  <h3 className="text-2xl font-black leading-tight text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                </div>

                <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium flex-grow">
                  {project.description}
                </p>

                {/* Displaying Project Results (Gourmet Bento Style) */}
                {project.results && project.results.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
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

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-full bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Button container */}
                <div className="pt-2">
                  <Button 
                    asChild
                    className="w-full h-14 bg-white/5 hover:bg-blue-600 text-white hover:text-white border border-white/10 hover:border-blue-600 font-bold text-base rounded-full group transition-all duration-300 shadow-xl shadow-black/10"
                  >
                    <Link href={`/${lang}/portfolio/${project.slug}`}>
                      {dictionary.viewCase}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
