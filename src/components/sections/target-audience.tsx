'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ArrowRight, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const problems = [
  { text: "Biznesim bor, lekin brendim yo'q. Meni hech kim tanimaydi." },
  { text: "Brendim eskirgan, raqobatchilarimdan orqada qolyapman." },
  { text: "Mijozlarim qiymatimni tushunmayapti, faqat narx so'rayapti." },
  { text: "Sotuvlarim bor, lekin barqaror emas. Mijozlar qaytib kelmayapti." },
];

const TargetAudience = () => {
  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };

  return (
    <section id="target-audience" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Bu muammolar sizga tanishmi?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Agar quyidagi fikrlar sizni bezovta qilayotgan bo'lsa, demak, biz siz uchun to'g'ri yechimmiz.
          </p>
        </div>
        <div className="mt-12 max-w-4xl mx-auto">
            <Card className="p-6 sm:p-8 rounded-2xl shadow-lg bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {problems.map((problem, index) => (
                        <Card key={index} className="bg-red-500/10 border-red-500/20 rounded-xl p-5">
                             <div className="flex items-start gap-4">
                                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                                <p className="text-base font-semibold text-red-900">{problem.text}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>

        <Card className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-primary to-blue-800 text-white p-8 rounded-2xl shadow-xl">
             <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="flex-shrink-0 bg-white/10 p-4 rounded-full">
                    <ThumbsUp className="w-10 h-10 text-accent" />
                </div>
                <div className="flex-1">
                    <h3 className="text-2xl font-bold">Yaxshi yangilik: Bu muammolarning barchasini yechsa bo'ladi!</h3>
                    <p className="mt-2 text-blue-200 text-lg">
                       To'g'ri qurilgan brend strategiyasi bu kabi muammolarni bartaraf etib, biznesingizni barqaror o'sish yo'liga olib chiqadi.
                    </p>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                     <Button 
                        onClick={handleOpenModal} 
                        size="lg" 
                        className="text-lg w-full md:w-auto shadow-ocean animate-subtle-pulse bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                        Yechimni muhokama qilish <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
             </div>
        </Card>
      </div>
    </section>
  );
};

export default TargetAudience;
