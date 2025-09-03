
'use client';

import { useState, useEffect, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, CalendarClock, User, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * (15 - 7 + 1)) + 7);
    const interval = setInterval(() => {
      setOnlineCount(prevCount => {
        const fluctuation = Math.random() > 0.5 ? 1 : -1;
        const newCount = prevCount + fluctuation;
        return Math.max(7, Math.min(15, newCount));
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);


  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto bg-secondary/70 backdrop-blur-sm rounded-2xl shadow-lg border-primary/20 p-6 sm:p-8">
          <CardHeader className="text-center p-0 mb-8">
              <CardTitle className="text-3xl md:text-4xl text-dark-blue font-extrabold">
                Bizda loyihalar navbat asosida
              </CardTitle>
             <CardDescription className="text-gray-600 mt-2 max-w-2xl mx-auto text-lg">
              Sifatli natija vaqt va e'tibor talab qiladi. Biz har bir loyihaga individual yondashamiz.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <TooltipProvider>
              <div className="flex justify-center items-center gap-2 sm:gap-4 p-4 bg-white/60 rounded-xl shadow-inner border">
                {Array.from({ length: totalSlots }).map((_, index) => {
                  const isBusy = index < currentProjects;
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div className={cn(
                          'p-3 sm:p-4 rounded-full transition-all duration-300',
                           isBusy ? 'bg-red-500/10' : 'bg-green-500/10'
                        )}>
                          {isBusy ? (
                            <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                          ) : (
                            <User className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isBusy ? 'Bu o\'rin band' : 'Bu o\'rin bo\'sh'}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div className="bg-white/80 p-6 rounded-xl shadow-sm border">
                <Briefcase className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-lg font-bold text-dark-blue">{currentProjects} ta loyiha</p>
                <p className="text-sm text-gray-600">Hozirda faol ishlanmoqda</p>
              </div>
              <div className="bg-white/80 p-6 rounded-xl shadow-sm border">
                <CalendarClock className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-lg font-bold text-dark-blue">{nextAvailable} dan so'ng</p>
                <p className="text-sm text-gray-600">Keyingi bo'sh joy</p>
              </div>
            </div>

            <div className="mt-8 text-center">
               <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                 <Badge variant="destructive" className="text-base px-4 py-2 rounded-lg animate-subtle-pulse shadow-md">
                    {totalSlots - currentProjects} ta bo'sh joy qoldi
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">
                      <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                      </span>
                      Hozir saytda: {onlineCount} kishi
                  </div>
              </div>
               <div className="mt-6">
                <Button
                  onClick={onCtaClick}
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90 shadow-ocean text-lg animate-subtle-pulse px-8 py-6"
                >
                  Navbatga yozilish
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                O'z joyingizni band qilish uchun hoziroq bog'laning!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QueueStatus;
