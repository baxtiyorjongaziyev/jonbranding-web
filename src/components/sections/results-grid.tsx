'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { TrendingUp, Users, Award, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultItem {
  title: string;
  impact: string;
  desc: string;
  label: string;
}

interface ResultsGridProps {
  dictionary: {
    title: string;
    subtitle: string;
    items: ResultItem[];
  };
}

const ResultCard = ({ item, index }: { item: ResultItem, index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - 150);
        mouseY.set(e.clientY - rect.top - 150);
    };

    const icons = [TrendingUp, Users, Award];
    const Icon = icons[index % icons.length];

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            className={cn(
                "group relative overflow-hidden rounded-[2.5rem] p-10 glass-card-premium transition-all duration-500 hover:border-primary/30",
                index === 0 ? "md:col-span-2 md:row-span-1" : "md:col-span-1 md:row-span-1"
            )}
        >
            {/* Interactive Light Leak */}
            <motion.div 
                style={{ translateX: x, translateY: y }}
                className="light-leak-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                            {item.label}
                        </div>
                        <Icon className="w-6 h-6 text-muted-foreground/50 group-hover:text-primary transition-colors duration-500" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                        {item.title}
                    </h3>
                </div>

                <div className="mt-8">
                    <div className="text-6xl md:text-7xl font-black tracking-tighter text-foreground mb-2 group-hover:scale-105 origin-left transition-transform duration-500">
                        {item.impact}
                    </div>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                        {item.desc}
                    </p>
                </div>
            </div>

            {/* Ambient Background Pattern */}
            <div className="absolute inset-0 mesh-gradient-bg opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
};

const ResultsGrid: React.FC<ResultsGridProps> = ({ dictionary }) => {
  if (!dictionary || !dictionary.items) return null;

  return (
    <section id="results" className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-8 tracking-tighter leading-none">
                {dictionary.title}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {dictionary.subtitle}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-auto lg:max-w-7xl mx-auto">
          {dictionary.items.map((item, index) => (
            <ResultCard key={index} item={item} index={index} />
          ))}
        </div>
        
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex items-center gap-3 text-muted-foreground/60 font-medium"
        >
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
            <p className="text-sm">
                Natijalar real loyihalar bo'yicha tahlillar asosida shakllangan
            </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsGrid;
