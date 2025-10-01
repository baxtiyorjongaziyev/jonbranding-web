'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useExitIntent } from '@/hooks/use-exit-intent';

const testimonials = [
    { name: "Anvar T.", action: "konsultatsiya oldi" },
    { name: "Sardor M.", action: "paketni band qildi" },
    { name: "Gulnora A.", action: "savoliga javob oldi" },
    { name: "Timur R.", action: "taklif bilan tanishdi" },
    { name: "Lola K.", action: "konsultatsiya so'radi" }
];

const CountdownTimer = ({ initialHours = 3 }: { initialHours: number }) => {
    const getInitialTime = () => {
        if (typeof window !== 'undefined') {
            const storedEndTime = localStorage.getItem('offerEndTime');
            if (storedEndTime && parseInt(storedEndTime) > Date.now()) {
                return parseInt(storedEndTime) - Date.now();
            }
            const newEndTime = Date.now() + initialHours * 60 * 60 * 1000;
            localStorage.setItem('offerEndTime', newEndTime.toString());
            return newEndTime - Date.now();
        }
        return initialHours * 60 * 60 * 1000;
    };

    const [timeLeft, setTimeLeft] = useState(getInitialTime());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1000) {
                    const newEndTime = Date.now() + initialHours * 60 * 60 * 1000;
                    localStorage.setItem('offerEndTime', newEndTime.toString());
                    return newEndTime - Date.now();
                }
                return prevTime - 1000;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [initialHours]);

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="text-center">
                <div className="text-4xl sm:text-6xl font-mono font-bold text-white bg-black/20 px-3 py-2 rounded-lg">{String(hours).padStart(2, '0')}</div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">soat</div>
            </div>
            <div className="text-4xl sm:text-6xl font-bold text-white pb-6">:</div>
            <div className="text-center">
                <div className="text-4xl sm:text-6xl font-mono font-bold text-white bg-black/20 px-3 py-2 rounded-lg">{String(minutes).padStart(2, '0')}</div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">daqiqa</div>
            </div>
             <div className="text-4xl sm:text-6xl font-bold text-white pb-6">:</div>
            <div className="text-center">
                <div className="text-4xl sm:text-6xl font-mono font-bold text-white bg-black/20 px-3 py-2 rounded-lg">{String(seconds).padStart(2, '0')}</div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">soniya</div>
            </div>
        </div>
    );
};


const RecentActivity = () => {
    const [activity, setActivity] = useState(testimonials[0]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showNotification = () => {
            const randomActivity = testimonials[Math.floor(Math.random() * testimonials.length)];
            setActivity(randomActivity);
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 4000); // Hide after 4 seconds
        };
        
        // Show first notification after a delay
        const initialTimeout = setTimeout(showNotification, 7000);

        // Then show notifications periodically
        const interval = setInterval(() => {
             setTimeout(showNotification, 5000 + Math.random() * 10000); // 5 to 15 seconds
        }, 15000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        }
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    className="fixed bottom-4 left-4 z-[100] bg-gray-800 text-white p-4 rounded-lg shadow-2xl flex items-center gap-3 border border-gray-700"
                >
                    <CheckCircle className="text-green-400 h-6 w-6" />
                    <p className="text-sm font-medium">
                        <span className="font-bold">{activity.name}</span> {Math.floor(Math.random() * 25) + 5} daqiqa oldin {activity.action}.
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ExitPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white rounded-2xl p-8 max-w-md text-center relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XCircle className="h-6 w-6" />
                </button>
                <h2 className="text-3xl font-extrabold text-red-600">Stop!</h2>
                <p className="mt-2 text-xl text-gray-800">Siz haqiqatdan ham <span className="font-bold">5 500 000 so'mlik</span> bonusdan voz kechyapsizmi?</p>
                <Button asChild size="lg" className="mt-6 bg-green-500 hover:bg-green-600 text-lg">
                    <Link href="https://t.me/baxtiyorjon_gaziyev" target="_blank" onClick={onClose}>
                        Yo'q, bonusni olaman
                    </Link>
                </Button>
            </motion.div>
        </div>
    );
};

export default function OfferPage() {
    const [slotsLeft, setSlotsLeft] = useState(3);
    const [isPopupOpen, setPopupOpen] = useState(false);

    const handleExitIntent = useCallback(() => {
        // Prevent popup on mobile
        if (window.innerWidth < 768) return;
        setPopupOpen(true);
    }, []);

    useExitIntent(handleExitIntent);

    useEffect(() => {
        const initialSlots = parseInt(localStorage.getItem('slotsLeft') || '3');
        setSlotsLeft(initialSlots);

        const interval = setInterval(() => {
            setSlotsLeft(prev => {
                const newSlots = prev > 1 ? prev - 1 : 5;
                localStorage.setItem('slotsLeft', newSlots.toString());
                return newSlots;
            });
        }, 900000); // every 15 minutes

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="bg-gray-900 text-white">
            <div className="bg-red-600 text-center p-4">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white animate-pulse">🔥 RAD ETSANGIZ, RAQIBINGIZ RAD ETMAYDI</h1>
                <p className="mt-2 text-lg sm:text-xl font-bold text-white/90">Qolgan joylar: {slotsLeft}/5</p>
            </div>

            <div className="container mx-auto px-4 py-12 sm:py-20 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-5xl font-bold leading-tight">Siz bu sahifani yopishdan oldin...</h2>
                    <p className="mt-4 text-lg sm:text-xl text-gray-300">
                        Ertaga sizning raqibingiz professional brend bilan chiqdi. Logo — aql bovar qilmaydi. Packaging — do'konda birinchi bo'lib ko'zga tashlanadi. Mijozlar — sizdan emas, UNDAN sotib olishyapti. Sabab oddiy: U sarmoya kiritdi. Siz esa... o'yladingiz.
                    </p>
                </div>
            </div>

            <div className="bg-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <h3 className="text-center text-3xl font-bold text-yellow-300">📢 Mening taklifim oddiy:</h3>
                    <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                        <div className="bg-gray-700/50 p-6 rounded-lg flex items-center gap-4"><CheckCircle className="h-6 w-6 text-green-400" /><span><span className="font-bold">9 yillik tajriba</span> — 500+ brend yaratildi</span></div>
                        <div className="bg-gray-700/50 p-6 rounded-lg flex items-center gap-4"><CheckCircle className="h-6 w-6 text-green-400" /><span><span className="font-bold">Logo + Brandbook + Packaging</span> — bir joyda</span></div>
                        <div className="bg-gray-700/50 p-6 rounded-lg flex items-center gap-4"><CheckCircle className="h-6 w-6 text-green-400" /><span><span className="font-bold">Patent va Trademark</span> bo'yicha bepul maslahat</span></div>
                        <div className="bg-gray-700/50 p-6 rounded-lg flex items-center gap-4"><CheckCircle className="h-6 w-6 text-green-400" /><span><span className="font-bold">2-3 hafta ichida</span> tayyor natija</span></div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 sm:py-20">
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-8 max-w-3xl mx-auto">
                    <h3 className="text-center text-2xl sm:text-3xl font-bold text-yellow-300">⏰ FAQAT BIRINCHI 5 TA MIJOZ UCHUN:</h3>
                    <div className="mt-6 space-y-4 text-lg">
                        <p className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-green-400" /> <span>Brandbook dizayni — <span className="font-bold">BEPUL</span> <span className="line-through text-gray-400">3 000 000 so'm</span></span></p>
                        <p className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-green-400" /> <span>Naming + Patent maslahat — <span className="font-bold">BEPUL</span> <span className="line-through text-gray-400">2 000 000 so'm</span></span></p>
                        <p className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-green-400" /> <span>Prezentatsiya shabloni — <span className="font-bold">BEPUL</span> <span className="line-through text-gray-400">500 000 so'm</span></span></p>
                    </div>
                    <div className="mt-6 text-center text-xl sm:text-2xl font-bold text-red-500 bg-red-500/10 p-4 rounded-lg">
                        UMUMIY: 5 500 000 so'm qiymatidagi bonuslar
                    </div>
                </div>
            </div>

            <div className="bg-blue-900/40 py-12">
                 <div className="container mx-auto px-4 text-center">
                     <h3 className="text-2xl sm:text-3xl font-bold">Taklif tugashiga qoldi:</h3>
                     <div className="mt-4">
                         <CountdownTimer initialHours={3} />
                     </div>
                     <p className="mt-4 text-sm text-gray-400">Taymer tugasa — oddiy narx qaytadi.</p>
                 </div>
            </div>
            
            <div className="container mx-auto px-4 py-12 sm:py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold">🤔 Fikrlashingizga sabab yo'q</h2>
                    <div className="mt-6 text-left space-y-4">
                        <p><span className="font-bold text-yellow-300">Savol:</span> Brending kerakmi? <br /> <span className="text-gray-300">Javob: Ha, agar biznesingiz rivojlanishi kerak bo'lsa.</span></p>
                        <p><span className="font-bold text-yellow-300">Savol:</span> Qimmat emasmi? <br /> <span className="text-gray-300">Javob: Yo'q. Qimmat — bu yillar davomida professional brendsiz qolish.</span></p>
                        <p><span className="font-bold text-yellow-300">Savol:</span> Ishonchim komilmi? <br /> <span className="text-gray-300">Javob: 500+ mijoz portfolio va Telegram kanalimda jonli case studylar.</span></p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-950 py-12 sm:py-16">
                 <div className="container mx-auto px-4 text-center">
                     <h2 className="text-4xl font-extrabold text-red-500">⚡ HOZIR HARAKAT QILING</h2>
                     <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-red-500/10 p-6 rounded-lg">
                            <h3 className="font-bold text-xl text-white">Agar hozir yozmasangiz:</h3>
                             <ul className="mt-4 space-y-2 text-left">
                                <li className="flex items-center gap-2"><XCircle className="h-5 w-5 text-red-400" /> <span>5 ta joy to'lib ketadi</span></li>
                                <li className="flex items-center gap-2"><XCircle className="h-5 w-5 text-red-400" /> <span>5.5 million so'mlik bonusni yo'qotasiz</span></li>
                                <li className="flex items-center gap-2"><XCircle className="h-5 w-5 text-red-400" /> <span>Raqibingiz oldinda ketaveradi</span></li>
                            </ul>
                        </div>
                         <div className="bg-green-500/10 p-6 rounded-lg">
                            <h3 className="font-bold text-xl text-white">Agar yozsangiz:</h3>
                             <ul className="mt-4 space-y-2 text-left">
                                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-400" /> <span>Professional brend — 2-3 haftada</span></li>
                                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-400" /> <span>Patent bilan himoyalangan nom</span></li>
                                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-400" /> <span>Bozorda ajralib turadigan vizual identitet</span></li>
                            </ul>
                        </div>
                     </div>
                 </div>
            </div>
            
            <div className="py-12 sm:py-20 text-center">
                <div className="container mx-auto px-4">
                    <p className="text-xl font-bold">👇 1 TA TUGMA. 1 TA HARAKAT.</p>
                     <Button asChild size="lg" className="mt-4 bg-green-500 hover:bg-green-600 text-lg px-8 py-6 h-auto animate-pulse">
                        <Link href="https://t.me/baxtiyorjon_gaziyev" target="_blank">
                             HA, MEN RAD ETMAYMAN — HOZIR YOZAMAN
                        </Link>
                    </Button>
                    <p className="mt-2 text-sm text-gray-400">Telegram orqali 2 daqiqada javob</p>
                    
                    <div className="mt-8">
                        <p className="text-gray-300">Yoki qo'ng'iroq qiling: <a href="tel:+998336450097" className="font-bold text-white hover:underline">+998 33 645 00 97</a></p>
                        <p className="mt-4 text-xs text-gray-500 max-w-md mx-auto">P.S. Bu taklif abadiy emas. 5 ta joy to'lsa — sahifa yopiladi. Keyingi safar siz oddiy narxda navbatda turasiz. Tanlov sizniki. Lekin shoshiling.</p>
                    </div>
                </div>
            </div>
            <RecentActivity />
            <ExitPopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} />
        </main>
    );
}