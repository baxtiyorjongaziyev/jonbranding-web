'use client';

import { Medal, Users, Star, Award } from 'lucide-react';
import { motion, useInView, useAnimate, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
}

const AnimatedNumber = ({ value, suffix }: AnimatedNumberProps) => {
    const [scope, animate] = useAnimate();
    const isInView = useInView(scope, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            animate(0, value, {
                duration: 2,
                ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for premium feel
                onUpdate: (latest) => {
                    if(scope.current) {
                        scope.current.textContent = Math.round(latest).toString();
                    }
                },
            });
        }
    }, [isInView, animate, value, scope]);

    return (
        <div className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground flex items-baseline">
            <motion.span ref={scope}>0</motion.span>
            <span className="text-primary ml-1">{suffix}</span>
        </div>
    );
};

const StatCard = ({ stat, index }: { stat: any, index: number }) => {
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

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            className={cn(
                "group relative overflow-hidden rounded-[2.5rem] p-8 glass-card-premium transition-all duration-500 hover:border-primary/30",
                stat.className
            )}
        >
            {/* Interactive Light Leak */}
            <motion.div 
                style={{ translateX: x, translateY: y }}
                className="light-leak-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div className={cn("p-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-inner transition-transform duration-500 group-hover:scale-110", stat.iconColor)}>
                        <stat.icon className="w-8 h-8" />
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                </div>

                <div className="mt-12">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    <h3 className="text-lg font-semibold mt-2 text-foreground/80 tracking-tight group-hover:text-foreground transition-colors">
                        {stat.label}
                    </h3>
                    <p className="text-sm mt-3 text-muted-foreground leading-relaxed max-w-[200px] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        {stat.description}
                    </p>
                </div>
            </div>

            {/* Ambient Background Pattern */}
            <div className="absolute inset-0 mesh-gradient-bg opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
        </motion.div>
    );
};

const Stats = ({ dictionary }: { dictionary: any }) => {
  if (!dictionary) return null;

  const stats = [
    { 
      icon: Award, 
      value: 1000, 
      suffix: "+", 
      label: dictionary.projects || "Loyiha",
      description: "Muvaffaqiyatli yakunlangan brending va dizayn loyihalari.",
      className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary/5 to-transparent",
      iconColor: "text-primary"
    },
    { 
      icon: Users, 
      value: 500, 
      suffix: "+", 
      label: dictionary.clients || "Mijoz",
      description: "Bizga ishongan dunyo darajasidagi kompaniyalar.",
      className: "md:col-span-1 md:row-span-1",
      iconColor: "text-accent"
    },
    { 
      icon: Medal, 
      value: 9, 
      suffix: "+", 
      label: dictionary.experience || "Yil",
      description: "Bozorda orttirilgan professional tajriba.",
      className: "md:col-span-1 md:row-span-1",
      iconColor: "text-primary"
    },
    { 
      icon: Star, 
      value: 90, 
      suffix: "%", 
      label: dictionary.recommend || "Tavsiya",
      description: "Mijozlarimizning bizga bo'lgan ishonchi va sadoqati.",
      className: "md:col-span-2 md:row-span-1",
      iconColor: "text-yellow-400"
    }
  ];

  return (
    <section className="bg-background py-24 sm:py-32 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto lg:max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
