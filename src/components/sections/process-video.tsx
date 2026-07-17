'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { useState } from 'react';

interface ProcessVideoDictionary {
  eyebrow: string;
  title: string;
  description: string;
  play: string;
  posterAlt: string;
  fallbackHint: string;
  fallbackCta: string;
  iframeTitle: string;
}

const ProcessVideo: FC<{ dictionary: ProcessVideoDictionary }> = ({ dictionary }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section
      aria-labelledby="process-video-title"
      className="bg-[#f7f4ee] py-16 sm:py-20 lg:flex lg:min-h-screen lg:flex-col lg:justify-center"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-slate-600">
            {dictionary.eyebrow}
          </div>
          <h2 id="process-video-title" className="text-balance text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            {dictionary.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{dictionary.description}</p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
            <div className="relative aspect-video w-full">
              {showVideo ? (
                <iframe
                  src="https://player.vimeo.com/video/1109613592?h=6e85b42502&autoplay=1&title=0&byline=0&portrait=0&dnt=1"
                  className="absolute inset-0 h-full w-full"
                  width="1280"
                  height="720"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={dictionary.iframeTitle}
                />
              ) : (
                <button
                  type="button"
                  data-testid="process-video-play"
                  onClick={() => setShowVideo(true)}
                  aria-label={dictionary.play}
                  className="group absolute inset-0 block h-full w-full overflow-hidden text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white"
                >
                  <Image
                    src="/images/cms/corporate-process.webp"
                    alt={dictionary.posterAlt}
                    fill
                    sizes="(max-width: 896px) calc(100vw - 32px), 896px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 bg-slate-950/45 transition-colors group-hover:bg-slate-950/35" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-black/40 px-6 py-4 text-sm font-bold backdrop-blur-md transition-transform group-hover:scale-105">
                      <span aria-hidden="true" className="text-lg">▶</span>
                      {dictionary.play}
                    </span>
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/75 px-5 py-4 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-slate-600">{dictionary.fallbackHint}</p>
            <a
              href="#process"
              data-testid="process-video-fallback"
              className="shrink-0 text-sm font-bold text-blue-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            >
              {dictionary.fallbackCta} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessVideo;
