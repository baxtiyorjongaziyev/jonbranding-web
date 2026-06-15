'use client';
import type { FC } from 'react';
import { useState, useEffect } from 'react';

const AtMasthead: FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat('uz-UZ', {
          timeZone: 'Asia/Tashkent',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date())
      );
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-b border-[var(--at-line)] bg-[var(--at-bg)] text-[var(--at-muted)] py-2.5 px-5 md:px-8">
      <div className="max-w-[1320px] mx-auto flex items-center justify-between">
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest">
          Jon · Atelier  |  Toshkent · 41.3°N 69.3°E  |  {time || '——:——'} TST
        </span>
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest flex items-center gap-2">
          MMXXVI · vol. VI  |  Yangi loyihalar uchun ochiq
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--at-green)] animate-pulse" />
        </span>
      </div>
    </div>
  );
};

export default AtMasthead;
