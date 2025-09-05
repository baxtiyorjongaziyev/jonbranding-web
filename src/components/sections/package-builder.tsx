

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


interface PackageBuilderProps {
    onOrderNow: () => void;
}

const formatPrice = (price: number) => {
    if (price === 0) return "Kelishiladi";
    return `${price.toLocaleString('fr-FR')} so'm`;
}

type ServiceCategory = 'tripwire' |'main' | 'additional';

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
        services: ['strategy', 'commStrategy', 'smm', 'merch', 'illustrations', 'urgency', 'nda']
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

const InfoCard = ({ icon: Icon, title, description, className }: { icon: React.ElementType, title: string, description: string, className?: string }) => (
    <Card className={cn("bg-primary/80 p-4 rounded-xl border border-white/20 flex items-start gap-4 text-left", className)}>
        <div className="flex-shrink-0 text-accent p-2 rounded-lg mt-1">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h5 className="font-bold text-white">{title}</h5>
            <p className="text-sm text-blue-200">{description}</p>
        </div>
    </Card>
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
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [total, setTotal] = useState<PriceDetails>({ base: 0, final: 0, discountApplied: '', discountValue: 0, savings: 0, bonus: null, surcharges: [] });
    const [hasDiscountBeenApplied, setHasDiscountBeenApplied] = useState(false);

    useEffect(() => {
        if (isClient) {
            const result = calculatePackagePrice({
                selectedServices,
            });
            setTotal(result);

            const justAppliedDiscount = result.discountApplied && !hasDiscountBeenApplied;

            if (justAppliedDiscount) {
                 confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ['#00C9FD', '#ADFFFE', '#FFFFFF', '#050583']
                });
                setHasDiscountBeenApplied(true);
            }
            
            if(!result.discountApplied && hasDiscountBeenApplied) {
                setHasDiscountBeenApplied(false);
            }
        }
    }, [selectedServices, isClient, hasDiscountBeenApplied]);


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
                        {Object.values(serviceCategories).map((category, index) => (
                            <div key={index}>
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
                        <Card className="p-6 rounded-2xl shadow-xl bg-primary text-white">
                            <CardHeader className="p-0 text-center">
                               <CardTitle className="text-3xl font-bold text-white">Sizning to'plamingiz</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="mt-6 space-y-3 pb-4 border-b border-white/20 min-h-[120px]">
                                    {selectedServiceKeys.length > 0 ?
                                     selectedServiceKeys.map((key) => {
                                        const service = serviceDetails[key as keyof SelectedServices];
                                        if (!service) return null;
                                        if (service.price === 0 && !service.note?.includes('qo\'shiladi')) return null;
                                        
                                        let displayPrice = formatPrice(service.price);
                                        if (service.note?.includes('qo\'shiladi')) {
                                          displayPrice = service.note;
                                        }

                                        return (
                                            <div key={key} className="flex justify-between items-center text-sm animate-fade-in group">
                                                <span className="text-blue-200 flex-1 pr-2">{service.label}</span>
                                                <span className="font-medium text-white">{displayPrice}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-7 w-7 ml-2 text-gray-400 hover:bg-red-500/20 hover:text-white rounded-md"
                                                    onClick={() => handleServiceToggle(key)}
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        );
                                    })
                                    : <div className="text-center text-gray-400 text-sm pt-6 flex flex-col items-center">
                                        <ShoppingCart className="w-10 h-10 mb-2"/>
                                        <p>Savatchangiz bo'sh</p>
                                        <p className="text-xs">O'zingizga kerakli xizmatlarni qo'shing</p>
                                    </div>
                                   }
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between items-center text-base">
                                        <span className="text-blue-200">Asl narx:</span>
                                        <span className={cn("font-medium", total.discountApplied && "line-through text-gray-400")}>{formatPrice(total.base)}</span>
                                    </div>

                                    {total.surcharges.map((surcharge, index) => (
                                       <div key={index} className="flex justify-between items-center text-base">
                                            <span className="text-blue-200">{surcharge.name}:</span>
                                            <span className="font-medium text-white">+{formatPrice(surcharge.value)}</span>
                                       </div>
                                    ))}
                                    
                                    {total.discountApplied && (
                                        <>
                                            <div className="flex justify-between items-baseline text-accent">
                                                <span className="text-sm font-medium">{total.discountApplied}</span>
                                            </div>
                                             <div className="flex justify-center items-center gap-2 p-3 bg-green-500/10 rounded-lg text-green-300">
                                                <Sparkles className="h-5 w-5" />
                                                <p className="font-bold">Siz {formatPrice(total.savings)} tejadingiz!</p>
                                            </div>
                                        </>
                                    )}

                                    {total.bonus && (
                                         <div className="flex justify-center items-center gap-2 p-3 bg-accent/20 rounded-lg text-accent">
                                            <Gift className="h-5 w-5" />
                                            <p className="font-bold text-center text-sm">{total.bonus}</p>
                                        </div>
                                    )}


                                    <div className="border-t border-white/20 my-4 pt-4"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-200 text-xl">Yakuniy narx:</span>
                                        <span className="text-4xl font-extrabold text-accent">{formatPrice(total.final)}</span>
                                    </div>
                                </div>
                                
                                <InfoCard
                                    icon={Gift}
                                    title={`Paketli chegirma -${packageDiscount * 100}%`}
                                    description={`Asosiy xizmatlardan ${packageDiscountThreshold} yoki undan ko'p tanlasangiz, umumiy narxga chegirma qo'llaniladi.`}
                                    className="mt-6 bg-accent/10 border-accent/20"
                                />

                                <Button onClick={onOrderNow} className="w-full mt-6 text-lg bg-accent text-accent-foreground hover:bg-accent/90 shadow-ocean whitespace-normal h-auto animate-subtle-pulse py-4 rounded-xl" disabled={total.base === 0}>
                                    {total.discountApplied ? "Chegirma bilan buyurtma berish" : "Bepul konsultatsiya olish"}
                                </Button>
                                
                                <div className="mt-8 space-y-4 text-left">
                                   <InfoCard
                                        icon={Sparkles}
                                        title="100% Mamnuniyat Kafolati"
                                        description="Agar dastlabki konsepsiyalar yoqmasa, to'lovingizni qaytarib beramiz."
                                    />
                                    <InfoCard
                                        icon={Repeat}
                                        title="Sodiqlik Chegirmasi"
                                        description="Biz bilan 3+ loyiha qilgan mijozlarga navbatdagi ish uchun 20% gacha maxsus chegirma."
                                    />
                                     <InfoCard
                                        icon={Banknote}
                                        title="Oldindan to'lov uchun -10%"
                                        description="Loyiha uchun 100% oldindan to'lov qiling va qo'shimcha 10% chegirmaga ega bo'ling."
                                    />
                                    <InfoCard
                                        icon={Info}
                                        title="Bu ommaviy oferta emas"
                                        description="Narxlar tanishish uchun. Yakuniy narx shartnomada belgilanadi."
                                    />
                                    <InfoCard
                                        icon={Shield}
                                        title="Mualliflik huquqi"
                                        description="Buyurtmachi faqat tasdiqlangan konsepsiyaga huquq oladi. Boshqa variantlarni alohida sotib olish mumkin."
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
