'use client';

import { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Info, CheckCircle } from 'lucide-react';
import { servicePrices, basePackages, calculatePackagePrice, generateSummary } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';

interface PackageBuilderProps {
    onOrderNow: (summary: string, price: number) => void;
}

const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow }) => {
    const [selectedPackage, setSelectedPackage] = useLocalStorage('selectedPackage', 'B');
    const [includeNaming, setIncludeNaming] = useLocalStorage('includeNaming', false);
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
                selectedPackage,
                includeNaming,
                paymentOption,
                isPcgMember
            });
            setTotal(result);
        }
    }, [selectedPackage, includeNaming, paymentOption, isPcgMember, isClient]);

    const handleOrder = () => {
        const selections = { selectedPackage, includeNaming, paymentOption, isPcgMember };
        const summary = generateSummary(selections);
        const { final } = calculatePackagePrice(selections);
        onOrderNow(summary, final);
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
                            <h3 className="text-xl font-bold text-dark-blue mb-4">1. Asosiy paketni tanlang</h3>
                             <div className="grid sm:grid-cols-3 gap-4">
                                {basePackages.map(pkg => (
                                    <Card key={pkg.id} onClick={() => setSelectedPackage(pkg.id)}
                                        className={cn(
                                            "cursor-pointer transition-all duration-200 text-left p-6 rounded-2xl flex flex-col",
                                            selectedPackage === pkg.id ? 'border-primary ring-2 ring-primary shadow-xl' : 'hover:shadow-lg border-gray-200'
                                        )}>
                                        <h4 className="font-bold text-lg text-dark-blue">{pkg.name}</h4>
                                        <p className="text-2xl font-bold text-primary mt-2">${pkg.price}</p>
                                        <ul className='mt-4 space-y-2 text-sm text-gray-600 flex-grow'>
                                            {pkg.features.map(feature => (
                                                <li key={feature} className='flex items-start gap-2'>
                                                    <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-dark-blue mb-4">2. Qo'shimcha xizmatlar</h3>
                            <Card className="p-6 rounded-2xl shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <Checkbox id="naming-checkbox" checked={includeNaming} onCheckedChange={(checked) => setIncludeNaming(Boolean(checked))} className="h-6 w-6" />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="naming-checkbox"
                                            className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Naming xizmatini qo'shish (+${servicePrices.naming})
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            Brendingiz uchun unutilmas va kuchli nom tanlash.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-dark-blue mb-4">3. To'lov turi va chegirmalar</h3>
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
                            <Button onClick={handleOrder} size="lg" className="w-full mt-8 text-lg bg-primary text-white hover:bg-primary/90 shadow-ocean">
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
