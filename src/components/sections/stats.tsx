
'use client';

import { Medal, Users, Star, Award } from 'lucide-react';
import { motion, useInView, useAnimate } from 'framer-motion';
import { useEffect, useRef } from 'react';

const stats = [
  { icon: Medal, value: 9, suffix: "+", label: "Yillik tajriba" },
  { icon: Users, value: 500, suffix: "+", label: "Mamnun mijozlar" },
  { icon: Award, value: 1000, suffix: "+", label: "Muvaffaqiyatli loyiha" },
  { icon: Star, value: 90, suffix: "%", label: "Mijozlar tavsiya qilishadi" }
];

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
                ease: "easeOut",
                onUpdate: (latest) => {
                    if(scope.current) {
                        scope.current.textContent = Math.round(latest).toString();
                    }
                },
            });
        }
    }, [isInView, animate, value, scope]);

    return (
        <div className="text-3xl sm:text-4xl font-extrabold text-dark-blue flex items-center justify-center">
            <motion.span ref={scope}>0</motion.span>
            <span>{suffix}</span>
        </div>
    );
};


const Stats = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="border rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                    <stat.icon className="w-10 h-10 text-primary mb-2" />
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
                </div>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
