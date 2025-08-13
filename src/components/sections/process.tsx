import { FileText, Search, Target, Pencil, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: FileText,
    title: "Brief",
    description: "Sizning maqsadingiz, kutgan natijalaringiz va biznesingiz haqida ma'lumot to'playmiz."
  },
  {
    icon: Search,
    title: "Tahlil",
    description: "Bozorni, raqobatchilarni va maqsadli auditoriyangizni chuqur o'rganamiz."
  },
  {
    icon: Target,
    title: "Strategiya",
    description: "Tahlil natijalariga asosan brendingiz uchun yo'l xaritasini ishlab chiqamiz."
  },
  {
    icon: Pencil,
    title: "Dizayn",
    description: "Strategiyaga asoslangan holda vizual elementlarni (logo, uslub) yaratamiz."
  },
  {
    icon: Send,
    title: "Topshirish",
    description: "Barcha tayyor materiallarni sizga taqdim etamiz va qo'llab-quvvatlaymiz."
  },
];

const Process = () => {
  return (
    <section id="process" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Bizning ish jarayonimiz</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Har bir loyihada muvaffaqiyatni ta'minlaydigan sinovdan o'tgan 5 bosqichli tizim.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-center">
            {steps.map((step, index) => (
              <Card key={index} className="bg-transparent border-0 shadow-none">
                <CardContent className="flex flex-col items-center p-0">
                  <div className="relative mb-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                     <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-dark-blue">{step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
