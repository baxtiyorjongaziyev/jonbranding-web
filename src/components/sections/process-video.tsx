'use client';

import type { FC } from 'react';

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
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://player.vimeo.com/video/1109613592?h=6e85b42502&autoplay=1&muted=1&loop=1&background=1"
                className="absolute inset-0 h-full w-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
                title="Jon.Branding jarayon video"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessVideo;
