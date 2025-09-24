
'use client';

import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const processGroups = [
    {
        title: "Kashfiyot",
        subtitle: "Boshlanish nuqtasi",
        tasks: ["Briflash", "Muammoni aniqlash", "Bozor tahlili", "Odamlar ehtiyojlari", "Ijodiy g'oyalar"]
    },
    {
        title: "Strategiya",
        subtitle: "Yo‘l xaritasini belgilash",
        tasks: ["Maqsad qo‘yish", "Auditoriya tahlili", "Raqobatchilar tahlili", "Dizayn tamoyillari", "Rejalashtirish (roadmap)", "Brend vizyoni"]
    },
    {
        title: "Baholash",
        subtitle: "G'oyalarni sinovdan o'tkazish",
        tasks: ["Evristik baholash", "Foydalanuvchi testlari", "A/B testlar", "Fikr-mulohaza tahlili", "Dizayn tizimi", "Kirish imkoniyatini tekshirish"]
    },
    {
        title: "Ishlab chiqish",
        subtitle: "G'oyani hayotga tatbiq etish",
        tasks: ["Prototip (Wireframing)", "Interaktiv dizayn", "Brending elementlari", "Yakuniy maketlar", "Taqdimot"]
    },
];

interface ProcessProps {
  onCtaClick: () => void;
}

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {

    return (
    <>
        <section id="process" className="py-16 sm:py-24 bg-white">
             <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <p className="font-semibold text-primary">Bizning dizayn safarimiz</p>
                    <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue mt-2">
                        G'oyadan Mukammallikka
                    </h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                        Biz g'oyalarni o'rganishdan boshlab, ularni foydalanuvchilaringizni xursand qiladigan ajoyib raqamli mahsulotga aylantirish uchun qulay va proaktiv jarayonni taklif etamiz.
                    </p>
                </div>
                
                {/* Timeline Indicator */}
                <div className="relative mb-16 hidden md:block">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200"></div>
                    <div className="relative flex justify-between w-full">
                        <div className="w-1/4 flex justify-start items-center">
                            <div className="w-4 h-4 bg-primary rounded-full z-10"></div>
                             <p className="absolute top-6 text-sm text-gray-500">To'g'ri narsani loyihalash</p>
                        </div>
                        <div className="w-1/4 flex justify-end items-center">
                            <div className="w-4 h-4 bg-primary rounded-full z-10"></div>
                        </div>
                         <div className="w-1/4 flex justify-end items-center">
                            <div className="w-4 h-4 bg-gray-300 rounded-full z-10"></div>
                        </div>
                        <div className="w-1/4 flex justify-end items-center">
                             <div className="w-4 h-4 bg-gray-300 rounded-full z-10"></div>
                             <p className="absolute top-6 right-0 text-sm text-gray-500">To'g'ri loyihalash</p>
                        </div>
                    </div>
                </div>


                {/* Process Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {processGroups.map((group, index) => (
                        <div key={index}>
                            <h3 className="text-2xl font-bold text-dark-blue">{group.title}</h3>
                            <p className="text-gray-500 mt-1 mb-6">{group.subtitle}</p>
                            <div className="flex flex-wrap gap-2">
                                {group.tasks.map(task => (
                                    <Badge key={task} variant="secondary" className="font-normal bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-3 py-1">
                                        {task}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        <CtaBlock 
          title="Keling, ishni boshlaymiz!"
          description="Biznesingizni strategik brending orqali yangi bosqichga olib chiqishga tayyormisiz? Bizning sinovdan o'tgan tizimimiz sizga yordam beradi."
          buttonText="Loyihani muhokama qilish"
          onCtaClick={onCtaClick}
        />
    </>
    );
};

export default Process;

