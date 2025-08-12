import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Medal, Globe, Zap, Users } from 'lucide-react';

const founderPoints = [
  { icon: Medal, text: "50+ dan ortiq loyihalar" },
  { icon: Globe, text: "3 xil davlatda tajriba" },
  { icon: Zap, text: "Tez va samarali aloqa" },
  { icon: Users, text: "Aniq va shaffof ish jarayoni" },
];

const Founder = () => {
  return (
    <section id="founder" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="lg:order-last">
            <Card className="overflow-hidden shadow-xl rounded-2xl">
              <Image
                src="/images/founder.jpg"
                alt="Baxtiyorjon Gaziyev, Jon.Branding asoschisi"
                width={600}
                height={700}
                className="w-full h-auto object-cover"
                data-ai-hint="professional male portrait"
              />
            </Card>
          </div>
          <div className="lg:order-first">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">
              Asoschi: Baxtiyorjon Gaziyev
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              Salom! Men Baxtiyorjon, Jon.Branding asoschisi. PCG “Tez Natija 3” kursdoshlarimga va boshqa biznes egalariga o'z brendlarini keyingi bosqichga olib chiqishda yordam beraman.
            </p>
            <p className="mt-4 text-lg text-gray-700">
              Mening maqsadim – shunchaki chiroyli dizayn yaratish emas, balki biznesingiz uchun ishlaydigan, strategiyaga asoslangan va natija keltiradigan brend tizimini qurish.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {founderPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <point.icon className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{point.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
