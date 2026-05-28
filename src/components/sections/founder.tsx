'use client';

import Image from 'next/image';
import {
  Globe,
  Linkedin,
  Medal,
  Phone,
  PlayCircle,
  Send,
  Users,
  Volume2,
  VolumeX,
  Zap,
  type LucideProps,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import { BrandSection } from '@/components/ui/design-system';
import DOMPurify from 'isomorphic-dompurify';
import type { FounderDictionary } from '@/lib/types/dictionary';
import { renderHeadline } from '@/lib/headline';

const icons: { [key: string]: FC<LucideProps> } = { Medal, Globe, Zap, Users };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 140,
    },
  },
};

const Founder: FC<{ lang: string; dictionary: FounderDictionary }> = ({ dictionary }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [unmuted, setUnmuted] = useState(false);
  const translations = dictionary;

  if (!translations) return null;

  return (
    <BrandSection id="founder" tone="dark" className="relative overflow-hidden py-24 sm:py-32">



      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(37,99,235,0.16),transparent_44%,rgba(58,225,255,0.1))]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="visible"
        animate="visible"
        className="container relative z-10 mx-auto px-4"
      >
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
          <motion.div variants={itemVariants} className="order-2 flex flex-col gap-6 md:order-1">
            <div className="flex items-center gap-4">
              <h2 className="text-pretty text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                {renderHeadline(translations.title ?? '', "text-brand-cyan")}
              </h2>
              <a
                href="https://www.linkedin.com/in/baxtiyorjongaziyev/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Baxtiyorjon Gaziyev LinkedIn"
                className="flex-shrink-0 rounded-full border border-white/10 bg-white/5 p-2.5 text-white transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan active:scale-[0.95]"
              >
                <Linkedin size={18} aria-hidden="true" />
              </a>
            </div>
            <p
              className="mt-4 text-pretty text-lg leading-8 text-white/72"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translations.message ?? '') }}
            />

            {(translations.principles?.length ?? 0) > 0 && (
              <div className="grid gap-2 rounded-2xl border border-white/8 bg-white/[0.04] p-3 sm:grid-cols-3">
                {(translations.principles ?? []).map((item: string) => (
                  <div key={item} className="rounded-xl bg-white/[0.06] px-4 py-3 text-sm font-bold text-white/90">
                    {item}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(translations.points ?? []).map((point, index: number) => {
                const Icon = icons[point.icon];
                return (
                  <div key={index} className="flex items-center gap-3">
                    {Icon && <Icon className="h-5 w-5 flex-shrink-0 text-brand-cyan" aria-hidden="true" />}
                    <span className="text-sm font-medium text-white/75">{point.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="h-[52px] rounded-full bg-white px-6 text-brand-ink transition-[background-color,transform] duration-200 hover:bg-brand-lime active:scale-[0.97]" asChild>
                <a href="tel:+998336450097">
                  <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                  {translations.phoneButton}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-[52px] rounded-full border-white/12 bg-white/5 px-6 text-white transition-[background-color,border-color,transform] duration-200 hover:border-[#0088cc] hover:bg-[#0088cc]" asChild>
                <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noopener noreferrer">
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  {translations.telegramButton}
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="order-1 flex items-center justify-center md:order-2">
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/8 bg-[#050912] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)]">
              <div className="relative aspect-[4/5]">
                {!showVideo ? (
                  <>
                    <Image
                      src="/images/cms/founder-portrait.jpeg"
                      alt={translations.videoAlt || 'Baxtiyorjon Gaziyev, Jon.Branding asoschisi'}
                      fill
                      sizes="(min-width: 768px) 40vw, 92vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050912]/78 via-[#050912]/12 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <button
                        type="button"
                        onClick={() => {
                          setShowVideo(true);
                          setUnmuted(true);
                        }}
                        className="group inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/12 py-2 pl-2 pr-5 text-sm font-black text-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md transition-[background-color,transform,border-color] duration-300 hover:border-white/28 hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan active:scale-[0.98]"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-ink transition-transform duration-300 group-hover:scale-105">
                          <PlayCircle className="h-5 w-5" aria-hidden="true" />
                        </span>
                        {translations.videoButton || "Asoschidan 45 soniya"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <iframe
                      src={`https://player.vimeo.com/video/1109894697?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=${unmuted ? '0' : '1'}&loop=1&background=0&dnt=1&title=0&byline=0&portrait=0`}
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full"
                      title="Baxtiyorjon Gaziyev"
                    />
                    <button
                      type="button"
                      onClick={() => setUnmuted(!unmuted)}
                      className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#050912]/70 text-white backdrop-blur-sm transition-[background-color,transform] duration-200 hover:bg-[#050912]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan active:scale-95"
                      aria-label={unmuted ? "Ovozni o'chirish" : "Ovozni yoqish"}
                    >
                      {unmuted ? (
                        <Volume2 className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <VolumeX className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </BrandSection>
  );
};

export default Founder;
