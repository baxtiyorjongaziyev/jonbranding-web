
'use client';

import { useState, useEffect, FC, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, PercentSquare, Sparkles, Rocket, ShieldCheck, FileCheck, Gift, LifeBuoy, BadgePercent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

interface OfferProps {
  onCTAClick: () => void;
  lang: string;
  dictionary: any;
}

const offerIcons: { [key: string]: React.ElementType } = {
    Clock,
    Rocket,
    ShieldCheck,
    FileCheck,
    Gift,
    LifeBuoy,
    BadgePercent
};

const LiquidBlob = ({ className, style, transition }: { className: string, style: React.CSSProperties, transition: object }) => (
    <motion.div
        className={cn("absolute mix-blend-soft-light", className)}
        style={style}
        animate={{
            x: ['-20%', '20%', '-20%'],
            y: ['-10%', '10%', '-10%'],
            rotate: [0, 360, 0],
        }}
        transition={transition}
    />
);


const Offer: FC<OfferProps> = ({ onCTAClick, lang, dictionary }) => {
    const translations = dictionary;
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    useEffect(() => {
        const getOfferEndTime = () => {
            let endTime = localStorage.getItem('offerEndTime');
            if (!endTime || new Date().getTime() > parseInt(endTime)) {
                endTime = (new Date().getTime() + 24 * 60 * 60 * 1000).toString();
                localStorage.setItem('offerEndTime', endTime);
            }
            return parseInt(endTime);
        };

        const offerEndTime = getOfferEndTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = offerEndTime - now;

            if (distance < 0) {
                // Reset timer for a new 24h cycle
                const newEndTime = (new Date().getTime() + 24 * 60 * 60 * 1000).toString();
                localStorage.setItem('offerEndTime', newEndTime);
                // The main logic will pick up the new time on the next interval
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (time: number) => time.toString().padStart(2, '0');
    
    if (!translations) return null;

    return (
        <section id="offer" className="relative py-20 sm:py-28 bg-dark-blue text-white overflow-hidden">
             <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-br from-dark-blue to-blue-900" />
                 <AnimatePresence>
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 filter blur-3xl"
                    >
                        <LiquidBlob 
                            className="bg-accent" 
                            style={{ top: '5%', left: '10%', width: 300, height: 300, borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} 
                            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        />
                         <LiquidBlob 
                            className="bg-primary" 
                            style={{ bottom: '10%', right: '15%', width: 350, height: 350, borderRadius: '80% 20% 60% 40% / 50% 70% 30% 50%' }} 
                            transition={{ duration: 35, repeat: Infinity, ease: 'linear', delay: 5 }}
                        />
                         <LiquidBlob 
                            className="bg-sky-blue" 
                            style={{ top: '25%', right: '5%', width: 250, height: 250, borderRadius: '30% 70% 50% 50% / 60% 40% 60% 40%' }} 
                            transition={{ duration: 40, repeat: Infinity, ease: 'linear', delay: 10 }}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="relative container mx-auto px-4 z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="flex justify-center items-center gap-2">
                        <Sparkles className="w-6 h-6 text-accent" />
                        <p className="font-bold text-accent uppercase tracking-widest">{translations.subtitle}</p>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold mt-4 text-white" dangerouslySetInnerHTML={{ __html: translations.title }}>
                    </h2>
                     <div className="mt-6 flex justify-center items-center gap-4">
                        <div className="text-center">
                            <div className="font-bold text-lg text-gray-300">{translations.timerLabel}</div>
                            <div className="flex gap-2 text-4xl font-mono font-bold text-accent tracking-widest">
                                <span>{formatTime(timeLeft.hours)}</span>:
                                <span>{formatTime(timeLeft.minutes)}</span>:
                                <span>{formatTime(timeLeft.seconds)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                        {translations.description.map((item: {icon: string, text: string}, index: number) => {
                             const Icon = offerIcons[item.icon] || Sparkles;
                             return (
                                 <div key={index} className="flex items-start text-left gap-4 p-3 bg-white/5 rounded-lg border border-white/10 h-full">
                                     <div className="flex-shrink-0 bg-accent/20 text-accent p-2 rounded-md mt-1">
                                        <Icon className="w-5 h-5" />
                                     </div>
                                     <p 
                                        className="text-gray-300 text-sm"
                                        dangerouslySetInnerHTML={{ __html: item.text }}
                                    ></p>
                                 </div>
                             )
                        })}
                    </div>
                    
                    <Button id="offer-cta" size="lg" onClick={onCTAClick} className="mt-10 text-lg px-10 py-7 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform animate-breathing">
                       {translations.button}
                    </Button>
                    <p className="mt-3 text-xs text-gray-400">{translations.note}</p>
                </div>
            </div>
        </section>
    );
};

export default Offer;
