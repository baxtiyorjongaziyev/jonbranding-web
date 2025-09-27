
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, X, Minus, Info } from 'lucide-react';
import CtaBlock from './cta-block';
import { comparisonData, serviceDetails } from '@/lib/pricing';
import { Logo } from '../icons/logo';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const competitors = [
    { id: 'jon', name: 'Jon.Branding', isPrimary: true },
    { id: 'mano', name: 'Ma\'no Branding' },
    { id: 'abba', name: 'Abba Marketing' },
    { id: 'mountain', name: 'Mountain' },
];

const renderCompetitorValue = (value: string | boolean | null) => {
    if (typeof value === 'boolean') {
        return value ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />;
    }
    if (value === null) {
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
    return <span className="font-semibold text-gray-800 text-sm">{value}</span>;
}


interface ComparisonProps {
  onCtaClick: () => void;
  lang: string;
}

const t = {
    uz: {
        title: "Biz va Raqobatchilar",
        subtitle: "Biz yuqori sifatli brending xizmatlarini premium agentliklarga qaraganda ancha hamyonbop narxlarda taqdim etamiz. Natija esa siz kutgandan ham a'lo bo'ladi.",
        features: "Xususiyatlar",
        whyPremiumTitle: "Nega faqat premium agentliklar?",
        whyPremiumDesc: "Biz o'zimizni faqat eng yuqori darajadagi, strategik yondashuvga ega kompaniyalar bilan taqqoslaymiz. Maqsadimiz — shunchaki arzon bo'lish emas, balki premium sifatni hamyonbop narxda taqdim etish. Sifat va strategiya jihatidan biz bilan bir darajada bo'lmagan agentliklar bilan solishtirish, mijoz uchun ham, biz uchun ham to'g'ri bo'lmaydi.",
        ctaTitle: "Farqni o'zingiz ko'rdingiz. Endi tanlash vaqti keldi!",
        ctaDesc: "Sifatli brending uchun ortiqcha to'lash shart emas. Biznesingiz uchun eng to'g'ri qarorni qabul qiling va biz bilan bog'laning.",
        ctaButton: "Menga shunday yondashuv kerak",
    },
    ru: {
        title: "Мы и Конкуренты",
        subtitle: "Мы предоставляем высококачественные брендинговые услуги по гораздо более доступным ценам, чем премиум-агентства. А результат превзойдет ваши ожидания.",
        features: "Характеристики",
        whyPremiumTitle: "Почему только премиум-агентства?",
        whyPremiumDesc: "Мы сравниваем себя только с компаниями высшего уровня, обладающими стратегическим подходом. Наша цель — не просто быть дешевле, а предоставлять премиум-качество по доступной цене. Сравнение с агентствами, которые не соответствуют нашему уровню по качеству и стратегии, было бы некорректным как для клиента, так и для нас.",
        ctaTitle: "Вы сами увидели разницу. Теперь время выбирать!",
        ctaDesc: "Не обязательно переплачивать за качественный брендинг. Примите самое правильное решение для вашего бизнеса и свяжитесь с нами.",
        ctaButton: "Мне нужен такой подход",
    }
}


const Comparison: React.FC<ComparisonProps> = ({ onCtaClick, lang }) => {
  const translations = lang === 'ru' ? t.ru : t.uz;
  const cData = comparisonData(lang);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
            <p className="mt-4 text-lg text-gray-700">
                {translations.subtitle}
            </p>
        </div>
        
        {/* Desktop View */}
        <div className="mt-12 max-w-6xl mx-auto hidden md:block">
          <Card className="rounded-2xl shadow-xl border-2 border-primary/20 overflow-hidden">
            <div className="grid grid-cols-5 bg-secondary/50">
              <div className="col-span-1 p-4 font-bold text-sm sm:text-lg text-dark-blue border-r border-gray-200 flex items-center">{translations.features}</div>
              {competitors.map(c => (
                 <div key={c.id} className={cn("col-span-1 p-4 text-center font-bold text-sm sm:text-lg", c.isPrimary ? 'text-primary' : 'text-dark-blue')}>
                   {c.id === 'jon' ? <Logo /> : c.name}
                 </div>
              ))}
            </div>
            
            <div className="divide-y divide-gray-200">
              {cData.map((item, index) => (
                <div key={index} className="grid grid-cols-5 items-center">
                  <div className="col-span-1 p-4 font-medium text-gray-800 border-r border-gray-200 text-sm sm:text-base">{item.feature}</div>
                  {competitors.map(c => (
                      <div key={c.id} className={cn(
                        "col-span-1 p-4 text-center flex justify-center items-center h-full",
                        c.isPrimary && "bg-primary/5 font-bold text-primary"
                      )}>
                       {renderCompetitorValue(item.competitors[c.id as keyof typeof item.competitors])}
                      </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Mobile View */}
        <div className="mt-12 max-w-3xl mx-auto md:hidden">
            <Accordion type="single" collapsible defaultValue='item-0' className="w-full space-y-4">
                {competitors.map((competitor, index) => (
                     <AccordionItem key={competitor.id} value={`item-${index}`} className="border rounded-2xl shadow-sm bg-secondary/70 px-6 hover:bg-secondary transition-colors duration-300 data-[state=open]:bg-white data-[state=open]:shadow-lg">
                        <AccordionTrigger className={cn("text-left font-bold text-dark-blue hover:no-underline text-xl", competitor.isPrimary && "text-primary")}>
                            {competitor.id === 'jon' ? <Logo /> : competitor.name}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 text-base">
                           <div className="space-y-4">
                            {cData.map(item => (
                                <div key={item.feature} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                    <span className="font-medium text-gray-700">{item.feature}</span>
                                    {renderCompetitorValue(item.competitors[competitor.id as keyof typeof item.competitors])}
                                </div>
                            ))}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>

        <div className="mt-10 max-w-3xl mx-auto">
            <Card className="bg-sky-blue/30 border-primary/20 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full mt-1">
                        <Info className="h-6 w-6" />
                    </div>
                    <div>
                         <h4 className="font-bold text-dark-blue">{translations.whyPremiumTitle}</h4>
                         <p className="text-base text-dark-blue/80 mt-1">
                             {translations.whyPremiumDesc}
                         </p>
                    </div>
                </div>
            </Card>
        </div>

      </div>
      <CtaBlock 
        title={translations.ctaTitle}
        description={translations.ctaDesc}
        buttonText={translations.ctaButton}
        onCtaClick={onCtaClick}
      />
    </section>
  );
};

export default Comparison;
