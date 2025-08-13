'use client';

import { useState, useEffect, FC } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import Link from 'next/link';

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    useEffect(() => {
        const getEndTime = () => {
            let endTime = localStorage.getItem('offerEndTime');
            if (!endTime) {
                endTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();
                localStorage.setItem('offerEndTime', endTime);
            }
            return new Date(endTime);
        };

        const endTime = getEndTime();

        const interval = setInterval(() => {
            const now = new Date();
            const distance = endTime.getTime() - now.getTime();

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                localStorage.removeItem('offerEndTime');
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

    return (
        <div className="flex justify-center gap-4 text-center">
            <div>
                <span className="text-4xl sm:text-5xl font-bold">{formatTime(timeLeft.hours)}</span>
                <span className="block text-sm uppercase">Soat</span>
            </div>
            <div className="text-4xl sm:text-5xl font-bold">:</div>
            <div>
                <span className="text-4xl sm:text-5xl font-bold">{formatTime(timeLeft.minutes)}</span>
                <span className="block text-sm uppercase">Daqiqa</span>
            </div>
            <div className="text-4xl sm:text-5xl font-bold">:</div>
            <div>
                <span className="text-4xl sm:text-5xl font-bold">{formatTime(timeLeft.seconds)}</span>
                <span className="block text-sm uppercase">Soniya</span>
            </div>
        </div>
    );
};

interface OfferProps {
  onCTAClick: () => void;
}

const Offer: FC<OfferProps> = ({ onCTAClick }) => {
    return (
        <section id="offer" className="py-16 sm:py-24 bg-dark-blue text-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="flex justify-center items-center gap-2">
                        <Clock className="w-6 h-6 text-accent" />
                        <p className="font-bold text-accent uppercase tracking-widest">Cheklangan taklif</p>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold mt-4 text-white">
                        Rad etib bo'lmas <span className="text-accent">taklif</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                        Hozir buyurtma bering va har qanday branding paketi uchun <span className="font-bold text-white">kafolatlangan 50% chegirmaga</span> ega bo'ling. Bu imkoniyatni qo'ldan boy bermang!
                    </p>
                    <div className="mt-8 bg-black/20 rounded-2xl p-6">
                        <CountdownTimer />
                    </div>
                    <Button onClick={onCTAClick} size="lg" className="mt-8 text-lg px-10 py-7 bg-accent text-dark-blue hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform">
                        50% chegirmadan foydalanish
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Offer;
