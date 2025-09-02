
'use client';

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, Package, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LeadMagnetProps {
    onCtaClick: () => void;
}

const magnets = [
  {
    id: "pdf",
    icon: FileText,
    title: "1-qadam: Bepul PDF",
    subtitle: "Brendingda 7 ta eng katta xato",
    description: "Biznesingizda qanday xatolarga yo'l qo'ymaslik kerakligini bilib oling va brendingizni tahlil qilish uchun amaliy qo'llanmani oling.",
    cta: "PDF yuklab olish",
    href: null,
    onClick: 'onCtaClick'
  },
  {
    id: "audit",
    icon: Search,
    title: "2-qadam: Audit yoki Tekshiruv",
    subtitle: "Brending audit yoki Naming check",
    description: "Kichik, ammo samarali xizmatlarimiz orqali ishimiz sifatini sinab ko'ring va birinchi natijalarga ega bo'ling.",
    cta: "Xizmatni tanlash",
    href: "#package-builder",
  },
  {
    id: "package",
    icon: Package,
    title: "3-qadam: Paket Yig'ish",
    subtitle: "Starter yoki Premium paket",
    description: "Biznesingiz uchun zarur bo'lgan xizmatlarni o'zingiz yig'ing va shaffof narxlarda to'liq brending yechimiga ega bo'ling.",
    cta: "Paket yig'ish",
    href: "#package-builder",
  },
];

const LeadMagnet: FC<LeadMagnetProps> = ({ onCtaClick }) => {
  const handleClick = (action: string | null | undefined) => {
    if (action === 'onCtaClick') {
      onCtaClick();
    } else {
        const el = document.getElementById('package-builder');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="lead-magnet" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Siz uchun maxsus sotuv voronkasi
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
            Biz siz uchun oddiy va tushunarli yo'l xaritasi ishlab chiqdik. Har bir bosqich sizni muvaffaqiyatli brend sari yetaklaydi.
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
                {magnet.href ? (
                    <Link href={magnet.href} passHref>
                        <Button asChild className="w-full shadow-md hover:shadow-lg transition-shadow">
                            <a>
                               {magnet.id === 'audit' ? <Search className="w-4 h-4 mr-2" /> : <Package className="w-4 h-4 mr-2" />}
                                {magnet.cta}
                            </a>
                        </Button>
                    </Link>
                ) : (
                    <Button onClick={() => handleClick(magnet.onClick)} className="w-full shadow-md hover:shadow-lg transition-shadow">
                        <Download className="w-4 h-4 mr-2" />
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
