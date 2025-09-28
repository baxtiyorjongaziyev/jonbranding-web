

'use client';

import { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getServiceDetails, calculatePackagePrice, type PriceDetails, SelectedServices } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Gift, Info, ShoppingCart, CheckCircle, Trash2, Flame, ShieldCheck, FileText, ClipboardSignature, Megaphone, Shirt, PenTool, ClipboardList, Type, Palette, Layers, BookMarked, Box, PercentCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Switch } from '@/components/ui/switch';
import TiltCard from '../ui/tilt-card';


interface PackageBuilderProps {
    onOrderNow: () => void;
    lang: string;
    dictionary: any;
}

const formatPriceForDisplay = (price: number, lang: 'uz' | 'ru' | 'en', dictionary: any) => {
    if (price === 0) return dictionary.agreed_price;
    return `${price.toLocaleString('fr-FR')} ${dictionary.currency}`;
}


type ServiceCategory = 'tripwire' |'main' | 'additional' | 'options';

const serviceCategories: Record<ServiceCategory, { titleKey: string; services: (keyof SelectedServices)[] }> = {
    tripwire: {
        titleKey: "tripwire",
        services: ['audit', 'namingCheck', 'consultation']
    },
    main: {
        titleKey: "main",
        services: ['naming', 'logo', 'designSystem', 'brandbook', 'packaging']
    },
    additional: {
        titleKey: "additional",
        services: ['strategy', 'commStrategy', 'smm', 'merch', 'illustrations']
    },
    options: {
        titleKey: "options",
        services: ['urgency', 'nda']
    }
};

const serviceIcons: { [key in keyof SelectedServices]?: React.ElementType } = {
    strategy: ClipboardList,
    commStrategy: Megaphone,
    smm: PenTool,
    merch: Shirt,
    illustrations: Palette,
    urgency: Flame,
    nda: ShieldCheck,
    audit: FileText,
    namingCheck: ClipboardSignature,
    consultation: Info,
    naming: Type,
    logo: Layers,
    designSystem: BookMarked,
    brandbook: BookMarked,
    packaging: Box
};


const ServiceCard = ({ id, onSelect, selected, lang, dictionary }: { id: keyof SelectedServices, onSelect: () => void, selected: boolean, lang: 'uz' | 'ru' | 'en', dictionary: any }) => {
    const serviceDetails = getServiceDetails(lang);
    const detail = serviceDetails[id];
    if (!detail) return null;
    const { label, description, price, note } = detail;
    const isPercentageBased = note && (note.includes('%'));

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
                 <div className="my-2 text-center min-h-[40px] flex items-center justify-center">
                    {price > 0 && !isPercentageBased && (
                       <span className="text-2xl font-bold text-primary whitespace-nowrap">{`+${formatPriceForDisplay(price, lang, dictionary)}`}</span>
                    )}
                    {note && (
                        <span className="text-lg font-semibold text-primary whitespace-nowrap">{note}</span>
                    )}
                    {price === 0 && !note && (
                         <span className="text-xl font-bold text-primary whitespace-nowrap">{formatPriceForDisplay(price, lang, dictionary)}</span>
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
                            {dictionary.selected}
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            {dictionary.select}
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

const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow, lang, dictionary }) => {
    const translations = dictionary;
    const serviceDetails = getServiceDetails(lang as 'uz' | 'ru' | 'en');
    
    const [selectedServices, setSelectedServices] = useLocalStorage<SelectedServices>('selectedServices', {
        audit: false, namingCheck: false, consultation: false, strategy: false, commStrategy: false,
        naming: false, logo: true, designSystem: false, brandbook: false, packaging: false,
        smm: false, merch: false, illustrations: false, urgency: false, nda: false,
    });
    const [wantsUpfrontPayment, setWantsUpfrontPayment] = useLocalStorage('wantsUpfrontPayment', false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => { setIsClient(true); }, []);

    const [total, setTotal] = useState<PriceDetails>({ base: 0, final: 0, discountApplied: [], savings: 0, bonus: null, surcharges: [] });
    const [hasDiscountBeenApplied, setHasDiscountBeenApplied] = useState(false);

    useEffect(() => {
        if (isClient) {
            const result = calculatePackagePrice({ selectedServices, wantsUpfrontPayment }, lang as 'uz' | 'ru' | 'en');
            setTotal(result);
            const justAppliedDiscount = result.discountApplied.length > 0 && !hasDiscountBeenApplied;
            if (justAppliedDiscount) {
                 confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#00C9FD', '#ADFFFE', '#FFFFFF', '#050583'] });
                setHasDiscountBeenApplied(true);
            }
            if(result.discountApplied.length === 0 && hasDiscountBeenApplied) {
                setHasDiscountBeenApplied(false);
            }
        }
    }, [selectedServices, wantsUpfrontPayment, isClient, hasDiscountBeenApplied, lang]);

    const handleServiceToggle = (service: keyof SelectedServices) => {
        setSelectedServices(prev => {
            const newState = { ...prev };
            newState[service] = !newState[service];
            // If `logo` is selected, deselect `designSystem` and vice versa
            if (service === 'logo' && newState.logo) newState.designSystem = false;
            else if (service === 'designSystem' && newState.designSystem) newState.logo = false;
            return newState;
        });
    };
    
    if (!isClient || !translations) {
        return (
            <section id="package-builder" className="py-16 sm:py-24 bg-secondary pt-32">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                         <Skeleton className="h-10 w-1/2 mx-auto" />
                         <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
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
        <section id="package-builder" className="py-16 sm:py-24 bg-secondary pt-32">
             <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
                     <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">{translations.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-2 space-y-12">
                        {Object.entries(serviceCategories).map(([key, category]) => (
                            <div key={key}>
                                <h3 className="text-2xl font-bold text-dark-blue mb-6">{translations.categories[category.titleKey]}</h3>
                                {key === 'main' && (
                                    <div className="mb-6 rounded-2xl bg-gradient-to-br from-dark-blue to-primary p-6 text-white shadow-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/10 p-3 rounded-full">
                                                <PercentCircle className="h-8 w-8 text-accent flex-shrink-0"/>
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-lg text-white">{translations.discount_alert_title}</h4>
                                                <p className="text-blue-200" dangerouslySetInnerHTML={{ __html: translations.discount_alert_desc }}></p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {category.services.map((serviceId) => {
                                        if (!serviceDetails[serviceId]) return null;
                                        return (
                                            <TiltCard key={serviceId} strength={10}>
                                                <ServiceCard
                                                    id={serviceId}
                                                    selected={selectedServices[serviceId] || false}
                                                    onSelect={() => handleServiceToggle(serviceId)}
                                                    lang={lang as 'uz' | 'ru' | 'en'}
                                                    dictionary={translations}
                                                />
                                            </TiltCard>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
    
                    <div className="lg:col-span-1 lg:sticky top-24">
                        <Card className="p-6 sm:p-8 rounded-2xl shadow-xl bg-gradient-to-br from-dark-blue to-primary text-white">
                            <CardHeader className="p-0 text-left">
                               <CardTitle className="text-2xl font-bold text-white">{translations.your_package}</CardTitle>
                               <p className="text-blue-200 text-sm mt-1">{translations.your_package_desc}</p>
                            </CardHeader>
                            <CardContent className="p-0 mt-6">
                                <div className="space-y-3 min-h-[100px] border-b border-white/10 pb-4 mb-4">
                                    {selectedServiceKeys.length > 0 ? (
                                        selectedServiceKeys
                                            .filter(key => {
                                                const service = serviceDetails[key];
                                                return service && (service.price > 0 || service.note?.includes('%'));
                                            })
                                            .map((key) => {
                                                const service = serviceDetails[key];
                                                return (
                                                    <div key={key} className="flex justify-between items-center text-sm animate-fade-in group">
                                                        <span className="text-white flex-1 pr-2">{service.label}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-gray-300">
                                                                {service.price > 0 ? `+${formatPriceForDisplay(service.price, lang as 'uz' | 'ru' | 'en', translations)}` : service.note}
                                                            </span>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-6 w-6 text-gray-400 hover:bg-red-500/20 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => handleServiceToggle(key)}
                                                            >
                                                                <Trash2 className="h-4 w-4"/>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    ) : (
                                        <div className="text-center text-blue-200 text-sm py-4 flex flex-col items-center gap-2">
                                            <ShoppingCart className="w-8 h-8"/>
                                            <p>{translations.select_services}</p>
                                        </div>
                                    )}
                                </div>
                                
                                {total.base > 0 && (
                                    <div className="py-4 space-y-3 border-b border-white/10 mb-4">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-blue-200">{translations.services_total}</span>
                                            <span className="font-mono">{total.base.toLocaleString('fr-FR')} {translations.currency}</span>
                                        </div>
                                        {total.surcharges.map(s => (
                                            <div key={s.name} className="flex justify-between items-center text-sm text-amber-300">
                                                <span>{s.name}</span>
                                                <span className="font-mono">+ {s.value.toLocaleString('fr-FR')} {translations.currency}</span>
                                            </div>
                                        ))}
                                        {total.discountApplied.map(d => (
                                            <div key={d.name} className="flex justify-between items-center text-sm text-green-300">
                                                <span>{d.name}</span>
                                                <span className="font-mono">- {d.value.toLocaleString('fr-FR')} {translations.currency}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {total.savings > 0 && (
                                    <div className="text-center py-4 my-4 bg-green-500/20 rounded-lg animate-fade-in border border-green-400/30">
                                        <p className="text-sm text-green-200">{translations.total_savings}</p>
                                        <p className="text-3xl font-bold text-green-300 animate-pulse">{formatPriceForDisplay(total.savings, lang as 'uz' | 'ru' | 'en', translations)}</p>
                                    </div>
                                )}
                                
                                {total.bonus && (
                                    <InfoCard
                                        icon={Gift}
                                        title={translations.gift_title}
                                        description={total.bonus}
                                        className="my-4 bg-accent/10 border-accent/20 text-accent-light"
                                    />
                                )}

                                <div className="mt-4 flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                                   <Label htmlFor="upfront-payment" className="flex flex-col cursor-pointer flex-1 pr-4">
                                        <span className="font-semibold text-white">{translations.upfront_discount_title}</span>
                                        <span className="text-xs text-blue-200">{translations.upfront_discount_desc}</span>
                                   </Label>
                                   <Switch
                                        id="upfront-payment"
                                        checked={wantsUpfrontPayment}
                                        onCheckedChange={setWantsUpfrontPayment}
                                        aria-label={translations.upfront_discount_title}
                                        className="flex-shrink-0"
                                    />
                                </div>

                                <div className='mt-6 text-center'>
                                     <p className="text-sm text-blue-200">{translations.final_price}</p>
                                      <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight flex justify-center items-baseline">
                                        {total.final > 0 ? (
                                            <>
                                                {total.final.toLocaleString('fr-FR')}
                                                <span className="text-2xl font-medium text-blue-200 ml-2">{translations.currency}</span>
                                            </>
                                        ) : (
                                            translations.agreed_price
                                        )}
                                    </p>
                                </div>


                                <Button onClick={onOrderNow} variant="default" size="lg" className="w-full mt-6 text-lg py-3" disabled={total.base === 0}>
                                    {total.discountApplied.length > 0 ? translations.order_with_discount : translations.get_free_consultation}
                                </Button>
                                
                                <div className="mt-8 space-y-4 text-left">
                                   <InfoCard
                                        icon={Sparkles}
                                        title={translations.satisfaction_guarantee}
                                        description={translations.satisfaction_guarantee_desc}
                                    />
                                    <InfoCard
                                        icon={Info}
                                        title={translations.not_public_offer}
                                        description={translations.not_public_offer_desc}
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
