'use client';

import type { FC } from 'react';
import { Play } from 'lucide-react';
import { useState } from 'react';

const copy = {
  uz: {
    eyebrow: 'Jarayon',
    title: "Biz qanday ishlashimizni ko'ring",
    description: "Naming, logo, vizual aydentika — ketma-ketlik va natija. 3 daqiqalik video.",
  },
  ru: {
    eyebrow: 'Процесс',
    title: 'Посмотрите, как мы работаем',
    description: 'Нейминг, лого, визуальная айдентика — последовательность и результат.',
  },
  en: {
    eyebrow: 'Process',
    title: 'See how we work',
    description: 'Naming, logo, visual identity — the sequence and the result.',
  },
  zh: {
    eyebrow: '流程',
    title: '看看我们如何工作',
    description: '命名、标志、视觉识别——顺序与结果。',
  },
};

const ProcessVideo: FC<{ lang: string }> = ({ lang }) => {
  const [playing, setPlaying] = useState(false);
  const t = copy[(lang as keyof typeof copy) || 'uz'] || copy.uz;

  return (
    <section className="bg-[#f7f4ee] py-16 sm:py-20 lg:flex lg:min-h-screen lg:flex-col lg:justify-center">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-slate-600">
            {t.eyebrow}
          </div>
          <h2 className="text-balance text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{t.description}</p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
            {playing ? (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src="https://player.vimeo.com/video/1109613592?h=6e85b42502&autoplay=1"
                  className="absolute inset-0 h-full w-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  allowFullScreen
                  title="Jon.Branding jarayon video"
                />
              </div>
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="group relative block w-full"
                aria-label="Videoni boshlash"
              >
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-transform group-hover:scale-110">
                      <Play className="h-8 w-8 text-white" fill="white" />
                    </div>
                    <span className="text-sm font-bold text-white/70">
                      {lang === 'uz' ? "Ko'rish uchun bosing" : 'Click to play'}
                    </span>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessVideo;
