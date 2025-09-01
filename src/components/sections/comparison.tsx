
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles, Shield, Minus } from 'lucide-react';
import CtaBlock from './cta-block';
import { serviceDetails } from '@/lib/pricing';
import { Logo } from '../icons/logo';

const formatPrice = (price: number) => {
    return `${(price / 1000000).toLocaleString('fr-FR')} mln so'm`;
}

const comparisonData = [
  { 
    feature: 'Brend-strategiya', 
    jon: `dan ${formatPrice(serviceDetails.strategy.price)}`, 
    others: `dan ${formatPrice(serviceDetails.strategy.marketPrice!)}` 
  },
  { 
    feature: 'Logotip va stil', 
    jon: `dan ${formatPrice(serviceDetails.logo.price)}`, 
    others: `dan ${formatPrice(serviceDetails.logo.marketPrice!)}` 
  },
  { 
    feature: 'Neyming', 
    jon: `dan ${formatPrice(serviceDetails.naming.price)}`, 
    others: `dan ${formatPrice(serviceDetails.naming.marketPrice!)}` 
  },
  { 
    feature: '100% Mamnuniyat Kafolati', 
    jon: <Check className="w-6 h-6 text-green-500" />, 
    others: <X className="w-6 h-6 text-red-500" /> 
  },
  { 
    feature: 'Shaffof jarayon va doimiy aloqa', 
    jon: <Check className="w-6 h-6 text-green-500" />, 
    others: <Minus className="w-6 h-6 text-gray-400" />
  },
   { 
    feature: 'PCG a\'zolari uchun -50% chegirma', 
    jon: <Check className="w-6 h-6 text-green-500" />, 
    others: <X className="w-6 h-6 text-red-500" /> 
  },
];

interface ComparisonProps {
  onCtaClick: () => void;
}

const Comparison: React.FC<ComparisonProps> = ({ onCtaClick }) => {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold">Nima uchun Jon.Branding?</h2>
            <p className="mt-4 text-lg text-gray-700">
                Biz yuqori sifatli brending xizmatlarini premium agentliklarga qaraganda ancha hamyonbop narxlarda taqdim etamiz. Natija esa siz kutgandan ham a'lo bo'ladi.
            </p>
        </div>
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="rounded-2xl shadow-xl border-2 border-primary/20 overflow-hidden">
            <div className="grid grid-cols-3">
              <div className="col-span-1 p-6 font-bold text-lg text-dark-blue border-r border-gray-200">Xususiyatlar</div>
              <div className="col-span-1 p-6 bg-primary/5 text-center">
                  <Logo />
              </div>
              <div className="col-span-1 p-6 text-center font-bold text-lg text-dark-blue">Premium agentliklar</div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {comparisonData.map((item, index) => (
                <div key={index} className="grid grid-cols-3 items-center">
                  <div className="col-span-1 p-4 font-medium text-gray-800 border-r border-gray-200">{item.feature}</div>
                  <div className="col-span-1 p-4 bg-primary/5 text-center flex justify-center items-center font-bold text-primary">
                    {item.jon}
                  </div>
                  <div className="col-span-1 p-4 text-center flex justify-center items-center font-semibold text-gray-600 line-through">
                    {item.others}
                  </div>
                </div>
              ))}
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
