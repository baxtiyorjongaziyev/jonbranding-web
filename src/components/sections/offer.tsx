
'use client';

import { useState, useEffect, FC } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, PercentSquare } from 'lucide-react';
import Link from 'next/link';

interface OfferProps {
  onCTAClick: () => void;
}

const Offer: FC<OfferProps> = ({ onCTAClick }) => {
    // End date for the offer
    const offerEndDate = new Date('2024-09-01T00:00:00');
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const distance = offerEndDate.getTime() - now.getTime();

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft({ days, hours, minutes });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    return (
        <section id="offer" className="py-16 sm:py-24 bg-dark-blue text-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="flex justify-center items-center gap-2">
                        <PercentSquare className="w-6 h-6 text-accent" />
                        <p className="font-bold text-accent uppercase tracking-widest">PCG a'zolari uchun maxsus taklif</p>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold mt-4 text-white">
                        Siz kutgan <span className="text-accent">imkoniyat!</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                        Siz <a href="https://www.facebook.com/groups/Potrebitel.Uz" target="_blank" rel="noopener noreferrer" className="font-bold text-white underline hover:text-accent">Potrebitel.uz (PCG)</a> hamjamiyatining faol a'zosisimisiz? Unda bizning istalgan brending to'plamimiz uchun <span className="font-bold text-white">kafolatlangan 50% chegirmaga</span> ega bo'ling! Bu sizning biznesingiz uchun eng yaxshi sarmoyadir.
                    </p>
                    
                    {timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 ? (
                        <div className="mt-8 bg-black/20 rounded-2xl p-6">
                             <div className="flex justify-center gap-4 sm:gap-6 text-center">
                                <div>
                                    <span className="text-4xl sm:text-5xl font-bold">{formatTime(timeLeft.days)}</span>
                                    <span className="block text-sm uppercase">Kun</span>
                                </div>
                                <div className="text-4xl sm:text-5xl font-bold">:</div>
                                <div>
                                    <span className="text-4xl sm:text-5xl font-bold">{formatTime(timeLeft.hours)}</span>
                                    <span className="block text-sm uppercase">Soat</span>
                                </div>
                                <div className="text-4xl sm:text-5xl font-bold">:</div>
                                <div>
                                    <span className="text-4xl sm:text-5xl font-bold">{formatTime(timeLeft.minutes)}</span>
                                    <span className="block text-sm uppercase">Daqiqa</span>
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-gray-400">Taklif tugashiga qolgan vaqt</p>
                        </div>
                    ) : (
                         <div className="mt-8 bg-black/20 rounded-2xl p-4">
                            <p className="font-bold text-lg text-red-400">Afsuski, ushbu maxsus taklif muddati tugadi.</p>
                        </div>
                    )}
                    
                    <Button asChild size="lg" className="mt-8 text-lg px-10 py-7 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform animate-breathing" disabled={timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0}>
                        <Link href="/xizmatlar">
                           PCG chegirmasini qo'llash
                        </Link>
                    </Button>
                    <p className="mt-2 text-xs text-gray-400">*Chegirma xizmatlar bo'limida to'plamingizni yig'ganingizdan so'ng, murojaat vaqtida qo'llaniladi.</p>
                </div>
            </div>
        </section>
    );
};

export default Offer;
