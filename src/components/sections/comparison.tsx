
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, X, Minus, Info } from 'lucide-react';
import CtaBlock from './cta-block';
import { comparisonData } from '@/lib/pricing';
import { Logo } from '../icons/logo';
import { cn } from '@/lib/utils';

const competitors = [
    { id: 'jon', name: 'Jon.Branding', isPrimary: true },
    { id: 'mano', name: 'Ma\'no Branding' },
    { id: 'abba', name: 'Abba Marketing' },
    { id: 'mountain', name: 'Mountain' },
];

const renderCompetitorValue = (value: string | boolean | null) => {
    if (typeof value === 'boolean') {
        return value ? <Check className="w-6 h-6 text-green-500" /> : <X className="w-6 h-6 text-red-500" />;
    }
    if (value === null) {
        return <Minus className="w-6 h-6 text-gray-400" />;
    }
    return <span className="font-semibold text-gray-800 text-sm sm:text-base">{value}</span>;
}


interface ComparisonProps {
  onCtaClick: () => void;
}

const Comparison: React.FC<ComparisonProps> = ({ onCtaClick }) => {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold">Biz va Raqobatchilar</h2>
            <p className="mt-4 text-lg text-gray-700">
                Biz yuqori sifatli brending xizmatlarini premium agentliklarga qaraganda ancha hamyonbop narxlarda taqdim etamiz. Natija esa siz kutgandan ham a'lo bo'ladi.
            </p>
        </div>
        <div className="mt-12 max-w-6xl mx-auto">
          <Card className="rounded-2xl shadow-xl border-2 border-primary/20 overflow-hidden">
            <div className="grid grid-cols-5 bg-secondary/50">
              <div className="col-span-1 p-4 font-bold text-sm sm:text-lg text-dark-blue border-r border-gray-200 flex items-center">Xususiyatlar</div>
              {competitors.map(c => (
                 <div key={c.id} className={cn("col-span-1 p-4 text-center font-bold text-sm sm:text-lg", c.isPrimary ? 'text-primary' : 'text-dark-blue')}>
                   {c.id === 'jon' ? <Logo /> : c.name}
                 </div>
              ))}
            </div>
            
            <div className="divide-y divide-gray-200">
              {comparisonData.map((item, index) => (
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

        <div className="mt-10 max-w-3xl mx-auto">
            <Card className="bg-sky-blue/30 border-primary/20 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full mt-1">
                        <Info className="h-6 w-6" />
                    </div>
                    <div>
                         <h4 className="font-bold text-dark-blue">Nega faqat premium agentliklar?</h4>
                         <p className="text-base text-dark-blue/80 mt-1">
                             Biz o'zimizni faqat eng yuqori darajadagi, strategik yondashuvga ega kompaniyalar bilan taqqoslaymiz. Maqsadimiz — shunchaki arzon bo'lish emas, balki premium sifatni hamyonbop narxda taqdim etish. Sifat va strategiya jihatidan biz bilan bir darajada bo'lmagan agentliklar bilan solishtirish, mijoz uchun ham, biz uchun ham to'g'ri bo'lmaydi.
                         </p>
                    </div>
                </div>
            </Card>
        </div>

      </div>
      <CtaBlock 
        title="Farqni o'zingiz ko'rdingiz. Endi tanlash vaqti!"
        description="Sifatli brending uchun ortiqcha to'lash shart emas. Biznesingiz uchun eng to'g'ri qarorni qabul qiling va biz bilan bog'laning."
        buttonText="Menga shunday yondashuv kerak"
        onCtaClick={onCtaClick}
      />
    </section>
  );
};

export default Comparison;
