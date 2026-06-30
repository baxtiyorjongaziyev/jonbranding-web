'use client';
import type { FC } from 'react';

interface Props {
  lang?: string;
}

type Lang = 'uz' | 'ru' | 'en' | 'zh';

const t = {
  uz: {
    label: 'Bizning ishlarimiz',
    title: 'Nom, logo, firma uslubi — barchasini bir videoda',
    subtitle: 'Biz yaratgan brendlar qanday hayotga kirib, o\'z sohasida ajralib turganini ko\'ring.',
  },
  ru: {
    label: 'Наши работы',
    title: 'Название, логотип, фирменный стиль — всё в одном видео',
    subtitle: 'Посмотрите, как созданные нами бренды вживаются в жизнь и выделяются на рынке.',
  },
  en: {
    label: 'Our work',
    title: 'Name, logo, visual identity — all in one video',
    subtitle: 'See how the brands we created come to life and stand out in their market.',
  },
  zh: {
    label: '我们的作品',
    title: '命名、标志、品牌风格 — 全在一个视频里',
    subtitle: '看看我们创造的品牌如何融入市场并脱颖而出。',
  },
} as const;

const AtVideo: FC<Props> = ({ lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];

  return (
    <section className="pb-[88px] pt-6 relative z-[2]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-muted)] inline-block" />
            {l.label}
          </span>
          <h2
            className="mt-4 font-bold leading-[0.95] max-w-[680px]"
            style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', letterSpacing: '-0.03em', color: 'var(--at-ink)' }}
          >
            {l.title}
          </h2>
          <p className="mt-3 text-sm md:text-base max-w-[520px] leading-relaxed" style={{ color: 'var(--at-muted)' }}>
            {l.subtitle}
          </p>
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--at-line)]" style={{ aspectRatio: '16/9' }}>
          <iframe
            src="https://player.vimeo.com/video/1109613592?h=6e85b42502&badge=0&autopause=0&player_id=0&app_id=58479"
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            title={l.title}
          />
        </div>
      </div>
    </section>
  );
};

export default AtVideo;
