
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ArrowRight, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const TargetAudience = ({ lang }: { lang: string }) => {
  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };
  
  const t = {
      uz: {
          title: "Bu muammolar sizga tanishmi?",
          subtitle: "Agar quyidagi fikrlar sizni bezovta qilayotgan bo'lsa, demak, biz siz uchun to'g'ri yechimmiz.",
          problems: [
              { text: "Biznesim bor, lekin brendim yo'q. Meni hech kim tanimaydi." },
              { text: "Brendim eskirgan, raqobatchilarimdan orqada qolyapman." },
              { text: "Mijozlarim qiymatimni tushunmayapti, faqat narx so'rayapti." },
              { text: "Sotuvlarim bor, lekin barqaror emas. Mijozlar qaytib kelmayapti." },
          ],
          solutionTitle: "Yaxshi yangilik: Bu muammolarning barchasini yechsa bo'ladi!",
          solutionSubtitle: "To'g'ri qurilgan brend strategiyasi bu kabi muammolarni bartaraf etib, biznesingizni barqaror o'sish yo'liga olib chiqadi.",
          solutionButton: "Barcha muammolar yechimini ko'rish"
      },
      ru: {
          title: "Вам знакомы эти проблемы?",
          subtitle: "Если следующие мысли вас беспокоят, значит, мы — правильное решение для вас.",
          problems: [
              { text: "У меня есть бизнес, но нет бренда. Меня никто не знает." },
              { text: "Мой бренд устарел, я отстаю от конкурентов." },
              { text: "Мои клиенты не понимают моей ценности, они спрашивают только цену." },
              { text: "У меня есть продажи, но они нестабильны. Клиенты не возвращаются." },
          ],
          solutionTitle: "Хорошая новость: все эти проблемы можно решить!",
          solutionSubtitle: "Правильно выстроенная бренд-стратегия устраняет подобные проблемы и выводит ваш бизнес на путь стабильного роста.",
          solutionButton: "Увидеть решение всех проблем"
      }
  }

  const translations = lang === 'ru' ? t.ru : t.uz;

  return (
    <section id="target-audience" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            {translations.subtitle}
          </p>
        </div>
        <div className="mt-12 max-w-4xl mx-auto">
            <Card className="p-6 sm:p-8 rounded-2xl shadow-lg bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {translations.problems.map((problem, index) => (
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

        <Card className="max-w-4xl mx-auto mt-8 bg-gradient-to-br from-primary to-dark-blue text-white p-8 rounded-2xl shadow-xl overflow-hidden relative text-center">
             <div className="relative z-10">
                <h3 className="text-3xl lg:text-4xl font-bold leading-tight text-white">{translations.solutionTitle}</h3>
                <p className="mt-4 text-blue-200 text-lg max-w-2xl mx-auto">
                   {translations.solutionSubtitle}
                </p>
                 <div className="mt-8 flex justify-center">
                     <Button 
                        onClick={handleOpenModal} 
                        size="lg" 
                        variant="default"
                    >
                        {translations.solutionButton} <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
             </div>
        </Card>
      </div>
    </section>
  );
};

export default TargetAudience;
