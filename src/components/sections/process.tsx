import { FileText, Search, Target, Pencil, Send } from 'lucide-react';

const steps = [
  { icon: FileText, title: "Brief", description: "Sizning maqsadingiz, kutgan natijalaringiz va biznesingiz haqida ma'lumot to'playmiz." },
  { icon: Search, title: "Tahlil", description: "Bozorni, raqobatchilarni va maqsadli auditoriyangizni chuqur o'rganamiz." },
  { icon: Target, title: "Strategiya", description: "Tahlil natijalariga asosan brendingiz uchun yo'l xaritasini ishlab chiqamiz." },
  { icon: Pencil, title: "Dizayn", description: "Strategiyaga asoslangan holda vizual elementlarni (logo, uslub) yaratamiz." },
  { icon: Send, title: "Topshirish", description: "Barcha tayyor materiallarni sizga taqdim etamiz va qo'llab-quvvatlaymiz." },
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
        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block" aria-hidden="true"></div>
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <div key={index} className="md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-8 items-center">
                <div className={`md:text-right ${index % 2 === 0 ? 'md:order-1' : 'md:order-3'}`}>
                  <h3 className="text-xl font-bold text-dark-blue">{step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.description}</p>
                </div>
                
                <div className="relative flex justify-center my-4 md:my-0 md:order-2">
                   <div className="absolute h-full w-px bg-gray-200 md:hidden" />
                   <div className="bg-primary text-white rounded-full p-4 z-10 shadow-lg">
                    <step.icon className="w-8 h-8" />
                  </div>
                </div>

                <div className={`${index % 2 === 0 ? 'md:order-3' : 'md:order-1'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
