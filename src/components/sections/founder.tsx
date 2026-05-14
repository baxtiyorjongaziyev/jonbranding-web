
'use client';

import Image from 'next/image';
import { Medal, Globe, Zap, Users, Phone, Send, PlayCircle, type LucideProps, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, type FC } from 'react';
import { BrandCard, BrandSection } from '@/components/ui/design-system';
import DOMPurify from 'isomorphic-dompurify';

const icons: { [key: string]: FC<LucideProps> } = { Medal, Globe, Zap, Users };

const Founder: FC<{ lang: string, dictionary: any }> = ({ lang, dictionary }) => {
  const [playVideo, setPlayVideo] = useState(false);
  const translations = dictionary;
  
  if (!translations) return null;

  return (
    <BrandSection id="founder" tone="dark" className="relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(58,225,255,0.16),transparent_34rem)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8 order-2 md:order-1">
            <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                    {translations.title}
                  </h2>
                  <a 
                      href="https://www.linkedin.com/in/baxtiyorjongaziyev/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 flex-shrink-0"
                      title="LinkedIn Profile"
                  >
                      <Linkedin size={20} />
                  </a>
                </div>
            </div>
            <p 
              className="mt-4 text-lg leading-8 text-white/72"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translations.message) }}
            />
            <BrandCard className="brand-card-dark grid gap-3 p-4 sm:grid-cols-3">
              {[
                lang === 'uz' ? 'Strategiya bilan boshlaymiz' : lang === 'ru' ? 'Начинаем со стратегии' : lang === 'zh' ? '从策略开始' : 'Strategy first',
                lang === 'uz' ? 'Tadbirkor tilida tushuntiramiz' : lang === 'ru' ? 'Объясняем языком бизнеса' : lang === 'zh' ? '用商业语言解释' : 'Business-language clarity',
                lang === 'uz' ? 'Natija: ishonch va premiumlik' : lang === 'ru' ? 'Результат: доверие и премиальность' : lang === 'zh' ? '结果：信任与高级感' : 'Trust and premium feel',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/8 px-3 py-3 text-sm font-black leading-5 text-white">
                  {item}
                </div>
              ))}
            </BrandCard>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {translations.points.map((point: any, index: number) => {
                const Icon = icons[point.icon];
                return (
                    <div key={index} className="flex items-center gap-3">
                        {Icon && <Icon className="w-6 h-6 text-brand-cyan flex-shrink-0" />}
                        <span className="text-white/82 font-medium">{point.text}</span>
                    </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" className="w-full sm:w-auto min-w-[200px] rounded-2xl bg-white text-brand-ink hover:bg-brand-lime" asChild>
                    <a href="tel:+998336450097">
                        <Phone className="mr-2 h-5 w-5" />
                        {translations.phoneButton}
                    </a>
                </Button>
                 <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[200px] rounded-2xl text-white border-white/20 hover:bg-[#0088cc] hover:border-[#0088cc] hover:text-white bg-white/5 transition-all duration-300" asChild>
                    <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank">
                        <Send className="mr-2 h-5 w-5" />
                        {translations.telegramButton}
                    </a>
                </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center relative order-1 md:order-2">
            <BrandCard className="brand-card-dark overflow-hidden shadow-xl rounded-[2rem] w-full p-0">
              <div className="p-0 relative bg-black aspect-[4/5]">
                {playVideo ? (
                     <div className="absolute inset-0 w-full h-full">
                        <iframe 
                            src="https://player.vimeo.com/video/1109894697?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;muted=1" 
                            frameBorder="0" 
                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                            className="absolute inset-0 w-full h-full"
                            title="Baxtiyorjon Gaziyev">
                        </iframe>
                    </div>
                ) : (
                  <>
                    <Image
                      src="/images/cms/founder-portrait.jpeg"
                      alt="Baxtiyorjon Gaziyev"
                      fill
                      unoptimized
                      className="object-cover"
                      data-ai-hint="founder portrait"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-24 h-24 text-white hover:bg-white/20 hover:text-white rounded-full"
                        onClick={() => setPlayVideo(true)}
                        aria-label="Play video"
                      >
                        <PlayCircle className="w-20 h-20" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </BrandCard>
          </div>
        </div>
      </div>
    </BrandSection>
  );
};

export default Founder;
