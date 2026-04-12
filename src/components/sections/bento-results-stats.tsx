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
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
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

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 400, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 400, damping: 30 });

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
        flex: isFocused ? 2 : 1,
        scale: isFocused ? 1.02 : 1,
        z: isFocused ? 20 : 0
      }}
      className={cn(
        "group relative overflow-hidden rounded-[2.5rem] p-6 md:p-12 glass-card-premium h-full flex flex-col justify-between cursor-pointer",
        isFocused ? "shadow-2xl ring-1 ring-white/20" : "opacity-80 grayscale-[0.2]",
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
            "px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] text-white border border-white/10 backdrop-blur-xl uppercase",
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
  const statsBadge = dictionary.stats?.badge || "STATISTIKA";
  const resultsBadge = dictionary.results?.badge || "NATIJALAR";

  const statsList = [
    { icon: Award, value: "1000+", label: dictionary.stats?.projects || "Loyihalar", color: "text-primary" },
    { icon: Medal, value: "9+", label: dictionary.stats?.experience || "Yil", color: "text-accent" },
    { icon: Users, value: "500+", label: dictionary.stats?.clients || "Mijozlar", color: "text-blue-400" },
    { icon: Star, value: "90%", label: dictionary.stats?.recommend || "Tavsiya", color: "text-yellow-400" }
  ];

  return (
    <section id="results" className="py-24 sm:py-32 bg-background perspective-1000 overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-7xl font-black text-foreground mb-6 tracking-tight leading-[1.1]"
          >
            {dictionary.results?.title || "Natijalar"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg md:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed"
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          
          {/* Block 1: Client Results */}
          <BentoCard
            index={0}
            isFocused={true}
            onHover={() => {}}
            onLeave={() => {}}
            badge={resultsBadge}
            badgeColor="primary"
          >
            <div className="space-y-10 md:space-y-16 mt-6 md:mt-12">
              {resultsItems.slice(0, 2).map((item: any, idx: number) => (
                <div key={idx} className="group/item">
                  <div className="flex items-baseline gap-4">
                    <CountUp 
                      value={item.impact} 
                      className="text-5xl sm:text-6xl md:text-7xl font-black text-primary tracking-tighter leading-none"
                    />
                  </div>
                  <div className="mt-2 md:mt-4">
                    <h4 className="text-xl md:text-3xl font-bold text-foreground mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm md:text-base font-medium">{item.desc}</p>
                  </div>
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
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:gap-x-12 md:gap-y-16 mt-6 md:mt-12">
              {statsList.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="space-y-2 md:space-y-4"
                >
                  <stat.icon className={cn("w-6 h-6 md:w-10 md:h-10 mb-2 text-primary/60", stat.color)} />
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-none">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="text-muted-foreground/60 font-bold uppercase tracking-widest text-[8px] md:text-[9px]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </BentoCard>

          {/* Block 3: The Quote (Combined & Static) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="lg:col-span-2 p-8 md:p-12 rounded-[2.5rem] glass-card-premium border border-white/10 backdrop-blur-3xl relative overflow-hidden group"
          >
            <div className="noise-texture" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Medal className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground text-xl md:text-3xl leading-snug font-bold italic text-center md:text-left tracking-tight">
                &ldquo;{dictionary.stats?.detail || dictionary.results?.detail}&rdquo;
              </p>
            </div>
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 bg-gradient-to-r from-primary/30 via-accent/30 to-transparent" />
          </motion.div>

        </motion.div>
      </div>

      {/* Ambient background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-primary blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-accent blur-[120px] rounded-full animate-pulse" />
      </div>
    </section>
  );
};

export default BentoResultsStats;
