
'use client';

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ListChecks, Video, Download } from 'lucide-react';

interface LeadMagnetProps {
    onCtaClick: () => void;
}

const magnets = [
  {
    icon: FileText,
    title: "PDF-Checklist",
    subtitle: "Brendingda 7 ta eng katta xato",
    description: "Brendingizni tahlil qilish va keng tarqalgan xatolardan saqlanish uchun amaliy qo'llanma.",
    cta: "PDF yuklab olish",
  },
  {
    icon: ListChecks,
    title: "Mini-test",
    subtitle: "Biznesingiz brendga tayyormi?",
    description: "Bir nechta oddiy savollarga javob bering va biznesingizning brendingga qanchalik tayyorligini bilib oling.",
    cta: "Testni boshlash",
  },
  {
    icon: Video,
    title: "Mini-video darslik",
    subtitle: "Nega brendsiz biznes unutiladi?",
    description: "10 daqiqalik videoda kuchli brendning nima uchun muhimligi va uning biznes o'sishiga ta'siri haqida bilib oling.",
    cta: "Videoni ko'rish",
  },
];

const LeadMagnet: FC<LeadMagnetProps> = ({ onCtaClick }) => {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Bilimingizni oshiring va xatolardan saqlaning
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
            Biznesingiz uchun to'g'ri qarorlar qabul qilishga yordam beradigan bepul resurslarimizdan foydalaning. Ishonchni qozonish va natijaga erishish uchun birinchi qadamni tashlang.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {magnets.map((magnet, index) => (
            <Card key={index} className="flex flex-col text-center shadow-lg rounded-2xl hover:shadow-xl transition-shadow bg-secondary/50">
              <CardHeader className="items-center pb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <magnet.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="!mt-4 text-xl">{magnet.title}</CardTitle>
                <CardDescription className="font-bold text-primary !mt-1 px-4">{magnet.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between px-6 pb-6">
                <p className="text-gray-600 mb-6">{magnet.description}</p>
                <Button onClick={onCtaClick} className="w-full shadow-md hover:shadow-lg transition-shadow">
                  <Download className="w-4 h-4 mr-2" />
                  {magnet.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
