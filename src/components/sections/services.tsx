import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const services = [
  { name: "Naming", price: "550+", description: "Brendingiz uchun unutilmas va kuchli nom tanlash." },
  { name: "Logo", price: "550", description: "Biznesingizning o'ziga xosligini aks ettiruvchi professional logotip." },
  { name: "Korporativ uslub", price: "850", description: "Brendingiz uchun yagona vizual tizim (ranglar, shriftlar, elementlar)." },
  { name: "Brandbook", price: "990", description: "Brenddan foydalanish bo'yicha to'liq qo'llanma." },
];

const Services = () => {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Xizmatlarimiz</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Biznesingiz ehtiyojlariga mos keladigan professional brending yechimlari.
          </p>
        </div>
        <div data-testid="services-list" className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map(service => (
            <Card key={service.name} className="flex flex-col text-center shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-dark-blue">{service.name}</CardTitle>
                <CardDescription className="text-base !mt-2">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <p className="text-4xl font-bold text-primary mb-6">
                  ${service.price}
                  {service.name === "Naming" && <span className="text-2xl">+</span>}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="#package-builder">Tanlash</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
