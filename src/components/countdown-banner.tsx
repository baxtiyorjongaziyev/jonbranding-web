'use client';

import { FC, useEffect, useState } from 'react';
import { Clock, Flame } from 'lucide-react';

function getEndOfWeek(): Date {
  const now = new Date();
  const daysUntilSunday = 7 - now.getDay();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59);
  return end;
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const copy = {
  uz: { label: 'Har hafta faqat 5 ta bepul tahlil qilamiz', spots: 'ta joy qoldi' },
  ru: { label: 'Только 5 бесплатных анализов в неделю', spots: 'мест осталось' },
  en: { label: 'Only 5 free analyses per week', spots: 'spots left' },
  zh: { label: '每周仅5个免费分析名额', spots: '个名额剩余' },
};

const CountdownBanner: FC<{ lang: string }> = ({ lang }) => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const t = copy[(lang as keyof typeof copy) || 'uz'] || copy.uz;

  useEffect(() => {
    setMounted(true);
    const target = getEndOfWeek();
    setTime(getTimeLeft(target));
    const interval = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, []);

  const dayOfWeek = new Date().getDay();
  const spotsLeft = Math.max(1, 5 - dayOfWeek);

  if (!mounted) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 py-1.5">
        <div className="container mx-auto flex items-center justify-center gap-2 px-4 text-center text-xs text-white sm:gap-3 sm:text-sm">
          <span className="flex items-center gap-1 font-bold">
            <Flame className="h-3 w-3 text-orange-400 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{spotsLeft} {t.spots}</span>
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider sm:px-3 sm:py-1 sm:text-xs">
            <Clock className="h-3 w-3" />
            --:--:--
          </span>
          <span className="hidden rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-black sm:inline-block sm:px-3 sm:py-1 sm:text-xs">
            {spotsLeft} {t.spots}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 py-1.5">
      <div className="container mx-auto flex items-center justify-center gap-2 px-4 text-center text-xs text-white sm:gap-3 sm:text-sm">
        <span className="flex items-center gap-1 font-bold">
          <Flame className="h-3 w-3 text-orange-400 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">{t.label}</span>
          <span className="sm:hidden">{spotsLeft} {t.spots}</span>
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider sm:px-3 sm:py-1 sm:text-xs">
          <Clock className="h-3 w-3" />
          {time.days > 0 && `${time.days}d `}
          {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
        </span>
        <span className="hidden rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-black sm:inline-block sm:px-3 sm:py-1 sm:text-xs">
          {spotsLeft} {t.spots}
        </span>
      </div>
    </div>
  );
};

export default CountdownBanner;
