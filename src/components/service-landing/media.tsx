'use client';

import { FC, ReactNode, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import type { ServiceCase, ServiceVideo } from './types';

/** Ekranga kirganda silliq paydo bo'lish. `prefers-reduced-motion` da o'chadi. */
export const Reveal: FC<{ children: ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

/** Hero yonidagi keys kollaji — kartalar sekin "suzib" turadi. */
export const HeroCollage: FC<{ cases: ServiceCase[] }> = ({ cases }) => {
  const reduce = useReducedMotion();
  const slots = [
    'left-0 top-8 w-[62%] -rotate-[4deg] z-10',
    'right-0 top-0 w-[56%] rotate-[3deg] z-20',
    'left-[16%] bottom-2 w-[66%] rotate-[1deg] z-30',
  ];
  return (
    <div className="relative hidden aspect-square w-full lg:block" aria-hidden>
      {cases.slice(0, 3).map((item, i) => (
        <motion.div
          key={item.slug}
          className={`absolute aspect-[4/3] overflow-hidden rounded-2xl border-4 border-white bg-neutral-100 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)] ${slots[i]}`}
          initial={reduce ? false : { opacity: 0, y: 40, scale: 0.95 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -10, 0], scale: 1 }}
          transition={{
            opacity: { duration: 0.7, delay: 0.15 * i },
            scale: { duration: 0.7, delay: 0.15 * i },
            y: { duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: 0.6 + 0.15 * i },
          }}
        >
          <Image src={item.image} alt="" fill sizes="380px" className="object-cover" priority={i === 0} />
        </motion.div>
      ))}
    </div>
  );
};

/** Keyslar to'ri — rasm katta, ustiga kelganda kattalashadi, bosilsa keys sahifasi. */
export const CasesSection: FC<{ cases: ServiceCase[] }> = ({ cases }) => (
  <section className="px-5 py-20 sm:px-8 md:py-28">
    <div className="mx-auto max-w-6xl">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-4 text-[11px] font-medium uppercase text-blue-700" style={{ fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.12em' }}>
            Qilingan ishlar
          </p>
          <h2 className="max-w-3xl font-bold" style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Real loyihalar — gapdan ko‘ra ko‘proq aytadi
          </h2>
        </div>
        <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:underline">
          Barcha keyslar <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((item, i) => (
          <Reveal key={item.slug} delay={(i % 3) * 0.08}>
            <Link href={`/portfolio/${item.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                <span>
                  <span className="block text-base font-bold leading-snug">{item.title}</span>
                  {item.client ? <span className="mt-0.5 block text-xs text-white/70">{item.client}</span> : null}
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/** Video sharh: mp4 — o'zimizning player, Vimeo — bosilganda yuklanadigan iframe. */
export const VideoCard: FC<{ video: ServiceVideo }> = ({ video }) => {
  const [playing, setPlaying] = useState(false);
  const isVimeo = video.src.includes('vimeo.com');
  return (
    <figure className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="relative aspect-[3/4] w-full bg-neutral-900">
        {playing ? (
          isVimeo ? (
            <iframe
              src={`${video.src}${video.src.includes('?') ? '&' : '?'}autoplay=1`}
              title={`${video.name} — video sharh`}
              allow="autoplay; fullscreen; picture-in-picture"
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <video src={video.src} poster={video.poster} controls autoPlay playsInline className="absolute inset-0 h-full w-full object-cover" />
          )
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0" aria-label={`${video.name} video sharhini ko‘rish`}>
            {video.poster ? (
              <Image src={video.poster} alt="" fill sizes="(max-width: 640px) 100vw, 300px" className="object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
            ) : null}
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 h-6 w-6 fill-current" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="p-5 text-sm">
        <span className="font-semibold text-white">{video.name}</span>
        <span className="block text-neutral-500">{video.company}</span>
      </figcaption>
    </figure>
  );
};
