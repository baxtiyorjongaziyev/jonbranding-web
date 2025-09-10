
'use client';

import { useState, useEffect, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';

interface QueueStatusProps {
  onCtaClick: () => void;
}

const QueueStatus: FC<QueueStatusProps> = ({ onCtaClick }) => {
  // ** O'zgartirish uchun ma'lumotlar **
  const totalSlots = 7;
  const currentProjects = 4;
  const nextAvailable = "2 hafta";
  // *********************************

  const slots = Array.from({ length: totalSlots });
  const remainingSlots = totalSlots - currentProjects;

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-dark-blue to-blue-900 text-white rounded-3xl shadow-2xl p-6 sm:p-10">
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


            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="bg-black/20 p-4 rounded-xl">
                <p className="text-sm text-blue-200">Qolgan bo'sh o'rinlar</p>
                <p className="text-2xl font-bold text-white">{remainingSlots} ta</p>
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
        </Card>
      </div>
    </section>
  );
};

export default QueueStatus;
