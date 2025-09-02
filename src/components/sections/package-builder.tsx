
'use client';

import { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { serviceDetails, calculatePackagePrice, type PriceDetails, SelectedServices } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Gift, Shield, CreditCard, ShieldCheck, ShoppingCart, CheckCircle, Trash2, FileText, ClipboardSignature, Info, Banknote, Flame, Megaphone, Shirt, PenTool, Share2, ClipboardList } from 'lucide-react';
import confetti from 'canvas-confetti';

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
};


const ServiceCard = ({ id, onSelect, selected }: { id: keyof SelectedServices, onSelect: () => void, selected: boolean }) => {
    const detail = serviceDetails[id];
    if (!detail) return null;
    const { label, description, price, marketPrice, timeline, note } = detail;
    const isPercentageBased = note === 'Narxga qo\'shiladi';

    const Icon = serviceIcons[id];

    return (
        <Card 
            onClick={onSelect}
            className={cn(
                "rounded-2xl shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between bg-white cursor-pointer hover:shadow-md",
                 selected && 'border-primary ring-2 ring-primary shadow-lg'
            )}
        >
            <div className="p-5 flex-grow">
                 <div className="flex items-center gap-2">
                    {Icon && <Icon className={cn("h-5 w-5", id === 'urgency' ? 'text-red-500' : 'text-primary' )} />}
                    <h4 className="text-base font-bold text-dark-blue leading-tight flex-1">{label}</h4>
                </div>
                <div className="my-2">
                    {price > 0 && (
                       <span className="text-xl font-bold text-primary whitespace-nowrap">{`+${formatPrice(price)}`}</span>
                    )}
                    {isPercentageBased && (
                        <span className="text-xl font-bold text-primary whitespace-nowrap">{note}</span>
                    )}
                    {price === 0 && !isPercentageBased && (
                         <span className="text-xl font-bold text-primary whitespace-nowrap">{formatPrice(price)}</span>
                    )}
                    {marketPrice && <span className="text-sm text-muted-foreground whitespace-nowrap line-through ml-2">{formatPrice(marketPrice)}</span>}
                </div>
                 <p className="text-sm text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: description }}></p>
                 <div className="text-xs text-muted-foreground mt-2 space-x-4">
                    {timeline && <span>Muddati: <strong>{timeline}</strong></span>}
                 </div>
            </div>
             <div className="p-4 bg-gray-50/70 border-t pointer-events-none">
                <Button 
                    className="w-full"
                    variant={selected ? 'secondary' : 'default'}
                    tabIndex={-1}
                >
                    {selected ? (
                        <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Savatchada
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Savatchaga qo'shish
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
};

const InfoCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <Card className="bg-primary/5 p-4 rounded-xl border-white/20 flex items-start gap-3">
        <div className="flex-shrink-0 bg-white/20 text-white p-2 rounded-lg mt-1">
            <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
            <h5 className="font-bold text-sm text-white">{title}</h5>
            <p className="text-xs text-gray-300">{description}</p>
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
    const [isPcgMember, setIsPcgMember] = useLocalStorage('isPcgMember', false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [total, setTotal] = useState<PriceDetails>({ base: 0, final: 0, discountApplied: '', discountValue: 0, savings: 0, bonus: null, surcharges: [] });

    useEffect(() => {
        if (isClient) {
            const result = calculatePackagePrice({
                selectedServices,
                isPcgMember
            });
            setTotal(result);
        }
    }, [selectedServices, isPcgMember, isClient]);


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
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold">Narxlar va Xizmatlar</h2>
                     <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                        Bu yerda xizmatlarimizning taxminiy boshlang'ich narxlari ko'rsatilgan. O'zingizga mos to'plamni yig'ing va yakuniy narxni darhol bilib oling.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        {Object.entries(serviceCategories).map(([key, category]) => (
                            <div key={key}>
                                <h3 className="text-2xl font-bold text-dark-blue mb-4">{category.title}</h3>
                                <div className={cn(
                                    "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    key === 'tripwire' && 'md:grid-cols-3',
                                    key === 'additional' && 'md:grid-cols-3'
                                )}>
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
                        
                        <div>
                            <h3 className="text-2xl font-bold text-dark-blue mb-4">Maxsus taklif</h3>
                             <Card 
                                onClick={() => handlePcgToggle(!isPcgMember)}
                                className={cn(
                                    "p-1 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer",
                                    isPcgMember ? "bg-accent/20 border-accent ring-2 ring-accent" : "bg-white hover:shadow-md"
                                )}
                             >
                                <div className="flex items-center space-x-4 p-5 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <input 
                                          type="checkbox"
                                          id="pcg" 
                                          checked={isPcgMember} 
                                          onChange={(e) => handlePcgToggle(e.target.checked)}
                                          className="h-6 w-6 text-primary focus:ring-primary border-gray-300 rounded"
                                      />
                                      <Label htmlFor="pcg" className="text-base font-bold leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex flex-col">
                                          PCG "Tez Natija 3" kursi a'zosiman (-50% chegirma)
                                          <span className="font-normal text-sm text-gray-600 mt-1">Faqat PCG a'zolari uchun! Bu imkoniyatni qo'ldan boy bermang!</span>
                                      </Label>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="lg:col-span-1 sticky top-24">
                        <Card className="p-6 rounded-2xl shadow-xl bg-dark-blue text-white">
                            <CardHeader className="p-0 text-center">
                               <CardTitle className="text-2xl font-bold text-white">Sizning savatchangiz</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="mt-4 space-y-2 pb-4 border-b border-gray-600 min-h-[100px]">
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
                                                <span className="text-gray-300 flex-1 pr-2">{service.label}</span>
                                                <span className="font-medium text-gray-200">{displayPrice}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 ml-2 text-gray-400 hover:bg-red-500/20 hover:text-white"
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
                                        <span className="text-gray-300">Asl narx:</span>
                                        <span className={cn("font-medium", total.discountApplied && "line-through text-gray-400")}>{formatPrice(total.base)}</span>
                                    </div>

                                    {total.surcharges.map((surcharge, index) => (
                                       <div key={index} className="flex justify-between items-center text-base">
                                            <span className="text-gray-300">{surcharge.name}:</span>
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
                                         <div className="flex justify-center items-center gap-2 p-3 bg-primary/20 rounded-lg text-sky-300">
                                            <Gift className="h-5 w-5" />
                                            <p className="font-bold text-center text-sm">{total.bonus}</p>
                                        </div>
                                    )}


                                    <div className="border-t border-gray-600 my-4"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-200 text-xl">Yakuniy narx:</span>
                                        <span className="text-4xl font-extrabold text-accent">{formatPrice(total.final)}</span>
                                    </div>
                                </div>
                                <Button onClick={onOrderNow} className="w-full mt-8 text-lg bg-primary text-white hover:bg-primary/90 shadow-ocean whitespace-normal h-auto animate-subtle-pulse py-3 px-8 rounded-md" disabled={total.base === 0}>
                                    {total.discountApplied ? "Chegirma bilan buyurtma berish" : "Bepul konsultatsiya olish"}
                                </Button>
                                
                                <div className="mt-6 space-y-3">
                                   <InfoCard
                                        icon={Sparkles}
                                        title="100% Mamnuniyat Kafolati"
                                        description="Agar dastlabki konsepsiyalar yoqmasa, to'lovingizni qaytarib beramiz."
                                    />
                                     <InfoCard
                                        icon={Banknote}
                                        title="To'lov shartlari"
                                        description="Standart sxema — 50% oldindan to'lov, 50% loyiha topshirilgandan so'ng."
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

    

    
