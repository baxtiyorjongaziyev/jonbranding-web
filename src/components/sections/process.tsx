
'use client';

import { FileText, Search, Target, Pencil, Send, ClipboardCheck, Lightbulb, Users, BarChart2 } from 'lucide-react';
import CtaBlock from './cta-block';
import { Badge } from '@/components/ui/badge';
import React from 'react';

const processPhases = [
  {
    phaseTitle: "Tadqiqot va Strategiya",
    columns: [
      {
        title: "Kashfiyot (Discovery)",
        subtitle: "Sayohatning boshlanishi",
        tasks: ["Briefing", "Bozor tadqiqoti", "Raqobatchilar tahlili"]
      },
      {
        title: "Strategiya",
        subtitle: "Yo'lni xaritaga tushirish",
        tasks: ["Maqsadlarni belgilash", "Pozitsiyalash", "Brend platformasi"]
      }
    ]
  },
  {
    phaseTitle: "Dizayn va Amalga oshirish",
    columns: [
      {
        title: "Dizayn (Development)",
        subtitle: "Tajribani yaratish",
        tasks: ["Vizual konsepsiyalar", "Logotip va Aydentika", "Interaktiv dizayn"]
      },
      {
        title: "Topshirish (Evaluation & Delivery)",
        subtitle: "Natijalarni taqdim etish",
        tasks:["Brendbuk/Gaydlayn", "Fayllarni topshirish", "Qo'llab-quvvatlash"]
      }
    ]
  }
];


interface ProcessProps {
  onCtaClick: () => void;
}

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  return (
    <section id="process" className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Bizning ish jarayonimiz</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
                Har bir loyihada muvaffaqiyatni ta'minlaydigan sinovdan o'tgan bosqichli tizim.
            </p>
        </div>

        {/* Timeline visualization */}
        <div className="relative mb-16">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-gray-200"></div>
            <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary rounded-full z-10"></div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary rounded-full z-10"></div>
                    <span className="text-sm font-medium text-gray-600 bg-white px-2">Dizayn va Amalga oshirish</span>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary rounded-full z-10"></div>
                </div>
            </div>
             <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-center">
                 <span className="text-sm font-medium text-gray-600 bg-white px-2">Tadqiqot va Strategiya</span>
            </div>
        </div>


        {/* Process Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processPhases.flatMap(phase => phase.columns).map((column, index) => (
            <div key={index} className="text-left">
              <h3 className="text-2xl font-bold text-dark-blue">{column.title}</h3>
              <p className="text-gray-500 mt-1">{column.subtitle}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {column.tasks.map(task => (
                  <Badge key={task} variant="secondary" className="font-normal bg-gray-100 text-gray-700 hover:bg-gray-200">
                    {task}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className='mt-20'>
        <CtaBlock 
          title="Jarayon bilan tanishdingizmi? Endi natijaga o'tish vaqti!"
          description="Biznesingizni strategik brending orqali yangi bosqichga olib chiqishga tayyormisiz? Bizning sinovdan o'tgan tizimimiz sizga yordam beradi."
          buttonText="Keling, birinchi qadamni tashlaymiz!"
          onCtaClick={onCtaClick}
        />
      </div>
    </section>
  );
};

export default Process;
