

'use client';

import { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { serviceDetails, calculatePackagePrice, type PriceDetails, SelectedServices, packageDiscountThreshold, packageDiscount } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Gift, Shield, Banknote, Info, ShoppingCart, CheckCircle, Trash2, Flame, ShieldCheck, FileText, ClipboardSignature, Megaphone, Shirt, PenTool, Share2, ClipboardList, Type, Palette, Layers, BookMarked, Box, Repeat, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';


interface PackageBuilderProps {
    onOrderNow: () => void;
}

const formatPrice = (price: number) => {
    if (price === 0) return "Kelishiladi";
    return `${price.toLocaleString('fr-FR')} so'm`;
}

type ServiceCategory = 'tripwire' |'main' | 'additional' | 'options';

const serviceCategories: Record<ServiceCategory, { title: string; services: (keyof SelectedServices)[] }> = {
    tripwire: {
        title: "Birinchi qadam (Tezkor xizmatlar)",
        services: ['audit', 'namingCheck', 'consultation']
    },
    main: {
        title: "Asosiy xizmatlarimiz",
        services: ['naming', 'logo', 'designSystem', 'brandbook', 'packaging']
    },
    additional: {
        title: "Qo'shimcha xizmatlar",
        services: ['strategy', 'commStrategy', 'smm', 'merch', 'illustrations']
    },
    options: {
        title: "Maxsus shartlar",
        services: ['urgency', 'nda']
    }
};

const serviceIcons: { [key in keyof SelectedServices]?: React.ElementType } = {
    strategy: ClipboardList,
    commStrategy: Megaphone,
    smm: Share2,
    merch: Shirt,
    illustrations: PenTool,
    urgency: Flame,
    nda: ShieldCheck,
    audit: FileText,
    namingCheck: ClipboardSignature,
    consultation: Info,
    naming: Type,
    logo: Palette,
    designSystem: Layers,
    brandbook: BookMarked,
    packaging: Box
};


const ServiceCard = ({ id, onSelect, selected }: { id: keyof SelectedServices, onSelect: () => void, selected: boolean }) => {
    const detail = serviceDetails[id];
    if (!detail) return null;
    const { label, description, price, note, timeline } = detail;
    const isPercentageBased = note === 'Narxga qo\'shiladi';

    const Icon = serviceIcons[id];

    return (
        <Card 
            onClick={onSelect}
            className={cn(
                "rounded-2xl shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between bg-white cursor-pointer hover:shadow-md h-full",
                selected && 'border-accent ring-2 ring-accent shadow-lg'
            )}
        >
            <div className="p-5 flex-grow">
                <div className="flex items-start gap-4">
                    {Icon && <Icon className={cn("h-8 w-8 flex-shrink-0 mt-1", id === 'urgency' ? 'text-red-500' : 'text-primary' )} />}
                    <div className='flex-1'>
                        <h4 className="text-lg font-bold text-dark-blue leading-tight">{label}</h4>
                        <p className="text-sm text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: description }}></p>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-secondary/50 border-t mt-auto">
                 <div className="my-2 text-center">
                    {price > 0 && (
                    <span className="text-2xl font-bold text-primary whitespace-nowrap">{`+${formatPrice(price)}`}</span>
                    )}
                    {isPercentageBased && (
                        <span className="text-lg font-semibold text-primary whitespace-nowrap">{note}</span>
                    )}
                    {price === 0 && !isPercentageBased && (
                        <span className="text-xl font-bold text-primary whitespace-nowrap">{formatPrice(price)}</span>
                    )}
                </div>
                <Button 
                    className="w-full text-base py-3 h-auto"
                    variant={selected ? 'default' : 'outline'}
                    tabIndex={-1}
                >
                    {selected ? (
                        <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Tanlangan
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Tanlash
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
};

const InfoCard = ({ icon: Icon, title, description, className, children }: { icon: React.ElementType, title: string, description: string, className?: string, children?: React.ReactNode }) => (
    <div className={cn("bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-4 text-left", className)}>
        <div className="flex-shrink-0 text-accent p-2 rounded-lg mt-1">
            {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div className="flex-1">
            <h5 className="font-semibold text-white">{title}</h5>
            <p className="text-sm text-blue-200">{description}</p>
        </div>
        {children}
    </div>
);

const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow }) => {
    const [selectedServices, setSelectedServices] = useLocalStorage<SelectedServices>('selectedServices', {
        audit: false,
        namingCheck: false,
        consultation: false,
        strategy: false,
        commStrategy: false,
        naming: false,
        logo: false,
        designSystem: false,
        brandbook: false,
        packaging: false,
        smm: false,
        merch: false,
        illustrations: false,
        urgency: false,
        nda: false,
    });
    const [wantsUpfrontPayment, setWantsUpfrontPayment] = useLocalStorage('wantsUpfrontPayment', false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [total, setTotal] = useState<PriceDetails>({ base: 0, final: 0, discountApplied: [], savings: 0, bonus: null, surcharges: [] });
    const [hasDiscountBeenApplied, setHasDiscountBeenApplied] = useState(false);

    useEffect(() => {
        if (isClient) {
            const result = calculatePackagePrice({
                selectedServices,
                wantsUpfrontPayment,
            });
            setTotal(result);

            const justAppliedDiscount = result.discountApplied.length > 0 && !hasDiscountBeenApplied;

            if (justAppliedDiscount) {
                 confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ['#00C9FD', '#ADFFFE', '#FFFFFF', '#050583']
                });
                setHasDiscountBeenApplied(true);
            }
            
            if(result.discountApplied.length === 0 && hasDiscountBeenApplied) {
                setHasDiscountBeenApplied(false);
            }
        }
    }, [selectedServices, wantsUpfrontPayment, isClient, hasDiscountBeenApplied]);


    const handleServiceToggle = (service: keyof SelectedServices) => {
        setSelectedServices(prev => {
            const newState = { ...prev };
            
            newState[service] = !newState[service];

            if (service === 'logo' && newState.logo) {
                newState.designSystem = false;
            } else if (service === 'designSystem' && newState.designSystem) {
                newState.logo = false;
            }

            return newState;
        });
    };
    
     if (!isClient) {
        return (
            <section id="package-builder" className="py-16 sm:py-24 bg-secondary">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                         <h2 className="text-3xl sm:text-4xl font-bold">Narxlar va Xizmatlar</h2>
                         <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                             Bu yerda xizmatlarimizning taxminiy boshlang'ich narxlari ko'rsatilgan. Har bir kompaniya o'ziga xos bo'lgani uchun, yakuniy narx loyihaning murakkabligi, ish hajmi va sizning vazifalaringizga bog'liq.
                         </p>
                    </div>
                     <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                           <Skeleton className="h-64 w-full" />
                           <Skeleton className="h-64 w-full" />
                        </div>
                        <div className="lg:col-span-1 sticky top-24">
                             <Skeleton className="h-64 w-full" />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    const selectedServiceKeys = Object.entries(selectedServices)
                                .filter(([, value]) => value)
                                .map(([key]) => key as keyof SelectedServices);

    return (
        <section id="package-builder" className="py-16 sm:py-24 bg-secondary">
             <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl sm:text-4xl font-bold">Narxlar va Xizmatlar</h2>
                     <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                         Bu yerda xizmatlarimizning taxminiy boshlang'ich narxlari ko'rsatilgan. Har bir kompaniya o'ziga xos bo'lgani uchun, yakuniy narx loyihaning murakkabligi, ish hajmi va sizning vazifalaringizga bog'liq.
                     </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-2 space-y-12">
                        {Object.entries(serviceCategories).map(([key, category]) => (
                            <div key={key}>
                                <h3 className="text-2xl font-bold text-dark-blue mb-6">{category.title}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {category.services.map((serviceId) => {
                                        if (!serviceDetails[serviceId]) return null;
                                        return (
                                            <ServiceCard
                                                key={serviceId}
                                                id={serviceId}
                                                selected={selectedServices[serviceId] || false}
                                                onSelect={() => handleServiceToggle(serviceId)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
    
                    <div className="lg:col-span-1 lg:sticky top-24">
                        <Card className="p-6 sm:p-8 rounded-2xl shadow-xl bg-gradient-to-br from-dark-blue to-primary text-white">
                            <CardHeader className="p-0 text-left">
                               <CardTitle className="text-2xl font-bold text-white">Sizning to'plamingiz</CardTitle>
                               <p className="text-blue-200 text-sm mt-1">O'zingizga mos xizmatlarni tanlang.</p>
                            </CardHeader>
                            <CardContent className="p-0 mt-6">
                                <div className="space-y-3 pb-4 border-b border-white/20 min-h-[60px]">
                                    {selectedServiceKeys.length > 0 ?
                                     selectedServiceKeys.map((key) => {
                                        const service = serviceDetails[key as keyof SelectedServices];
                                        if (!service) return null;
                                        if (service.price === 0 && !service.note?.includes('qo\'shiladi')) return null;
                                        
                                        return (
                                            <div key={key} className="flex justify-between items-center text-sm animate-fade-in group">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-accent"/>
                                                    <span className="text-white flex-1 pr-2">{service.label}</span>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-7 w-7 ml-2 text-gray-400 hover:bg-red-500/20 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleServiceToggle(key)}
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        );
                                    })
                                    : <div className="text-center text-blue-200 text-sm py-4 flex flex-col items-center gap-2">
                                        <ShoppingCart className="w-8 h-8"/>
                                        <p>Xizmatlarni tanlang</p>
                                    </div>
                                   }
                                </div>

                                <div className="space-y-4 my-6">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-blue-200 text-base">Yakuniy narx:</span>
                                        <div className="text-right">
                                            {total.savings > 0 && (
                                                <p className="text-sm line-through text-gray-400">{formatPrice(total.base + total.surcharges.reduce((a,b) => a + b.value, 0))}</p>
                                            )}
                                            <p className="text-4xl font-extrabold text-white">{formatPrice(total.final)}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-end">
                                      {total.savings > 0 && (
                                          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-none">
                                              <Sparkles className="h-3 w-3 mr-1" />
                                              Siz {formatPrice(total.savings)} tejadingiz!
                                          </Badge>
                                      )}
                                      {total.bonus && (
                                          <Badge variant="secondary" className="bg-accent/20 text-accent-light border-none">
                                              <Gift className="h-3 w-3 mr-1" />
                                              {total.bonus}
                                          </Badge>
                                      )}
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                                   <Label htmlFor="upfront-payment" className="flex flex-col">
                                        <span className="font-semibold text-white">Oldindan to'lov uchun -10%</span>
                                        <span className="text-xs text-blue-200">Loyiha uchun 100% oldindan to'lov qiling</span>
                                   </Label>
                                   <Switch
                                        id="upfront-payment"
                                        checked={wantsUpfrontPayment}
                                        onCheckedChange={setWantsUpfrontPayment}
                                        aria-label="Oldindan to'lov chegirmasi"
                                        className="flex-shrink-0"
                                    />
                                </div>


                                <Button onClick={onOrderNow} variant="default" size="lg" className="w-full mt-6 text-lg py-3" disabled={total.base === 0}>
                                    {total.discountApplied.length > 0 ? "Chegirma bilan buyurtma berish" : "Bepul konsultatsiya olish"}
                                </Button>
                                
                                <div className="mt-8 space-y-4 text-left">
                                   <InfoCard
                                        icon={Sparkles}
                                        title="100% Mamnuniyat Kafolati"
                                        description="Agar dastlabki konsepsiyalar yoqmasa, to'lovingizni qaytarib beramiz."
                                    />
                                    <InfoCard
                                        icon={Info}
                                        title="Bu ommaviy oferta emas"
                                        description="Narxlar tanishish uchun. Yakuniy narx shartnomada belgilanadi."
                                    />
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PackageBuilder;

    
    
