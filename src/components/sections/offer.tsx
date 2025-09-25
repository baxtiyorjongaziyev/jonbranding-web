
'use client';

import { useState, useEffect, FC } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, PercentSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OfferProps {
  onCTAClick: () => void;
}

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


const Offer: FC<OfferProps> = ({ onCTAClick }) => {
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
                <div className="text-center max-w-3xl mx-auto">
                    <div className="flex justify-center items-center gap-2">
                        <Sparkles className="w-6 h-6 text-accent" />
                        <p className="font-bold text-accent uppercase tracking-widest">Strategik Imkoniyat</p>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold mt-4 text-white">
                       Yaxlit brending — bu shunchaki chegirma emas, bu strategik ustunlik.
                    </h2>
                    <p 
                        className="mt-6 text-lg text-gray-300"
                        dangerouslySetInnerHTML={{ __html: "Brending bu — qismlarga bo'lib bo'lmaydigan yaxlit tizim. Xizmatlarimizdan bir martada <strong>3 yoki undan ortiq asosiy yo'nalishni</strong> tanlab, siz nafaqat umumiy summadan <strong>kafolatlangan -20% tejaysiz</strong>, balki bundan ham muhimi — brendingiz uchun <strong>yagona, kuchli va izchil poydevor</strong> qurasiz. Bu premium agentliklarga nisbatan ikki karra foyda degani!" }}
                    >
                    </p>
                    
                    <Button asChild size="lg" className="mt-10 text-lg px-10 py-7 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform animate-breathing">
                        <Link href="/xizmatlar">
                           O'z to'plamimni yaratish
                        </Link>
                    </Button>
                    <p className="mt-3 text-xs text-gray-400">*Chegirma xizmatlar bo'limida to'plamingizni yig'ganingizdan so'ng avtomatik tarzda hisoblanadi.</p>
                </div>
            </div>
        </section>
    );
};

export default Offer;
