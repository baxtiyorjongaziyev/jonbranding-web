import { FileText, Search, Target, Pencil, Send } from 'lucide-react';

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
        <div className="mt-20">
          <div className="relative">
            {/* Dotted line for large screens */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px -translate-y-12">
               <div className="w-full h-full" style={{
                  backgroundImage: "linear-gradient(to right, hsl(var(--border)) 50%, transparent 50%)",
                  backgroundSize: "20px 1px",
                  backgroundRepeat: "repeat-x"
                }}></div>
            </div>
            
            <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-0">
              {steps.map((step, index) => (
                <div key={index} className="flex-1 text-center w-full lg:w-auto flex flex-col items-center">
                  <div className="relative z-10">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary border-4 border-white shadow-md transform hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-12 w-12 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm shadow-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-dark-blue">{step.title}</h3>
                  <p className="mt-2 text-gray-600 max-w-xs">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
