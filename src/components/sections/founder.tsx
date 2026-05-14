'use client';

import { Medal, Globe, Zap, Users, Phone, Send, Volume2, VolumeX, type LucideProps, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, type FC } from 'react';
import { BrandCard, BrandSection } from '@/components/ui/design-system';
import DOMPurify from 'isomorphic-dompurify';

const icons: { [key: string]: FC<LucideProps> } = { Medal, Globe, Zap, Users };

const Founder: FC<{ lang: string, dictionary: any }> = ({ lang, dictionary }) => {
  const [unmuted, setUnmuted] = useState(false);
  const translations = dictionary;

  if (!translations) return null;

  return (
    <BrandSection id="founder" tone="dark" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/8 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
          {/* Text */}
          <div className="order-2 flex flex-col gap-6 md:order-1">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                {translations.title}
              </h2>
              <a
                href="https://www.linkedin.com/in/baxtiyorjongaziyev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 rounded-full border border-white/10 bg-white/5 p-2.5 text-white transition-all duration-200 hover:bg-white hover:text-black active:scale-[0.95]"
              >
                <Linkedin size={18} />
              </a>
            </div>
            <p
              className="mt-4 text-lg leading-8 text-white/72"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translations.message) }}
            />

            <div className="grid gap-2 rounded-2xl border border-white/8 bg-white/[0.04] p-3 sm:grid-cols-3">
              {[
                lang === 'uz' ? 'Strategiya bilan boshlaymiz' : lang === 'ru' ? 'Начинаем со стратегии' : lang === 'zh' ? '从策略开始' : 'Strategy first',
                lang === 'uz' ? 'Tadbirkor tilida tushuntiramiz' : lang === 'ru' ? 'Объясняем языком бизнеса' : lang === 'zh' ? '用商业语言解释' : 'Business-language clarity',
                lang === 'uz' ? 'Natija: ishonch va premiumlik' : lang === 'ru' ? 'Результат: доверие и премиальность' : lang === 'zh' ? '结果：信任与高级感' : 'Trust and premium feel',
              ].map((item) => (
                <div key={item} className="rounded-xl bg-white/[0.06] px-4 py-3 text-sm font-bold text-white/90">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {translations.points.map((point: any, index: number) => {
                const Icon = icons[point.icon];
                return (
                  <div key={index} className="flex items-center gap-3">
                    {Icon && <Icon className="h-5 w-5 flex-shrink-0 text-brand-cyan" />}
                    <span className="text-sm font-medium text-white/75">{point.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="h-13 rounded-2xl bg-white px-6 text-brand-ink transition-all duration-200 hover:bg-brand-lime active:scale-[0.97]" asChild>
                <a href="tel:+998336450097">
                  <Phone className="mr-2 h-4 w-4" />
                  {translations.phoneButton}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-13 rounded-2xl border-white/12 bg-white/5 px-6 text-white transition-all duration-200 hover:border-[#0088cc] hover:bg-[#0088cc]" asChild>
                <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank">
                  <Send className="mr-2 h-4 w-4" />
                  {translations.telegramButton}
                </a>
              </Button>
            </div>
          </div>

          {/* Video — autoplay muted */}
          <div className="order-1 flex items-center justify-center md:order-2">
            <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/8 bg-black shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)]">
              <div className="relative aspect-[4/5]">
                <iframe
                  src={`https://player.vimeo.com/video/1109894697?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=${unmuted ? '0' : '1'}&loop=1&background=${unmuted ? '0' : '1'}`}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                  className="absolute inset-0 h-full w-full"
                  title="Baxtiyorjon Gaziyev"
                />
                {/* Unmute button */}
                <button
                  onClick={() => setUnmuted(!unmuted)}
                  className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/70 active:scale-95"
                  aria-label={unmuted ? "Ovozni o'chirish" : "Ovozni yoqish"}
                >
                  {unmuted ? (
                    <Volume2 className="h-5 w-5" />
                  ) : (
                    <VolumeX className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrandSection>
  );
};

export default Founder;
