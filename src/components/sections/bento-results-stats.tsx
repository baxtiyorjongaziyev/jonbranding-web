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
  const [displayValue, setDisplayValue] = useState(0);
  const target = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200;
    let animationFrameId: number;

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
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  if (!dictionary) return null;

  const resultsItems = dictionary.results?.items || [];
  const statsBadge = dictionary.results?.statsBadge || dictionary.stats?.badge || "STATISTIKA";
  const resultsBadge = dictionary.results?.badge || "NATIJALAR";

  const statsList = [
    { icon: Award, value: "1000+", label: dictionary.results?.stats?.projects || dictionary.stats?.projects || "Loyihalar", color: "text-primary" },
    { icon: Medal, value: "9+", label: dictionary.results?.stats?.experience || dictionary.stats?.experience || "Yil", color: "text-accent" },
    { icon: Users, value: "500+", label: dictionary.results?.stats?.clients || dictionary.stats?.clients || "Mijozlar", color: "text-blue-400" },
    { icon: Star, value: "90%", label: dictionary.results?.stats?.recommend || dictionary.stats?.recommend || "Tavsiya", color: "text-yellow-400" }
  ];

  return (
    <section id="results" className="py-8 lg:py-12 bg-background perspective-1000 overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="max-w-5xl mb-6 lg:mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 tracking-tighter leading-[1.1] uppercase whitespace-normal lg:whitespace-nowrap"
          >
            {dictionary.results?.title || "Natijalar"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="text-base md:text-lg text-muted-foreground font-bold max-w-3xl leading-snug tracking-tight italic border-l-4 border-primary pl-4"
          >
            {dictionary.results?.subtitle || "Strategik muvaffaqiyat ko'rsatkichlari."}
          </motion.p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5"
        >
          
          {/* Block 1: Client Results */}
          <BentoCard
            index={0}
            isFocused={true}
            onHover={() => {}}
            onLeave={() => {}}
            badge={resultsBadge}
            badgeColor="primary"
            className="h-auto md:h-[280px] lg:h-[320px]"
          >
            <div className="grid grid-cols-2 gap-4 md:gap-8 mt-5 md:mt-7 relative z-10">
              {resultsItems.slice(0, 2).map((item: any, idx: number) => (
                <div key={idx} className="group/item flex flex-col justify-between h-full">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1 whitespace-nowrap">
                      <CountUp 
                        value={item.impact} 
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tighter leading-none whitespace-nowrap"
                      />
                    </div>
                    <div className="mt-1">
                      <h4 className="text-xs sm:text-sm md:text-base lg:text-lg font-black text-foreground mb-0.5 leading-tight uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground font-bold leading-tight uppercase tracking-wider opacity-70 group-hover/item:opacity-100 transition-opacity">{item.desc}</p>
                    </div>
                  </div>
                  
                  {/* Subtle divider for mobile if needed, but grid handles it */}
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Block 2: Agency Stats */}
          <BentoCard
            index={1}
            isFocused={true}
            onHover={() => {}}
            onLeave={() => {}}
            badge={statsBadge}
            badgeColor="accent"
            className="h-auto md:h-[280px] lg:h-[320px]"
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:gap-x-8 md:gap-y-5 mt-5 md:mt-7">
              {statsList.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="space-y-1 md:space-y-2"
                >
                  <stat.icon className={cn("w-6 h-6 md:w-8 md:h-8 mb-1 text-primary/60", stat.color)} />
                  <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter leading-none">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="text-muted-foreground/60 font-bold uppercase tracking-widest text-[8px] md:text-[9px]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </BentoCard>

          {/* Block 3: The Quote (Combined & Static) - Now more compact */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="lg:col-span-2 p-5 md:p-6 lg:p-7 rounded-[2.5rem] glass-card-premium border border-white/10 backdrop-blur-3xl relative overflow-hidden group"
          >
            <div className="noise-texture" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Medal className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <p className="text-foreground text-base md:text-xl lg:text-2xl leading-snug font-bold italic text-center md:text-left tracking-tight">
                &ldquo;{dictionary.results?.detail || dictionary.stats?.detail}&rdquo;
              </p>
            </div>
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 bg-gradient-to-r from-primary/30 via-accent/30 to-transparent" />
          </motion.div>

        </motion.div>
      </div>

      {/* Ambient background decoration - Optimized for performance */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 md:opacity-20 z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary blur-[120px] rounded-full animate-pulse will-change-transform" />
        <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-accent blur-[120px] rounded-full animate-pulse will-change-transform" />
      </div>
    </section>
  );
};

export default BentoResultsStats;
