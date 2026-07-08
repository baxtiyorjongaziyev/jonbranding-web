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
import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import DOMPurify from 'isomorphic-dompurify';
import { renderHeadline } from '@/lib/headline';
import type { FounderDictionary } from '@/lib/types/dictionary';

const icons: { [key: string]: FC<LucideProps> } = { Medal, Globe, Zap, Users };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, damping: 28, stiffness: 150 },
  },
};

const Founder: FC<{ lang: string; dictionary: FounderDictionary }> = ({ dictionary }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [unmuted, setUnmuted] = useState(false);
  const translations = dictionary;

  if (!translations) return null;

  return (
    <section
      id="founder"
      style={{ background: 'var(--at-bg)', color: 'var(--at-ink)' }}
      className="relative min-h-[90dvh] overflow-hidden py-16 sm:py-20"
    >
      <motion.div
        variants={containerVariants}
        initial="visible"
        animate="visible"
        className="max-w-[1320px] mx-auto px-5 md:px-8"
      >
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">

          {/* ── LEFT: Portrait / Video ── */}
          <motion.div variants={itemVariants} className="flex items-center justify-center">
            <div
              className="relative w-full max-w-[420px] overflow-hidden rounded-2xl"
              style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)' }}
            >
              <div className="relative w-full aspect-[4/5]">
                {!showVideo ? (
                  <>
                    <Image
                      src="/images/cms/founder-portrait.webp"
                      alt={translations.videoAlt || 'Baxtiyorjon Gaziyev, Jon.Branding asoschisi'}
                      fill
                      sizes="(min-width: 768px) 40vw, 92vw"
                      className="object-cover object-top"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--at-bg)]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <button
                        type="button"
                        onClick={() => { setShowVideo(true); setUnmuted(true); }}
                        className="group inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-5 text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)', color: 'var(--at-ink)' }}
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full"
                          style={{ background: 'var(--at-accent)', color: '#fff' }}
                        >
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
                      className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:opacity-80"
                      style={{ background: 'var(--at-bg)', color: 'var(--at-ink)', border: '1px solid var(--at-line)' }}
                      aria-label={unmuted ? "Ovozni o'chirish" : "Ovozni yoqish"}
                    >
                      {unmuted ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Text content ── */}
          <motion.div variants={itemVariants} className="flex flex-col gap-5">

            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
              Asoschi
            </div>

            {/* Title + LinkedIn */}
            <div className="flex items-start gap-3">
              <h2
                className="font-bold leading-tight"
                style={{ fontSize: 'clamp(28px, 3.6vw, 48px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}
              >
                {renderHeadline(translations.title ?? '', 'var(--at-accent)')}
              </h2>
              <a
                href="https://www.linkedin.com/in/baxtiyorjongaziyev/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Baxtiyorjon Gaziyev LinkedIn"
                className="mt-1 flex-shrink-0 rounded-full p-2 transition-all hover:opacity-80"
                style={{ border: '1px solid var(--at-line)', color: 'var(--at-ink-2)' }}
              >
                <Linkedin size={15} aria-hidden="true" />
              </a>
            </div>

            {/* Message */}
            <p
              className="text-[15px] leading-7"
              style={{ color: 'var(--at-ink-2)' }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translations.message ?? '') }}
            />

            {/* Principles */}
            {(translations.principles?.length ?? 0) > 0 && (
              <div
                className="grid gap-1.5 rounded-2xl p-2 sm:grid-cols-3"
                style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)' }}
              >
                {(translations.principles ?? []).map((item: string) => (
                  <div
                    key={item}
                    className="rounded-xl px-3 py-2.5 text-[11px] sm:text-xs font-semibold text-center"
                    style={{ background: 'var(--at-bg)', color: 'var(--at-ink)' }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}

            {/* Points */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(translations.points ?? []).map((point: { icon: string; text: string }, index: number) => {
                const IconComp = icons[point.icon];
                return (
                  <div key={index} className="flex items-center gap-2.5">
                    {IconComp && <IconComp className="h-4 w-4 shrink-0" style={{ color: 'var(--at-accent)' }} aria-hidden="true" />}
                    <span className="text-sm font-medium" style={{ color: 'var(--at-ink-2)' }}>{point.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="tel:+998336450097"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'var(--at-accent)', color: '#fff' }}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {translations.phoneButton}
              </a>
              <a
                href="https://t.me/baxtiyorjon_gaziyev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)', color: 'var(--at-ink)' }}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {translations.telegramButton}
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Founder;
