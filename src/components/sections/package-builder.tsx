'use client';

import { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { servicePrices, calculatePackagePrice, generateSummary } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';

interface PackageBuilderProps {
    onOrderNow: (summary: string, price: number) => void;
}

const ServiceCheckbox = ({ id, label, description, price, checked, onCheckedChange }: { id: string, label: string, description: string, price: number, checked: boolean, onCheckedChange: (checked: boolean) => void }) => (
    <div className="flex items-start space-x-3">
        <Checkbox id={id} checked={checked} onCheckedChange={(c) => onCheckedChange(Boolean(c))} className="h-6 w-6 mt-1" disabled={id === 'logo'} />
        <div className="grid gap-1.5 leading-none">
            <label
                htmlFor={id}
                className={cn("text-base font-medium leading-none", id !== 'logo' && "cursor-pointer", id === 'logo' && "cursor-not-allowed opacity-70")}
            >
                {label} <span className="text-primary font-bold">(+${price})</span>
            </label>
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    </div>
);


const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow }) => {
    const [selectedServices, setSelectedServices] = useLocalStorage('selectedServices', {
        naming: false,
        logo: true,
        style: false,
        brandbook: false,
    });
    const [paymentOption, setPaymentOption] = useLocalStorage('paymentOption', '50');
    const [isPcgMember, setIsPcgMember] = useLocalStorage('isPcgMember', true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [total, setTotal] = useState({ base: 0, final: 0, discountApplied: '' });

    useEffect(() => {
        if (isClient) {
            const result = calculatePackagePrice({
                selectedServices,
                paymentOption,
                isPcgMember
            });
            setTotal(result);
        }
    }, [selectedServices, paymentOption, isPcgMember, isClient]);

    const handleOrder = () => {
        const selections = { selectedServices, paymentOption, isPcgMember };
        const summary = generateSummary(selections);
        const { final } = calculatePackagePrice(selections);
        onOrderNow(summary, final);
    };

    const handleServiceChange = (service: keyof typeof selectedServices, checked: boolean) => {
        setSelectedServices(prev => ({ ...prev, [service]: checked }));
    };

     if (!isClient) {
        return (
            <section id="package-builder" className="py-16 sm:py-24 bg-secondary">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                         <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Paketni Hisoblash</h2>
                         <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
                             O'zingizga mos keladigan xizmatlar to'plamini tanlang va chegirmalarni qo'llang.
                         </p>
                    </div>
                     <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                             <Skeleton className="h-48 w-full" />
                             <Skeleton className="h-24 w-full" />
                             <Skeleton className="h-48 w-full" />
                        </div>
                        <div className="lg:col-span-1 sticky top-24">
                             <Skeleton className="h-64 w-full" />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="package-builder" className="py-16 sm:py-24 bg-secondary">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Paketni Hisoblash</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
                        O'zingizga mos keladigan xizmatlar to'plamini tanlang va chegirmalarni qo'llang.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-dark-blue mb-4">1. Kerakli xizmatlarni tanlang</h3>
                            <Card className="p-6 rounded-2xl shadow-sm space-y-6">
                                <ServiceCheckbox 
                                    id="naming"
                                    label="Naming"
                                    description="Brendingiz uchun unutilmas va kuchli nom tanlash."
                                    price={servicePrices.naming}
                                    checked={selectedServices.naming}
                                    onCheckedChange={(checked) => handleServiceChange('naming', checked)}
                                />
                                <hr />
                                <ServiceCheckbox 
                                    id="logo"
                                    label="Logo"
                                    description="Biznesingizning o'ziga xosligini aks ettiruvchi professional logotip. (Asosiy xizmat)"
                                    price={servicePrices.logo}
                                    checked={selectedServices.logo}
                                    onCheckedChange={(checked) => handleServiceChange('logo', checked)}
                                />
                                 <hr />
                                <ServiceCheckbox 
                                    id="style"
                                    label="Korporativ uslub"
                                    description="Brendingiz uchun yagona vizual tizim (ranglar, shriftlar, elementlar)."
                                    price={servicePrices.style}
                                    checked={selectedServices.style}
                                    onCheckedChange={(checked) => handleServiceChange('style', checked)}
                                />
                                 <hr />
                                <ServiceCheckbox 
                                    id="brandbook"
                                    label="Brandbook"
                                    description="Brenddan foydalanish bo'yicha to'liq qo'llanma."
                                    price={servicePrices.brandbook}
                                    checked={selectedServices.brandbook}
                                    onCheckedChange={(checked) => handleServiceChange('brandbook', checked)}
                                />
                            </Card>
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-bold text-dark-blue mb-4">2. To'lov turi va chegirmalar</h3>
                            <Card className="p-6 rounded-2xl shadow-sm space-y-6">
                                <RadioGroup value={paymentOption} onValueChange={setPaymentOption} className="grid sm:grid-cols-3 gap-4">
                                    <Label className="flex flex-col items-center justify-center gap-2 border rounded-lg p-4 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                                        <RadioGroupItem value="100" />
                                        <span>100% oldindan</span>
                                        <span className="font-bold text-green-600">-30%</span>
                                    </Label>
                                    <Label className="flex flex-col items-center justify-center gap-2 border rounded-lg p-4 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                                        <RadioGroupItem value="50" />
                                        <span>50% / 50%</span>
                                        <span className="font-bold text-green-600">-15%</span>
                                    </Label>
                                    <Label className="flex flex-col items-center justify-center gap-2 border rounded-lg p-4 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                                        <RadioGroupItem value="none" />
                                        <span>Bo'lib to'lash</span>
                                        <span className="font-bold text-gray-500">Chegirmasiz</span>
                                    </Label>
                                </RadioGroup>
                                <div className="flex items-center space-x-3 bg-yellow-100/50 border border-yellow-300 p-4 rounded-lg">
                                    <Checkbox id="pcg" checked={isPcgMember} onCheckedChange={(checked) => setIsPcgMember(Boolean(checked))} />
                                    <Label htmlFor="pcg" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        PCG "Tez Natija 3" kursi a'zosiman (-50% chegirma)
                                    </Label>
                                </div>
                                 <div className="bg-blue-100/50 border border-blue-300 p-3 rounded-lg flex items-start gap-2 text-sm text-blue-800">
                                    <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <p>Eng katta bitta chegirma avtomatik tarzda qo'llaniladi. Chegirmalar bir-biriga qo'shilmaydi.</p>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="lg:col-span-1 sticky top-24">
                        <Card className="p-6 rounded-2xl shadow-xl bg-dark-blue text-white">
                            <h3 className="text-2xl font-bold text-center">Natija</h3>
                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="text-gray-300">Asl narx:</span>
                                    <span className="font-bold line-through">${total.base.toLocaleString('en-US')}</span>
                                </div>
                                <div className="border-t border-gray-600 my-2"></div>
                                <div className="flex justify-between items-baseline text-accent">
                                    <span className="text-sm font-medium">{total.discountApplied}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-200 text-xl">Yakuniy narx:</span>
                                    <span className="text-4xl font-extrabold text-accent">${total.final.toLocaleString('en-US')}</span>
                                </div>
                            </div>
                            <Button onClick={handleOrder} size="lg" className="w-full mt-8 text-lg bg-primary text-white hover:bg-primary/90 shadow-ocean" disabled={total.base === 0}>
                                Hoziroq buyurtma berish
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PackageBuilder;
