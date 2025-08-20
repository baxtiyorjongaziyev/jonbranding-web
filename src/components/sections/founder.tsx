'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Medal, Globe, Zap, Users, Phone, Send, PlayCircle, type LucideProps } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, type FC } from 'react';

const icons: { [key: string]: FC<LucideProps> } = { Medal, Globe, Zap, Users };

const founderPoints = [
  { icon: 'Medal', text: "50+ dan ortiq loyihalar" },
  { icon: 'Globe', text: "Xalqaro tajriba" },
  { icon: 'Zap', text: "Tez va samarali aloqa" },
  { icon: 'Users', text: "Aniq va shaffof ish jarayoni" },
];

const founderMessage = "Salom! Men Baxtiyorjon, Jon.Branding asoschisi. PCG “Tez Natija 3” kursdoshlarimga va boshqa biznes egalariga o'z brendlarini keyingi bosqichga olib chiqishda yordam beraman. Mening maqsadim – shunchaki chiroyli dizayn yaratish emas, balki biznesingiz uchun ishlaydigan, strategiyaga asoslangan va natija keltiradigan brend tizimini qurish. Keling, brendingizni birgalikda tahlil qilamiz va uning 'uxlab yotgan' potensialini uyg'otamiz.";


const Founder = () => {
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <section id="founder" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="lg:order-last">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">
              Asoschi: Baxtiyorjon Gaziyev
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              {founderMessage}
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {founderPoints.map((point, index) => {
                const Icon = icons[point.icon];
                return (
                    <div key={index} className="flex items-center gap-3">
                        {Icon && <Icon className="w-6 h-6 text-primary flex-shrink-0" />}
                        <span className="text-gray-800 font-medium">{point.text}</span>
                    </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="shadow-ocean animate-subtle-pulse">
                    <Link href="tel:+998336450097">
                        <Phone className="mr-2 h-5 w-5" />
                        Telefon orqali bog'lanish
                    </Link>
                </Button>
                 <Button asChild size="lg" variant="outline">
                    <Link href="https://t.me/baxtiyorjon_gaziyev" target="_blank">
                        <Send className="mr-2 h-5 w-5" />
                        Telegram orqali yozish
                    </Link>
                </Button>
            </div>
          </div>
          <div>
            <Card className="overflow-hidden shadow-xl rounded-2xl">
              <CardContent className="p-0 aspect-w-1 aspect-h-1 relative w-full bg-black">
                {playVideo ? (
                    <div style={{padding:'177.78% 0 0 0',position:'relative', width: '100%', height: '100%'}}>
                        <iframe
                            src="https://player.vimeo.com/video/1109894697?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&dnt=1"
                            frameBorder="0" 
                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                            className="absolute top-0 left-0 w-full h-full"
                            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} 
                            title="Baxtiyorjon Gaziyev">
                        </iframe>
                    </div>
                ) : (
                  <>
                    <Image 
                      src="https://img1.teletype.in/files/06/12/06122643-c462-4c8d-aa63-55a8ca1dca38.jpeg"
                      alt="Baxtiyorjon Gaziyev"
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="founder portrait"
                      className="opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
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
