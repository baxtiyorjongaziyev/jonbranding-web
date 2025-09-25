
'use client';

import { useState, useEffect, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, ArrowRight, Sparkles, UserCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface QueueStatusProps {
  onCtaClick: () => void;
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


const QueueStatus: FC<QueueStatusProps> = ({ onCtaClick }) => {
  // ** O'zgartirish uchun ma'lumotlar **
  const totalSlots = 7;
  const currentProjects = 4;
  const nextAvailable = "2 hafta";
  // *********************************

  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    // Set initial random number between 12 and 25
    setOnlineUsers(Math.floor(Math.random() * (25 - 12 + 1)) + 12);

    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        // Keep it within a realistic range
        return Math.max(10, Math.min(30, newCount));
      });
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);


  const slots = Array.from({ length: totalSlots });
  const remainingSlots = totalSlots - currentProjects;

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <Card className="relative overflow-hidden max-w-4xl mx-auto bg-dark-blue text-white rounded-3xl shadow-2xl p-6 sm:p-10">
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

          <div className="relative z-10">
              <CardHeader className="text-center p-0 mb-8">
                  <div className="flex justify-center items-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6 text-accent" />
                    <p className="font-bold text-accent uppercase tracking-widest">Joylar cheklangan</p>
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-extrabold">
                    Tezda! O'z o'rningizni band qiling!
                  </CardTitle>
                 <CardDescription className="text-blue-200 mt-2 max-w-2xl mx-auto text-lg">
                   Biz har bir loyihaga yuksak sifatni ta'minlash uchun vaqt ajratamiz. Shu sababli, bir vaqtning o'zida faqat cheklangan miqdordagi loyihalar ustida ishlaymiz.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                
                <div className="mb-8">
                    <h3 className="text-center font-bold text-lg mb-4 text-white">Loyiha navbati</h3>
                     <TooltipProvider>
                        <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-4 p-2 sm:p-4 bg-black/20 rounded-xl">
                            {slots.map((_, index) => {
                                const isBooked = index < currentProjects;
                                const isNext = index === currentProjects;
                                return (
                                    <Tooltip key={index}>
                                        <TooltipTrigger asChild>
                                            <div className={cn(
                                                "relative flex flex-col items-center gap-1 p-1 sm:p-2 rounded-lg transition-all",
                                                isBooked ? "text-gray-400" : "text-green-400",
                                                isNext && "animate-subtle-pulse bg-accent/20"
                                            )}>
                                                {isBooked ? <UserCheck className="h-8 w-8 sm:h-10 sm:w-10" /> : <User className="h-8 w-8 sm:h-10 sm:w-10" />}
                                                <span className="text-xs font-mono">{isBooked ? `Band` : `Bo'sh`}</span>
                                                {isNext && <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent ring-2 ring-background"></div>}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{isBooked ? `O'rin band` : `Navbatga yozilishingiz mumkin`}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            })}
                        </div>
                     </TooltipProvider>
                </div>


                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-black/20 p-4 rounded-xl">
                    <p className="text-sm text-blue-200">Qolgan bo'sh o'rinlar</p>
                    <p className="text-2xl font-bold text-white">{remainingSlots} ta</p>
                  </div>
                   <div className="bg-black/20 p-4 rounded-xl border-2 border-accent/50 shadow-lg">
                    <p className="text-sm text-accent flex items-center justify-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                        </span>
                        Hozir saytda
                    </p>
                    <p className="text-2xl font-bold text-white">{onlineUsers} kishi</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl">
                    <p className="text-sm text-blue-200">Keyingi loyihani boshlash</p>
                    <p className="text-2xl font-bold text-white">{nextAvailable}dan keyin</p>
                  </div>
                </div>

                <div className="mt-10 text-center">
                    <Button
                      onClick={onCtaClick}
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform text-lg animate-subtle-pulse px-6 sm:px-8 py-6"
                    >
                      O'z joyimni band qilish
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  <p className="text-sm text-blue-300 mt-3">
                    Raqobatchilaringizdan bir qadam oldinda bo'ling!
                  </p>
                </div>
              </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default QueueStatus;
