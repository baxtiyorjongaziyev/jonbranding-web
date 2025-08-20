'use client';

import { useState, useEffect, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, CalendarClock, Hourglass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueueStatusProps {
  onCtaClick: () => void;
}

const QueueStatus: FC<QueueStatusProps> = ({ onCtaClick }) => {
  // ** O'zgartirish uchun ma'lumotlar **
  const currentProjects = 4;
  const nextAvailable = "2 hafta";
  // *********************************

  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    // Initial random count
    setOnlineCount(Math.floor(Math.random() * (15 - 7 + 1)) + 7);

    const interval = setInterval(() => {
      // Fluctuate the count slightly
      setOnlineCount(prevCount => {
        const fluctuation = Math.random() > 0.5 ? 1 : -1;
        const newCount = prevCount + fluctuation;
        return Math.max(7, Math.min(15, newCount)); // Keep it within 7-15 range
      });
    }, 3500); // Update every 3.5 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center items-center gap-4">
              <Hourglass className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl md:text-3xl text-primary-foreground">
                Ishlarimiz Navbat Asosida
              </CardTitle>
            </div>
             <p className="text-gray-600 mt-2">
              Sifatli natija vaqt talab qiladi. Biz har bir loyihaga maksimal e'tibor qaratamiz.
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div className="bg-white/80 p-6 rounded-xl shadow-sm border">
                <Briefcase className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-lg text-gray-700">Hozirda band loyihalar:</p>
                <p className="text-4xl md:text-5xl font-bold text-primary-foreground my-2">{currentProjects} ta</p>
              </div>
              <div className="bg-white/80 p-6 rounded-xl shadow-sm border">
                <CalendarClock className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-lg text-gray-700">Yangi buyurtmalar uchun:</p>
                <p className="text-4xl md:text-5xl font-bold text-primary-foreground my-2">{nextAvailable}</p>
              </div>
            </div>
            <div className="mt-6 text-center">
               <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                 <Badge variant="destructive" className="text-base px-4 py-2 rounded-lg animate-subtle-pulse shadow-md">
                    NAVBAT MAVJUD
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">
                      <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                      </span>
                      Hozir onlayn: {onlineCount} kishi
                  </div>
              </div>
               <div className="mt-6">
                <Button
                  onClick={onCtaClick}
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90 shadow-ocean text-lg animate-subtle-pulse"
                >
                  O'z joyimni band qilish
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
