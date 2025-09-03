
'use client';

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ListChecks, Film, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LeadMagnetProps {
    onCtaClick: () => void;
}

const magnets = [
  {
    id: "pdf",
    icon: FileText,
    title: "Bepul PDF-Cheklist",
    subtitle: "Brendingda 7 ta eng katta xato",
    description: "Biznesingizda qanday xatolarga yo'l qo'ymaslik kerakligini bilib oling va brendingizni tahlil qilish uchun amaliy qo'llanmani oling.",
    cta: "PDF yuklab olish",
    href: null, // this will trigger onCtaClick
    action: 'onCtaClick'
  },
  {
    id: "quiz",
    icon: ListChecks,
    title: "Mini-Test",
    subtitle: "Biznesingiz brendga tayyormi?",
    description: "Bir nechta savolga javob bering va biznesingizning brendingga qanchalik tayyorligini, kuchli va zaif tomonlarini bilib oling.",
    cta: "Testni boshlash",
    href: "/quiz",
  },
  {
    id: "video",
    icon: Film,
    title: "Video Qo'llanma",
    subtitle: "Strategik brending nima?",
    description: "Nega shunchaki chiroyli logotip yetarli emas? Bizning yondashuvimiz biznesingizga qanday natija keltirishini videoda ko'ring.",
    cta: "Videoni ko'rish",
    href: "#video",
  },
];

const LeadMagnet: FC<LeadMagnetProps> = ({ onCtaClick }) => {
  const handleClick = (magnet: (typeof magnets)[0]) => {
    if (magnet.action === 'onCtaClick') {
      onCtaClick();
    } else if (magnet.href?.startsWith('#')) {
        const elementId = magnet.href.substring(1);
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="lead-magnet" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Brendingizni Keyingi Bosqichga Olib Chiqing
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
            Biz bilan ishlashni nimadan boshlashni bilmayapsizmi? Siz uchun bir nechta bepul va foydali resurslar tayyorladik. Brending olamini o'rganing va birinchi qadamni tashlang.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {magnets.map((magnet) => (
            <Card key={magnet.id} className="flex flex-col text-center shadow-lg rounded-2xl hover:shadow-xl transition-shadow bg-secondary/50">
              <CardHeader className="items-center pb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <magnet.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="!mt-4 text-xl">{magnet.title}</CardTitle>
                <CardDescription className="font-bold text-primary !mt-1 px-4">{magnet.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between px-6 pb-6">
                <p className="text-gray-600 mb-6">{magnet.description}</p>
                {magnet.href && !magnet.href.startsWith('#') ? (
                    <Link href={magnet.href} passHref>
                        <Button asChild className="w-full shadow-md hover:shadow-lg transition-shadow">
                            <a>
                               {magnet.icon === ListChecks ? <ListChecks className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                                {magnet.cta}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                        </Button>
                    </Link>
                ) : (
                    <Button onClick={() => handleClick(magnet)} className="w-full shadow-md hover:shadow-lg transition-shadow">
                        {magnet.id === 'video' ? <Film className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                        {magnet.cta}
                    </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
