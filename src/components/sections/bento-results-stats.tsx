'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, Users, Award, Star, Medal, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface BentoResultsStatsProps {
  dictionary: any;
}

const CountUp = ({ value, className }: { value: string, className?: string }) => {
  const target = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');
  const [displayValue, setDisplayValue] = useState(target);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200;
    let animationFrameId: number;
    setDisplayValue(0);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Power3 out easing for smoother finish
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeProgress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target]);

  return (
    <span className={className}>
      {displayValue}{suffix}
    </span>
  );
};

const BentoCard = ({ 
  children, 
  className, 
  isFocused, 
  onHover, 
  onLeave, 
  index,
  badge,
  badgeColor = "primary"
}: { 
  children: React.ReactNode, 
  className?: string, 
  isFocused: boolean, 
  onHover: () => void, 
  onLeave: () => void,
  index: number,
  badge: string,
  badgeColor?: "primary" | "accent"
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 200, damping: 20 });

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;
    mouseX.set(mouseXPos / width - 0.5);
    mouseY.set(mouseYPos / height - 0.5);
  }

  function handleMouseLeave() {
    onLeave();
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      layout
      onMouseMove={onMouseMove}
      onMouseEnter={onHover}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d",
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        mass: 0.5
      }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      animate={{ 
        scale: isFocused ? 1.01 : 1,
        z: isFocused ? 10 : 0
      }}
      className={cn(
        "group relative overflow-hidden rounded-[2.5rem] p-6 md:p-12 glass-card-premium h-full flex flex-col justify-between cursor-pointer transform-gpu transition-shadow duration-500",
        isFocused ? "shadow-2xl ring-1 ring-white/10" : "opacity-80 grayscale-[0.1]",
        className
      )}
    >
      {/* Background Effects */}
      <div className="noise-texture" />
      <motion.div 
        className="spotlight"
        style={{
          left: useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]),
          top: useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]),
        }}
      />

      <div className="absolute top-8 left-8 z-30">
        <motion.span 
          layout
          className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] text-white border border-white/10 backdrop-blur-lg uppercase",
            badgeColor === "primary" ? "bg-primary/20" : "bg-accent/20"
          )}
        >
          {badge}
        </motion.span>
      </div>

      <div className="relative z-20" style={{ transform: "translateZ(50px)" }}>
        {children}
      </div>

      {/* Modern Mesh Gradient Overlay */}
      <div className={cn(
        "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-1000 bg-gradient-to-br",
        badgeColor === "primary" ? "from-primary/40 to-transparent" : "from-accent/40 to-transparent"
      )} />
    </motion.div>
  );
};

const BentoResultsStats: React.FC<BentoResultsStatsProps> = ({ dictionary }) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  if (!dictionary) return null;

  const resultsItems = dictionary.results?.items || [];
  const statsList = [
    { icon: Award, value: "1000+", label: dictionary.results?.stats?.projects || "Loyihalar" },
    { icon: Medal, value: "9+", label: dictionary.results?.stats?.experience || "Yil" },
    { icon: Users, value: "500+", label: dictionary.results?.stats?.clients || "Mijozlar" },
    { icon: Star, value: "90%", label: dictionary.results?.stats?.recommend || "Tavsiya" }
  ];

  return (
    <section id="results" className="py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6"
          >
            {dictionary.results?.title || "Natijalar"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground border-l-4 border-primary pl-6 font-medium italic"
          >
            {dictionary.results?.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Results Card */}
          <div className="lg:col-span-7">
            <BentoCard 
              index={0} 
              badge="Case Studies" 
              isFocused={focusedIndex === 0}
              onHover={() => setFocusedIndex(0)}
              onLeave={() => setFocusedIndex(null)}
              className="bg-slate-50/50"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 p-4">
                {resultsItems.slice(0, 2).map((item: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                    <CountUp 
                      value={item.impact} 
                      className="text-5xl md:text-6xl font-black text-primary tracking-tighter"
                    />
                    <div>
                      <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-6">
            {statsList.map((stat, idx) => (
              <BentoCard 
                key={idx}
                index={idx + 1}
                badge={stat.label}
                isFocused={focusedIndex === idx + 1}
                onHover={() => setFocusedIndex(idx + 1)}
                onLeave={() => setFocusedIndex(null)}
                className="text-center"
              >
                <div className="flex flex-col items-center justify-center py-6">
                  <stat.icon className="w-8 h-8 mb-4 text-primary/40 group-hover:text-primary transition-colors duration-500" />
                  <div className="text-3xl font-black text-foreground tracking-tighter">
                     <CountUp value={stat.value} />
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>

          {/* Quote/Detail Block */}
          <div className="lg:col-span-12">
            <BentoCard
              index={5}
              badge="Success"
              badgeColor="accent"
              isFocused={focusedIndex === 5}
              onHover={() => setFocusedIndex(5)}
              onLeave={() => setFocusedIndex(null)}
              className="bg-primary text-white"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Medal className="w-8 h-8" />
                </div>
                <p className="text-xl md:text-2xl font-bold italic leading-relaxed text-center md:text-left">
                  &ldquo;{dictionary.results?.detail || dictionary.stats?.detail}&rdquo;
                </p>
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoResultsStats;
