
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import React from 'react';

const processPhases = [
  {
    phase: "01",
    title: "Kashfiyot",
    description: "Boshlanish nuqtasi",
    tasks: ["Briflash", "Biznes muammolari", "Auditoriya ehtiyojlari", "Bozor tahlili", "Raqobatchilar", "Ilhom/g‘oya"],
  },
  {
    phase: "02",
    title: "Strategiya",
    description: "Yo‘l xaritasini belgilash",
    tasks: ["Maqsad qo‘yish", "Auditoriya tahlili", "Pozitsiyalash", "Asosiy tamoyillar", "Roadmap", "Brend vizyoni"],
  },
  {
    phase: "03",
    title: "Ijodiy Dizayn",
    description: "Brendni shakllantirish",
    tasks: ["Naming", "Logo", "Rang & shrift", "Vizual konsepsiya", "Qadoqlash", "Brandbook asoslari"],
  },
  {
    phase: "04",
    title: "Taqdimot va Fikr",
    description: "Sinov va takomillashtirish",
    tasks: ["Taqdimot", "Fikr-mulohaza", "Iteratsiya", "Moslashtirish"],
  },
  {
    phase: "05",
    title: "Amaliyotga Tatbiq",
    description: "Brendni hayotga tadbiq etish",
    tasks: ["Tayyor fayllar", "Brandbook", "Vizual qo‘llanmalar", "Tatbiq yo‘riqnomasi"],
  },
  {
    phase: "06",
    title: "Qo‘llab-quvvatlash",
    description: "Brend hech qachon to‘xtamaydi",
    tasks: ["Doimiy support", "Fikr yig‘ish", "Trendlarni kuzatish", "Yangilash/kengaytirish"],
  },
];


const ProcessCard = ({ phase, title, description, tasks }: (typeof processPhases)[0]) => (
    <li className="flex-shrink-0 w-full sm:w-auto snap-start">
        <div className="h-full p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col">
            <h2 className="text-2xl font-bold text-dark-blue">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {tasks.map((task) => (
                    <span key={task} className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                        {task}
                    </span>
                ))}
            </div>
        </div>
    </li>
);

interface ProcessProps {
  onCtaClick: () => void;
}

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  return (
    <section id="process" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-dark-blue">
            To‘g‘ri Brendni Loyihalash
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            G‘oyalarni ajoyib natijaga aylantirish uchun qulay, shaffof va samarali ish jarayonini taklif etamiz.
          </p>
        </div>

        {/* This container handles the unique mobile-to-desktop layout transition */}
        <div className="mt-12">
            {/* 
              On small screens (sm and below):
              - A horizontal scroll container is created with `overflow-x-auto`.
              - `snap-x` and `snap-mandatory` ensure that scrolling snaps to the beginning of each card.
              - `sm:grid` and other `sm:` prefixes reset these styles for larger screens.
              - A `pb-6` is added for scrollbar spacing.
            */}
            <ul className="grid grid-cols-1 gap-6 
                         md:grid-cols-2 lg:grid-cols-3
                         sm:overflow-visible sm:p-0 
                         overflow-x-auto snap-x snap-mandatory py-4 -mx-4 px-4 pb-6">
                {processPhases.map((phase) => (
                    <ProcessCard key={phase.phase} {...phase} />
                ))}
            </ul>
        </div>
        
        <div className="mt-16 text-center">
            <Button size="lg" onClick={onCtaClick}>
                Loyihani muhokama qilish <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
      </div>
    </section>
  );
};

export default Process;
