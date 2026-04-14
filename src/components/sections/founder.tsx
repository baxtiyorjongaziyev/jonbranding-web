
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Medal, Globe, Zap, Users, Phone, Send, PlayCircle, type LucideProps, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, type FC } from 'react';

const icons: { [key: string]: FC<LucideProps> } = { Medal, Globe, Zap, Users };

const Founder: FC<{ lang: string, dictionary: any }> = ({ lang, dictionary }) => {
  const [playVideo, setPlayVideo] = useState(false);
  const translations = dictionary;
  
  if (!translations) return null;

  return (
    <section id="founder" className="snap-section py-0 relative bg-black overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8 order-2 md:order-1">
            <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  {translations.title}
                </h2>
                <a 
                    href="https://www.linkedin.com/in/baxtiyorjongaziyev/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white shadow-sm text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all duration-300"
                    title="LinkedIn Profile"
                >
                    <Linkedin size={20} />
                </a>
            </div>
            <p 
              className="mt-4 text-lg text-gray-300"
              dangerouslySetInnerHTML={{ __html: translations.message }}
            />
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {translations.points.map((point: any, index: number) => {
                const Icon = icons[point.icon];
                return (
                    <div key={index} className="flex items-center gap-3">
                        {Icon && <Icon className="w-6 h-6 text-primary flex-shrink-0" />}
                        <span className="text-gray-200 font-medium">{point.text}</span>
                    </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" className="w-full sm:w-auto min-w-[200px]" asChild>
                    <a href="tel:+998336450097">
                        <Phone className="mr-2 h-5 w-5" />
                        {translations.phoneButton}
                    </a>
                </Button>
                 <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[200px] text-white border-white/20 hover:bg-[#0088cc] hover:border-[#0088cc] hover:text-white bg-white/5 transition-all duration-300" asChild>
                    <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank">
                        <Send className="mr-2 h-5 w-5" />
                        {translations.telegramButton}
                    </a>
                </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center relative order-1 md:order-2">
            <Card className="overflow-hidden shadow-xl rounded-2xl w-full">
              <CardContent className="p-0 relative bg-black aspect-[4/5]">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
