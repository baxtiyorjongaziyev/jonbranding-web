import { FileText, Search, Target, Pencil, Send, ClipboardSignature } from 'lucide-react';
import CtaBlock from './cta-block';

const steps = [
  {
    icon: FileText,
    title: "Brief",
    description: "Sizning maqsadingiz, kutgan natijalaringiz va biznesingiz haqida ma'lumot to'playmiz."
  },
  {
    icon: ClipboardSignature,
    title: "Shartnoma va Kelishuv",
    description: "Loyiha shartlarini kelishib olamiz, shartnoma imzolaymiz va oldindan to'lovni qabul qilamiz."
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

interface ProcessProps {
  onCtaClick: () => void;
}

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  return (
    <section id="process" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Bizning ish jarayonimiz</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Har bir loyihada muvaffaqiyatni ta'minlaydigan sinovdan o'tgan bosqichli tizim.
          </p>
        </div>
        <div className="mt-16">
          <div className="relative flex flex-col lg:flex-row justify-between w-full">
            {/* Dotted line for desktop */}
            <div className="absolute top-12 left-0 w-full h-px hidden lg:block" aria-hidden="true">
              <div className="w-full h-full" style={{
                backgroundImage: "linear-gradient(to right, hsl(var(--border)) 50%, transparent 50%)",
                backgroundSize: "20px 1px",
                backgroundRepeat: "repeat-x"
              }}></div>
            </div>
             {/* Dotted line for mobile */}
            <div className="absolute top-0 left-12 w-px h-full lg:hidden" aria-hidden="true">
              <div className="w-full h-full" style={{
                backgroundImage: "linear-gradient(to bottom, hsl(var(--border)) 50%, transparent 50%)",
                backgroundSize: "1px 20px",
                backgroundRepeat: "repeat-y"
              }}></div>
            </div>

            {steps.map((step, index) => (
              <div key={index} className="relative flex lg:flex-col items-start lg:items-center lg:flex-1 w-full mb-12 lg:mb-0 last:mb-0">
                <div className="flex-shrink-0 z-10">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white border-4 border-white shadow-md transform hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-12 w-12 text-primary" />
                  </div>
                   <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm shadow-sm z-20">
                    {index + 1}
                  </div>
                </div>
                <div className="ml-6 lg:ml-0 lg:mt-6 text-left lg:text-center">
                  <h3 className="text-xl font-bold text-dark-blue">{step.title}</h3>
                  <p className="mt-2 text-gray-600 max-w-xs">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CtaBlock 
        title="Jarayon bilan tanishdingizmi? Endi natijaga o'tish vaqti!"
        description="Biznesingizni strategik brending orqali yangi bosqichga olib chiqishga tayyormisiz? Bizning sinovdan o'tgan tizimimiz sizga yordam beradi."
        buttonText="Keling, birinchi qadamni tashlaymiz!"
        onCtaClick={onCtaClick}
      />
    </section>
  );
};

export default Process;
