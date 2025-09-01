'use client';

import { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { servicePrices, calculatePackagePrice, type PriceDetails } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Sparkles, Gift, ShieldCheck, FileText, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PackageBuilderProps {
    onOrderNow: () => void;
}

const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR');
}

const serviceDetails = {
    naming: { id: "naming", label: "Naming", description: "Brendingiz uchun unutilmas va kuchli nom tanlash.", price: servicePrices.naming },
    logo: { id: "logo", label: "Logo", description: "Biznesingizning o'ziga xosligini aks ettiruvchi professional logotip. (Asosiy xizmat)", price: servicePrices.logo },
    style: { id: "style", label: "Korporativ uslub", description: "Brendingiz uchun yagona vizual tizim (ranglar, shriftlar, elementlar).", price: servicePrices.style },
    brandbook: { id: "brandbook", label: "Brandbook", description: "Brenddan foydalanish bo'yicha to'liq qo'llanma.", price: servicePrices.brandbook }
};

const ServiceCard = ({ id, label, description, price, selected, onSelect, disabled = false }: { id: string, label: string, description: string, price: number, selected: boolean, onSelect: () => void, disabled?: boolean }) => (
    <Card 
        onClick={!disabled ? onSelect : undefined}
        className={cn(
            "rounded-2xl shadow-sm transition-all duration-300 cursor-pointer relative overflow-hidden transform hover:-translate-y-2",
            selected ? 'border-primary ring-2 ring-primary shadow-lg' : 'border-gray-200 hover:shadow-md hover:border-primary/50',
            disabled && "cursor-not-allowed opacity-70 bg-gray-50"
        )}
    >
        <CardContent className="p-5">
             {selected && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <CheckCircle className="h-4 w-4" />
                </div>
            )}
            <div className="grid gap-1.5 leading-none">
                <h4 className="text-base font-bold text-dark-blue leading-none">
                    {label} <span className="text-primary font-bold">(+{formatPrice(price)} so'm)</span>
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                    {description}
                </p>
            </div>
        </CardContent>
    </Card>
);


const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow }) => {
    const [selectedServices, setSelectedServices] = useLocalStorage('selectedServices', {
        naming: false,
        logo: true,
        style: false,
        brandbook: false,
    });
    const [isPcgMember, setIsPcgMember] = useLocalStorage('isPcgMember', false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [total, setTotal] = useState<PriceDetails>({ base: 0, final: 0, discountApplied: '', discountValue: 0, savings: 0, bonus: null });

    useEffect(() => {
        if (isClient) {
            const result = calculatePackagePrice({
                selectedServices,
                isPcgMember
            });
            setTotal(result);
        }
    }, [selectedServices, isPcgMember, isClient]);


    const handleServiceToggle = (service: keyof typeof selectedServices) => {
        if (service === 'logo') return; // Logo is mandatory
        setSelectedServices(prev => ({ ...prev, [service]: !prev[service] }));
    };
    
    const handlePcgToggle = (checked: boolean) => {
        if(checked && !isPcgMember) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        setIsPcgMember(checked);
    }

     if (!isClient) {
        return (
            <section id="package-builder" className="py-16 sm:py-24 bg-secondary">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                         <h2 className="text-3xl sm:text-4xl font-bold">Paketni Hisoblash</h2>
                         <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
                             O'zingizga mos keladigan xizmatlar to'plamini tanlang va chegirmalarni qo'llang.
                         </p>
                    </div>
                     <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-1/2" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                </div>
                            </div>
                            <div>
                                <Skeleton className="h-10 w-1/3 mb-4" />
                                <Skeleton className="h-24 w-full" />
                            </div>
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
                    <h2 className="text-3xl sm:text-4xl font-bold">Paketni Hisoblash</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
                        O'zingizga mos keladigan xizmatlar to'plamini tanlang va chegirmalarni qo'llang.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-dark-blue mb-4">1. Kerakli xizmatlarni tanlang</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ServiceCard 
                                    id="naming"
                                    label="Naming"
                                    description="Brendingiz uchun unutilmas va kuchli nom tanlash."
                                    price={servicePrices.naming}
                                    selected={selectedServices.naming}
                                    onSelect={() => handleServiceToggle('naming')}
                                />
                                <ServiceCard 
                                    id="logo"
                                    label="Logo"
                                    description="Biznesingizning o'ziga xosligini aks ettiruvchi professional logotip. (Asosiy xizmat)"
                                    price={servicePrices.logo}
                                    selected={selectedServices.logo}
                                    onSelect={() => {}}
                                    disabled={true}
                                />
                                <ServiceCard 
                                    id="style"
                                    label="Korporativ uslub"
                                    description="Brendingiz uchun yagona vizual tizim (ranglar, shriftlar, elementlar)."
                                    price={servicePrices.style}
                                    selected={selectedServices.style}
                                    onSelect={() => handleServiceToggle('style')}
                                />
                                <ServiceCard 
                                    id="brandbook"
                                    label="Brandbook"
                                    description="Brenddan foydalanish bo'yicha to'liq qo'llanma."
                                    price={servicePrices.brandbook}
                                    selected={selectedServices.brandbook}
                                    onSelect={() => handleServiceToggle('brandbook')}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-bold text-dark-blue mb-4">2. Maxsus taklif</h3>
                             <Card 
                                onClick={() => handlePcgToggle(!isPcgMember)}
                                className={cn(
                                    "p-1 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer animate-subtle-pulse",
                                    isPcgMember ? "bg-accent/20 border-accent ring-2 ring-accent" : "bg-white hover:shadow-md"
                                )}
                             >
                                <div className="flex items-center space-x-4 p-6 rounded-lg">
                                    <Checkbox id="pcg" checked={isPcgMember} onCheckedChange={(checked) => handlePcgToggle(Boolean(checked))} className="h-8 w-8"/>
                                    <Label htmlFor="pcg" className="text-base font-bold leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex flex-col">
                                        PCG "Tez Natija 3" kursi a'zosiman (-50% chegirma)
                                        <span className="font-normal text-sm text-gray-600 mt-1">Faqat PCG a'zolari uchun! Bu imkoniyatni qo'ldan boy bermang!</span>
                                    </Label>
                                </div>
                            </Card>
                        </div>

                         <div>
                            <h3 className="text-xl font-bold text-dark-blue mb-4">3. Bizning kafolatimiz va shartlar</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="rounded-2xl shadow-sm bg-primary/10 border-primary/30">
                                    <CardContent className="flex items-center space-x-4 p-4">
                                        <ShieldCheck className="h-10 w-10 text-primary flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-dark-blue">100% Kafolat</h4>
                                            <p className="text-muted-foreground text-sm">Sizga yoqadigan dizayn yoki pulingizni qaytarish.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                 <Card className="rounded-2xl shadow-sm bg-secondary border">
                                    <CardContent className="flex items-center space-x-4 p-4">
                                        <CreditCard className="h-10 w-10 text-dark-blue/70 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-dark-blue">To'lov shartlari</h4>
                                            <p className="text-muted-foreground text-sm">50% oldindan to'lov, 50% loyiha yakunida.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                 <Card className="rounded-2xl shadow-sm bg-secondary border col-span-1 md:col-span-2">
                                    <CardContent className="flex items-center space-x-4 p-4">
                                        <FileText className="h-10 w-10 text-dark-blue/70 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-dark-blue">Yuridik ma'lumot</h4>
                                            <p className="text-muted-foreground text-sm">Narxlar tanishuvingiz uchun ko'rsatilgan va ommaviy oferta hisoblanmaydi. Yakuniy narx loyiha murakkabligiga qarab belgilanadi.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 sticky top-24">
                        <Card className="p-6 rounded-2xl shadow-xl bg-dark-blue text-white">
                            <h3 className="text-2xl font-bold text-center">Natija</h3>
                            <div className="mt-4 space-y-2 pb-4 border-b border-gray-600">
                                {Object.entries(selectedServices).map(([key, value]) => {
                                    if (value) {
                                        const service = serviceDetails[key as keyof typeof serviceDetails];
                                        return (
                                            <div key={key} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-300">{service.label}</span>
                                                <span className="font-medium text-gray-200">{formatPrice(service.price)} so'm</span>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            <div className="mt-4 space-y-4">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="text-gray-300">Asl narx:</span>
                                    <span className={cn("font-bold", total.discountApplied && "line-through text-gray-400")}>{formatPrice(total.base)} so'm</span>
                                </div>
                                
                                {total.discountApplied && (
                                    <>
                                        <div className="flex justify-between items-baseline text-accent">
                                            <span className="text-sm font-medium">{total.discountApplied}</span>
                                        </div>
                                         <div className="flex justify-center items-center gap-2 p-3 bg-green-500/10 rounded-lg text-green-300">
                                            <Sparkles className="h-5 w-5" />
                                            <p className="font-bold">Siz {formatPrice(total.savings)} so'm tejadingiz!</p>
                                        </div>
                                    </>
                                )}

                                {total.bonus && (
                                     <div className="flex justify-center items-center gap-2 p-3 bg-primary/20 rounded-lg text-sky-blue">
                                        <Gift className="h-5 w-5" />
                                        <p className="font-bold text-center">{total.bonus}</p>
                                    </div>
                                )}


                                <div className="border-t border-gray-600 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-200 text-xl">Yakuniy narx:</span>
                                    <span className="text-4xl font-extrabold text-accent">{formatPrice(total.final)} so'm</span>
                                </div>
                            </div>
                            <Button onClick={onOrderNow} className="w-full mt-8 text-lg bg-primary text-white hover:bg-primary/90 shadow-ocean whitespace-normal h-auto animate-subtle-pulse py-3 px-8 rounded-md" disabled={total.final === 0}>
                                {total.discountApplied ? "50% chegirma bilan buyurtma berish" : "Bepul konsultatsiya olish"}
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PackageBuilder;

    
