'use client';

import { useEffect, useState } from 'react';

interface LiveClockProps {
  lang?: string;
}

export default function LiveClock({ lang = 'uz' }: LiveClockProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const locale = lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : lang === 'zh' ? 'zh-CN' : 'en-US';
    const update = () => {
      setTime(
        new Date().toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Tashkent',
        })
      );
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [lang]);

  if (!time) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-[5.5rem] right-4 z-30 hidden items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[10px] font-medium tabular-nums text-muted-foreground backdrop-blur-sm sm:flex"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-lime" />
      {time} TAS
    </div>
  );
}
