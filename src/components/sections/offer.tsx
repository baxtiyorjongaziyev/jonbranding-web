
'use client';

import { useState, useEffect, FC } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, PercentSquare } from 'lucide-react';
import Link from 'next/link';

interface OfferProps {
  onCTAClick: () => void;
}

const Offer: FC<OfferProps> = ({ onCTAClick }) => {
    return (
        <section id="offer" className="py-16 sm:py-24 bg-dark-blue text-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="flex justify-center items-center gap-2">
                        <PercentSquare className="w-6 h-6 text-accent" />
                        <p className="font-bold text-accent uppercase tracking-widest">Maxsus taklif</p>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold mt-4 text-white">
                        Sizning <span className="text-accent">imkoniyatingiz!</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                        Biznesingiz uchun kompleks yechim izlayapsizmi? Xizmatlar bo'limimizdan <strong>3 yoki undan ortiq asosiy brending xizmatini</strong> tanlang va umumiy to'plamingiz uchun <strong>kafolatlangan 20% chegirmaga</strong> ega bo'ling. Bu sizning biznesingiz uchun eng yaxshi sarmoyadir.
                    </p>
                    
                    <Button asChild size="lg" className="mt-8 text-lg px-10 py-7 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform animate-breathing">
                        <Link href="/xizmatlar">
                           Chegirmadan foydalanish
                        </Link>
                    </Button>
                    <p className="mt-2 text-xs text-gray-400">*Chegirma xizmatlar bo'limida to'plamingizni yig'ganingizdan so'ng avtomatik tarzda hisoblanadi.</p>
                </div>
            </div>
        </section>
    );
};

export default Offer;
